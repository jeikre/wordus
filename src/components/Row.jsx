import Tile from "./Tile";

function Row({ guess, word, isCurrent }) {
  const tiles = [];
  const letters = guess.split("");

  const getStatuses = () => {
    const result = Array(5).fill("absent");
    const wordArr = word.split("");

    // Step 1: mark correct
    for (let i = 0; i < 5; i++) {
      if (letters[i] === wordArr[i]) {
        result[i] = "correct";
        wordArr[i] = null; // mark used
      }
    }

    // Step 2: mark present
    for (let i = 0; i < 5; i++) {
      if (result[i] === "correct") continue;

      const index = wordArr.indexOf(letters[i]);
      if (index !== -1) {
        result[i] = "present";
        wordArr[index] = null; // mark used
      }
    }

    return result;
  };

  const statuses = !isCurrent && word ? getStatuses() : [];

  for (let i = 0; i < 5; i++) {
    const letter = letters[i] || "";
    const status = isCurrent ? "empty" : statuses[i] || "empty";

    tiles.push(
      <Tile key={i} letter={letter} status={status} index={i} />
    );
  }

  return <div className="row">{tiles}</div>;
}

export default Row;