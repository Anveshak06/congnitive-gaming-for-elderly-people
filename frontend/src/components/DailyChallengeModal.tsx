import { useNavigate } from "react-router-dom";
import { X, Sparkles, ArrowRight, Star } from "lucide-react";
import { sounds } from "../utils/audio";

interface DailyChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DailyChallengeModal({
  isOpen,
  onClose,
}: DailyChallengeModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const challengeGames = [
    {
      step: 1,
      name: "Card Matching",
      category: "Memory Workout",
      icon: "🃏",
      route: "/games/card-matching",
      stars: 3,
      desc: "Flip and match pairs to wake up visual memory.",
    },
    {
      step: 2,
      name: "Number Sequence",
      category: "Mental Arithmetic",
      icon: "➕",
      route: "/games/number-sequence",
      stars: 3,
      desc: "Spot the hidden number pattern and complete the row.",
    },
    {
      step: 3,
      name: "Quick Response",
      category: "Gentle Reflexes",
      icon: "⚡",
      route: "/games/quick-response",
      stars: 3,
      desc: "Follow the friendly instructions and tap quickly.",
    },
  ];

  const handleStartGame = (route: string) => {
    sounds.playClick();
    navigate(route);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-3xl">
              🌟
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Daily Mind Workout
              </h2>
              <p className="text-sm font-medium text-slate-500">
                Complete these 3 gentle exercises today
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="rounded-xl p-2.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Challenge Steps */}
        <div className="mt-6 space-y-4">
          {challengeGames.map((game) => (
            <div
              key={game.route}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border-2 border-slate-100 p-5 bg-slate-50/70 hover:border-blue-300 hover:bg-blue-50/40 transition"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm border border-slate-200">
                  {game.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800">
                      Step {game.step}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {game.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    {game.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    {game.desc}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleStartGame(game.route)}
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow transition hover:bg-blue-800"
              >
                <span>Play</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Daily Reward Banner */}
        <div className="mt-6 flex items-center justify-between rounded-2xl bg-amber-50 p-4 border border-amber-200">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏅</span>
            <div>
              <p className="text-sm font-bold text-amber-900">Total Completion Reward</p>
              <p className="text-xs text-amber-700">Earn +9 Mind Stars & extend your daily streak!</p>
            </div>
          </div>
          <div className="flex items-center gap-1 font-bold text-amber-800 bg-amber-200/60 px-3 py-1.5 rounded-xl">
            <Star size={16} fill="#B45309" />
            <span>9 Stars</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => handleStartGame(challengeGames[0].route)}
          className="mt-6 flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-4 text-lg font-bold text-white shadow-xl transition hover:from-blue-800 hover:to-indigo-800"
        >
          <Sparkles size={22} />
          <span>Begin Step 1: Card Matching</span>
          <ArrowRight size={22} />
        </button>
      </div>
    </div>
  );
}
