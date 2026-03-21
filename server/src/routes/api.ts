import "dotenv/config";
import { Router, Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import multer from "multer";
import nodemailer from "nodemailer";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const ROOT_DIR = path.resolve(__dirname, "../../");
const DATA_DIR = path.join(ROOT_DIR, "data");
const LETTERS_FILE = path.join(DATA_DIR, "letters.json");
const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

const apiRouter = Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

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

apiRouter.post("/send-letter", async (req: Request, res: Response, next) => {
  try {
    await ensureDataFoldersExist();
    const uploadHandler = upload.single("file");

    uploadHandler(req, res, async (err: any) => {
      if (err) return next(err);

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

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: "my__email",
          subject: `New letter: ${subject || "No topic"}`,
          html: `
            <h3>Letter from: ${from}</h3>
            <div>
              ${message}
            </div>
          `,
          attachments: req.file ? [
            {
              filename: req.file.originalname,
              path: req.file.path,
            }
          ] : []
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ success: true, sent: true });

      } catch (err) {
        console.error("PROCESS ERROR:", err);
        return res.status(500).json({ error: "Failed to process letter or email" });
      }
    });
  } catch (err) {
    next(err);
  }
});

export default apiRouter;
