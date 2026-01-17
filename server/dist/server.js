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
const app = (0, express_1.default)();
app.use((0, compression_1.default)());
app.use("/api", api_1.default);
const PORT = process.env.PORT || 3000;
const STATIC_PATH = path_1.default.resolve("../client/dist");
const MIME_TYPES = {
    html: "text/html; charset=UTF-8",
    css: "text/css",
    js: "text/javascript",
    json: "application/json",
    png: "image/png",
    svg: "image/svg+xml",
    default: "application/octet-stream",
};
const prepareFile = async (url) => {
    const cleanUrl = url.split("?")[0] || "/";
    const paths = [STATIC_PATH, cleanUrl];
    if (cleanUrl.endsWith("/"))
        paths.push("index.html");
    const filePath = path_1.default.join(...paths);
    const resolvedPath = path_1.default.resolve(filePath);
    const exists = await fs_1.default.promises
        .access(resolvedPath)
        .then(() => true)
        .catch(() => false);
    const streamPath = exists
        ? resolvedPath
        : path_1.default.join(STATIC_PATH, "index.html");
    const stat = await fs_1.default.promises.stat(streamPath);
    const ext = path_1.default.extname(streamPath).slice(1).toLowerCase();
    const stream = fs_1.default.createReadStream(streamPath);
    return { ext, stream, size: stat.size };
};
app.use(async (req, res, next) => {
    try {
        const file = await prepareFile(req.url);
        const contentType = MIME_TYPES[file.ext] ?? MIME_TYPES.default;
        res.setHeader("Content-Type", contentType);
        res.setHeader("Content-Length", file.size);
        file.stream.pipe(res);
    }
    catch (err) {
        next(err);
    }
});
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
