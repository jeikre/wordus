function Keyboard({ onKey, keyColors }) {
  const row1 = "QWERTYUIOP".split("");
  const row2 = "ASDFGHJKL".split("");
  const row3 = "ZXCVBNM".split("");

  const renderKey = (key) => {
    const status = keyColors[key] || "";

    return (
      <button
        key={key}
        className={`key ${status}`}
        onClick={() => onKey(key)}
      >
        {key}
      </button>
    );
  };

  return (
    <div className="keyboard">
      <div className="keyboard-row">
        {row1.map(renderKey)}
      </div>

      <div className="keyboard-row">
        {row2.map(renderKey)}
      </div>

      <div className="keyboard-row">
        <button
          className="wide-btn"
          onClick={() => onKey("ENTER")}
        >
          Enter
        </button>

        {row3.map(renderKey)}

        <button
          className="wide-btn"
          onClick={() => onKey("BACK")}
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default Keyboard;