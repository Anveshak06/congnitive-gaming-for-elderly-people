import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { sounds, speakAloud, stopSpeaking } from "../utils/audio";

interface Message {
  id: string;
  sender: "sheru" | "user";
  text: string;
  action?: {
    type: string;
    path?: string;
    gameTitle?: string;
    games?: string[];
  } | null;
  quickReplies?: string[];
  timestamp: string;
}

const BACKEND_URL = "http://localhost:3001";

export default function AiCompanion() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessageNotice, setHasNewMessageNotice] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initial greeting
  useEffect(() => {
    const initialGreeting: Message = {
      id: "welcome-1",
      sender: "sheru",
      text: "Namaste & Hello! I am Sheru, your friendly guide companion 🐕. I'm here to help you navigate and find the most enjoyable games for your mind today. How are you feeling right now?",
      quickReplies: [
        "Want to train my memory 🧠",
        "Give me a number game 🔢",
        "Something relaxing 🌿",
        "Start Daily Challenge 🌟",
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages([initialGreeting]);
  }, []);

  // Auto scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Setup Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
        handleSendMessage(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in this browser. Please type your message.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      sounds.playClick();
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend || inputValue).trim();
    if (!content) return;

    sounds.playClick();
    const userMsg: Message = {
      id: "user-" + Date.now(),
      sender: "user",
      text: content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          history: messages.map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      });

      if (!response.ok) throw new Error("Backend unavailable");

      const data = await response.json();
      const botMsg: Message = {
        id: "sheru-" + Date.now(),
        sender: "sheru",
        text: data.reply,
        action: data.action,
        quickReplies: data.quickReplies,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
      sounds.playCorrect();
    } catch {
      // Fallback if backend is not yet reached
      const fallbackReply = getLocalFallback(content);
      const botMsg: Message = {
        id: "sheru-" + Date.now(),
        sender: "sheru",
        text: fallbackReply.reply,
        action: fallbackReply.action,
        quickReplies: fallbackReply.quickReplies,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
      sounds.playCorrect();
    } finally {
      setIsLoading(false);
    }
  };

  // Local fallback logic
  const getLocalFallback = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes("card") || lower.includes("match") || lower.includes("memory")) {
      return {
        reply: "Card Matching is wonderful for memory! Flipping pairs keeps the mind focused and sharp.",
        action: { type: "NAVIGATE", path: "/games/card-matching", gameTitle: "Card Matching" },
        quickReplies: ["Play Card Matching! 🃏", "Try Word Recall 🗣️", "Show all games 🎮"],
      };
    }
    if (lower.includes("sudoku") || lower.includes("number")) {
      return {
        reply: "Simple Sudoku is a relaxing 4x4 puzzle with numbers 1 to 4! Perfect for gentle logic.",
        action: { type: "NAVIGATE", path: "/games/simple-sudoku", gameTitle: "Simple Sudoku" },
        quickReplies: ["Play Simple Sudoku! 🧩", "Number Sequence ➕", "Back to Home 🏠"],
      };
    }
    return {
      reply: "I am right here with you! Tell me if you'd like to practice memory, numbers, patterns, words, or have a calming session.",
      action: { type: "NAVIGATE", path: "/games", gameTitle: "All Games" },
      quickReplies: ["Card Matching 🃏", "Simple Sudoku 🧩", "Word Recall 🗣️", "Daily Challenge 🌟"],
    };
  };

  const handleActionClick = (action: NonNullable<Message["action"]>) => {
    sounds.playClick();
    if (action.type === "NAVIGATE" && action.path) {
      navigate(action.path);
      setIsOpen(false);
    } else if (action.type === "TRIGGER_DAILY") {
      navigate("/games");
      setIsOpen(false);
    } else if (action.type === "TRIGGER_PROGRESS") {
      navigate("/games");
      setIsOpen(false);
    }
  };

  const openDrawer = () => {
    sounds.playBark();
    setIsOpen(true);
    setHasNewMessageNotice(false);
  };

  const closeDrawer = () => {
    sounds.playClick();
    stopSpeaking();
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Mascot Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
        {/* Floating Greeting Bubble */}
        {!isOpen && hasNewMessageNotice && (
          <div
            onClick={openDrawer}
            className="hidden sm:flex cursor-pointer items-center gap-2 rounded-2xl bg-amber-50 px-4 py-3 shadow-xl border-2 border-amber-300 transition-all hover:scale-105 animate-gentle-float"
          >
            <span className="text-xl">🐾</span>
            <div className="text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-800">Sheru the Guide Dog</p>
              <p className="text-sm font-semibold text-slate-800">Tap me for assistance & game guide!</p>
            </div>
          </div>
        )}

        {/* Mascot Avatar Widget */}
        <button
          onClick={isOpen ? closeDrawer : openDrawer}
          aria-label="Open AI Navigation Companion Sheru"
          className="group relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 border-4 border-white animate-pulse-glow"
        >
          {/* Dog Mascot SVG Icon */}
          <div className="relative flex items-center justify-center">
            <svg
              viewBox="0 0 64 64"
              className="h-14 w-14 drop-shadow-md"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Dog Ears */}
              <ellipse cx="14" cy="26" rx="8" ry="14" fill="#92400E" transform="rotate(-15 14 26)" />
              <ellipse cx="50" cy="26" rx="8" ry="14" fill="#92400E" transform="rotate(15 50 26)" />
              {/* Dog Face */}
              <circle cx="32" cy="32" r="22" fill="#FBBF24" />
              <ellipse cx="32" cy="38" rx="14" ry="11" fill="#FEF3C7" />
              {/* Eyes */}
              <ellipse cx="23" cy="27" rx="3.5" ry="4.5" fill="#1E293B" />
              <ellipse cx="41" cy="27" rx="3.5" ry="4.5" fill="#1E293B" />
              <circle cx="24" cy="25" r="1.2" fill="#FFFFFF" />
              <circle cx="42" cy="25" r="1.2" fill="#FFFFFF" />
              {/* Nose */}
              <ellipse cx="32" cy="35" rx="5" ry="3.5" fill="#451A03" />
              {/* Mouth & Tongue */}
              <path d="M28 38 Q32 42 36 38" stroke="#451A03" strokeWidth="2" strokeLinecap="round" fill="none" />
              <ellipse cx="32" cy="42" rx="3" ry="4" fill="#F43F5E" />
              {/* Wagging Tail behind */}
              <path
                d="M48 44 Q56 46 58 38"
                stroke="#D97706"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                className="animate-tail-wag"
              />
            </svg>

            {/* Sparkle badge */}
            <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white shadow-md">
              <Sparkles size={14} />
            </span>
          </div>
        </button>
      </div>

      {/* Slide-in / Popup Chat Window */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out border-l border-amber-200 sm:max-w-lg">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-amber-200 bg-gradient-to-r from-amber-50 via-amber-100 to-amber-50 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-2xl shadow-inner border-2 border-white">
                🐕
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-800">Sheru</h3>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                    Online Guide
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">Your Gentle Mind Navigation Partner</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  sounds.playClick();
                  setMessages([
                    {
                      id: "restart-" + Date.now(),
                      sender: "sheru",
                      text: "Let's start fresh! Tell me what you'd like to do today.",
                      quickReplies: [
                        "Memory games 🧠",
                        "Numbers & Sudoku 🔢",
                        "Word challenges ✏️",
                        "Relaxing pace 🌿",
                      ],
                      timestamp: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      }),
                    },
                  ]);
                }}
                title="Restart conversation"
                className="rounded-xl p-2.5 text-slate-500 hover:bg-amber-200/50 hover:text-slate-800 transition"
              >
                <RotateCcw size={18} />
              </button>

              <button
                onClick={closeDrawer}
                className="rounded-xl p-2.5 text-slate-500 hover:bg-amber-200/50 hover:text-slate-800 transition"
                aria-label="Close Chat"
              >
                <X size={22} />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`flex gap-3 max-w-[88%] ${
                    msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Mascot Avatar */}
                  {msg.sender === "sheru" && (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-lg shadow-sm border border-amber-300">
                      🐕
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5">
                    {/* Message Bubble */}
                    <div
                      className={`rounded-3xl px-5 py-4 text-base sm:text-lg leading-relaxed shadow-sm ${
                        msg.sender === "user"
                          ? "bg-blue-700 text-white rounded-tr-none"
                          : "bg-white text-slate-800 border-2 border-amber-100 rounded-tl-none font-medium"
                      }`}
                    >
                      {msg.text}

                      {/* Text-To-Speech Button for Sheru */}
                      {msg.sender === "sheru" && (
                        <div className="mt-2 flex items-center justify-end">
                          <button
                            onClick={() => {
                              sounds.playClick();
                              speakAloud(msg.text);
                            }}
                            className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition"
                            title="Read aloud"
                          >
                            <Volume2 size={14} />
                            <span>Listen</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Interactive Navigation Action Card */}
                    {msg.action && msg.action.type === "NAVIGATE" && msg.action.path && (
                      <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/80 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                              Recommended Activity
                            </span>
                            <h4 className="text-lg font-bold text-slate-900">
                              {msg.action.gameTitle || "Selected Game"}
                            </h4>
                          </div>
                          <span className="text-2xl">🎯</span>
                        </div>
                        <button
                          onClick={() => handleActionClick(msg.action!)}
                          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-3 text-base font-bold text-white shadow transition hover:bg-amber-700 active:scale-98"
                        >
                          <span>Play {msg.action.gameTitle} Now</span>
                          <ArrowRight size={18} />
                        </button>
                      </div>
                    )}

                    {/* Quick Replies */}
                    {msg.quickReplies && msg.quickReplies.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {msg.quickReplies.map((reply, index) => (
                          <button
                            key={index}
                            onClick={() => handleSendMessage(reply)}
                            className="rounded-full border border-amber-300 bg-white px-3.5 py-2 text-sm font-semibold text-amber-900 shadow-sm transition hover:bg-amber-100 hover:border-amber-400 active:scale-95"
                          >
                            {reply}
                          </button>
                        ))}
                      </div>
                    )}

                    <span className="text-[11px] text-slate-400 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-lg">
                  🐕
                </div>
                <div className="rounded-2xl bg-white border border-amber-200 px-4 py-3 text-sm text-slate-600 shadow-sm flex items-center gap-2">
                  <span className="animate-spin text-amber-600">🐾</span>
                  <span>Sheru is thinking of the best game for you...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input & Voice Controls */}
          <div className="border-t border-slate-200 bg-white p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={toggleListening}
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 transition ${
                  isListening
                    ? "border-red-500 bg-red-50 text-red-600 animate-pulse"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700"
                }`}
                title={isListening ? "Stop listening" : "Click to speak with Sheru"}
              >
                {isListening ? <MicOff size={22} /> : <Mic size={22} />}
              </button>

              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  isListening ? "Listening... speak now" : "Ask Sheru or type what you want to play..."
                }
                className="min-h-12 flex-1 rounded-2xl border-2 border-slate-200 px-4 text-base font-medium text-slate-800 placeholder-slate-400 outline-none transition focus:border-amber-500"
              />

              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-700 text-white shadow transition hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send size={20} />
              </button>
            </form>

            <div className="mt-2 flex items-center justify-between px-1 text-xs text-slate-400">
              <span>Tip: Ask "I want to train my memory" or "Suggest a calm game"</span>
              <button
                onClick={() => {
                  sounds.playClick();
                  handleSendMessage("Tell me what games are available");
                }}
                className="text-amber-700 font-semibold hover:underline"
              >
                Help guide
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
