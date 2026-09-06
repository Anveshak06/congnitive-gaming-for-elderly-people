import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Calculator,
  Focus,
  Image,
  Lightbulb,
  MessageCircle,
  Zap,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { sounds } from "../utils/audio";

interface Game {
  name: string;
  description: string;
  icon: string;
  route: string;
}

interface Category {
  name: string;
  description: string;
  icon: React.ReactNode;
  games: Game[];
}

const categories: Category[] = [
  {
    name: "Memory",
    description: "Practice remembering objects, cards, and sequences.",
    icon: <Brain size={30} />,
    games: [
      {
        name: "Card Matching",
        description: "Flip and match pairs of colorful cards.",
        icon: "🃏",
        route: "/games/card-matching",
      },
      {
        name: "Remember the Sequence",
        description: "Follow and repeat the flashing tile sequence.",
        icon: "🔢",
        route: "/games/remember-sequence",
      },
    ],
  },
  {
    name: "Number Skills",
    description: "Practice numbers, sequences, and gentle problem solving.",
    icon: <Calculator size={30} />,
    games: [
      {
        name: "Number Sequence",
        description: "Find the missing number in arithmetic patterns.",
        icon: "➕",
        route: "/games/number-sequence",
      },
      {
        name: "Simple Sudoku",
        description: "Complete a gentle 4x4 beginner Sudoku grid.",
        icon: "🧩",
        route: "/games/simple-sudoku",
      },
    ],
  },
  {
    name: "Pattern Recognition",
    description: "Identify order, color sequences, and subtle differences.",
    icon: <Lightbulb size={30} />,
    games: [
      {
        name: "Complete the Pattern",
        description: "Find what symbol comes next in sequence.",
        icon: "🔵",
        route: "/games/complete-pattern",
      },
      {
        name: "Odd One Out",
        description: "Spot the object that looks different.",
        icon: "🔺",
        route: "/games/odd-one-out",
      },
    ],
  },
  {
    name: "Attention & Focus",
    description: "Practice concentration and scanning through visual scenes.",
    icon: <Focus size={30} />,
    games: [
      {
        name: "Find the Object",
        description: "Locate a specific target item hidden in the grid.",
        icon: "🔎",
        route: "/games/find-object",
      },
      {
        name: "Target Search",
        description: "Count and collect all target symbols.",
        icon: "🎯",
        route: "/games/target-search",
      },
    ],
  },
  {
    name: "Word Skills",
    description: "Practice recalling and completing familiar words.",
    icon: <MessageCircle size={30} />,
    games: [
      {
        name: "Word Recall",
        description: "Memorize words and identify which were shown.",
        icon: "🗣️",
        route: "/games/word-recall",
      },
      {
        name: "Complete the Word",
        description: "Pick the missing letter to complete familiar words.",
        icon: "✏️",
        route: "/games/complete-word",
      },
    ],
  },
  {
    name: "Image Recall",
    description: "Practice remembering pictures and visual details.",
    icon: <Image size={30} />,
    games: [
      {
        name: "Picture Memory",
        description: "Remember pictures and recall which was displayed.",
        icon: "🖼️",
        route: "/games/picture-memory",
      },
      {
        name: "What Was Missing?",
        description: "Spot which picture vanished from the group.",
        icon: "👀",
        route: "/games/what-was-missing",
      },
    ],
  },
  {
    name: "Gentle Reaction",
    description: "Practice hand-eye coordination at a comfortable pace.",
    icon: <Zap size={30} />,
    games: [
      {
        name: "Tap the Target",
        description: "Tap the star target gently as it appears.",
        icon: "⏱️",
        route: "/games/tap-the-target",
      },
      {
        name: "Quick Response",
        description: "Follow the friendly instructions promptly.",
        icon: "⚡",
        route: "/games/quick-response",
      },
    ],
  },
];

interface GamesPageProps {
  onOpenProgress?: () => void;
  onOpenDaily?: () => void;
}

