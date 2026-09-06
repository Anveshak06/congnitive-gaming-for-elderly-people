import { useEffect, useMemo, useState, useRef } from "react";
import {
  ArrowLeft,
  RotateCcw,
  Volume2,
  Sparkles,
  Star,
  Lightbulb,
} from "lucide-react";
import { sounds, speakAloud } from "../../utils/audio";

export type GameType =
  | "card-matching"
  | "remember-sequence"
  | "number-sequence"
  | "simple-sudoku"
  | "complete-pattern"
  | "odd-one-out"
  | "find-object"
  | "target-search"
  | "word-recall"
  | "complete-word"
  | "picture-memory"
  | "what-was-missing"
  | "tap-the-target"
  | "quick-response";

interface GameConfig {
  title: string;
  category: string;
  description: string;
  instruction: string;
  icon: string;
  color: string;
}

export const gameConfigs: Record<GameType, GameConfig> = {
  "card-matching": {
    title: "Card Matching",
    category: "Memory",
    description: "Find matching pairs of cards.",
    instruction: "Tap any card to turn it over, then find its matching partner. Remember where each symbol was!",
    icon: "🃏",
    color: "bg-blue-600",
  },
  "remember-sequence": {
    title: "Remember the Sequence",
    category: "Memory",
    description: "Remember the flashing sequence in order.",
    instruction: "Watch the tiles light up in order. When they finish, tap the tiles in the exact same sequence!",
    icon: "🔢",
    color: "bg-indigo-600",
  },
  "number-sequence": {
    title: "Number Sequence",
    category: "Number Skills",
    description: "Discover the missing number.",
    instruction: "Look closely at the numbers and find the pattern. What number completes the sequence?",
    icon: "➕",
    color: "bg-emerald-600",
  },
  "simple-sudoku": {
    title: "Simple Sudoku",
    category: "Number Skills",
    description: "Solve a gentle 4x4 Mini-Sudoku.",
    instruction: "Fill the grid so every row, column, and 2x2 box contains numbers 1, 2, 3, and 4 without repeating.",
    icon: "🧩",
    color: "bg-teal-600",
  },
  "complete-pattern": {
    title: "Complete the Pattern",
    category: "Pattern Recognition",
    description: "Identify what comes next.",
    instruction: "Observe the order of shapes and colors. Select the option that naturally follows the pattern.",
    icon: "🔵",
    color: "bg-amber-600",
  },
  "odd-one-out": {
    title: "Odd One Out",
    category: "Pattern Recognition",
    description: "Spot the one object that is different.",
    instruction: "Most items in the grid look alike, but one is different. Tap the odd one out!",
    icon: "🔺",
    color: "bg-orange-600",
  },
  "find-object": {
    title: "Find the Object",
    category: "Attention",
    description: "Locate the hidden object.",
    instruction: "Look through the items and tap the specific item shown in the question prompt.",
    icon: "🔎",
    color: "bg-cyan-600",
  },
  "target-search": {
    title: "Target Search",
    category: "Attention",
    description: "Count and tap all target symbols.",
    instruction: "Find and tap all designated target symbols in the grid until you collect them all!",
    icon: "🎯",
    color: "bg-sky-600",
  },
  "word-recall": {
    title: "Word Recall",
    category: "Word Skills",
    description: "Remember the words you saw.",
    instruction: "Read and remember the words on the screen. Once hidden, choose the words that were on the list.",
    icon: "🗣️",
    color: "bg-purple-600",
  },
  "complete-word": {
    title: "Complete the Word",
    category: "Word Skills",
    description: "Fill in the missing letter.",
    instruction: "Look at the familiar word and pick the correct missing letter to complete it.",
    icon: "✏️",
    color: "bg-fuchsia-600",
  },
  "picture-memory": {
    title: "Picture Memory",
    category: "Image Recall",
    description: "Remember the pictures shown.",
    instruction: "Memorize the pictures displayed. When hidden, select which picture was in the group.",
    icon: "🖼️",
    color: "bg-rose-600",
  },
  "what-was-missing": {
    title: "What Was Missing?",
    category: "Image Recall",
    description: "Identify which picture disappeared.",
    instruction: "Observe all items carefully. When one vanishes, identify which item is missing!",
    icon: "👀",
    color: "bg-pink-600",
  },
  "tap-the-target": {
    title: "Tap the Target",
    category: "Reaction",
    description: "Tap the target as it appears.",
    instruction: "Stay relaxed and watch the circle. As soon as the golden star target appears, tap it!",
    icon: "⏱️",
    color: "bg-lime-700",
  },
  "quick-response": {
    title: "Quick Response",
    category: "Reaction",
    description: "Follow the friendly prompt.",
    instruction: "Read the prompt and tap the matching color or shape as promptly as you comfortably can.",
    icon: "⚡",
    color: "bg-yellow-600",
  },
};

const SYMBOLS_POOL = ["🍎", "🌸", "🚗", "🐱", "☕", "⭐", "🌳", "🏠", "🌞", "🦋", "🎨", "🔔"];

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function getGameType(): GameType {
  const path = window.location.pathname.replace("/games/", "").replace(/\/$/, "");
  if (path in gameConfigs) {
    return path as GameType;
  }
  return "card-matching";
}

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL !== undefined
    ? import.meta.env.VITE_BACKEND_URL
    : typeof window !== "undefined" && window.location.port === "5173"
    ? "http://localhost:3001"
    : "";

