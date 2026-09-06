import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, RotateCcw, Volume2 } from "lucide-react";

interface Card {
  id: number;
  symbol: string;
  matched: boolean;
}

const symbols = [
  "🍎",
  "🌸",
  "🚗",
  "🐱",
  "☕",
  "⭐",
  "🌳",
  "🏠",
];

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

function getCardCount(level: number) {
  if (level === 1) return 4;
  if (level === 2) return 6;
  if (level === 3) return 8;
  if (level === 4) return 12;
  return 12;
}

function createCards(level: number): Card[] {
  const pairCount = getCardCount(level) / 2;

  const selectedSymbols = shuffle(symbols).slice(0, pairCount);

  const cards = selectedSymbols.flatMap((symbol, index) => [
    {
      id: index * 2,
      symbol,
      matched: false,
    },
    {
      id: index * 2 + 1,
      symbol,
      matched: false,
    },
  ]);

  return shuffle(cards);
}

function CardMatching() {
  const [level, setLevel] = useState(1);
  const [cards, setCards] = useState<Card[]>(() => createCards(1));
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [locked, setLocked] = useState(false);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [message, setMessage] = useState("");

  const totalCards = useMemo(() => getCardCount(level), [level]);

  const startGame = () => {
    setCards(createCards(level));
    setSelected([]);
    setMoves(0);
    setScore(0);
    setMessage("");
    setCompleted(false);
    setLocked(false);
    setStarted(true);
  };

  const restartGame = () => {
    startGame();
  };

  const readInstructions = () => {
    const text =
      "Look carefully at the cards. Tap two cards to find matching pairs. Take your time and have fun.";

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const speech = new SpeechSynthesisUtterance(text);
      speech.rate = 0.85;

      window.speechSynthesis.speak(speech);
    }
  };

  const handleCardClick = (cardId: number) => {
    if (!started || locked || completed) return;

    if (selected.includes(cardId)) return;

    const card = cards.find((item) => item.id === cardId);

    if (!card || card.matched) return;

    const newSelected = [...selected, cardId];

    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves((previous) => previous + 1);
      setLocked(true);

      const firstCard = cards.find(
        (item) => item.id === newSelected[0]
      );

      const secondCard = cards.find(
        (item) => item.id === newSelected[1]
      );

      if (firstCard?.symbol === secondCard?.symbol) {
        setTimeout(() => {
          setCards((previousCards) =>
            previousCards.map((item) =>
              newSelected.includes(item.id)
                ? { ...item, matched: true }
                : item
            )
          );

          setScore((previous) => previous + 10);
          setSelected([]);
          setLocked(false);
          setMessage("🎉 Great! You found a match!");

          setTimeout(() => {
            setMessage("");
          }, 1200);
        }, 500);
      } else {
        setTimeout(() => {
          setSelected([]);
          setLocked(false);
          setMessage("😊 Good try! Keep looking.");

          setTimeout(() => {
            setMessage("");
          }, 1200);
        }, 900);
      }
    }
  };

  useEffect(() => {
    if (!started) return;

    const allMatched =
      cards.length > 0 && cards.every((card) => card.matched);

    if (!allMatched) return;

    setCompleted(true);

    if (level < 4) {
      setTimeout(() => {
        setLevel((previous) => previous + 1);
      }, 1500);
    }
  }, [cards, level, started]);

  if (!started) {
    return (
      <div className="min-h-screen bg-slate-50 px-5 py-10">
        <div className="mx-auto max-w-3xl">

          <button
            onClick={() => (window.location.href = "/games")}
            className="mb-8 flex min-h-12 items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-5 py-3 font-bold text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft size={20} />
            Back to Games
          </button>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">

            <div className="text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-blue-100 text-5xl">
                🃏
              </div>

              <h1 className="mt-6 text-4xl font-bold text-slate-900">
                Card Matching
              </h1>

              <p className="mt-3 text-lg text-slate-600">
                A gentle memory activity
              </p>
            </div>

            <div className="mt-10 rounded-2xl bg-blue-50 p-6">
              <h2 className="text-2xl font-bold text-slate-900">
                How to Play
              </h2>

              <p className="mt-4 text-lg leading-8 text-slate-700">
                Look carefully at the cards. Tap two cards to find matching
                pairs. Take your time and remember where each picture is.
              </p>

              <button
                onClick={readInstructions}
                className="mt-5 flex min-h-12 items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-blue-700 shadow-sm"
              >
                <Volume2 size={21} />
                Read Instructions
              </button>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 p-6">
              <p className="text-base text-slate-600">
                Starting difficulty
              </p>

              <p className="mt-2 text-2xl font-bold text-blue-700">
                Level {level} · {totalCards} cards
              </p>

              <p className="mt-2 text-slate-600">
                The activity will gradually become more challenging as you
                improve.
              </p>
            </div>

            <button
              onClick={startGame}
              className="mt-8 flex min-h-16 w-full items-center justify-center rounded-2xl bg-blue-700 px-6 py-4 text-xl font-bold text-white shadow-lg hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              START GAME
            </button>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-5 py-8 pb-12">

      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <button
            onClick={() => (window.location.href = "/games")}
            className="flex min-h-12 w-fit items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-5 py-3 font-bold text-slate-700"
          >
            <ArrowLeft size={20} />
            Exit
          </button>

          <button
            onClick={restartGame}
            className="flex min-h-12 w-fit items-center gap-2 rounded-xl border-2 border-blue-200 bg-white px-5 py-3 font-bold text-blue-700"
          >
            <RotateCcw size={20} />
            Restart
          </button>

        </div>

        {/* Title */}
        <div className="mt-8 text-center">
          <div className="text-5xl">🃏</div>

          <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Card Matching
          </h1>

          <p className="mt-2 text-lg text-slate-600">
            Find all the matching pairs
          </p>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-5">

          <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Score
            </p>
            <p className="mt-1 text-2xl font-bold text-blue-700">
              {score}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Moves
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {moves}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Level
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {level}
            </p>
          </div>

        </div>

        {/* Feedback */}
        <div className="mt-5 min-h-10 text-center">
          {message && (
            <p className="text-lg font-bold text-blue-700">
              {message}
            </p>
          )}
        </div>

        {/* Cards */}
        <div
          className={`mx-auto mt-4 grid max-w-3xl gap-4 ${
            cards.length <= 4
              ? "grid-cols-2 max-w-md"
              : cards.length <= 8
              ? "grid-cols-4"
              : "grid-cols-4 sm:grid-cols-6"
          }`}
        >
          {cards.map((card) => {
            const isVisible =
              selected.includes(card.id) || card.matched;

            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                disabled={card.matched || locked}
                aria-label={
                  isVisible
                    ? `Card showing ${card.symbol}`
                    : "Hidden card"
                }
                className={`aspect-square rounded-2xl border-4 text-4xl shadow-md transition sm:text-5xl ${
                  isVisible
                    ? "border-blue-300 bg-white"
                    : "border-blue-700 bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isVisible ? card.symbol : "?"}
              </button>
            );
          })}
        </div>

        {/* Difficulty message */}
        {completed && (
          <div className="mt-8 rounded-3xl bg-white p-7 text-center shadow-lg">

            <div className="text-5xl">🎉</div>

            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              Activity Complete!
            </h2>

            <p className="mt-3 text-lg text-slate-600">
              You found all the matching pairs.
            </p>

            {level < 4 ? (
              <p className="mt-4 text-lg font-bold text-blue-700">
                🌟 You're doing great! Let's try something a little more
                challenging.
              </p>
            ) : (
              <p className="mt-4 text-lg font-bold text-blue-700">
                🧠 Excellent work! You've reached the highest demo level.
              </p>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">

              <button
                onClick={restartGame}
                className="min-h-14 rounded-xl bg-blue-700 px-7 py-4 text-lg font-bold text-white"
              >
                Play Again
              </button>

              <button
                onClick={() => (window.location.href = "/games")}
                className="min-h-14 rounded-xl border-2 border-slate-200 bg-white px-7 py-4 text-lg font-bold text-slate-700"
              >
                Try Another Game
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default CardMatching;