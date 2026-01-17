"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const LETTERS_FILE = path_1.default.resolve(__dirname, "../data/letters.json");
const apiRouter = (0, express_1.Router)();
apiRouter.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
const saveLetterToFile = async (letter) => {
    try {
        const data = await promises_1.default.readFile(LETTERS_FILE, "utf-8");
        const letters = JSON.parse(data);
        letters.push({
            ...letter,
            timestamp: new Date().toISOString(),
        });
        await promises_1.default.writeFile(LETTERS_FILE, JSON.stringify(letters, null, 2), "utf-8");
    }
    catch (err) {
        console.error("Error saving letter:", err);
        throw err;
    }
};
apiRouter.post("/send-letter", async (req, res) => {
    const { from, subject, message } = req.body;
    if (!from || !message) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        await saveLetterToFile({ from, subject, message });
        console.log("📨 NEW LETTER SAVED");
        console.log("From:", from);
        console.log("Subject:", subject);
        console.log("Message:", message);
        return res
            .status(200)
            .json({ success: true, message: "Letter saved successfully" });
    }
    catch (err) {
        return res.status(500).json({ error: "Failed to save letter" });
    }
});
exports.default = apiRouter;