// Record score to backend API
async function recordScore(gameId: string, category: string, stars: number = 3) {
  try {
    await fetch(`${BACKEND_URL}/api/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId, category, stars, score: stars * 10 }),
    });
  } catch {
    // Offline mode graceful ignore
  }
}

// -------------------------------------------------------------
// 1. CARD MATCHING GAME
// -------------------------------------------------------------
function CardMatchingGame({ level, onWin }: { level: number; onWin: () => void }) {
  const pairCount = level === 1 ? 2 : level === 2 ? 3 : level === 3 ? 4 : 6;
  const [cards, setCards] = useState<{ id: number; symbol: string }[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);
  const [moves, setMoves] = useState(0);

  const initGame = () => {
    const chosen = shuffle(SYMBOLS_POOL).slice(0, pairCount);
    const deck = shuffle(
      chosen.flatMap((symbol, idx) => [
        { id: idx * 2, symbol },
        { id: idx * 2 + 1, symbol },
      ])
    );
    setCards(deck);
    setSelected([]);
    setMatched([]);
    setLocked(false);
    setMoves(0);
  };

  useEffect(() => {
    initGame();
  }, [level]);

  const handleCardClick = (id: number) => {
    if (locked || selected.includes(id) || matched.includes(id)) return;
    sounds.playClick();

    const next = [...selected, id];
    setSelected(next);

    if (next.length === 2) {
      setLocked(true);
      setMoves((m) => m + 1);

      const first = cards.find((c) => c.id === next[0]);
      const second = cards.find((c) => c.id === next[1]);

      if (first?.symbol === second?.symbol) {
        setTimeout(() => {
          sounds.playCorrect();
          const newMatched = [...matched, ...next];
          setMatched(newMatched);
          setSelected([]);
          setLocked(false);

          if (newMatched.length === cards.length) {
            sounds.playCelebration();
            onWin();
          }
        }, 350);
      } else {
        setTimeout(() => {
          sounds.playTryAgain();
          setSelected([]);
          setLocked(false);
        }, 900);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-base sm:text-lg font-semibold text-slate-600">
        <span>Pairs Matched: {matched.length / 2} / {pairCount}</span>
        <span>Moves: {moves}</span>
      </div>

      <div
        className={`mx-auto grid gap-4 ${
          pairCount <= 2
            ? "grid-cols-2 max-w-xs"
            : pairCount <= 4
            ? "grid-cols-2 sm:grid-cols-4 max-w-xl"
            : "grid-cols-3 sm:grid-cols-4 max-w-2xl"
        }`}
      >
        {cards.map((card) => {
          const isFlipped = selected.includes(card.id) || matched.includes(card.id);
          const isMatched = matched.includes(card.id);

          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square rounded-3xl border-4 text-5xl sm:text-6xl flex items-center justify-center transition-all duration-300 shadow-md transform ${
                isMatched
                  ? "border-emerald-400 bg-emerald-50 scale-95 opacity-90"
                  : isFlipped
                  ? "border-blue-400 bg-white scale-100"
                  : "border-blue-600 bg-gradient-to-br from-blue-600 to-indigo-700 text-white hover:scale-105"
              }`}
            >
              {isFlipped ? card.symbol : "❓"}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 2. REMEMBER THE SEQUENCE GAME
// -------------------------------------------------------------
function RememberSequenceGame({ level, onWin }: { level: number; onWin: () => void }) {
  const count = level + 2; // 3 to 5 items
  const [sequence, setSequence] = useState<number[]>([]);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [isShowing, setIsShowing] = useState(true);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [errorIndex, setErrorIndex] = useState<number | null>(null);

  const colors = [
    { id: 1, label: "Blue", bg: "bg-blue-600 hover:bg-blue-700", symbol: "🔵" },
    { id: 2, label: "Emerald", bg: "bg-emerald-600 hover:bg-emerald-700", symbol: "🟢" },
    { id: 3, label: "Amber", bg: "bg-amber-500 hover:bg-amber-600", symbol: "🟡" },
    { id: 4, label: "Rose", bg: "bg-rose-600 hover:bg-rose-700", symbol: "🔴" },
  ];

  const playSequence = (seq: number[]) => {
    setIsShowing(true);
    setUserSequence([]);
    setErrorIndex(null);

    seq.forEach((num, index) => {
      setTimeout(() => {
        setActiveStep(num);
        sounds.playClick();
      }, (index + 1) * 750);

      setTimeout(() => {
        setActiveStep(null);
      }, (index + 1) * 750 + 400);
    });

    setTimeout(() => {
      setIsShowing(false);
    }, (seq.length + 1) * 750 + 200);
  };

  const startRound = () => {
    const newSeq = Array.from({ length: count }, () => Math.floor(Math.random() * 4) + 1);
    setSequence(newSeq);
    playSequence(newSeq);
  };

  useEffect(() => {
    startRound();
  }, [level]);

  const handleTileClick = (id: number) => {
    if (isShowing) return;
    sounds.playClick();

    const nextUserSeq = [...userSequence, id];
    setUserSequence(nextUserSeq);

    const currentIndex = nextUserSeq.length - 1;
    if (sequence[currentIndex] !== id) {
      sounds.playTryAgain();
      setErrorIndex(id);
      setTimeout(() => {
        playSequence(sequence);
      }, 700);
      return;
    }

    if (nextUserSeq.length === sequence.length) {
      sounds.playCelebration();
      onWin();
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6 text-center">
      <div className="rounded-2xl bg-blue-50 p-4 border border-blue-200">
        <p className="text-lg font-bold text-blue-900">
          {isShowing ? "👀 Watch the sequence carefully..." : "👉 Now tap the tiles in the same order!"}
        </p>
        <p className="text-sm text-blue-700 mt-1">
          {isShowing ? "Get ready to repeat it" : `Progress: ${userSequence.length} / ${sequence.length}`}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {colors.map((c) => {
          const isLit = activeStep === c.id;
          return (
            <button
              key={c.id}
              disabled={isShowing}
              onClick={() => handleTileClick(c.id)}
              className={`flex h-36 flex-col items-center justify-center rounded-3xl text-5xl font-bold shadow-lg transition-all duration-200 transform ${
                isLit
                  ? "scale-105 ring-8 ring-white bg-white text-slate-900"
                  : `${c.bg} text-white`
              } ${isShowing ? "cursor-not-allowed opacity-85" : "hover:scale-102 active:scale-95"}`}
            >
              <span>{c.symbol}</span>
              <span className="text-lg mt-2 font-extrabold">{c.label}</span>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => playSequence(sequence)}
        disabled={isShowing}
        className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-5 py-3 text-base font-semibold text-slate-700 hover:bg-slate-200 transition"
      >
        <RotateCcw size={18} />
        <span>Replay Sequence</span>
      </button>
    </div>
  );
}

// -------------------------------------------------------------
// 3. NUMBER SEQUENCE GAME
// -------------------------------------------------------------
function NumberSequenceGame({ level, onWin }: { level: number; onWin: () => void }) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [missingIndex, setMissingIndex] = useState(3);
  const [options, setOptions] = useState<number[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [hint, setHint] = useState("");

  const generateSequence = () => {
    setSelected(null);
    const start = Math.floor(Math.random() * 10) + 1;
    const step = level === 1 ? 2 : level === 2 ? 3 : level === 3 ? 5 : 4;
    const seq = Array.from({ length: 5 }, (_, i) => start + i * step);

    const missing = level === 1 ? 4 : Math.floor(Math.random() * 3) + 1;
    const answer = seq[missing];

    setSequence(seq);
    setMissingIndex(missing);
    setCorrectAnswer(answer);
    setHint(`Pattern hint: Each number increases by +${step}`);

    const wrongOptions = [answer + step, answer - step, answer + 1, answer - 2].filter(
      (n) => n !== answer && n > 0
    );
    setOptions(shuffle([answer, ...shuffle(wrongOptions).slice(0, 3)]));
  };

  useEffect(() => {
    generateSequence();
  }, [level]);

  const handleSelect = (num: number) => {
    sounds.playClick();
    setSelected(num);

    if (num === correctAnswer) {
      sounds.playCorrect();
      setTimeout(() => {
        sounds.playCelebration();
        onWin();
      }, 500);
    } else {
      sounds.playTryAgain();
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-8 text-center">
      {/* Sequence numbers display */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        {sequence.map((num, idx) => (
          <div
            key={idx}
            className={`flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-3xl text-3xl sm:text-4xl font-extrabold shadow-md border-4 ${
              idx === missingIndex
                ? "border-amber-400 bg-amber-50 text-amber-900 animate-pulse"
                : "border-slate-200 bg-white text-slate-800"
            }`}
          >
            {idx === missingIndex ? (selected !== null ? selected : "?") : num}
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-blue-50/70 p-4 border border-blue-200 text-sm font-semibold text-blue-800">
        💡 {hint}
      </div>

      {/* Multiple choice options */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            className={`min-h-16 rounded-2xl border-3 text-2xl font-bold shadow transition-all ${
              selected === option
                ? option === correctAnswer
                  ? "border-emerald-500 bg-emerald-100 text-emerald-900"
                  : "border-rose-400 bg-rose-50 text-rose-800"
                : "border-slate-200 bg-white text-slate-800 hover:border-blue-500 hover:bg-blue-50"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 4. SIMPLE SUDOKU (4x4 Mini-Sudoku for Seniors)
// -------------------------------------------------------------
function SimpleSudokuGame({ level, onWin }: { level: number; onWin: () => void }) {
  // Solved 4x4 boards
  const sampleBoards = [
    [
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [2, 1, 4, 3],
      [4, 3, 2, 1],
    ],
    [
      [2, 4, 1, 3],
      [3, 1, 4, 2],
      [4, 2, 3, 1],
      [1, 3, 2, 4],
    ],
  ];

  const [solution, setSolution] = useState<number[][]>(sampleBoards[0]);
  const [board, setBoard] = useState<number[][]>([]);
  const [initial, setInitial] = useState<boolean[][]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);

  const initSudoku = () => {
    const sol = sampleBoards[Math.floor(Math.random() * sampleBoards.length)];
    setSolution(sol);

    // blanks depending on level: level 1 has 3 blanks, level 2 has 5, level 3 has 7
    const blanksCount = level === 1 ? 3 : level === 2 ? 5 : 7;
    const newBoard = sol.map((r) => [...r]);
    const initMask = sol.map(() => [true, true, true, true]);

    let cleared = 0;
    while (cleared < blanksCount) {
      const r = Math.floor(Math.random() * 4);
      const c = Math.floor(Math.random() * 4);
      if (newBoard[r][c] !== 0) {
        newBoard[r][c] = 0;
        initMask[r][c] = false;
        cleared++;
      }
    }

    setBoard(newBoard);
    setInitial(initMask);
    setSelectedCell(null);
  };

  useEffect(() => {
    initSudoku();
  }, [level]);

  const handleCellClick = (r: number, c: number) => {
    if (initial[r][c]) return;
    sounds.playClick();
    setSelectedCell([r, c]);
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell) return;
    const [r, c] = selectedCell;
    if (initial[r][c]) return;

    sounds.playClick();
    const updated = board.map((row, rowIdx) =>
      row.map((val, colIdx) => (rowIdx === r && colIdx === c ? num : val))
    );
    setBoard(updated);

    // Check complete
    let isComplete = true;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (updated[i][j] !== solution[i][j]) {
          isComplete = false;
        }
      }
    }

    if (isComplete) {
      sounds.playCelebration();
      onWin();
    }
  };

  const handleHint = () => {
    if (!selectedCell) return;
    const [r, c] = selectedCell;
    if (initial[r][c]) return;
    handleNumberInput(solution[r][c]);
  };

  return (
    <div className="mx-auto max-w-md space-y-6 text-center">
      {/* 4x4 Grid */}
      <div className="mx-auto grid max-w-xs grid-cols-4 gap-2 rounded-3xl bg-slate-200 p-3 shadow-inner">
        {board.map((row, r) =>
          row.map((val, c) => {
            const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;
            const isPrefilled = initial[r]?.[c];
            const borderRight = c === 1 ? "border-r-4 border-slate-400" : "";
            const borderBottom = r === 1 ? "border-b-4 border-slate-400" : "";

            return (
              <button
                key={`${r}-${c}`}
                onClick={() => handleCellClick(r, c)}
                className={`flex aspect-square items-center justify-center rounded-2xl text-3xl font-black transition-all shadow-sm ${borderRight} ${borderBottom} ${
                  isSelected
                    ? "bg-amber-300 ring-4 ring-amber-500 scale-105"
                    : isPrefilled
                    ? "bg-slate-100 text-slate-800 cursor-default"
                    : val !== 0
                    ? "bg-white text-blue-700 hover:bg-blue-50"
                    : "bg-white text-transparent hover:bg-slate-50"
                }`}
              >
                {val !== 0 ? val : ""}
              </button>
            );
          })
        )}
      </div>

      <p className="text-sm font-semibold text-slate-500">
        {selectedCell ? "Now tap 1, 2, 3, or 4 below to fill" : "Tap an empty square to select it"}
      </p>

      {/* Number Keypad */}
      <div className="flex justify-center gap-3">
        {[1, 2, 3, 4].map((num) => (
          <button
            key={num}
            onClick={() => handleNumberInput(num)}
            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-700 text-2xl font-bold text-white shadow-lg transition hover:bg-blue-800 active:scale-95"
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => handleNumberInput(0)}
          className="flex h-16 px-4 items-center justify-center rounded-2xl bg-slate-200 text-base font-bold text-slate-700 hover:bg-slate-300 transition"
        >
          Erase
        </button>
      </div>

      {/* Hint Button */}
      <button
        onClick={handleHint}
        disabled={!selectedCell}
        className="inline-flex items-center gap-2 rounded-xl bg-amber-100 px-4 py-2.5 text-sm font-bold text-amber-800 hover:bg-amber-200 disabled:opacity-40 transition"
      >
        <Lightbulb size={18} />
        <span>Hint for selected square</span>
      </button>
    </div>
  );
}

// -------------------------------------------------------------
// 5. COMPLETE THE PATTERN
// -------------------------------------------------------------
function CompletePatternGame({ level, onWin }: { level: number; onWin: () => void }) {
  const [pattern, setPattern] = useState<string[]>([]);
  const [correct, setCorrect] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const initPattern = () => {
    setSelected(null);
    const sets = [
      ["🔴", "🟢", "🔵"],
      ["⭐", "🌙", "☀️"],
      ["🍎", "🍌", "🍇"],
      ["🔺", "🟦", "🟡"],
    ];
    const picked = sets[Math.floor(Math.random() * sets.length)];

    let seq: string[] = [];
    if (level === 1) {
      // A B A B A ? -> B
      seq = [picked[0], picked[1], picked[0], picked[1], picked[0]];
      setCorrect(picked[1]);
    } else {
      // A B C A B ? -> C
      seq = [picked[0], picked[1], picked[2], picked[0], picked[1]];
      setCorrect(picked[2]);
    }

    setPattern(seq);
    setOptions(shuffle([...picked, "🌸"]).slice(0, 4));
  };

  useEffect(() => {
    initPattern();
  }, [level]);

  const handleSelect = (item: string) => {
    sounds.playClick();
    setSelected(item);
    if (item === correct) {
      sounds.playCorrect();
      setTimeout(() => {
        sounds.playCelebration();
        onWin();
      }, 400);
    } else {
      sounds.playTryAgain();
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-8 text-center">
      {/* Pattern Row */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {pattern.map((item, index) => (
          <div
            key={index}
            className="flex h-18 w-18 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-slate-100 text-4xl shadow border border-slate-200"
          >
            {item}
          </div>
        ))}
        <div className="flex h-18 w-18 sm:h-20 sm:w-20 items-center justify-center rounded-2xl border-4 border-dashed border-amber-400 bg-amber-50 text-4xl font-bold text-amber-700">
          {selected || "?"}
        </div>
      </div>

      <p className="text-base font-semibold text-slate-600">Which symbol comes next?</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleSelect(opt)}
            className={`flex min-h-20 items-center justify-center rounded-3xl border-3 text-4xl shadow transition hover:scale-105 ${
              selected === opt
                ? opt === correct
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-rose-400 bg-rose-50"
                : "border-slate-200 bg-white"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 6. ODD ONE OUT
// -------------------------------------------------------------
function OddOneOutGame({ level, onWin }: { level: number; onWin: () => void }) {
  const count = level === 1 ? 4 : level === 2 ? 6 : 9;
  const [items, setItems] = useState<{ id: number; symbol: string; isOdd: boolean }[]>([]);

  const initGame = () => {
    const pairs = [
      { normal: "🐱", odd: "🐶" },
      { normal: "🍎", odd: "🍊" },
      { normal: "🚗", odd: "🚲" },
      { normal: "⭐", odd: "✨" },
      { normal: "🌳", odd: "🌴" },
    ];
    const pair = pairs[Math.floor(Math.random() * pairs.length)];
    const oddPos = Math.floor(Math.random() * count);

    const list = Array.from({ length: count }, (_, idx) => ({
      id: idx,
      symbol: idx === oddPos ? pair.odd : pair.normal,
      isOdd: idx === oddPos,
    }));
    setItems(list);
  };

  useEffect(() => {
    initGame();
  }, [level]);

  const handleSelect = (item: { id: number; isOdd: boolean }) => {
    sounds.playClick();
    if (item.isOdd) {
      sounds.playCorrect();
      setTimeout(() => {
        sounds.playCelebration();
        onWin();
      }, 400);
    } else {
      sounds.playTryAgain();
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6 text-center">
      <p className="text-lg font-bold text-slate-700">Find the symbol that is different from all others:</p>

      <div
        className={`mx-auto grid gap-4 ${
          count === 4 ? "grid-cols-2 max-w-xs" : count === 6 ? "grid-cols-3 max-w-sm" : "grid-cols-3 max-w-md"
        }`}
      >
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleSelect(item)}
            className="flex aspect-square items-center justify-center rounded-3xl border-3 border-slate-200 bg-white text-5xl shadow-md transition hover:scale-105 hover:border-blue-400 active:scale-95"
          >
            {item.symbol}
          </button>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 7. FIND THE OBJECT
// -------------------------------------------------------------
function FindObjectGame({ level, onWin }: { level: number; onWin: () => void }) {
  const [target, setTarget] = useState("🌻");
  const [grid, setGrid] = useState<string[]>([]);

  const initGame = () => {
    const targets = ["🌻", "🦋", "🚗", "☕", "🔔", "⭐"];
    const chosenTarget = targets[Math.floor(Math.random() * targets.length)];
    setTarget(chosenTarget);

    const pool = ["🍎", "🌸", "🐱", "🌳", "🏠", "🌞", "🎈", "💎"].filter((x) => x !== chosenTarget);
    const count = level === 1 ? 6 : level === 2 ? 9 : 12;
    const targetIdx = Math.floor(Math.random() * count);

    const items = Array.from({ length: count }, (_, i) =>
      i === targetIdx ? chosenTarget : pool[Math.floor(Math.random() * pool.length)]
    );
    setGrid(items);
  };

  useEffect(() => {
    initGame();
  }, [level]);

  const handleSelect = (symbol: string) => {
    sounds.playClick();
    if (symbol === target) {
      sounds.playCorrect();
      setTimeout(() => {
        sounds.playCelebration();
        onWin();
      }, 400);
    } else {
      sounds.playTryAgain();
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6 text-center">
      <div className="inline-flex items-center gap-3 rounded-2xl bg-amber-50 px-6 py-3 border-2 border-amber-300">
        <span className="text-base font-bold text-amber-900">Please locate this object:</span>
        <span className="text-4xl">{target}</span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
        {grid.map((symbol, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(symbol)}
            className="flex min-h-24 items-center justify-center rounded-3xl border-3 border-slate-200 bg-white text-5xl shadow transition hover:scale-105 hover:border-blue-400 active:scale-95"
          >
            {symbol}
          </button>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 8. TARGET SEARCH (Count & Tap All Instances)
// -------------------------------------------------------------
function TargetSearchGame({ level, onWin }: { level: number; onWin: () => void }) {
  const targetSymbol = "🎯";
  const targetCount = level === 1 ? 3 : level === 2 ? 4 : 5;
  const [foundIndices, setFoundIndices] = useState<number[]>([]);
  const [items, setItems] = useState<{ id: number; symbol: string; isTarget: boolean }[]>([]);

  const initGame = () => {
    setFoundIndices([]);
    const totalSlots = 12;
    const targets = new Set<number>();
    while (targets.size < targetCount) {
      targets.add(Math.floor(Math.random() * totalSlots));
    }

    const distractors = ["🔵", "⭐", "🔶", "🟢", "🔺"];
    const list = Array.from({ length: totalSlots }, (_, i) => ({
      id: i,
      symbol: targets.has(i) ? targetSymbol : distractors[Math.floor(Math.random() * distractors.length)],
      isTarget: targets.has(i),
    }));
    setItems(list);
  };

  useEffect(() => {
    initGame();
  }, [level]);

  const handleTap = (item: { id: number; isTarget: boolean }) => {
    sounds.playClick();
    if (foundIndices.includes(item.id)) return;

    if (item.isTarget) {
      sounds.playCorrect();
      const updated = [...foundIndices, item.id];
      setFoundIndices(updated);

      if (updated.length === targetCount) {
        sounds.playCelebration();
        setTimeout(onWin, 500);
      }
    } else {
      sounds.playTryAgain();
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6 text-center">
      <div className="flex items-center justify-between rounded-2xl bg-sky-50 px-5 py-3 border border-sky-200 text-lg font-bold text-sky-900">
        <span>Find all {targetSymbol} Target symbols</span>
        <span className="bg-sky-200/80 px-3 py-1 rounded-xl">
          {foundIndices.length} / {targetCount} Found
        </span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
        {items.map((item) => {
          const isCollected = foundIndices.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => handleTap(item)}
              className={`flex min-h-24 items-center justify-center rounded-3xl border-3 text-4xl shadow transition ${
                isCollected
                  ? "border-emerald-500 bg-emerald-100 opacity-60 scale-95"
                  : "border-slate-200 bg-white hover:border-sky-400 hover:scale-105"
              }`}
            >
              {isCollected ? "✅" : item.symbol}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 9. WORD RECALL
// -------------------------------------------------------------
function WordRecallGame({ level, onWin }: { level: number; onWin: () => void }) {
  const WORD_POOL = ["SUNSHINE", "GARDEN", "FLOWER", "MORNING", "FRIEND", "PEACE", "MUSIC", "SMILE", "RIVER", "BREAD"];
  const wordCount = level === 1 ? 3 : level === 2 ? 4 : 5;
  const [shownWords, setShownWords] = useState<string[]>([]);
  const [isMemorizing, setIsMemorizing] = useState(true);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  const initGame = () => {
    const picked = shuffle(WORD_POOL).slice(0, wordCount);
    setShownWords(picked);
    setSelectedWords([]);
    setIsMemorizing(true);

    const otherWords = WORD_POOL.filter((w) => !picked.includes(w)).slice(0, 3);
    setOptions(shuffle([...picked, ...otherWords]));

    // Auto switch to test after 5 seconds
    setTimeout(() => {
      setIsMemorizing(false);
    }, 5000);
  };

  useEffect(() => {
    initGame();
  }, [level]);

  const handleWordSelect = (word: string) => {
    sounds.playClick();
    if (selectedWords.includes(word)) return;

    if (shownWords.includes(word)) {
      sounds.playCorrect();
      const updated = [...selectedWords, word];
      setSelectedWords(updated);

      if (updated.length === shownWords.length) {
        sounds.playCelebration();
        setTimeout(onWin, 500);
      }
    } else {
      sounds.playTryAgain();
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6 text-center">
      {isMemorizing ? (
        <div className="rounded-3xl bg-purple-50 p-8 border-2 border-purple-200 space-y-5">
          <p className="text-xl font-bold text-purple-900">👀 Remember these words:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {shownWords.map((w) => (
              <span
                key={w}
                className="rounded-2xl bg-purple-600 px-5 py-3 text-2xl font-black text-white shadow-md"
              >
                {w}
              </span>
            ))}
          </div>
          <p className="text-sm font-semibold text-purple-700">They will hide shortly...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl bg-purple-50 p-4 border border-purple-200">
            <p className="text-lg font-bold text-purple-900">
              Select the words you saw! ({selectedWords.length} / {shownWords.length})
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {options.map((w) => {
              const isFound = selectedWords.includes(w);
              return (
                <button
                  key={w}
                  onClick={() => handleWordSelect(w)}
                  disabled={isFound}
                  className={`min-h-16 rounded-2xl border-3 text-xl font-bold shadow transition ${
                    isFound
                      ? "border-emerald-500 bg-emerald-100 text-emerald-900"
                      : "border-slate-200 bg-white text-slate-800 hover:border-purple-500 hover:bg-purple-50"
                  }`}
                >
                  {w} {isFound && "✓"}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// 10. COMPLETE THE WORD
// -------------------------------------------------------------
function CompleteWordGame({ level, onWin }: { level: number; onWin: () => void }) {
  const WORDS = [
    { full: "APPLE", hint: "A delicious red or green fruit 🍎" },
    { full: "HOUSE", hint: "A cozy place where we live 🏠" },
    { full: "WATER", hint: "Essential to drink every day 💧" },
    { full: "CHAIR", hint: "Something comfortable to sit on 🪑" },
    { full: "MANGO", hint: "Sweet golden tropical fruit 🥭" },
  ];

  const [currentWord, setCurrentWord] = useState(WORDS[0]);
  const [missingIdx, setMissingIdx] = useState(1);
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const initGame = () => {
    setSelected(null);
    const item = WORDS[Math.floor(Math.random() * WORDS.length)];
    const missing = Math.floor(Math.random() * (item.full.length - 2)) + 1;
    setCurrentWord(item);
    setMissingIdx(missing);

    const correctLetter = item.full[missing];
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").filter((l) => l !== correctLetter);
    setOptions(shuffle([correctLetter, ...shuffle(alphabet).slice(0, 3)]));
  };

  useEffect(() => {
    initGame();
  }, [level]);

  const handleSelect = (letter: string) => {
    sounds.playClick();
    setSelected(letter);
    if (letter === currentWord.full[missingIdx]) {
      sounds.playCorrect();
      setTimeout(() => {
        sounds.playCelebration();
        onWin();
      }, 500);
    } else {
      sounds.playTryAgain();
    }
  };

  const displayLetters = currentWord.full.split("").map((ch, idx) => (idx === missingIdx ? "_" : ch));

  return (
    <div className="mx-auto max-w-lg space-y-6 text-center">
      <div className="flex justify-center gap-3">
        {displayLetters.map((letter, i) => (
          <div
            key={i}
            className={`flex h-20 w-16 items-center justify-center rounded-2xl text-4xl font-extrabold shadow border-3 ${
              letter === "_"
                ? "border-fuchsia-500 bg-fuchsia-50 text-fuchsia-800"
                : "border-slate-200 bg-white text-slate-800"
            }`}
          >
            {letter === "_" ? selected || "?" : letter}
          </div>
        ))}
      </div>

      <p className="text-base font-semibold text-slate-600">💡 Hint: {currentWord.hint}</p>

      <div className="grid grid-cols-4 gap-3">
        {options.map((letter) => (
          <button
            key={letter}
            onClick={() => handleSelect(letter)}
            className="flex min-h-16 items-center justify-center rounded-2xl border-2 border-slate-200 bg-white text-3xl font-extrabold text-slate-800 shadow hover:border-fuchsia-500 hover:bg-fuchsia-50 transition"
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 11. PICTURE MEMORY
// -------------------------------------------------------------
function PictureMemoryGame({ level, onWin }: { level: number; onWin: () => void }) {
  const [items, setItems] = useState<string[]>([]);
  const [isMemorizing, setIsMemorizing] = useState(true);
  const [questionPrompt, setQuestionPrompt] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);

  const initGame = () => {
    setIsMemorizing(true);
    const count = level === 1 ? 3 : 4;
    const selected = shuffle(SYMBOLS_POOL).slice(0, count);
    setItems(selected);

    const target = selected[Math.floor(Math.random() * selected.length)];
    setQuestionPrompt(target);

    const distractors = SYMBOLS_POOL.filter((s) => !selected.includes(s)).slice(0, 3);
    setOptions(shuffle([target, ...distractors]));

    setTimeout(() => {
      setIsMemorizing(false);
    }, 4500);
  };

  useEffect(() => {
    initGame();
  }, [level]);

  const handleSelect = (symbol: string) => {
    sounds.playClick();
    if (symbol === questionPrompt) {
      sounds.playCorrect();
      setTimeout(() => {
        sounds.playCelebration();
        onWin();
      }, 450);
    } else {
      sounds.playTryAgain();
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6 text-center">
      {isMemorizing ? (
        <div className="rounded-3xl bg-rose-50 p-8 border border-rose-200 space-y-4">
          <p className="text-xl font-bold text-rose-900">Memorize these picture cards:</p>
          <div className="flex justify-center gap-4">
            {items.map((item, i) => (
              <div
                key={i}
                className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white text-5xl shadow-md border-2 border-rose-200"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-xl font-bold text-slate-800">Which picture did you see earlier?</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                className="flex aspect-square items-center justify-center rounded-3xl border-3 border-slate-200 bg-white text-5xl shadow hover:border-rose-400 hover:scale-105 transition"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// 12. WHAT WAS MISSING?
// -------------------------------------------------------------
function WhatWasMissingGame({ level, onWin }: { level: number; onWin: () => void }) {
  const [allImages, setAllImages] = useState<string[]>([]);
  const [remaining, setRemaining] = useState<string[]>([]);
  const [missing, setMissing] = useState<string>("");
  const [isMemorizing, setIsMemorizing] = useState(true);
  const [options, setOptions] = useState<string[]>([]);

  const initGame = () => {
    setIsMemorizing(true);
    const count = level === 1 ? 3 : 4;
    const picked = shuffle(SYMBOLS_POOL).slice(0, count);
    setAllImages(picked);

    const missingItem = picked[Math.floor(Math.random() * picked.length)];
    setMissing(missingItem);
    setRemaining(picked.filter((x) => x !== missingItem));

    const extra = SYMBOLS_POOL.filter((s) => !picked.includes(s)).slice(0, 2);
    setOptions(shuffle([missingItem, ...extra, remaining[0]]));

    setTimeout(() => {
      setIsMemorizing(false);
    }, 4000);
  };

  useEffect(() => {
    initGame();
  }, [level]);

  const handleSelect = (symbol: string) => {
    sounds.playClick();
    if (symbol === missing) {
      sounds.playCorrect();
      setTimeout(() => {
        sounds.playCelebration();
        onWin();
      }, 450);
    } else {
      sounds.playTryAgain();
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6 text-center">
      {isMemorizing ? (
        <div className="rounded-3xl bg-pink-50 p-8 border border-pink-200 space-y-4">
          <p className="text-xl font-bold text-pink-900">Look at all these items carefully:</p>
          <div className="flex justify-center gap-4">
            {allImages.map((s, i) => (
              <div
                key={i}
                className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-5xl shadow border"
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-lg font-bold text-slate-700">One item disappeared! These are the remaining ones:</p>
          <div className="flex justify-center gap-3">
            {remaining.map((s, i) => (
              <div
                key={i}
                className="flex h-18 w-18 items-center justify-center rounded-2xl bg-slate-100 text-4xl border"
              >
                {s}
              </div>
            ))}
          </div>

          <p className="text-lg font-bold text-pink-800">Which item is missing?</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                className="flex aspect-square items-center justify-center rounded-2xl border-2 border-slate-200 bg-white text-5xl shadow hover:border-pink-500 hover:scale-105 transition"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// 13. TAP THE TARGET (Gentle Reaction)
// -------------------------------------------------------------
function TapTargetGame({ level, onWin }: { level: number; onWin: () => void }) {
  const [isReady, setIsReady] = useState(false);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const startRound = () => {
    setIsReady(false);
    setReactionTime(null);

    const delay = Math.floor(Math.random() * 2000) + 1500;
    setTimeout(() => {
      setIsReady(true);
      startTimeRef.current = Date.now();
    }, delay);
  };

  useEffect(() => {
    startRound();
  }, [level]);

  const handleTap = () => {
    if (!isReady) {
      sounds.playTryAgain();
      return;
    }
    const elapsed = Date.now() - startTimeRef.current;
    setReactionTime(elapsed);
    sounds.playCorrect();

    setTimeout(() => {
      sounds.playCelebration();
      onWin();
    }, 600);
  };

  return (
    <div className="mx-auto max-w-md space-y-6 text-center">
      <div className="rounded-2xl bg-lime-50 p-4 border border-lime-200">
        <p className="text-base font-semibold text-lime-900">
          {isReady ? "🌟 TAP NOW!" : "⏳ Wait for the golden star to appear..."}
        </p>
      </div>

      <button
        onClick={handleTap}
        className={`mx-auto flex h-52 w-52 items-center justify-center rounded-full border-8 text-7xl shadow-2xl transition-all transform ${
          isReady
            ? "border-amber-400 bg-gradient-to-br from-amber-400 to-amber-500 text-white scale-110 animate-bounce"
            : "border-slate-200 bg-slate-100 text-slate-300 scale-95"
        }`}
      >
        {isReady ? "⭐" : "⌛"}
      </button>

      {reactionTime && (
        <p className="text-xl font-bold text-emerald-700">
          Superb! Response time: {reactionTime} ms
        </p>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// 14. QUICK RESPONSE
// -------------------------------------------------------------
function QuickResponseGame({ level, onWin }: { level: number; onWin: () => void }) {
  const prompts = [
    { text: "Tap the BLUE Circle", target: "🔵" },
    { text: "Tap the RED Heart", target: "❤️" },
    { text: "Tap the GREEN Leaf", target: "🍃" },
    { text: "Tap the GOLDEN Star", target: "⭐" },
  ];

  const [currentPrompt, setCurrentPrompt] = useState(prompts[0]);
  const [options, setOptions] = useState<string[]>([]);

  const initGame = () => {
    const p = prompts[Math.floor(Math.random() * prompts.length)];
    setCurrentPrompt(p);
    setOptions(shuffle(["🔵", "❤️", "🍃", "⭐"]));
  };

  useEffect(() => {
    initGame();
  }, [level]);

  const handleSelect = (item: string) => {
    sounds.playClick();
    if (item === currentPrompt.target) {
      sounds.playCorrect();
      setTimeout(() => {
        sounds.playCelebration();
        onWin();
      }, 400);
    } else {
      sounds.playTryAgain();
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6 text-center">
      <div className="rounded-2xl bg-yellow-50 p-6 border-2 border-yellow-300">
        <p className="text-sm font-bold uppercase tracking-wider text-yellow-800">Prompt</p>
        <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{currentPrompt.text}</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleSelect(opt)}
            className="flex min-h-28 items-center justify-center rounded-3xl border-3 border-slate-200 bg-white text-6xl shadow-md hover:scale-105 hover:border-blue-400 active:scale-95 transition"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MAIN DYNAMIC GAME CONTAINER
// -------------------------------------------------------------
export default function DynamicGame() {
  const gameType = useMemo(() => getGameType(), []);
  const config = gameConfigs[gameType];

  const [level, setLevel] = useState(1);
  const [starsEarned, setStarsEarned] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleWin = () => {
    setStarsEarned((s) => s + 1);
    setShowCelebration(true);
    recordScore(gameType, config.category, 3);
  };

  const handleNextRound = () => {
    sounds.playClick();
    setShowCelebration(false);
    // Increase level up to 3
    setLevel((lvl) => (lvl < 3 ? lvl + 1 : 1));
  };

  const handleReadInstruction = () => {
    sounds.playClick();
    speakAloud(`${config.title}. ${config.instruction}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <button
            onClick={() => (window.location.href = "/games")}
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2 font-bold text-slate-700 hover:bg-slate-100 transition"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back to Games</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-3xl">{config.icon}</span>
            <div className="text-left">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                {config.title}
              </h1>
              <span className="text-xs font-semibold text-slate-500">
                {config.category}
              </span>
            </div>
          </div>

          {/* Stars & Read Aloud */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleReadInstruction}
              className="flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700 hover:bg-blue-100 transition"
              title="Listen to instruction"
            >
              <Volume2 size={18} />
              <span className="hidden sm:inline">Listen</span>
            </button>

            <div className="flex items-center gap-1 rounded-xl bg-amber-50 px-3 py-2 text-sm font-bold text-amber-800 border border-amber-200">
              <Star size={18} fill="#D97706" />
              <span>{starsEarned}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-6 sm:py-8 sm:px-6">
        {/* Instruction Banner */}
        <div className="mb-6 rounded-2xl bg-white p-4 sm:p-5 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              How to Play
            </span>
            <p className="text-base sm:text-lg font-medium text-slate-700 mt-0.5">
              {config.instruction}
            </p>
          </div>

          {/* Difficulty Switcher */}
          <div className="flex items-center gap-1 self-end sm:self-center">
            {[1, 2, 3].map((lvl) => (
              <button
                key={lvl}
                onClick={() => {
                  sounds.playClick();
                  setLevel(lvl);
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  level === lvl
                    ? "bg-blue-700 text-white shadow"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Level {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Game Component Renderer */}
        <div className="rounded-3xl bg-white p-6 sm:p-10 shadow-lg border border-slate-200 min-h-[420px] flex flex-col justify-center">
          {gameType === "card-matching" && <CardMatchingGame level={level} onWin={handleWin} />}
          {gameType === "remember-sequence" && <RememberSequenceGame level={level} onWin={handleWin} />}
          {gameType === "number-sequence" && <NumberSequenceGame level={level} onWin={handleWin} />}
          {gameType === "simple-sudoku" && <SimpleSudokuGame level={level} onWin={handleWin} />}
          {gameType === "complete-pattern" && <CompletePatternGame level={level} onWin={handleWin} />}
          {gameType === "odd-one-out" && <OddOneOutGame level={level} onWin={handleWin} />}
          {gameType === "find-object" && <FindObjectGame level={level} onWin={handleWin} />}
          {gameType === "target-search" && <TargetSearchGame level={level} onWin={handleWin} />}
          {gameType === "word-recall" && <WordRecallGame level={level} onWin={handleWin} />}
          {gameType === "complete-word" && <CompleteWordGame level={level} onWin={handleWin} />}
          {gameType === "picture-memory" && <PictureMemoryGame level={level} onWin={handleWin} />}
          {gameType === "what-was-missing" && <WhatWasMissingGame level={level} onWin={handleWin} />}
          {gameType === "tap-the-target" && <TapTargetGame level={level} onWin={handleWin} />}
          {gameType === "quick-response" && <QuickResponseGame level={level} onWin={handleWin} />}
        </div>
      </main>

      {/* Win Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl border-4 border-amber-300">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-5xl">
              🎉
            </div>
            <h3 className="mt-4 text-2xl font-black text-slate-900">Brilliant Job!</h3>
            <p className="mt-2 text-base font-medium text-slate-600">
              You exercised your mind wonderfully! Keep up the daily practice.
            </p>

            <div className="mt-4 flex justify-center gap-1 text-amber-500">
              <Star size={28} fill="#F59E0B" />
              <Star size={28} fill="#F59E0B" />
              <Star size={28} fill="#F59E0B" />
            </div>

            <button
              onClick={handleNextRound}
              className="mt-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-blue-700 px-6 py-3 text-lg font-bold text-white shadow-lg hover:bg-blue-800 transition"
            >
              <span>Play Next Round</span>
              <Sparkles size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
