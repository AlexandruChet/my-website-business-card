import { useState } from "react";
import { Button } from "../ui/button/btn_ui";
import "../assets/styles/AboutMeComponent.css";

const AboutMeComponent = () => {
  const [num, setNum] = useState<number>(0);

  const arrayText: string[] = [
    "I started at 12.",
    "I am 15 years old.",
    "Looking for a Junior Frontend - Backend position.",
    "I know React, TypeScript, Tailwind, C, C++, JavaScript.",
    "I am currently looking for an internship.",
  ];

  return (
    <section className="about">
      <div className="about__content">
        {num >= 1 && num <= 5 && (
          <h3 className="about__text">{arrayText[num - 1]}</h3>
        )}
        {num === 6 && <h3 className="about__text">{arrayText}</h3>}
      </div>

      <div className="about__actions">
        <Button variant="secondary" size="sm" onClick={() => setNum(1)}>
          At what age did I start learning programming?
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setNum(2)}>
          How old am I now?
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setNum(3)}>
          What am I looking for now?
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setNum(4)}>
          What do I already know?
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setNum(5)}>
          What am I studying now?
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setNum(6)}>
          all together
        </Button>
      </div>
    </section>
  );
};

export default AboutMeComponent;
