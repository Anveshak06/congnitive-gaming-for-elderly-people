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
} from "lucide-react";

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
    description:
      "Practice remembering objects, sequences and information.",
    icon: <Brain size={30} />,
    games: [
      {
        name: "Card Matching",
        description: "Find and match pairs of cards.",
        icon: "🃏",
        route: "/games/card-matching",
      },
      {
        name: "Remember the Sequence",
        description:
          "Remember numbers, shapes and symbols in order.",
        icon: "🔢",
        route: "/games/remember-sequence",
      },
    ],
  },

  {
    name: "Number Skills",
    description:
      "Practice numbers, sequences and simple problem solving.",
    icon: <Calculator size={30} />,
    games: [
      {
        name: "Number Sequence",
        description: "Find the missing number in a sequence.",
        icon: "🔢",
        route: "/games/number-sequence",
      },
      {
        name: "Simple Sudoku",
        description:
          "Complete a beginner-friendly Sudoku puzzle.",
        icon: "🧩",
        route: "/games/simple-sudoku",
      },
    ],
  },

  {
    name: "Pattern Recognition",
    description:
      "Identify patterns and find differences.",
    icon: <Lightbulb size={30} />,
    games: [
      {
        name: "Complete the Pattern",
        description:
          "Find what comes next in a pattern.",
        icon: "🔵",
        route: "/games/complete-pattern",
      },
      {
        name: "Odd One Out",
        description:
          "Find the object that is different.",
        icon: "🔺",
        route: "/games/odd-one-out",
      },
    ],
  },

  {
    name: "Attention",
    description:
      "Practice focus through simple visual activities.",
    icon: <Focus size={30} />,
    games: [
      {
        name: "Find the Object",
        description:
          "Find a specific object in a simple scene.",
        icon: "🔎",
        route: "/games/find-object",
      },
      {
        name: "Target Search",
        description:
          "Find and tap all the target symbols.",
        icon: "🎯",
        route: "/games/target-search",
      },
    ],
  },

  {
    name: "Word Skills",
    description:
      "Practice remembering and completing familiar words.",
    icon: <MessageCircle size={30} />,
    games: [
      {
        name: "Word Recall",
        description:
          "Remember words you saw earlier.",
        icon: "🗣️",
        route: "/games/word-recall",
      },
      {
        name: "Complete the Word",
        description:
          "Choose the missing letter to complete a word.",
        icon: "✏️",
        route: "/games/complete-word",
      },
    ],
  },

  {
    name: "Image Recall",
    description:
      "Practice remembering pictures and visual information.",
    icon: <Image size={30} />,
    games: [
      {
        name: "Picture Memory",
        description:
          "Remember familiar pictures.",
        icon: "🖼️",
        route: "/games/picture-memory",
      },
      {
        name: "What Was Missing?",
        description:
          "Remember which picture disappeared.",
        icon: "👀",
        route: "/games/what-was-missing",
      },
    ],
  },

  {
    name: "Reaction",
    description:
      "Practice simple reaction and response activities.",
    icon: <Zap size={30} />,
    games: [
      {
        name: "Tap the Target",
        description:
          "Tap the target when it appears.",
        icon: "🎯",
        route: "/games/tap-the-target",
      },
      {
        name: "Quick Response",
        description:
          "Respond to simple instructions.",
        icon: "⚡",
        route: "/games/quick-response",
      },
    ],
  },
];

function GamesPage() {
  const openGame = (route: string) => {
    window.location.href = route;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
              🧠
            </div>

            <div>
              <h1 className="text-xl font-bold text-blue-700 sm:text-2xl">
                NeuroSathi
              </h1>

              <p className="hidden text-sm text-slate-500 sm:block">
                Choose an activity
              </p>
            </div>

          </div>

          <button
            onClick={() => (window.location.href = "/")}
            className="flex min-h-12 items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft size={20} />

            <span className="hidden sm:inline">
              Home
            </span>
          </button>

        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">

        {/* Page Introduction */}
        <div className="max-w-3xl">

          <p className="text-base font-bold uppercase tracking-wide text-blue-700">
            14 Cognitive Activities
          </p>

          <h2 className="mt-3 text-4xl font-bold text-slate-900 sm:text-5xl">
            Choose a Cognitive Activity
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Take your time and choose an activity that feels
            comfortable. NeuroSathi will gradually adapt activities
            to your performance.
          </p>

        </div>

        {/* Categories */}
        <div className="mt-12 space-y-10">

          {categories.map((category) => (

            <section
              key={category.name}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >

              {/* Category Header */}
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-start gap-4">

                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                    {category.icon}
                  </div>

                  <div>

                    <h3 className="text-2xl font-bold text-slate-900">
                      {category.name}
                    </h3>

                    <p className="mt-1 text-base leading-6 text-slate-600">
                      {category.description}
                    </p>

                  </div>

                </div>

                <span className="w-fit rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
                  {category.games.length} games
                </span>

              </div>

              {/* Games */}
              <div className="mt-7 grid gap-5 md:grid-cols-2">

                {category.games.map((game) => (

                  <div
                    key={game.name}
                    className="group rounded-2xl border-2 border-slate-200 bg-slate-50 p-5 transition hover:border-blue-200 hover:bg-white hover:shadow-md"
                  >

                    <div className="flex items-start gap-4">

                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-4xl shadow-sm">
                        {game.icon}
                      </div>

                      <div className="min-w-0 flex-1">

                        <h4 className="text-xl font-bold text-slate-900">
                          {game.name}
                        </h4>

                        <p className="mt-2 text-base leading-6 text-slate-600">
                          {game.description}
                        </p>

                      </div>

                    </div>

                    <button
                      onClick={() => openGame(game.route)}
                      className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-base font-bold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200"
                    >
                      Play Game
                      <ArrowRight size={20} />
                    </button>

                  </div>

                ))}

              </div>

            </section>

          ))}

        </div>

        {/* Encouragement */}
        <div className="mt-10 rounded-3xl border border-blue-100 bg-blue-50 p-6 text-center sm:p-8">

          <div className="text-4xl">
            🌟
          </div>

          <h3 className="mt-3 text-2xl font-bold text-slate-900">
            Practice at Your Own Pace
          </h3>

          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-600">
            There is no need to rush. NeuroSathi adjusts activities
            gradually based on your recent performance.
          </p>

        </div>

      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white px-2 py-2 shadow-lg md:hidden">

        <div className="mx-auto grid max-w-lg grid-cols-4">

          <button
            onClick={() => (window.location.href = "/")}
            className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-slate-600"
          >
            <span className="text-xl">
              🏠
            </span>

            <span className="text-xs font-semibold">
              Home
            </span>
          </button>

          <button
            className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-blue-700"
          >
            <span className="text-xl">
              🎮
            </span>

            <span className="text-xs font-semibold">
              Games
            </span>
          </button>

          <button
            className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-slate-600"
          >
            <span className="text-xl">
              🌟
            </span>

            <span className="text-xs font-semibold">
              Daily
            </span>
          </button>

          <button
            className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-slate-600"
          >
            <span className="text-xl">
              📊
            </span>

            <span className="text-xs font-semibold">
              Progress
            </span>
          </button>

        </div>

      </nav>

    </div>
  );
}

export default GamesPage;