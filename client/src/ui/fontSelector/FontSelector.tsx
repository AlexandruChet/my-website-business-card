import { useState, type FC } from "react";
import "../../assets/styles/fontsSelector.css";

const FONT_FAMILIES = ["Inter", "Roboto", "Arial", "Times New Roman"];
const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32];

interface FontSelectorProps {
  onFontChange?: (fontFamily: string, fontSize: number) => void;
}

const FontSelector: FC<FontSelectorProps> = ({ onFontChange }) => {
  const [fontFamily, setFontFamily] = useState(FONT_FAMILIES[0]);
  const [fontSize, setFontSize] = useState(FONT_SIZES[0]);

  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFontFamily(value);
    onFontChange?.(value, fontSize);
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    setFontSize(value);
    onFontChange?.(fontFamily, value);
  };

  return (
    <div className="font-selector">
      <select value={fontFamily} onChange={handleFontFamilyChange}>
        {FONT_FAMILIES.map((font) => (
          <option key={font} value={font}>
            {font}
          </option>
        ))}
      </select>

      <select value={fontSize} onChange={handleFontSizeChange}>
        {FONT_SIZES.map((size) => (
          <option key={size} value={size}>
            {size}px
          </option>
        ))}
      </select>
    </div>
  );
};

export default FontSelector;
