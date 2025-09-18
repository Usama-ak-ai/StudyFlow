import { useState, useEffect, useMemo } from "react";
import SubjectsList from "../components/SubjectsList";

function Main() {
  const quotes = [
    "You wont always be motivated so you must learn  to be disciplined.",
    "Small progress each day adds up to big results.",
    "Focus on being productive instead of busy.",
    "Dream big, start small, act now.",
    "Discipline is the bridge between goals and success.",
  ];

  const [quoteIndex, setQuoteIndex] = useState(0);

  const [displayedText, setDisplayedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (charIndex < quotes[quoteIndex].length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + quotes[quoteIndex][charIndex]);
        setCharIndex(charIndex + 1);
      }, 100); // typing speed
      return () => clearTimeout(timeout);
    }
  }, [charIndex, quoteIndex, quotes]);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
      setDisplayedText("");
      setCharIndex(0);
    }, 20000);

    return () => clearInterval(timeInterval);
  }, [quotes.length]);

  return (
    <>
      <main>
        <h1 className="main-heading">
          {displayedText}
          <span className="cursor">|</span>
        </h1>
        <div className="container">
          <div className="container-card">
            <div className="my-3 p-3 bg-body rounded shadow-sm info-card">
              <SubjectsList />
            </div>
          </div>
          <div className="container-img">
            <img className="container-imge" src="/cat.png" alt="image" />
          </div>
        </div>
      </main>
    </>
  );
}

export default Main;
