import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import GamesPage from "./pages/GamesPage";
import DynamicGame from "./games/DynamicGame/DynamicGame";
import AiCompanion from "./components/AiCompanion";
import ProgressModal from "./components/ProgressModal";
import DailyChallengeModal from "./components/DailyChallengeModal";

import {
  Heart,
  ArrowRight,
  Gamepad2,
  BarChart3,
  Accessibility,
  Volume2,
  Sparkles,
} from "lucide-react";
import { sounds } from "./utils/audio";

interface HomeProps {
  onOpenProgress: () => void;
  onOpenDaily: () => void;
}

function HomePage({ onOpenProgress, onOpenDaily }: HomeProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div
            onClick={() => navigate("/")}
            className="flex cursor-pointer items-center gap-3 transition hover:opacity-90"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-2xl shadow-sm">
              🧠
            </div>
            <div>
              <h1 className="text-xl font-bold text-blue-700 sm:text-2xl">
                NeuroSathi
              </h1>
              <p className="hidden text-xs font-semibold text-slate-500 sm:block">
                Your Friendly Companion for an Active Mind
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-2 md:flex">
            <button
              onClick={() => {
                sounds.playClick();
                navigate("/");
              }}
              className="rounded-xl px-4 py-3 text-base font-bold text-blue-700 bg-blue-50"
            >
              Home
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                navigate("/games");
              }}
              className="rounded-xl px-4 py-3 text-base font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              Games Library (14)
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                onOpenDaily();
              }}
              className="flex items-center gap-1.5 rounded-xl px-4 py-3 text-base font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              <span>🌟</span>
              <span>Daily Routine</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                onOpenProgress();
              }}
              className="flex items-center gap-1.5 rounded-xl px-4 py-3 text-base font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              <BarChart3 size={20} />
              <span>My Progress</span>
            </button>
          </nav>

          <button
            onClick={() => {
              sounds.playClick();
              onOpenProgress();
            }}
            title="View Player Profile & Stars"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-lg font-bold text-white shadow-md hover:scale-105 transition"
          >
            ⭐
          </button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 lg:pb-24 lg:pt-16">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-800">
                <Sparkles size={18} />
                Cognitive Health & Wellness
              </div>

              <h2 className="max-w-2xl text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Keep Your Mind Active,
                <span className="mt-2 block text-blue-700">Every Single Day</span>
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 sm:text-xl">
                Simple, relaxing, and enjoyable activities designed to exercise memory,
                attention, numbers, words, and reaction—paced gently for senior citizens.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={() => {
                    sounds.playClick();
                    navigate("/games");
                  }}
                  className="flex min-h-16 items-center justify-center gap-3 rounded-2xl bg-blue-700 px-8 py-4 text-xl font-bold text-white shadow-xl transition hover:bg-blue-800 hover:scale-102 focus:ring-4 focus:ring-blue-200"
                >
                  <Gamepad2 size={26} />
                  <span>Start Playing Games</span>
                  <ArrowRight size={22} />
                </button>

                <button
                  onClick={() => {
                    sounds.playClick();
                    onOpenDaily();
                  }}
                  className="flex min-h-16 items-center justify-center gap-3 rounded-2xl border-3 border-amber-300 bg-amber-50 px-8 py-4 text-xl font-bold text-amber-900 transition hover:bg-amber-100"
                >
                  <span>🌟</span>
                  <span>Daily Mind Routine</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-10 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-3.5 border border-emerald-200">
                  <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-800">
                    <Heart size={22} />
                  </div>
                  <span className="text-base font-bold text-emerald-900">
                    Gentle Pace
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-purple-50 p-3.5 border border-purple-200">
                  <div className="rounded-xl bg-purple-100 p-2.5 text-purple-800">
                    <Accessibility size={22} />
                  </div>
                  <span className="text-base font-bold text-purple-900">
                    Large Buttons
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-amber-50 p-3.5 border border-amber-200">
                  <div className="rounded-xl bg-amber-100 p-2.5 text-amber-800">
                    <Volume2 size={22} />
                  </div>
                  <span className="text-base font-bold text-amber-900">
                    Audio Guided
                  </span>
                </div>
              </div>
            </div>

            {/* Illustration / Companion Feature Card */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-lg">
                <div className="absolute -left-5 top-10 h-32 w-32 rounded-full bg-blue-200 opacity-60 blur-3xl" />
                <div className="absolute -right-5 bottom-10 h-40 w-40 rounded-full bg-amber-200 opacity-60 blur-3xl" />

                <div className="relative rounded-[2.5rem] border-2 border-slate-200 bg-white p-8 shadow-2xl sm:p-10">
                  <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-tr from-amber-200 to-amber-100 text-7xl shadow-inner border-4 border-amber-300 animate-gentle-float">
                    🐕
                  </div>

                  <div className="mt-6 text-center">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">
                      <Sparkles size={14} />
                      Meet Sheru Your Companion
                    </div>
                    <h3 className="mt-3 text-2xl font-black text-slate-900">
                      Need help picking a game?
                    </h3>
                    <p className="mx-auto mt-2 max-w-sm text-base font-medium text-slate-600">
                      Tap Sheru in the bottom-right corner anytime! He can recommend games, adjust difficulty, or chat with you.
                    </p>
                  </div>

                  <div className="mt-8 grid grid-cols-3 gap-3">
                    <button
                      onClick={() => {
                        sounds.playClick();
                        navigate("/games/card-matching");
                      }}
                      className="rounded-2xl bg-blue-50 p-4 text-center hover:bg-blue-100 transition border border-blue-100"
                    >
                      <div className="text-3xl">🃏</div>
                      <p className="mt-2 text-xs font-bold text-blue-900">Memory</p>
                    </button>

                    <button
                      onClick={() => {
                        sounds.playClick();
                        navigate("/games/simple-sudoku");
                      }}
                      className="rounded-2xl bg-teal-50 p-4 text-center hover:bg-teal-100 transition border border-teal-100"
                    >
                      <div className="text-3xl">🧩</div>
                      <p className="mt-2 text-xs font-bold text-teal-900">Sudoku</p>
                    </button>

                    <button
                      onClick={() => {
                        sounds.playClick();
                        navigate("/games/number-sequence");
                      }}
                      className="rounded-2xl bg-emerald-50 p-4 text-center hover:bg-emerald-100 transition border border-emerald-100"
                    >
                      <div className="text-3xl">🔢</div>
                      <p className="mt-2 text-xs font-bold text-emerald-900">Numbers</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="bg-white px-5 py-16 sm:px-8 lg:py-20 border-t border-slate-200">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-base font-bold uppercase tracking-wide text-blue-700">
                Cognitive Categories
              </p>
              <h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                Choose What You'd Like to Practice
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Take your time and pick what feels right today. Every exercise has gentle levels.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["🃏", "Memory", "Card Matching & Sequence memory to exercise short-term recall.", "/games/card-matching"],
                ["🔢", "Number Skills", "Simple 4x4 Sudoku and number sequences for logical thinking.", "/games/simple-sudoku"],
                ["🔵", "Pattern Recognition", "Complete patterns and spot the odd one out.", "/games/complete-pattern"],
                ["🔎", "Attention & Focus", "Visual search scenes and target counting.", "/games/find-object"],
                ["🗣️", "Word Skills", "Word recall and vocabulary fill-in-the-blank.", "/games/word-recall"],
                ["🖼️", "Image Recall", "Remember pictures and detect what went missing.", "/games/picture-memory"],
                ["⚡", "Gentle Reaction", "Tap the target and quick prompt response.", "/games/tap-the-target"],
              ].map(([icon, title, description, route]) => (
                <div
                  key={title}
                  className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-4xl shadow-sm border border-slate-100">
                      {icon}
                    </div>
                    <h3 className="mt-6 text-2xl font-bold text-slate-900">{title}</h3>
                    <p className="mt-3 text-base leading-relaxed text-slate-600">{description}</p>
                  </div>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      navigate(route);
                    }}
                    className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-base font-bold text-white transition hover:bg-blue-800 shadow"
                  >
                    <span>Play Now</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Daily Motivation Banner */}
        <section className="px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-[2.5rem] bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 p-8 text-white shadow-2xl sm:p-12">
              <div className="grid items-center gap-10 lg:grid-cols-2">
                <div>
                  <div className="mb-4 text-5xl">🌟</div>
                  <h2 className="text-3xl font-black sm:text-4xl">
                    Ready for Today's Mind Workout?
                  </h2>
                  <p className="mt-4 text-lg leading-relaxed text-blue-100">
                    Just 10 minutes a day maintains sharp memory, improves focus, and brings a sense of joyful accomplishment!
                  </p>
                  <div className="mt-8 flex flex-wrap gap-4">
                    <button
                      onClick={() => {
                        sounds.playClick();
                        onOpenDaily();
                      }}
                      className="flex min-h-14 items-center gap-2 rounded-2xl bg-white px-7 py-4 text-lg font-extrabold text-blue-800 shadow-lg hover:bg-blue-50 transition"
                    >
                      <span>Start Daily Routine</span>
                      <ArrowRight size={20} />
                    </button>
                    <button
                      onClick={() => {
                        sounds.playClick();
                        onOpenProgress();
                      }}
                      className="flex min-h-14 items-center gap-2 rounded-2xl border-2 border-white/40 bg-white/10 px-7 py-4 text-lg font-bold text-white hover:bg-white/20 transition"
                    >
                      <BarChart3 size={20} />
                      <span>View My Stars</span>
                    </button>
                  </div>
                </div>

                <div className="rounded-3xl bg-white/10 p-6 sm:p-8 backdrop-blur border border-white/20">
                  <h4 className="text-xl font-bold">✨ NeuroSathi Senior Features</h4>
                  <ul className="mt-4 space-y-3 text-base text-blue-50">
                    <li className="flex items-center gap-3">
                      <span className="text-xl">🐕</span>
                      <span><strong>AI Companion Mascot</strong> navigates and guides you</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-xl">🔊</span>
                      <span><strong>Voice & Audio Assistance</strong> reads instructions aloud</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-xl">🎮</span>
                      <span><strong>14 Playable Games</strong> designed specifically for seniors</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-xl">⭐</span>
                      <span><strong>Progress Tracking</strong> to celebrate your daily streak</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white px-2 py-2 shadow-lg md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-4">
          <button
            onClick={() => {
              sounds.playClick();
              navigate("/");
            }}
            className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-blue-700"
          >
            <span className="text-xl">🏠</span>
            <span className="text-xs font-bold">Home</span>
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              navigate("/games");
            }}
            className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-slate-600"
          >
            <span className="text-xl">🎮</span>
            <span className="text-xs font-semibold">Games</span>
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              onOpenDaily();
            }}
            className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-slate-600"
          >
            <span className="text-xl">🌟</span>
            <span className="text-xs font-semibold">Daily</span>
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              onOpenProgress();
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

function App() {
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [isDailyOpen, setIsDailyOpen] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              onOpenProgress={() => setIsProgressOpen(true)}
              onOpenDaily={() => setIsDailyOpen(true)}
            />
          }
        />
        <Route
          path="/games"
          element={
            <GamesPage
              onOpenProgress={() => setIsProgressOpen(true)}
              onOpenDaily={() => setIsDailyOpen(true)}
            />
          }
        />
        <Route path="/games/:gameId" element={<DynamicGame />} />
      </Routes>

      {/* Global AI Navigation Companion Mascot (Sheru 🐕) */}
      <AiCompanion />

      {/* Global Modals */}
      <ProgressModal
        isOpen={isProgressOpen}
        onClose={() => setIsProgressOpen(false)}
      />
      <DailyChallengeModal
        isOpen={isDailyOpen}
        onClose={() => setIsDailyOpen(false)}
      />
    </BrowserRouter>
  );
}

export default App;
