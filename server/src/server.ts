import express, { Request, Response, NextFunction } from "express";
import compression from "compression";
import path from "path";
import fs from "fs";
import "dotenv/config";
import apiRouter from "./routes/api";

const app = express();
app.use(compression());
app.use("/api", apiRouter);

const PORT = process.env.PORT || 3000;
const STATIC_PATH = path.resolve("../client/dist");

const MIME_TYPES: Record<string, string> = {
  html: "text/html; charset=UTF-8",
  css: "text/css",
  js: "text/javascript",
  json: "application/json",
  png: "image/png",
  svg: "image/svg+xml",
  default: "application/octet-stream",
};

const prepareFile = async (url: string) => {
  const cleanUrl = url.split("?")[0] || "/";
  const paths = [STATIC_PATH, cleanUrl];

  if (cleanUrl.endsWith("/")) paths.push("index.html");

  const filePath = path.join(...paths);
  const resolvedPath = path.resolve(filePath);

  const exists = await fs.promises
    .access(resolvedPath)
    .then(() => true)
    .catch(() => false);

  const streamPath = exists
    ? resolvedPath
    : path.join(STATIC_PATH, "index.html");

  const stat = await fs.promises.stat(streamPath);
  const ext = path.extname(streamPath).slice(1).toLowerCase();
  const stream = fs.createReadStream(streamPath);

  return { ext, stream, size: stat.size };
};

app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = await prepareFile(req.url);
    const contentType = MIME_TYPES[file.ext] ?? MIME_TYPES.default;

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Length", file.size);
    file.stream.pipe(res);
  } catch (err) {
    next(err);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
