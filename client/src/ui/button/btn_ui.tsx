import React from "react";
import "../../assets/styles/btn-ui.css";
import type { ButtonProps } from "./button_types";

export const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size = "default",
  className = "",
  children,
  ...props
}) => {
  return (
    <button
      className={[
        "button",
        variant,
        `size-${size}`,
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
