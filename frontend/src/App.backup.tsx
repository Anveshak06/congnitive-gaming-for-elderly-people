import { BrowserRouter, Routes, Route } from "react-router-dom";
import GamesPage from "./pages/GamesPage";
import CardMatching from "./games/CardMatching/CardMatching";

import {
  Brain,
  Heart,
  ArrowRight,
  Gamepad2,
  BarChart3,
  Accessibility,
  Volume2,
  Sparkles,
} from "lucide-react";

const abilities = [
  {
    icon: "🧩",
    title: "Memory",
    description: "Practice remembering objects, sequences and information.",
    games: 2,
  },
  {
    icon: "🔢",
    title: "Number Skills",
    description: "Practice numbers, sequences and simple problem solving.",
    games: 2,
  },
  {
    icon: "🧠",
    title: "Pattern Recognition",
    description: "Identify patterns and find differences.",
    games: 2,
  },
  {
    icon: "🎯",
    title: "Attention",
    description: "Practice focus through simple visual activities.",
    games: 2,
  },
  {
    icon: "🗣️",
    title: "Word Skills",
    description: "Practice remembering and completing familiar words.",
    games: 2,
  },
  {
    icon: "🖼️",
    title: "Image Recall",
    description: "Practice remembering pictures and visual information.",
    games: 2,
  },
  {
    icon: "⚡",
    title: "Reaction",
    description: "Practice simple reaction and response activities.",
    games: 2,
  },
];

