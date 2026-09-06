import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle,
  RotateCcw,
  Volume2,
} from "lucide-react";

type GameType =
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
  description: string;
  icon: string;
}

const gameConfigs: Record<GameType, GameConfig> = {
  "card-matching": {
    title: "Card Matching",
    description: "Find all matching pairs.",
    icon: "ðŸƒ",
  },
  "remember-sequence": {
    title: "Remember the Sequence",
    description: "Remember the sequence and enter it in the correct order.",
    icon: "ðŸ”¢",
  },
  "number-sequence": {
    title: "Number Sequence",
    description: "Find the missing number.",
    icon: "ðŸ”¢",
  },
  "simple-sudoku": {
    title: "Simple Sudoku",
    description: "Complete the missing numbers.",
    icon: "ðŸ§©",
  },
  "complete-pattern": {
    title: "Complete the Pattern",
    description: "Find what comes next.",
    icon: "ðŸ”µ",
  },
  "odd-one-out": {
    title: "Odd One Out",
    description: "Find the item that is different.",
    icon: "ðŸ”º",
  },
  "find-object": {
    title: "Find the Object",
    description: "Find the requested object.",
    icon: "ðŸ”Ž",
  },
  "target-search": {
    title: "Target Search",
    description: "Find all target symbols.",
    icon: "ðŸŽ¯",
  },
  "word-recall": {
    title: "Word Recall",
    description: "Remember the words shown earlier.",
    icon: "ðŸ—£ï¸",
  },
  "complete-word": {
    title: "Complete the Word",
    description: "Complete the missing letters.",
    icon: "âœï¸",
  },
  "picture-memory": {
    title: "Picture Memory",
    description: "Remember the pictures.",
    icon: "ðŸ–¼ï¸",
  },
  "what-was-missing": {
    title: "What Was Missing?",
    description: "Identify the missing picture.",
    icon: "ðŸ‘€",
  },
  "tap-the-target": {
    title: "Tap the Target",
    description: "Tap the target as quickly as you can.",
    icon: "ðŸŽ¯",
  },
  "quick-response": {
    title: "Quick Response",
    description: "Follow the instruction and respond correctly.",
    icon: "âš¡",
  },
};

const symbols = [
  "ðŸŽ",
  "ðŸŒ¸",
  "ðŸš—",
  "ðŸ±",
  "â˜•",
  "â­",
  "ðŸŒ³",
  "ðŸ ",
];

const words = [
  "APPLE",
  "HOUSE",
  "GARDEN",
  "FLOWER",
  "CHAIR",
  "WATER",
  "SCHOOL",
  "MANGO",
  "RIVER",
  "BOOK",
];

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function clampLevel(level: number) {
  return Math.max(1, Math.min(4, level));
}

function getGameType(): GameType {
  const path = window.location.pathname;

  const value = path
    .replace("/games/", "")
    .replace(/\/$/, "");

  if (value in gameConfigs) {
    return value as GameType;
  }

  return "card-matching";
}

