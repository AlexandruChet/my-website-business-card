import React from "react";
import "../assets/styles/AboutMe.css";

const AboutMeComponent: React.FC = () => {
  return (
    <div className="aboutme-container">
      <div className="typing-svg">
        <img
          src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=28&pause=1000&color=00BFFF&center=true&vCenter=true&width=850&height=70&lines=Hi%2C+I'm+Alexandru+Chetrean!;14-year-old+Developer+from+Germany;Frontend+%26+Backend+Dev+%7C+Future+C%2B%2B+System+Programmer"
          alt="Typing SVG"
        />
      </div>

      <h1 className="title">👋 Welcome!</h1>
      <h3 className="subtitle">
        💻 Young Developer | 🌍 Germany | 🚀 Passionate about Coding
      </h3>
      <hr className="divider" />

      <section className="about-section">
        <h2>👨‍💻 About Me</h2>
        <ul>
          <li>✨ 14 years old</li>
          <li>🌍 Based in Germany</li>
          <li>
            🖥️ Focused on <strong>Frontend & Backend Development</strong> (HTML,
            CSS, JS, TS, React, Node.js, C++, C)
          </li>
          <li>
            ⚡ Currently learning <strong>C++</strong> to become a System
            Programmer
          </li>
          <li>
            🎯 Passionate about building projects and constantly improving
          </li>
        </ul>
      </section>

      <hr className="divider" />

      <section className="tech-stack">
        <h2>🚀 Tech Stack</h2>
        <img
          src="https://skillicons.dev/icons?i=html,css,sass,js,ts,react,nodejs,cpp,git,github,vscode&perline=7"
          alt="Tech Stack"
        />
      </section>

      <hr className="divider" />

      <section className="projects">
        <h2>📂 Featured Projects</h2>
        <table>
          <thead>
            <tr>
              <th>Project</th>
              <th>Repository</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>⚔️ C-RPG</td>
              <td>
                <a href="https://github.com/AlexandruChet/C-RPG">C-RPG</a>
              </td>
            </tr>
            <tr>
              <td>📂 cpp_basic_manager</td>
              <td>
                <a href="https://github.com/AlexandruChet/cpp_basic_manager">
                  cpp_basic_manager
                </a>
              </td>
            </tr>
            <tr>
              <td>🌍 my-website-business-card</td>
              <td>
                <a href="https://github.com/AlexandruChet/my-website-business-card">
                  my-website-business-card
                </a>
              </td>
            </tr>
            <tr>
              <td>🎮 Gamers</td>
              <td>
                <a href="https://github.com/AlexandruChet/Gamers">Gamers</a>
              </td>
            </tr>
            <tr>
              <td>🌍 WebSite</td>
              <td>
                <a href="https://github.com/AlexandruChet/WebSite">WebSite</a>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <hr className="divider" />

      <section className="achievements">
        <h2>🏆 Achievements</h2>
        <ul>
          <li>
            🚀 Built multiple <strong>frontend & fullstack projects</strong>
          </li>
          <li>
            ⚙️ Learned <strong>Node.js</strong> & <strong>TypeScript</strong>{" "}
            while creating tools and applications
          </li>
          <li>
            🎮 Developing <strong>games & apps</strong> in{" "}
            <strong>C++ and JavaScript</strong>
          </li>
          <li>📈 Always improving skills and exploring new technologies</li>
        </ul>
      </section>

      <hr className="divider" />

      <section className="goals">
        <h2>🎯 Goals</h2>
        <ul>
          <li>
            🔹 Become a professional <strong>C++ System Programmer</strong>
          </li>
          <li>
            🔹 Grow as a <strong>Frontend & Fullstack Developer</strong>
          </li>
          <li>
            🔹 Contribute to <strong>Open Source</strong> & build impactful
            projects
          </li>
        </ul>
      </section>

      <hr className="divider" />

      <section className="contact">
        <h2>📫 Contact Me</h2>
        <div className="contact-links">
          <a
            href="https://github.com/AlexandruChet"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white"
              alt="GitHub"
            />
          </a>
          <a href="mailto:chetreanalexandru63@gmail.com">
            <img
              src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white"
              alt="Email"
            />
          </a>
        </div>
      </section>

      <h3 className="footer">✨ Thanks for visiting! ✨</h3>
    </div>
  );
};

export default AboutMeComponent;
