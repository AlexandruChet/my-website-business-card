import type { FC } from "react";

interface BurgerMenuProps {
  isOpen: boolean;
  onClick: () => void;
}

export const BurgerMenu: FC<BurgerMenuProps> = ({ isOpen, onClick }) => {
  return (
    <button
      type="button"
      aria-label="Toggle menu"
      aria-expanded={isOpen}
      onClick={onClick}
      className={`burger ${isOpen ? "burger--open" : ""}`}
    >
      <span />
      <span />
      <span />
    </button>
  );
};
