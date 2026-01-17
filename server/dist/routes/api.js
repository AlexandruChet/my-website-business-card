"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
// корінь проєкту (працює і в src, і в dist)
const ROOT_DIR = path_1.default.resolve(__dirname, "../../");
const DATA_DIR = path_1.default.join(ROOT_DIR, "data");
const LETTERS_FILE = path_1.default.join(DATA_DIR, "letters.json");
const UPLOAD_DIR = path_1.default.join(DATA_DIR, "uploads");
const apiRouter = (0, express_1.Router)();
// --- Функція для створення папок перед multer ---
const ensureDataFoldersExist = async () => {
    await promises_1.default.mkdir(DATA_DIR, { recursive: true });
    await promises_1.default.mkdir(UPLOAD_DIR, { recursive: true });
};
const upload = (0, multer_1.default)({ dest: UPLOAD_DIR });
// health check
apiRouter.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
// --- Збереження листа у JSON ---
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
// --- POST /send-letter ---
apiRouter.post("/send-letter", async (req, res, next) => {
    try {
        // спочатку створюємо папки
        await ensureDataFoldersExist();
        // тепер ініціалізуємо multer
        const uploadHandler = upload.single("file");
        uploadHandler(req, res, async (err) => {
            if (err)
                return next(err);
            console.log("➡️ /send-letter");
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
            }
            catch (err) {
                console.error("🔥 SAVE ERROR:", err);
                return res.status(500).json({ error: "Failed to save letter" });
            }
        });
    }
    catch (err) {
        next(err);
    }
});
exports.default = apiRouter;
