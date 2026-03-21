"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = require("express");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const ROOT_DIR = path_1.default.resolve(__dirname, "../../");
const DATA_DIR = path_1.default.join(ROOT_DIR, "data");
const LETTERS_FILE = path_1.default.join(DATA_DIR, "letters.json");
const UPLOAD_DIR = path_1.default.join(DATA_DIR, "uploads");
const apiRouter = (0, express_1.Router)();
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
const ensureDataFoldersExist = async () => {
    await promises_1.default.mkdir(DATA_DIR, { recursive: true });
    await promises_1.default.mkdir(UPLOAD_DIR, { recursive: true });
};
const upload = (0, multer_1.default)({ dest: UPLOAD_DIR });
apiRouter.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
const saveLetterToFile = async (letter) => {
    let letters = [];
    try {
        const data = await promises_1.default.readFile(LETTERS_FILE, "utf-8");
        letters = JSON.parse(data);
        if (!Array.isArray(letters))
            letters = [];
    }
    catch {
        letters = [];
    }
    letters.push({
        ...letter,
        timestamp: new Date().toISOString(),
    });
    await promises_1.default.writeFile(LETTERS_FILE, JSON.stringify(letters, null, 2), "utf-8");
};
apiRouter.post("/send-letter", async (req, res, next) => {
    try {
        await ensureDataFoldersExist();
        const uploadHandler = upload.single("file");
        uploadHandler(req, res, async (err) => {
            if (err)
                return next(err);
            const { from, subject, message } = req.body;
            if (!from || !message) {
                return res.status(400).json({ error: "Missing required fields" });
            }
            try {
                // 1. Спочатку зберігаємо в файл
                await saveLetterToFile({
                    from,
                    subject,
                    message,
                    file: req.file?.filename,
                });
                // 2. Готуємо та відправляємо пошту
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: "chetreanalexandru@gmail.com",
                    subject: `Новий лист: ${subject || "Без теми"}`,
                    html: `
            <h3>Лист від: ${from}</h3>
            <div style="border: 1px solid #ccc; padding: 10px;">
              ${message}
            </div>
          `,
                    attachments: req.file ? [
                        {
                            filename: req.file.originalname,
                            path: req.file.path // Шлях до файлу в папці data/uploads
                        }
                    ] : []
                };
                await transporter.sendMail(mailOptions);
                // 3. Тільки ПІСЛЯ всього відправляємо відповідь клієнту
                return res.status(200).json({ success: true, sent: true });
            }
            catch (err) {
                console.error("PROCESS ERROR:", err);
                return res.status(500).json({ error: "Failed to process letter or email" });
            }
        });
    }
    catch (err) {
        next(err);
    }
});
exports.default = apiRouter;
