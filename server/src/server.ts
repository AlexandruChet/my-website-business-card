import express from "express";
import type { Request, Response, NextFunction } from "express";
import "dotenv/config";
import compression from "compression";
import path from "path";
import fs from "fs";
import apiRouter from "./routes/api.js";

const app = express();
const PORT = process.env.PORT || 3000;
const STATIC_PATH = path.resolve("../../client/dist");

type MimeTypes = {
  default: string;
  [key: string]: string;
};

const MIME_TYPES: MimeTypes = {
  html: "text/html; charset=UTF-8",
  css: "text/css",
  js: "text/javascript",
  json: "application/json",
  png: "image/png",
  svg: "image/svg+xml",
  default: "application/octet-stream",
};

const toBool = [(): boolean => true, (): boolean => false];

const prepareFile = async (url: string) => {
  const cleanUrl: string = url.split("?")[0] || "/";
  const paths = [STATIC_PATH, cleanUrl];

  if (cleanUrl.endsWith("/")) paths.push("index.html");

  const filePath = path.join(...paths);
  const resolvedPath = path.resolve(filePath);

  const pathTraversal = !resolvedPath.startsWith(STATIC_PATH);

  const exists = await fs.promises
    .access(resolvedPath)
    .then(toBool[0])
    .catch(toBool[1]);

  const found = !pathTraversal && exists;

  const notFoundPath = path.join(STATIC_PATH, "404.html");
  const fallbackPath = (await fs.promises
    .access(notFoundPath)
    .then(toBool[0])
    .catch(toBool[1]))
    ? notFoundPath
    : path.join(STATIC_PATH, "index.html");

  const streamPath = found ? resolvedPath : fallbackPath;

  const stat = await fs.promises.stat(streamPath);
  const ext = path.extname(streamPath).slice(1).toLowerCase();
  const stream = fs.createReadStream(streamPath);

  return {
    found,
    ext,
    stream,
    size: stat.size,
    lastModified: stat.mtime,
  };
};

app.use(compression());

app.use("/api", apiRouter);

app.get("*", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = await prepareFile(req.url);

    const contentType = MIME_TYPES[file.ext] ?? MIME_TYPES.default;

    res.status(file.found ? 200 : 404);

    res.setHeader(
      "Cache-Control",
      file.ext ? "public, max-age=31536000, immutable" : "no-cache"
    );
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Length", file.size);

    file.stream.pipe(res);
  } catch (error) {
    next(error);
  }
});

app.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
