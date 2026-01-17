import React, { type FC, useEffect, useState, useRef } from "react";
import Toolbar from "../ui/toolbar/toolbarUI";
import FontSelector from "../ui/fontSelector/FontSelector";
import { Button } from "../ui/button/btn_ui";
import "../assets/styles/write-letter.css";
import useWindowState from "../hooks/VisibleHook";
import { useFileInput } from "../hooks/userInput";

const WriteLetter: FC = () => {
  const [fontFamily, setFontFamily] = useState<string>("Inter");
  const [fontSize, setFontSize] = useState<number>(15);
  const [subject, setSubject] = useState<string>("");
  const editorRef = useRef<HTMLDivElement>(null);

  const clearDivContent = () => {
    if (editorRef.current) editorRef.current.innerHTML = "";
  };

  const {
    file: selectedFile,
    fileSizeText,
    error,
    handleFileChange,
    clearFile,
  } = useFileInput({
    allowedTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    maxSizeMB: 5,
  });

  const execCommand = (
    command: string,
    value?: string | null,
    e?: React.MouseEvent,
  ) => {
    e?.preventDefault();
    if (value != null) document.execCommand(command, false, value);
    else document.execCommand(command, false);
  };

  const handleBold = (e: React.MouseEvent) => execCommand("bold", undefined, e);
  const handleNormal = (e: React.MouseEvent) =>
    execCommand("removeFormat", undefined, e);
  const handleUnderline = (e: React.MouseEvent) =>
    execCommand("underline", undefined, e);
  const handleStrikeThrough = (e: React.MouseEvent) =>
    execCommand("strikeThrough", undefined, e);

  const handleAddLink = () => {
    const url = prompt("Enter URL:");
    if (url) execCommand("createLink", url);
  };

  const handleHighlight = () => {
    const color = prompt("Enter highlight color (yellow, #ff0):", "yellow");
    if (color) execCommand("backColor", color);
  };

  const handleAlign = () => {
    const align = prompt("Align text: left, center, right, justify", "left") as
      | "left"
      | "center"
      | "right"
      | "justify"
      | null;
    if (!align) return;

    const commands: Record<"left" | "center" | "right" | "justify", string> = {
      left: "justifyLeft",
      center: "justifyCenter",
      right: "justifyRight",
      justify: "justifyFull",
    };

    execCommand(commands[align]);
  };

  const { isVisible, isMinimized, open, close, toggleMinimize } =
    useWindowState();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "w") open();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  if (!isVisible) return null;

  const handleSend = async () => {
    if (!editorRef.current) return;

    const formData = new FormData();
    formData.append("from", subject);
    formData.append("subject", subject);
    formData.append("message", editorRef.current.innerHTML);

    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    try {
      const res = await fetch("http://localhost:3000/api/send-letter", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to send");

      alert("Letter sent successfully ✅");
      clearDivContent();
      setSubject("");
      clearFile();
    } catch (err) {
      console.error(err);
      alert("Error sending letter ❌");
    }
  };

  return (
    <div className={`write-letter ${isMinimized ? "minimized" : ""}`}>
      <div className="letter-header">
        <div className="from">
          <div className="avatar" />
          <span className="email">my-email-address</span>
        </div>
        <div className="window-actions">
          <button onClick={toggleMinimize}>—</button>
          <button onClick={toggleMinimize}>▢</button>
          <button onClick={close}>✕</button>
        </div>
      </div>

      {!isMinimized && (
        <main>
          <div className="subject">
            <input
              className="subject-input"
              placeholder="from whom"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <span className="counter">{subject.length} / 100</span>
          </div>

          <Toolbar gap="0.25rem">
            <FontSelector
              onFontChange={(family, size) => {
                setFontFamily(family);
                setFontSize(size);
              }}
            />
            <Button variant="ghost" size="icon" onMouseDown={handleBold}>
              B
            </Button>
            <Button variant="ghost" size="icon" onMouseDown={handleNormal}>
              I
            </Button>
            <Button variant="ghost" size="icon" onMouseDown={handleUnderline}>
              U
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onMouseDown={handleStrikeThrough}
            >
              S
            </Button>
            <Button variant="ghost" size="icon" onMouseDown={handleAddLink}>
              🔗
            </Button>
            <Button variant="ghost" size="icon" onMouseDown={handleHighlight}>
              col. back.
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onMouseDown={(e) => {
                e.preventDefault();
                handleAlign();
              }}
            >
              ⬅️
            </Button>
          </Toolbar>

          <div className="editor">
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning={true}
              className="editor-textarea"
              style={{ fontFamily, fontSize: `${fontSize}px` }}
            ></div>
          </div>

          <div className="attachment">
            <div className="file">
              <span className="file-icon">🎨</span>
              <div>
                <input
                  type="file"
                  hidden
                  id="fileInput"
                  onChange={handleFileChange}
                />
                <label htmlFor="fileInput">Select file</label>

                <div className="file-name">
                  {selectedFile ? selectedFile.name : "No file attached"}
                </div>
                <div className="file-size">
                  {fileSizeText && `—${fileSizeText}`}
                </div>
                {error && <p className="error">{error}</p>}
                {selectedFile && (
                  <Button variant="ghost" size="icon" onClick={clearFile}>
                    🗑 Clear
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="letter-footer">
            <div className="footer-left">
              <Button variant="ghost" size="icon" onClick={clearDivContent}>
                🗑
              </Button>
            </div>
            <div className="footer-right">
              <Button variant="default" onClick={handleSend}>
                Send now ▾
              </Button>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default WriteLetter;
