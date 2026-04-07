import { useEffect, useState } from "react";
import Board from "./components/Board";
import Keyboard from "./components/Keyboard";

function App() {
  const [word, setWord] = useState("APPLE"); // fallback
  const [guesses, setGuesses] = useState([]);
  const [current, setCurrent] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [keyColors, setKeyColors] = useState({});

  /* =========================
  ✅ DEBUG WORD CHANGE
  ========================= */
  useEffect(() => {
    console.log("🎯 Current word:", word);
  }, [word]);

  /* =========================
  ✅ FETCH RANDOM WORD (WORKING API)
  ========================= */
  const fetchNewWord = async () => {
    try {
      console.log("Fetching new word...");

      const res = await fetch(
        "https://api.datamuse.com/words?sp=?????&max=20"
      );

      console.log("📡 Response status:", res.status);

      const data = await res.json();
      console.log("📦 API data:", data);

      const validWords = data
        .map((w) => w.word.toUpperCase())
        .filter((w) => /^[A-Z]{5}$/.test(w));

      console.log("Valid words:", validWords);

      if (validWords.length > 0) {
        const randomWord =
          validWords[Math.floor(Math.random() * validWords.length)];
        console.log("✅ Selected word:", randomWord);
        setWord(randomWord);
      } else {
        console.log("No valid words, fallback to APPLE");
        setWord("APPLE");
      }

    } catch (err) {
      console.error("FETCH FAILED:", err);
      setWord("APPLE");
    }
  };

  /* =========================
  ✅ NEW GAME
  ========================= */
  const startNewGame = () => {
    setGuesses([]);
    setCurrent("");
    setGameOver(false);
    setMessage("");
    setKeyColors({});
    fetchNewWord();
  };

  /* =========================
  ✅ INITIAL LOAD
  ========================= */
  useEffect(() => {
    fetchNewWord();
  }, []);

  /* =========================
  ✅ HANDLE INPUT
  ========================= */
  const handleKey = async (key) => {
    if (gameOver) return;

    if (key === "ENTER") {
      if (current.length !== 5) {
        setMessage("Word must be 5 letters");
        return;
      }

      try {
        setMessage("Checking...");

        const res = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${current}`
        );

        if (!res.ok) {
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

      } catch (err) {
        console.error("❌ Validation error:", err);
        setMessage("Validation error");
      }

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

  /* =========================
  ✅ KEYBOARD LISTENER
  ========================= */
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