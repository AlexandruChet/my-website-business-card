import { type FC, useEffect, useState, useRef } from "react";
import Toolbar from "../ui/toolbar/toolbarUI";
import FontSelector from "../ui/fontSelector/FontSelector";
import { Button } from "../ui/button/btn_ui";
import "../assets/styles/write-letter.css";
import useWindowState from "../hooks/VisibleHook";
import { useFileInput } from "../hooks/userInput";

const WriteLetter: FC = () => {
  const [_, setText] = useState<string>("");
  const [fontFamily, setFontFamily] = useState<string>("Inter");
  const [fontSize, setFontSize] = useState<number>(15);
  const [subject, setSubject] = useState<string>("");
  const editorRef = useRef<HTMLDivElement>(null);

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

  const handleClear = () => setText("");

  const handleBold = (e: React.MouseEvent) => {
    e.preventDefault();
    document.execCommand("bold", false);
  };

  const handleNormal = (e: React.MouseEvent) => {
    e.preventDefault();
    document.execCommand("removeFormat", false);
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
            <Button variant="ghost" size="icon">
              U
            </Button>
            <Button variant="ghost" size="icon">
              S
            </Button>
            <Button variant="ghost" size="icon">
              🔗
            </Button>
            <Button variant="ghost" size="icon">
              ⋯
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
              <Button variant="ghost" size="icon" onClick={handleClear}>
                🗑
              </Button>
              <Button variant="ghost" size="icon">
                ⋮
              </Button>
            </div>
            <div className="footer-right">
              <Button variant="default">Send now ▾</Button>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default WriteLetter;
