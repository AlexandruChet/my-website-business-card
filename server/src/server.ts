import express from "express";
import { prepareFile, MIME_TYPES } from "./app.js";

const app = express();
const PORT = 3000;

app.get("*", async (req, res) => {
  try {
    const file = await prepareFile(req.url);

    const contentType: string =
      MIME_TYPES[file.ext] ?? MIME_TYPES.default;

    res.status(file.found ? 200 : 404);
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Length", file.size);

    file.stream.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 http://localhost:${PORT}`);
});
