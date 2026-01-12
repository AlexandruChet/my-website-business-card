import { type FC, useEffect } from "react";
import Toolbar from "../ui/toolbar/toolbarUI";
import FontSelector from "../ui/fontSelector/FontSelector";
import { Button } from "../ui/button/btn_ui";
import "../assets/styles/write-letter.css";
import useWindowState from "../hooks/VisibleHook";

const WriteLetter: FC = () => {
  const {
    isVisible,
    isMinimized,
    open,
    close,
    toggleMinimize,
  } = useWindowState();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "w") {
        open();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
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
            />
            <span className="counter">0</span>
          </div>

          <Toolbar gap="0.25rem">
            <FontSelector />

            <Button variant="ghost" size="icon">B</Button>
            <Button variant="ghost" size="icon">I</Button>
            <Button variant="ghost" size="icon">U</Button>
            <Button variant="ghost" size="icon">S</Button>
            <Button variant="ghost" size="icon">🔗</Button>
            <Button variant="ghost" size="icon">⋯</Button>
          </Toolbar>

          <div className="editor">
            <textarea
              className="editor-textarea"
              placeholder="Write your message here..."
            />
          </div>

          <div className="attachment">
            <div className="file">
              <span className="file-icon">🎨</span>
              <div>
                <div className="file-name">No file attached</div>
                <div className="file-size">—</div>
              </div>
            </div>

            <Button variant="secondary" size="sm">
              Attach file
            </Button>
          </div>

          <div className="letter-footer">
            <div className="footer-left">
              <Button variant="ghost" size="icon">🗑</Button>
              <Button variant="ghost" size="icon">⋮</Button>
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
