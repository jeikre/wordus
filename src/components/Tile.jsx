function Tile({ letter, status, index }) {
  return (
    <div
      className={`tile ${status}`}
      style={{ animationDelay: `${index * 0.2}s` }}
    >
      {letter}
    </div>
  );
}

export default Tile;