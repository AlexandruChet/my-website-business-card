import {
  type FC,
  type ReactNode,
  type CSSProperties,
  forwardRef,
  memo,
} from "react";
import "../../assets/styles/toolbar-ui.css";

interface ToolbarProps {
  children: ReactNode;
  className?: string;
  justify?: "start" | "center" | "end" | "between" | "around";
  gap?: string | number;
  style?: CSSProperties;
}

const Toolbar: FC<ToolbarProps> = memo(
  forwardRef<HTMLDivElement, ToolbarProps>(
    (
      {
        children,
        className = "",
        justify = "start",
        gap = "0.5rem",
        style = {},
      },
      ref
    ) => {
      const justifyClass = `toolbar--justify-${justify}`;

      return (
        <div
          ref={ref}
          className={`toolbar ${justifyClass} ${className}`}
          style={{ gap, ...style }}
        >
          {children}
        </div>
      );
    }
  )
);

export default Toolbar;