function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
              🧠
            </div>

            <div>
              <h1 className="text-xl font-bold text-blue-700 sm:text-2xl">
                NeuroSathi
              </h1>

              <p className="hidden text-xs text-slate-500 sm:block">
                Your Friendly Companion for an Active Mind
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-2 md:flex">
            <button className="rounded-xl px-4 py-3 text-base font-medium text-blue-700 hover:bg-blue-50">
              Home
            </button>

            <button className="rounded-xl px-4 py-3 text-base font-medium text-slate-600 hover:bg-slate-100">
              Games
            </button>

            <button className="rounded-xl px-4 py-3 text-base font-medium text-slate-600 hover:bg-slate-100">
              Daily Challenge
            </button>

            <button className="rounded-xl px-4 py-3 text-base font-medium text-slate-600 hover:bg-slate-100">
              My Progress
            </button>
          </nav>

          {/* Profile */}
          <button
            aria-label="Open profile"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700 hover:bg-blue-200"
          >
            V
          </button>
        </div>
      </header>

      {/* Hero */}
      <main>

        <section className="mx-auto max-w-7xl px-5 pb-16 pt-12 sm:px-8 lg:pb-24 lg:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">

            {/* Hero Text */}
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                <Sparkles size={18} />
                Cognitive Wellness
              </div>

              <h2 className="max-w-2xl text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Keep Your Mind Active,
                <span className="mt-2 block text-blue-700">
                  Every Day
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
                Simple and enjoyable activities designed to exercise memory,
                attention, numbers, patterns and more.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">

                <button className="flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-blue-700 px-7 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200">
                  <Gamepad2 size={24} />
                  Start Playing
                  <ArrowRight size={22} />
                </button>

                <button className="flex min-h-14 items-center justify-center gap-3 rounded-2xl border-2 border-blue-200 bg-white px-7 py-4 text-lg font-bold text-blue-700 transition hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-200">
                  <BarChart3 size={23} />
                  View My Progress
                </button>

              </div>

              {/* Trust / accessibility information */}
              <div className="mt-8 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-3">

                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-green-100 p-3 text-green-700">
                    <Heart size={21} />
                  </div>
                  <span className="text-sm font-medium text-slate-600">
                    Friendly
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-purple-100 p-3 text-purple-700">
                    <Accessibility size={21} />
                  </div>
                  <span className="text-sm font-medium text-slate-600">
                    Accessible
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-orange-100 p-3 text-orange-700">
                    <Volume2 size={21} />
                  </div>
                  <span className="text-sm font-medium text-slate-600">
                    Voice Ready
                  </span>
                </div>

              </div>
            </div>

            {/* Hero Illustration */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-lg">

                <div className="absolute -left-5 top-10 h-24 w-24 rounded-full bg-blue-200 opacity-60 blur-2xl" />
                <div className="absolute -right-5 bottom-10 h-32 w-32 rounded-full bg-purple-200 opacity-60 blur-2xl" />

                <div className="relative rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl sm:p-12">

                  <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-blue-100 text-7xl">
                    🧠
                  </div>

                  <div className="mt-8 text-center">
                    <h3 className="text-2xl font-bold text-slate-900">
                      A Little Practice,
                    </h3>

                    <p className="mt-2 text-xl font-semibold text-blue-700">
                      Every Day
                    </p>

                    <p className="mx-auto mt-4 max-w-sm text-base leading-7 text-slate-600">
                      Explore short, enjoyable activities at your own pace.
                    </p>
                  </div>

                  <div className="mt-8 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-blue-50 p-4 text-center">
                      <div className="text-3xl">🧩</div>
                      <p className="mt-2 text-sm font-semibold text-slate-700">
                        Memory
                      </p>
                    </div>

                    <div className="rounded-2xl bg-purple-50 p-4 text-center">
                      <div className="text-3xl">🎯</div>
                      <p className="mt-2 text-sm font-semibold text-slate-700">
                        Focus
                      </p>
                    </div>

                    <div className="rounded-2xl bg-green-50 p-4 text-center">
                      <div className="text-3xl">🔢</div>
                      <p className="mt-2 text-sm font-semibold text-slate-700">
                        Numbers
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Cognitive Abilities */}
        <section className="bg-white px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl">

            <div className="mx-auto max-w-2xl text-center">
              <p className="text-base font-bold uppercase tracking-wide text-blue-700">
                Explore Activities
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                Choose What You'd Like to Practice
              </h2>

              <p className="mt-4 text-lg leading-8 text-slate-600">
                Take your time and choose an activity that feels comfortable
                for you.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {abilities.map((ability) => (
                <div
                  key={ability.title}
                  className="group rounded-3xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-lg"
                >

                  <div className="flex items-start justify-between">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-4xl shadow-sm">
                      {ability.icon}
                    </div>

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                      {ability.games} games
                    </span>
                  </div>

                  <h3 className="mt-6 text-2xl font-bold text-slate-900">
                    {ability.title}
                  </h3>

                  <p className="mt-3 min-h-14 text-base leading-7 text-slate-600">
                    {ability.description}
                  </p>

                  <button className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-base font-bold text-blue-700 ring-1 ring-slate-200 transition group-hover:bg-blue-700 group-hover:text-white">
                    Explore Games
                    <ArrowRight size={20} />
                  </button>

                </div>
              ))}

            </div>
          </div>
        </section>

        {/* Daily Challenge */}
        <section className="px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl">

            <div className="rounded-[2rem] bg-blue-700 p-8 text-white shadow-xl sm:p-12">

              <div className="grid items-center gap-10 lg:grid-cols-2">

                <div>
                  <div className="mb-4 text-5xl">🌟</div>

                  <h2 className="text-3xl font-bold sm:text-4xl">
                    Today's Cognitive Activities
                  </h2>

                  <p className="mt-4 max-w-xl text-lg leading-8 text-blue-100">
                    Spend just 5–10 minutes enjoying a few simple activities.
                    Practice at your own pace.
                  </p>

                  <button className="mt-7 min-h-14 rounded-2xl bg-white px-7 py-4 text-lg font-bold text-blue-700 transition hover:bg-blue-50">
                    Start Today's Activities
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">

                  <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-5">
                    <span className="text-4xl">🧩</span>
                    <div>
                      <h3 className="text-lg font-bold">Card Matching</h3>
                      <p className="text-sm text-blue-100">Memory activity</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-5">
                    <span className="text-4xl">🎯</span>
                    <div>
                      <h3 className="text-lg font-bold">Find the Object</h3>
                      <p className="text-sm text-blue-100">Attention activity</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-5">
                    <span className="text-4xl">🗣️</span>
                    <div>
                      <h3 className="text-lg font-bold">Complete the Word</h3>
                      <p className="text-sm text-blue-100">Word activity</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Disclaimer */}
        <section className="border-t border-slate-200 bg-white px-5 py-8 sm:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm leading-6 text-slate-500">
              NeuroSathi is designed for cognitive engagement and wellness.
              It does not provide medical diagnosis or treatment.
            </p>
          </div>
        </section>

      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white px-2 py-2 shadow-lg md:hidden">

        <div className="mx-auto grid max-w-lg grid-cols-4">

          <button className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-blue-700">
            <span className="text-xl">🏠</span>
            <span className="text-xs font-semibold">Home</span>
          </button>

          <button className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-slate-600">
            <span className="text-xl">🎮</span>
            <span className="text-xs font-semibold">Games</span>
          </button>

          <button className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-slate-600">
            <span className="text-xl">🌟</span>
            <span className="text-xs font-semibold">Daily</span>
          </button>

          <button className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-slate-600">
            <span className="text-xl">📊</span>
            <span className="text-xs font-semibold">Progress</span>
          </button>

        </div>

      </nav>

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route
          path="/games/card-matching"
          element={<CardMatching />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;