function CardMatchingGame({
  level,
  onCorrect,
}: {
  level: number;
  onCorrect: (correct: boolean) => void;
}) {
  const pairCount = level === 1 ? 2 : level === 2 ? 3 : level === 3 ? 4 : 6;

  const [cards, setCards] = useState<
    { id: number; symbol: string }[]
  >([]);

  const [selected, setSelected] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);

  const createRound = () => {
    const selectedSymbols = shuffle(symbols).slice(0, pairCount);

    const newCards = shuffle(
      selectedSymbols.flatMap((symbol, index) => [
        { id: index * 2, symbol },
        { id: index * 2 + 1, symbol },
      ])
    );

    setCards(newCards);
    setSelected([]);
    setMatched([]);
    setLocked(false);
  };

  useEffect(() => {
    createRound();
  }, [level]);

  const chooseCard = (id: number) => {
    if (locked) return;
    if (selected.includes(id)) return;
    if (matched.includes(id)) return;

    const next = [...selected, id];
    setSelected(next);

    if (next.length === 2) {
      setLocked(true);

      const first = cards.find((card) => card.id === next[0]);
      const second = cards.find((card) => card.id === next[1]);

      if (first?.symbol === second?.symbol) {
        setTimeout(() => {
          setMatched((previous) => [...previous, ...next]);
          setSelected([]);
          setLocked(false);
          onCorrect(true);
        }, 400);
      } else {
        setTimeout(() => {
          setSelected([]);
          setLocked(false);
          onCorrect(false);
        }, 800);
      }
    }
  };

  return (
    <div
      className={`mx-auto grid max-w-2xl gap-4 ${
        pairCount <= 2
          ? "grid-cols-2 max-w-sm"
          : pairCount <= 4
          ? "grid-cols-4"
          : "grid-cols-4 sm:grid-cols-6"
      }`}
    >
      {cards.map((card) => {
        const visible =
          selected.includes(card.id) ||
          matched.includes(card.id);

        return (
          <button
            key={card.id}
            onClick={() => chooseCard(card.id)}
            className={`aspect-square rounded-2xl border-4 text-4xl shadow-md transition sm:text-5xl ${
              visible
                ? "border-blue-300 bg-white"
                : "border-blue-700 bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {visible ? card.symbol : "?"}
          </button>
        );
      })}
    </div>
  );
}

function SequenceGame({
  level,
  onCorrect,
}: {
  level: number;
  onCorrect: (correct: boolean) => void;
}) {
  const length = level + 3;

  const [sequence, setSequence] = useState<number[]>([]);
  const [input, setInput] = useState("");
  const [showing, setShowing] = useState(true);

  const createRound = () => {
    const newSequence = Array.from(
      { length },
      () => Math.floor(Math.random() * 9) + 1
    );

    setSequence(newSequence);
    setInput("");
    setShowing(true);

    setTimeout(() => {
      setShowing(false);
    }, 1600 + level * 500);
  };

  useEffect(() => {
    createRound();
  }, [level]);

  const submit = () => {
    const answer = input
      .split("")
      .map(Number)
      .filter((number) => !Number.isNaN(number));

    const correct =
      answer.length === sequence.length &&
      answer.every((value, index) => value === sequence[index]);

    onCorrect(correct);
    setInput("");
    createRound();
  };

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-3xl bg-blue-50 p-8 text-center">

        {showing ? (
          <>
            <p className="text-lg font-semibold text-slate-600">
              Remember this sequence
            </p>

            <div className="mt-6 flex justify-center gap-3">
              {sequence.map((number, index) => (
                <div
                  key={index}
                  className="flex h-14 w-12 items-center justify-center rounded-xl bg-blue-700 text-2xl font-bold text-white"
                >
                  {number}
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="text-lg font-semibold text-slate-700">
              Enter the sequence
            </p>

            <input
              value={input}
              onChange={(event) =>
                setInput(event.target.value.replace(/\D/g, ""))
              }
              maxLength={length}
              inputMode="numeric"
              className="mt-6 min-h-16 w-full rounded-2xl border-2 border-slate-300 bg-white px-5 text-center text-3xl font-bold tracking-widest outline-none focus:border-blue-600"
              placeholder="Enter numbers"
            />

            <button
              onClick={submit}
              className="mt-5 min-h-14 w-full rounded-2xl bg-blue-700 px-6 py-4 text-lg font-bold text-white"
            >
              Submit Answer
            </button>
          </>
        )}

      </div>
    </div>
  );
}

function NumberSequenceGame({
  level,
  onCorrect,
}: {
  level: number;
  onCorrect: (correct: boolean) => void;
}) {
  const [question, setQuestion] = useState<number[]>([]);
  const [answer, setAnswer] = useState("");

  const createQuestion = () => {
    let start = Math.floor(Math.random() * 8) + 2;
    let step = Math.floor(Math.random() * 5) + 1;

    if (level >= 3) {
      step = Math.floor(Math.random() * 7) + 2;
    }

    if (level === 4) {
      start = Math.floor(Math.random() * 5) + 2;
    }

    const result = Array.from(
      { length: 5 },
      (_, index) => start + index * step
    );

    const missingIndex =
      level === 1 ? 3 : Math.floor(Math.random() * 4);

    result[missingIndex] = -1;

    setQuestion(result);
    setAnswer("");
  };

  useEffect(() => {
    createQuestion();
  }, [level]);

  const correctAnswer = () => {
    const original = question;

    const visible = original.filter((number) => number !== -1);

    if (visible.length < 2) return 0;

    const differences = [];

    for (let i = 1; i < visible.length; i++) {
      differences.push(visible[i] - visible[i - 1]);
    }

    const step = differences[0];

    const firstVisibleIndex = original.findIndex(
      (number) => number !== -1
    );

    const firstValue = original[firstVisibleIndex];

    const missingIndex = original.findIndex(
      (number) => number === -1
    );

    return firstValue + (missingIndex - firstVisibleIndex) * step;
  };

  const submit = () => {
    const correct =
      Number(answer) === correctAnswer();

    onCorrect(correct);
    createQuestion();
  };

  return (
    <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 shadow-sm">

      <div className="flex flex-wrap justify-center gap-3">
        {question.map((number, index) => (
          <div
            key={index}
            className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-50 text-xl font-bold text-slate-800"
          >
            {number === -1 ? "?" : number}
          </div>
        ))}
      </div>

      <input
        value={answer}
        onChange={(event) =>
          setAnswer(event.target.value.replace(/\D/g, ""))
        }
        inputMode="numeric"
        className="mt-7 min-h-14 w-full rounded-xl border-2 border-slate-300 px-4 text-center text-2xl font-bold"
        placeholder="Missing number"
      />

      <button
        onClick={submit}
        className="mt-4 min-h-14 w-full rounded-xl bg-blue-700 px-5 py-4 text-lg font-bold text-white"
      >
        Submit Answer
      </button>

    </div>
  );
}

function MultipleChoiceGame({
  type,
  level,
  onCorrect,
}: {
  type: GameType;
  level: number;
  onCorrect: (correct: boolean) => void;
}) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [correct, setCorrect] = useState("");
  const [selected, setSelected] = useState("");

  const createQuestion = () => {
    setSelected("");

    if (type === "complete-pattern") {
      const start = Math.floor(Math.random() * 5) + 1;
      const step = level >= 3 ? Math.floor(Math.random() * 4) + 2 : 2;

      const numbers = Array.from(
        { length: 4 },
        (_, index) => start + index * step
      );

      const answer = start + 4 * step;

      setQuestion(`${numbers.join(" â†’ ")} â†’ ?`);
      setCorrect(String(answer));

      setOptions(
        shuffle([
          String(answer),
          String(answer + step),
          String(answer - 1),
          String(answer + 2),
        ])
      );

      return;
    }

    if (type === "odd-one-out") {
      const base = level >= 3 ? "ðŸ”µ" : "ðŸŽ";
      const odd = level >= 3 ? "ðŸŸ¢" : "ðŸŠ";

      const count = level === 1 ? 4 : level === 2 ? 6 : 8;

      const items = Array.from(
        { length: count },
        () => base
      );

      const oddIndex = Math.floor(Math.random() * count);
      items[oddIndex] = odd;

      setQuestion(items.join(" "));
      setCorrect(String(oddIndex + 1));

      setOptions(
        shuffle(
          [oddIndex + 1, oddIndex + 2, oddIndex - 1, 1]
            .filter((value) => value > 0 && value <= count)
            .map(String)
        ).slice(0, 4)
      );

      return;
    }

    if (type === "complete-word") {
      const word =
        words[Math.floor(Math.random() * words.length)];

      const index =
        level === 1
          ? 1
          : Math.floor(Math.random() * word.length);

      const answer = word[index];

      const display =
        word.substring(0, index) +
        "_" +
        word.substring(index + 1);

      setQuestion(`Complete the word: ${display}`);
      setCorrect(answer);

      const wrongLetters = shuffle(
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
          .split("")
          .filter((letter) => letter !== answer)
      ).slice(0, 3);

      setOptions(shuffle([answer, ...wrongLetters]));
    }
  };

  useEffect(() => {
    createQuestion();
  }, [level, type]);

  const submit = () => {
    onCorrect(selected === correct);
    createQuestion();
  };

  return (
    <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-sm">

      <h2 className="text-center text-2xl font-bold text-slate-900">
        {question}
      </h2>

      <div className="mt-8 grid grid-cols-2 gap-4">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => setSelected(option)}
            className={`min-h-16 rounded-2xl border-2 px-5 py-4 text-xl font-bold ${
              selected === option
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-slate-50 text-slate-800"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <button
        onClick={submit}
        disabled={!selected}
        className="mt-6 min-h-14 w-full rounded-2xl bg-blue-700 px-6 py-4 text-lg font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Submit Answer
      </button>

    </div>
  );
}

function TapTargetGame({
  level,
  onCorrect,
}: {
  level: number;
  onCorrect: (correct: boolean) => void;
}) {
  const [target, setTarget] = useState("");

  const targets =
    level === 1
      ? ["ðŸŽ¯"]
      : level === 2
      ? ["ðŸŽ¯", "â­", "ðŸ”µ"]
      : ["ðŸŽ¯", "â­", "ðŸ”µ", "ðŸŸ¢", "ðŸŸ¡"];

  const createTarget = () => {
    setTarget(
      targets[Math.floor(Math.random() * targets.length)]
    );
  };

  useEffect(() => {
    createTarget();
  }, [level]);

  return (
    <div className="text-center">

      <p className="text-lg font-semibold text-slate-600">
        Tap the target
      </p>

      <button
        onClick={() => {
          onCorrect(target === "ðŸŽ¯");
          createTarget();
        }}
        className="mx-auto mt-10 flex h-44 w-44 items-center justify-center rounded-full border-4 border-blue-200 bg-white text-7xl shadow-lg"
      >
        {target}
      </button>

      <p className="mt-6 text-slate-600">
        Find ðŸŽ¯ and tap it.
      </p>

    </div>
  );
}

function GenericGame({
  type,
  level,
  onCorrect,
}: {
  type: GameType;
  level: number;
  onCorrect: (correct: boolean) => void;
}) {
  const [items, setItems] = useState<string[]>([]);
  const [selected, setSelected] = useState("");
  const [correct, setCorrect] = useState("");

  const createRound = () => {
    const count =
      level === 1 ? 4 :
      level === 2 ? 6 :
      level === 3 ? 8 : 10;

    if (
      type === "find-object" ||
      type === "target-search"
    ) {
      const target = "â­";

      const newItems = Array.from(
        { length: count },
        () =>
          symbols[
            Math.floor(Math.random() * symbols.length)
          ]
      );

      const position = Math.floor(Math.random() * count);
      newItems[position] = target;

      setItems(newItems);
      setCorrect(target);
      setSelected("");

      return;
    }

    if (
      type === "picture-memory" ||
      type === "what-was-missing"
    ) {
      const selectedItems = shuffle(symbols).slice(
        0,
        Math.min(count, symbols.length)
      );

      setItems(selectedItems);
      setCorrect(
        selectedItems[
          Math.floor(Math.random() * selectedItems.length)
        ]
      );
      setSelected("");

      return;
    }

    if (type === "quick-response") {
      const instructions = [
        "Tap BLUE",
        "Tap RED",
        "Tap GREEN",
        "Tap STAR",
      ];

      const instruction =
        instructions[
          Math.floor(Math.random() * instructions.length)
        ];

      setItems(
        instruction.includes("BLUE")
          ? ["BLUE", "RED", "GREEN", "YELLOW"]
          : instruction.includes("RED")
          ? ["BLUE", "RED", "GREEN", "YELLOW"]
          : instruction.includes("GREEN")
          ? ["BLUE", "RED", "GREEN", "YELLOW"]
          : ["BLUE", "RED", "GREEN", "YELLOW"]
      );

      setCorrect(
        instruction.includes("BLUE")
          ? "BLUE"
          : instruction.includes("RED")
          ? "RED"
          : instruction.includes("GREEN")
          ? "GREEN"
          : "YELLOW"
      );

      setSelected("");

      return;
    }

    const newItems = shuffle(symbols).slice(
      0,
      Math.min(count, symbols.length)
    );

    setItems(newItems);
    setCorrect(
      newItems[Math.floor(Math.random() * newItems.length)]
    );
    setSelected("");
  };

  useEffect(() => {
    createRound();
  }, [level, type]);

  const submit = () => {
    onCorrect(selected === correct);
    createRound();
  };

  return (
    <div className="mx-auto max-w-2xl">

      {type === "quick-response" && (
        <div className="mb-6 rounded-2xl bg-blue-50 p-5 text-center">
          <p className="text-lg font-bold text-blue-700">
            Follow the instruction
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            Find the correct option
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">

        {items.map((item, index) => (
          <button
            key={`${item}-${index}`}
            onClick={() => setSelected(item)}
            className={`flex min-h-28 items-center justify-center rounded-2xl border-4 bg-white text-4xl shadow-sm ${
              selected === item
                ? "border-blue-600 bg-blue-50"
                : "border-slate-200"
            }`}
          >
            {item}
          </button>
        ))}

      </div>

      <button
        onClick={submit}
        disabled={!selected}
        className="mt-7 min-h-14 w-full rounded-2xl bg-blue-700 px-6 py-4 text-lg font-bold text-white disabled:opacity-40"
      >
        Submit Answer
      </button>

    </div>
  );
}

function DynamicGame() {
  const type = useMemo(() => getGameType(), []);
  const config = gameConfigs[type];

  const [level, setLevel] = useState(1);
  const [round, setRound] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [message, setMessage] = useState("");

  const handleResult = (correct: boolean) => {
    const newTotal = totalAnswers + 1;
    const newCorrect =
      correctAnswers + (correct ? 1 : 0);

    setTotalAnswers(newTotal);

    if (correct) {
      setCorrectAnswers(newCorrect);
      setMessage("ðŸŽ‰ Excellent! Great job!");
    } else {
      setMessage("ðŸ˜Š Good try! Keep going.");
    }

    setRound((previous) => previous + 1);

    /*
      ADAPTIVE DIFFICULTY

      Every 3 completed rounds:
      - 2 or more correct â†’ increase level
      - 0 or 1 correct â†’ decrease level
    */

    if (newTotal % 3 === 0) {
      const recentCorrect =
        newCorrect - correctAnswers +
        (correct ? 0 : 0);

      const recentAccuracy =
        newCorrect / newTotal;

      if (recentAccuracy >= 0.7) {
        setLevel((previous) =>
          clampLevel(previous + 1)
        );
        setMessage(
          "ðŸŒŸ You're doing very well! Difficulty increased."
        );
      } else if (recentAccuracy < 0.45) {
        setLevel((previous) =>
          clampLevel(previous - 1)
        );
        setMessage(
          "ðŸ’™ Let's make it a little easier."
        );
      }
    }

    setTimeout(() => {
      setMessage("");
    }, 1400);
  };

  const restart = () => {
    setLevel(1);
    setRound(0);
    setCorrectAnswers(0);
    setTotalAnswers(0);
    setMessage("");
  };

  const accuracy =
    totalAnswers === 0
      ? 0
      : Math.round(
          (correctAnswers / totalAnswers) * 100
        );

  const readInstructions = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const speech = new SpeechSynthesisUtterance(
        `${config.title}. ${config.description}. Take your time and complete the activity.`
      );

      speech.rate = 0.85;

      window.speechSynthesis.speak(speech);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-5 py-8 pb-12">

      <div className="mx-auto max-w-5xl">

        {/* TOP BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4">

          <button
            onClick={() => (window.location.href = "/games")}
            className="flex min-h-12 items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-5 py-3 font-bold text-slate-700"
          >
            <ArrowLeft size={20} />
            Back to Games
          </button>

          <button
            onClick={restart}
            className="flex min-h-12 items-center gap-2 rounded-xl border-2 border-blue-200 bg-white px-5 py-3 font-bold text-blue-700"
          >
            <RotateCcw size={20} />
            Restart
          </button>

        </div>

        {/* TITLE */}
        <div className="mt-8 text-center">

          <div className="text-6xl">
            {config.icon}
          </div>

          <h1 className="mt-4 text-4xl font-bold text-slate-900">
            {config.title}
          </h1>

          <p className="mt-2 text-lg text-slate-600">
            {config.description}
          </p>

          <button
            onClick={readInstructions}
            className="mx-auto mt-4 flex min-h-11 items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-blue-700 shadow-sm"
          >
            <Volume2 size={20} />
            Read Instructions
          </button>

        </div>

        {/* STATS */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">

          <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Level
            </p>
            <p className="mt-1 text-2xl font-bold text-blue-700">
              {level}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Score
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {correctAnswers * 10}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Rounds
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {round}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Accuracy
            </p>
            <p className="mt-1 text-2xl font-bold text-green-700">
              {accuracy}%
            </p>
          </div>

        </div>

        {/* FEEDBACK */}
        <div className="mt-5 min-h-10 text-center">
          {message && (
            <p className="text-lg font-bold text-blue-700">
              {message}
            </p>
          )}
        </div>

        {/* GAME AREA */}
        <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">

          {type === "card-matching" && (
            <CardMatchingGame
              level={level}
              onCorrect={handleResult}
            />
          )}

          {type === "remember-sequence" && (
            <SequenceGame
              level={level}
              onCorrect={handleResult}
            />
          )}

          {type === "number-sequence" && (
            <NumberSequenceGame
              level={level}
              onCorrect={handleResult}
            />
          )}

          {(type === "complete-pattern" ||
            type === "odd-one-out" ||
            type === "complete-word") && (
            <MultipleChoiceGame
              type={type}
              level={level}
              onCorrect={handleResult}
            />
          )}

          {type === "tap-the-target" && (
            <TapTargetGame
              level={level}
              onCorrect={handleResult}
            />
          )}

          {type !== "card-matching" &&
            type !== "remember-sequence" &&
            type !== "number-sequence" &&
            type !== "complete-pattern" &&
            type !== "odd-one-out" &&
            type !== "complete-word" &&
            type !== "tap-the-target" && (
              <GenericGame
                type={type}
                level={level}
                onCorrect={handleResult}
              />
            )}

        </div>

        {/* ADAPTIVE INFO */}
        <div className="mt-8 rounded-3xl bg-blue-50 p-6 text-center">

          <CheckCircle
            className="mx-auto text-blue-700"
            size={32}
          />

          <h2 className="mt-3 text-xl font-bold text-slate-900">
            NeuroSathi Adaptive Difficulty
          </h2>

          <p className="mx-auto mt-2 max-w-2xl leading-7 text-slate-600">
            Your performance is monitored during the activity.
            When you perform well, the challenge gradually becomes
            harder. If an activity becomes difficult, NeuroSathi
            automatically reduces the difficulty.
          </p>

        </div>

      </div>

    </div>
  );
}

export default DynamicGame;

