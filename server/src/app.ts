import path from "path";
import fs from "fs";

const STATIC_PATH = path.resolve("../../client/dist");

const toBool = [(): boolean => true, (): boolean => false];

type MimeTypes = {
  default: string;
  [key: string]: string;
};

export const MIME_TYPES: MimeTypes = {
  html: "text/html; charset=UTF-8",
  css: "text/css",
  js: "text/javascript",
  json: "application/json",
  png: "image/png",
  svg: "image/svg+xml",
  default: "application/octet-stream",
};

export const prepareFile = async (url: string) => {
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
