import { Router, Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import multer from "multer";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const ROOT_DIR = path.resolve(__dirname, "../../");
const DATA_DIR = path.join(ROOT_DIR, "data");
const LETTERS_FILE = path.join(DATA_DIR, "letters.json");
const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

const apiRouter = Router();

const ensureDataFoldersExist = async () => {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
};

const upload = multer({ dest: UPLOAD_DIR });

apiRouter.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const saveLetterToFile = async (letter: {
  from: string;
  subject?: string;
  message: string;
  file?: string;
}) => {
  let letters: any[] = [];

  try {
    const data = await fs.readFile(LETTERS_FILE, "utf-8");
    letters = JSON.parse(data);
    if (!Array.isArray(letters)) letters = [];
  } catch {
    letters = [];
  }

  letters.push({
    ...letter,
    timestamp: new Date().toISOString(),
  });

  await fs.writeFile(LETTERS_FILE, JSON.stringify(letters, null, 2), "utf-8");
};

apiRouter.post("/send-letter", async (req: MulterRequest, res: Response, next) => {
  try {
    await ensureDataFoldersExist();

    const uploadHandler = upload.single("file");

    uploadHandler(req, res, async (err: any) => {
      if (err) return next(err);

      console.log("/send-letter");
      console.log("BODY:", req.body);
      console.log("FILE:", req.file?.originalname);

      const { from, subject, message } = req.body;

      if (!from || !message) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      try {
        await saveLetterToFile({
          from,
          subject,
          message,
          file: req.file?.filename,
        });

        return res.status(200).json({ success: true });
      } catch (err) {
        console.error("SAVE ERROR:", err);
        return res.status(500).json({ error: "Failed to save letter" });
      }
    });
  } catch (err) {
    next(err);
  }
});

export default apiRouter;
