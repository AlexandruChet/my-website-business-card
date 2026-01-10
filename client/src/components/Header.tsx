import { useEffect, useRef, useState, type FC, type JSX } from "react";
import { Link } from "react-router-dom";
import { BurgerMenu } from "../ui/BurgerMenu";
import "../assets/styles/Header.css";

interface HeaderProps {
  logo?: JSX.Element;
  navLinks: {
    label: string;
    to: string;
  }[];
  actions?: React.ReactNode;
}

export const Header: FC<HeaderProps> = ({ logo, navLinks, actions }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuRef = useRef<HTMLElement | null>(null);
  const burgerWrapperRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      if (
        menuRef.current && !menuRef.current.contains(target) &&
        burgerWrapperRef.current && !burgerWrapperRef.current.contains(target)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className="header">
      <div className="header__logo">
        {logo || <Link to="/">Logo</Link>}
      </div>

      <nav className="header__nav header__nav--desktop">
        <ul>
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link to={link.to}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <div ref={burgerWrapperRef} className="header__burger-wrapper">
        <BurgerMenu isOpen={isMenuOpen} onClick={toggleMenu} />
      </div>

      {isMenuOpen && (
        <nav className="header__nav header__nav--mobile" ref={menuRef}>
          <ul>
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} onClick={() => setIsMenuOpen(false)}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {actions && <div className="header__actions">{actions}</div>}
    </header>
  );
};
