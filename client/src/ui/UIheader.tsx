import React, { useState, useEffect, useRef, type FC } from "react";
import { Link } from "react-router-dom";
import { BurgerMenu } from "../ui/BurgerMenu";

interface HeaderBody {
  logo?: React.ReactNode;
  navLinks: { label: string; to: string }[];
  actions?: React.ReactNode;
}

export const UIheader: FC<HeaderBody> = ({
  logo,
  navLinks,
  actions,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const menuRef = useRef<HTMLElement | null>(null);
  const burgerWrapperRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        menuRef.current && !menuRef.current.contains(target) &&
        burgerWrapperRef.current && !burgerWrapperRef.current.contains(target)
      ) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <header className="header">
      <div className="header__logo">
        {logo || <Link to="/">Logo</Link>}
      </div>

      <nav className="desktop-nav">
        <ul>
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link to={link.to}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <div ref={burgerWrapperRef}>
        <BurgerMenu isOpen={isMenuOpen} onClick={toggleMenu} />
      </div>

      {isMenuOpen && (
        <nav className="mobile-nav" ref={menuRef}>
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
