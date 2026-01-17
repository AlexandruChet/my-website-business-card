import { Router, Request, Response, Express } from "express";
import fs from "fs/promises";
import path from "path";
import multer from "multer";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const LETTERS_FILE = path.resolve(__dirname, "../data/letters.json");
const UPLOAD_DIR = path.resolve(__dirname, "../data/uploads");

const upload = multer({ dest: UPLOAD_DIR });
const apiRouter = Router();

apiRouter.get("/health", (_req, res) => res.json({ status: "ok" }));

const saveLetterToFile = async (letter: {
  from: string;
  subject?: string;
  message: string;
  file?: string;
}) => {
  try {
    const data = await fs.readFile(LETTERS_FILE, "utf-8");
    const letters = JSON.parse(data) as {
      from: string;
      subject?: string;
      message: string;
      file?: string;
      timestamp: string;
    }[];

    letters.push({
      ...letter,
      timestamp: new Date().toISOString(),
    });

    await fs.writeFile(LETTERS_FILE, JSON.stringify(letters, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving letter:", err);
    throw err;
  }
};

apiRouter.post(
  "/send-letter",
  upload.single("file"),
  async (req: MulterRequest, res: Response) => {
    const { from, subject, message } = req.body;
    const file = req.file ? req.file.filename : undefined;

    if (!from || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      await saveLetterToFile({ from, subject, message, file });
      return res
        .status(200)
        .json({ success: true, message: "Letter saved successfully" });
    } catch (err) {
      return res.status(500).json({ error: "Failed to save letter" });
    }
  },
);

export default apiRouter;
