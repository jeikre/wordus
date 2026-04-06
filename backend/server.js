import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

/* =========================
✅ RANDOM WORD (FIXED)
========================= */
app.get("/api/word", async (req, res) => {
try {
console.log("🔄 Fetching word...");

for (let i = 0; i < 5; i++) { // try 5 times
const response = await fetch(
"https://random-word-api.herokuapp.com/word?length=5"
);

const data = await response.json();
const word = data?.[0]?.toUpperCase();

console.log("Trying:", word);

if (!word || !/^[A-Z]{5}$/.test(word)) continue;

// 🔥 VALIDATE WORD IS REAL
const check = await fetch(
`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
);

if (check.ok) {
console.log("✅ Valid word:", word);
return res.json([word]);
}
}

console.log("⚠️ fallback used");
res.json(["APPLE"]);
} catch (err) {
console.log("❌ API FAILED:", err.message);
res.json(["APPLE"]);
}
});

/* =========================
✅ VALIDATE WORD
========================= */
app.get("/api/validate/:word", async (req, res) => {
const word = req.params.word;

try {
const response = await fetch(
`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
);

if (response.ok) {
return res.json({ valid: true });
}

res.json({ valid: false });
} catch (err) {
console.log("Validation error:", err.message);
res.json({ valid: false });
}
});

app.listen(3000, () => {
console.log("🚀 Backend running on http://localhost:3000");
});