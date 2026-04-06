import { useEffect, useState } from "react";
import Board from "./components/Board";
import Keyboard from "./components/Keyboard";

function App() {
  const [word, setWord] = useState("APPLE"); // ✅ default so app never freezes
  const [guesses, setGuesses] = useState([]);
  const [current, setCurrent] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [keyColors, setKeyColors] = useState({});

  // ✅ FETCH WORD (SAFE VERSION)
  const fetchNewWord = () => {
    fetch("http://localhost:3000/api/word")
      .then((res) => res.json())
      .then((data) => {
        const w = data?.[0]?.toUpperCase();

        if (w && /^[A-Z]{5}$/.test(w)) {
          setWord(w);
        } else {
          setWord("APPLE"); // fallback
        }
      })
      .catch(() => {
        setWord("APPLE"); // fallback if backend fails
      });
  };

  // ✅ START NEW GAME
  const startNewGame = () => {
    setGuesses([]);
    setCurrent("");
    setGameOver(false);
    setMessage("");
    setKeyColors({});
    fetchNewWord();
  };

  // initial load
  useEffect(() => {
    fetchNewWord();
  }, []);

  const handleKey = (key) => {
    if (gameOver) return; // ❗ removed "!word" block

    if (key === "ENTER") {
      if (current.length !== 5) {
        setMessage("Word must be 5 letters");
        return;
      }

      fetch(`http://localhost:3000/api/validate/${current}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.valid) {
            setMessage("Not a valid word");
            return;
          }

          const newGuesses = [...guesses, current];
          setGuesses(newGuesses);

          const newKeyColors = { ...keyColors };
          const wordArr = word.split("");

          // correct
          for (let i = 0; i < 5; i++) {
            if (current[i] === word[i]) {
              newKeyColors[current[i]] = "correct";
              wordArr[i] = null;
            }
          }

          // present / absent
          for (let i = 0; i < 5; i++) {
            if (newKeyColors[current[i]] === "correct") continue;

            const index = wordArr.indexOf(current[i]);

            if (index !== -1) {
              newKeyColors[current[i]] = "present";
              wordArr[index] = null;
            } else {
              if (!newKeyColors[current[i]]) {
                newKeyColors[current[i]] = "absent";
              }
            }
          }

          setKeyColors(newKeyColors);

          // win / lose
          if (current === word) {
            setMessage("You win!");
            setGameOver(true);
          } else if (newGuesses.length === 6) {
            setMessage(`You lose! Word was ${word}`);
            setGameOver(true);
          } else {
            setMessage("");
          }

          setCurrent("");
        })
        .catch(() => {
          setMessage("Validation server error");
        });

      return;
    }

    if (key === "BACK") {
      setCurrent((prev) => prev.slice(0, -1));
      return;
    }

    if (current.length < 5 && /^[A-Z]$/.test(key)) {
      setCurrent((prev) => prev + key);
    }
  };

  // keyboard listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toUpperCase();

      if (key === "ENTER") handleKey("ENTER");
      else if (key === "BACKSPACE") handleKey("BACK");
      else if (/^[A-Z]$/.test(key)) handleKey(key);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [current, guesses, gameOver, word, keyColors]);

  return (
    <div className="app">
      <h1>Wordus</h1>

      <p className="message">{message}</p>

      <button
        onClick={startNewGame}
        style={{
          marginBottom: "15px",
          padding: "10px 16px",
          fontSize: "16px",
          cursor: "pointer",
          borderRadius: "6px",
          border: "none",
          background: "#538d4e",
          color: "white",
        }}
      >
        New Game
      </button>

      <Board guesses={guesses} current={current} word={word} />

      <Keyboard onKey={handleKey} keyColors={keyColors} />
    </div>
  );
}

export default App;