export default function GamesPage({ onOpenProgress, onOpenDaily }: GamesPageProps) {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState<string>("All");

  const filterList = ["All", "Memory", "Number Skills", "Pattern Recognition", "Attention & Focus", "Word Skills", "Image Recall", "Gentle Reaction"];

  const filteredCategories =
    selectedFilter === "All"
      ? categories
      : categories.filter((c) => c.name.toLowerCase().includes(selectedFilter.toLowerCase().split(" ")[0]));

  const openGame = (route: string) => {
    sounds.playClick();
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-28 text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div
            onClick={() => navigate("/")}
            className="flex cursor-pointer items-center gap-3 transition hover:opacity-90"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
              🧠
            </div>
            <div>
              <h1 className="text-xl font-bold text-blue-700 sm:text-2xl">
                NeuroSathi
              </h1>
              <p className="hidden text-xs font-semibold text-slate-500 sm:block">
                All 14 Senior Cognitive Games
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenDaily && (
              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenDaily();
                }}
                className="hidden sm:flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-bold text-amber-900 hover:bg-amber-100 transition"
              >
                <span>🌟</span>
                <span>Daily Workout</span>
              </button>
            )}

            {onOpenProgress && (
              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenProgress();
                }}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                <BarChart3 size={18} />
                <span>My Progress</span>
              </button>
            )}

            <button
              onClick={() => {
                sounds.playClick();
                navigate("/");
              }}
              className="flex items-center gap-1.5 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-800 transition"
            >
              <ArrowLeft size={18} />
              <span>Home</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-12">
        {/* Page Title & Intro */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-bold text-blue-800 mb-3">
            <Sparkles size={16} />
            Complete Game Catalog
          </div>
          <h2 className="text-3xl font-black text-slate-900 sm:text-4xl lg:text-5xl">
            Choose a Cognitive Game
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-slate-600">
            Take your time and explore any game that interests you. Each game starts with gentle instructions and adapts to your comfort.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="mt-8 flex flex-wrap gap-2">
          {filterList.map((f) => (
            <button
              key={f}
              onClick={() => {
                sounds.playClick();
                setSelectedFilter(f);
              }}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                selectedFilter === f
                  ? "bg-blue-700 text-white shadow"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Categories & Game Cards */}
        <div className="mt-10 space-y-10">
          {filteredCategories.map((category) => (
            <section
              key={category.name}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{category.name}</h3>
                    <p className="text-sm font-medium text-slate-500 mt-0.5">{category.description}</p>
                  </div>
                </div>
                <span className="w-fit rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700 border border-blue-200">
                  {category.games.length} {category.games.length === 1 ? "Activity" : "Activities"}
                </span>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {category.games.map((game) => (
                  <div
                    key={game.name}
                    className="group flex flex-col justify-between rounded-2xl border-2 border-slate-200 bg-slate-50/70 p-5 transition-all hover:border-blue-300 hover:bg-white hover:shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-4xl shadow-sm border border-slate-200 group-hover:scale-105 transition-transform">
                        {game.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                          {game.name}
                        </h4>
                        <p className="mt-1.5 text-sm sm:text-base leading-relaxed text-slate-600">
                          {game.description}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => openGame(game.route)}
                      className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-base font-bold text-white shadow transition hover:bg-blue-800 active:scale-98"
                    >
                      <span>Play {game.name}</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Gentle Encouragement Banner */}
        <div className="mt-12 rounded-3xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-6 sm:p-8 text-center">
          <div className="text-4xl">🐕</div>
          <h3 className="mt-3 text-2xl font-bold text-slate-900">
            Unsure Which Game to Try First?
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-base text-slate-600">
            Tap Sheru the companion dog in the bottom corner anytime! He can ask how you are feeling and choose the right game for you.
          </p>
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white px-2 py-2 shadow-lg md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-4">
          <button
            onClick={() => {
              sounds.playClick();
              navigate("/");
            }}
            className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-slate-600"
          >
            <span className="text-xl">🏠</span>
            <span className="text-xs font-semibold">Home</span>
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              navigate("/games");
            }}
            className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-blue-700"
          >
            <span className="text-xl">🎮</span>
            <span className="text-xs font-bold">Games</span>
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              onOpenDaily?.();
            }}
            className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-slate-600"
          >
            <span className="text-xl">🌟</span>
            <span className="text-xs font-semibold">Daily</span>
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              onOpenProgress?.();
            }}
            className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-slate-600"
          >
            <span className="text-xl">📊</span>
            <span className="text-xs font-semibold">Progress</span>
          </button>
        </div>
      </nav>
    </div>
  );
}