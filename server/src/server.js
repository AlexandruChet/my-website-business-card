"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var compression_1 = require("compression");
var path = require("path");
var fs = require("fs");
require("dotenv/config");
var api_js_1 = require("./routes/api.js");
var app = (0, express_1.default)();
app.use((0, compression_1.default)());
var PORT = process.env.PORT || 3000;
var STATIC_PATH = path.resolve("../../client/dist");
var MIME_TYPES = {
    html: "text/html; charset=UTF-8",
    css: "text/css",
    js: "text/javascript",
    json: "application/json",
    png: "image/png",
    svg: "image/svg+xml",
    default: "application/octet-stream",
};
var toBool = [function () { return true; }, function () { return false; }];
var prepareFile = function (url) { return __awaiter(void 0, void 0, void 0, function () {
    var cleanUrl, paths, filePath, resolvedPath, pathTraversal, exists, found, notFoundPath, fallbackPath, streamPath, stat, ext, stream;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cleanUrl = url.split("?")[0] || "/";
                paths = [STATIC_PATH, cleanUrl];
                if (cleanUrl.endsWith("/"))
                    paths.push("index.html");
                filePath = path.join.apply(path, paths);
                resolvedPath = path.resolve(filePath);
                pathTraversal = !resolvedPath.startsWith(STATIC_PATH);
                return [4 /*yield*/, fs.promises
                        .access(resolvedPath)
                        .then(toBool[0])
                        .catch(toBool[1])];
            case 1:
                exists = _a.sent();
                found = !pathTraversal && exists;
                notFoundPath = path.join(STATIC_PATH, "404.html");
                return [4 /*yield*/, fs.promises
                        .access(notFoundPath)
                        .then(toBool[0])
                        .catch(toBool[1])];
            case 2:
                fallbackPath = (_a.sent())
                    ? notFoundPath
                    : path.join(STATIC_PATH, "index.html");
                streamPath = found ? resolvedPath : fallbackPath;
                return [4 /*yield*/, fs.promises.stat(streamPath)];
            case 3:
                stat = _a.sent();
                ext = path.extname(streamPath).slice(1).toLowerCase();
                stream = fs.createReadStream(streamPath);
                return [2 /*return*/, {
                        found: found,
                        ext: ext,
                        stream: stream,
                        size: stat.size,
                        lastModified: stat.mtime,
                    }];
        }
    });
}); };
app.use("/api", api_js_1.default);
app.get("*", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var file, contentType, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prepareFile(req.url)];
            case 1:
                file = _b.sent();
                contentType = (_a = MIME_TYPES[file.ext]) !== null && _a !== void 0 ? _a : MIME_TYPES.default;
                res.status(file.found ? 200 : 404);
                res.setHeader("Cache-Control", file.ext ? "public, max-age=31536000, immutable" : "no-cache");
                res.setHeader("Content-Type", contentType);
                res.setHeader("Content-Length", file.size);
                file.stream.pipe(res);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                next(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.use(function (err, _req, res, _next) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
});
app.listen(PORT, function () {
    console.log("\uD83D\uDE80 Server running at http://localhost:".concat(PORT));
});
