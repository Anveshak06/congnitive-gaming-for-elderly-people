import { useState, useEffect } from "react";
import {
  X,
  Star,
  Flame,
  Brain,
  Volume2,
} from "lucide-react";
import { sounds, speakAloud } from "../utils/audio";

interface ProgressData {
  totalPlayed: number;
  starsEarned: number;
  streakDays: number;
  categoryStats: Record<string, number>;
  history: Array<{
    gameId: string;
    category?: string;
    score: number;
    stars: number;
    date: string;
  }>;
}

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL !== undefined
    ? import.meta.env.VITE_BACKEND_URL
    : typeof window !== "undefined" && window.location.port === "5173"
    ? "http://localhost:3001"
    : "";

export default function ProgressModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [data, setData] = useState<ProgressData>({
    totalPlayed: 12,
    starsEarned: 34,
    streakDays: 4,
    categoryStats: {
      Memory: 5,
      "Number Skills": 3,
      "Pattern Recognition": 2,
      Attention: 1,
      "Word Skills": 1,
      "Image Recall": 0,
      Reaction: 0,
    },
    history: [],
  });

  useEffect(() => {
    if (isOpen) {
      sounds.playCelebration();
      fetch(`${BACKEND_URL}/api/progress`)
        .then((res) => res.json())
        .then((res) => {
          if (res && res.starsEarned !== undefined) {
            setData(res);
          }
        })
        .catch(() => {
          // Keep default state if offline
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSpeakSummary = () => {
    sounds.playClick();
    speakAloud(
      `Wonderful work! You have earned ${data.starsEarned} stars, played ${data.totalPlayed} games, and maintained a ${data.streakDays} day streak. Your mind is active and healthy!`
    );
  };

  const categories = [
    { name: "Memory", icon: "🧠", color: "bg-blue-100 text-blue-800" },
    { name: "Number Skills", icon: "🔢", color: "bg-emerald-100 text-emerald-800" },
    { name: "Pattern Recognition", icon: "🔵", color: "bg-amber-100 text-amber-800" },
    { name: "Attention", icon: "🔎", color: "bg-cyan-100 text-cyan-800" },
    { name: "Word Skills", icon: "🗣️", color: "bg-purple-100 text-purple-800" },
    { name: "Image Recall", icon: "🖼️", color: "bg-rose-100 text-rose-800" },
    { name: "Reaction", icon: "⚡", color: "bg-yellow-100 text-yellow-800" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-3xl">
              🏆
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                My Mind Progress
              </h2>
              <p className="text-sm font-medium text-slate-500">
                Celebrate your daily cognitive achievements
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSpeakSummary}
              className="flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700 hover:bg-blue-100 transition"
              title="Listen to summary"
            >
              <Volume2 size={18} />
              <span>Listen</span>
            </button>

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
        </div>

        {/* Big Highlights Row */}
        <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4 text-center">
          <div className="rounded-2xl bg-amber-50 p-4 border border-amber-200">
            <div className="flex items-center justify-center gap-1 text-amber-600 mb-1">
              <Star size={24} fill="#D97706" />
            </div>
            <p className="text-3xl font-extrabold text-amber-900 sm:text-4xl">
              {data.starsEarned}
            </p>
            <p className="text-xs sm:text-sm font-semibold text-amber-800 mt-1">Stars Earned</p>
          </div>

          <div className="rounded-2xl bg-orange-50 p-4 border border-orange-200">
            <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
              <Flame size={24} />
            </div>
            <p className="text-3xl font-extrabold text-orange-900 sm:text-4xl">
              {data.streakDays}
            </p>
            <p className="text-xs sm:text-sm font-semibold text-orange-800 mt-1">Day Streak</p>
          </div>

          <div className="rounded-2xl bg-blue-50 p-4 border border-blue-200">
            <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
              <Brain size={24} />
            </div>
            <p className="text-3xl font-extrabold text-blue-900 sm:text-4xl">
              {data.totalPlayed}
            </p>
            <p className="text-xs sm:text-sm font-semibold text-blue-800 mt-1">Games Played</p>
          </div>
        </div>

        {/* Cognitive Breakdown */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span>Cognitive Exercises Completed</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map((cat) => {
              const count = data.categoryStats[cat.name] || 0;
              return (
                <div
                  key={cat.name}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 p-3.5 bg-slate-50/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="text-base font-semibold text-slate-700">
                      {cat.name}
                    </span>
                  </div>
                  <span className={`rounded-xl px-3 py-1 text-sm font-bold ${cat.color}`}>
                    {count} {count === 1 ? "time" : "times"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Encouraging Wellness Note */}
        <div className="mt-8 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 p-5 border border-emerald-200">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🌿</span>
            <div>
              <h4 className="text-base font-bold text-emerald-900">
                Doctor & Wellness Tip for Seniors
              </h4>
              <p className="text-sm font-medium text-emerald-800 mt-1 leading-relaxed">
                Playing just 10 to 15 minutes of varied cognitive activities daily stimulates neural plasticity, preserves working memory, and boosts mood and mental confidence!
              </p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="mt-8 flex min-h-14 w-full items-center justify-center rounded-2xl bg-blue-700 px-6 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-blue-800"
        >
          Keep Playing & Having Fun!
        </button>
      </div>
    </div>
  );
}
