"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
require("dotenv/config");
const api_1 = __importDefault(require("./routes/api"));
const crypto_1 = __importDefault(require("crypto"));
const app = (0, express_1.default)();
app.use((0, compression_1.default)());
app.use("/api", api_1.default);
const PORT = process.env.PORT || 3000;
const STATIC_PATH = path_1.default.resolve("../client/dist");
const ERROR_FILE = path_1.default.resolve("../../client/dist", "Error.html");
const MIME_TYPES = {
    html: "text/html; charset=UTF-8",
    css: "text/css",
    js: "application/javascript",
    json: "application/json",
    png: "image/png",
    svg: "image/svg+xml",
    default: "application/octet-stream",
};
const generateETag = (size, mtime) => crypto_1.default.createHash("md5").update(`${size}-${mtime}`).digest("hex");
app.get("/download", (req, res) => {
    const fileName = req.query.file;
    if (!fileName) {
        return res.status(400).send("File name is required");
    }
    const targetPath = path_1.default.resolve(STATIC_PATH, fileName);
    if (!targetPath.startsWith(STATIC_PATH)) {
        console.warn(`[SECURITY ALERT] PATH TRAVERSAL attempt!: ${fileName}`);
        return res.status(403).sendFile(ERROR_FILE);
    }
    if (fs_1.default.existsSync(targetPath) && fs_1.default.lstatSync(targetPath).isFile()) {
        res.sendFile(targetPath);
    }
    else {
        res.status(404).send("File not found");
    }
});
const prepareFile = async (url) => {
    const cleanUrl = url.split("?")[0] || "/";
    const paths = [STATIC_PATH, cleanUrl];
    if (cleanUrl.endsWith("/"))
        paths.push("index.html");
    const filePath = path_1.default.join(...paths);
    const resolvedPath = path_1.default.resolve(filePath);
    if (!resolvedPath.startsWith(STATIC_PATH)) {
        const indexPath = path_1.default.join(STATIC_PATH, "index.html");
        const stat = await fs_1.default.promises.stat(indexPath);
        return {
            ext: "html",
            stream: fs_1.default.createReadStream(indexPath),
            size: stat.size,
            etag: generateETag(stat.size, stat.mtimeMs),
        };
    }
    const exists = await fs_1.default.promises
        .access(resolvedPath)
        .then(() => true)
        .catch(() => false);
    const streamPath = exists
        ? resolvedPath
        : path_1.default.join(STATIC_PATH, "index.html");
    const stat = await fs_1.default.promises.stat(streamPath);
    const etag = generateETag(stat.size, stat.mtimeMs);
    const ext = path_1.default.extname(streamPath).slice(1).toLowerCase();
    const stream = fs_1.default.createReadStream(streamPath);
    return { ext, stream, size: stat.size, etag };
};
app.use(async (req, res, next) => {
    try {
        const file = await prepareFile(req.url);
        const contentType = MIME_TYPES[file.ext] ?? MIME_TYPES.default;
        res.setHeader("Content-Type", contentType);
        res.setHeader("ETag", file.etag);
        const ifNoneMatch = req.headers["if-none-match"];
        if (typeof ifNoneMatch === "string" && ifNoneMatch === file.etag) {
            return res.status(304).end();
        }
        file.stream.on("error", next);
        file.stream.pipe(res);
        if (req.headers["if-none-match"] === file.etag) {
            return res.status(304).end();
        }
    }
    catch (err) {
        next(err);
    }
});
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
