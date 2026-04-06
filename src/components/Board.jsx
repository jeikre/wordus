import Row from "./Row";

function Board({ guesses, current, word }) {
  const rows = [];

  for (let i = 0; i < 6; i++) {
    if (i < guesses.length) {
      // ✅ Submitted guesses → show colors
      rows.push(
        <Row key={i} guess={guesses[i]} word={word} isCurrent={false} />
      );
    } else if (i === guesses.length) {
      // ✅ Current typing row → NO colors
      rows.push(
        <Row key={i} guess={current} word={word} isCurrent={true} />
      );
    } else {
      // Empty rows
      rows.push(
        <Row key={i} guess="" word={word} isCurrent={false} />
      );
    }
  }

  return <div className="board">{rows}</div>;
}

export default Board;