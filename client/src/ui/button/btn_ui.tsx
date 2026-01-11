import React from "react";
import styles from "./Button.module.css";
import type { ButtonProps } from "./button_types";

export const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size = "default",
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={[
        styles.button,
        styles[variant],
        styles[`size-${size}`],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </button>
  );
};
