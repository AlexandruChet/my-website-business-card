import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import AboutMe from "./pages/AboutMe";
import Skills from "./pages/Skills";
import Letter from "./pages/Letter";
import githubImg from "./assets/img/github.png";

const App = () => {
  const navLinks = [
    { label: "About Me", to: "/about" },
    { label: "Skills", to: "/my_skills" },
    { label: "Letter", to: "/writing_a_letter" },
  ];

  const logo = (
    <button>
      <img src={githubImg} alt="GitHub logo" width={40} />
    </button>
  );

  return (
    <Router>
      <Header logo={logo} navLinks={navLinks} />
      <main>
        <Routes>
          <Route path="/about" element={<AboutMe />} />
          <Route path="/my_skills" element={<Skills />} />
          <Route path="/writing_a_letter" element={<Letter />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
