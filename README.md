# 🌐 Personal Business Card Website

A modern **personal business card website** created to introduce myself as a developer.
The project combines a **frontend build** and a **custom backend server on Node.js + TypeScript** without using `express.static`.

---

## ✨ Features

- ⚛️ Frontend (SPA)
- 🌙 Dark UI design
- ⚡ Own static server (streaming files)
- 🔐 Protection against path traversal
- 📦 MIME-type control
- 🧠 SPA fallback (`index.html`)
- 🚀 Node.js + TypeScript (ESM) + React
- 🛠️ Strict TypeScript without `any`

---

## 🧩 Tech Stack

### Frontend
- HTML / CSS
- React
- TypeScript
- Build output → `client/dist`

### Backend
- Node.js
- TypeScript
- Express
- ESM (`"type": "module"`)
- Streaming (`fs.createReadStream`)

---

## 📁 Project Structure

```text
my-website-business-card/
├── client/
│ └── dist/ # Frontend
│
├── server/
│ ├── src/
│ │ ├── app.ts
│ │ └── server.ts
│ ├── tsconfig.json
│ └── package.json
│
└── README.md