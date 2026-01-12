import { useState, useCallback } from "react";

const useWindowState = () => {
  const [isVisible, setVisible] = useState<boolean>(true);
  const [isMinimized, setMinimized] = useState<boolean>(false);

  const open = useCallback(() => setVisible(true), []);
  const close = useCallback(() => setVisible(false), []);
  const minimize = useCallback(() => setMinimized(true), []);
  const restore = useCallback(() => setMinimized(false), []);
  const toggleMinimize = useCallback(() => setMinimized((prev) => !prev), []);

  return {
    isVisible,
    isMinimized,
    open,
    close,
    minimize,
    restore,
    toggleMinimize,
  };
};

export default useWindowState;
