import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Game Catalog
const GAMES_CATALOG = [
  {
    id: "card-matching",
    name: "Card Matching",
    category: "Memory",
    description: "Flip cards to find matching pairs. Great for short-term visual memory.",
    route: "/games/card-matching",
    icon: "🃏",
    color: "bg-blue-500",
    difficulty: "Gentle to Moderate",
    benefits: "Visual memory, concentration, focus"
  },
  {
    id: "remember-sequence",
    name: "Remember the Sequence",
    category: "Memory",
    description: "Watch the flashing numbers or tiles and repeat the exact order.",
    route: "/games/remember-sequence",
    icon: "🔢",
    color: "bg-indigo-500",
    difficulty: "Gentle to Moderate",
    benefits: "Working memory, sequential thinking"
  },
  {
    id: "number-sequence",
    name: "Number Sequence",
    category: "Number Skills",
    description: "Discover the missing number in an arithmetic pattern.",
    route: "/games/number-sequence",
    icon: "➕",
    color: "bg-emerald-500",
    difficulty: "Gentle to Moderate",
    benefits: "Mental arithmetic, logic, pattern deduction"
  },
  {
    id: "simple-sudoku",
    name: "Simple Sudoku",
    category: "Number Skills",
    description: "A calming 4x4 Mini-Sudoku grid with digits 1 through 4.",
    route: "/games/simple-sudoku",
    icon: "🧩",
    color: "bg-teal-500",
    difficulty: "Gentle to Moderate",
    benefits: "Problem solving, deduction, patience"
  },
  {
    id: "complete-pattern",
    name: "Complete the Pattern",
    category: "Pattern Recognition",
    description: "Identify which symbol comes next in a colorful sequence.",
    route: "/games/complete-pattern",
    icon: "🔵",
    color: "bg-amber-500",
    difficulty: "Gentle",
    benefits: "Visual spatial reasoning, prediction"
  },
  {
    id: "odd-one-out",
    name: "Odd One Out",
    category: "Pattern Recognition",
    description: "Spot the one object that looks different from all the others.",
    route: "/games/odd-one-out",
    icon: "🔺",
    color: "bg-orange-500",
    difficulty: "Gentle",
    benefits: "Selective attention, visual discrimination"
  },
  {
    id: "find-object",
    name: "Find the Object",
    category: "Attention",
    description: "Scan the scene and find the target hidden in the grid.",
    route: "/games/find-object",
    icon: "🔎",
    color: "bg-cyan-500",
    difficulty: "Gentle",
    benefits: "Visual scanning, sustained attention"
  },
  {
    id: "target-search",
    name: "Target Search",
    category: "Attention",
    description: "Count and tap all designated target symbols in the field.",
    route: "/games/target-search",
    icon: "🎯",
    color: "bg-sky-500",
    difficulty: "Gentle to Moderate",
    benefits: "Visual search speed, divided attention"
  },
  {
    id: "word-recall",
    name: "Word Recall",
    category: "Word Skills",
    description: "Memorize a list of warm words, then recall which ones you saw.",
    route: "/games/word-recall",
    icon: "🗣️",
    color: "bg-purple-500",
    difficulty: "Gentle to Moderate",
    benefits: "Verbal memory, vocabulary recognition"
  },
  {
    id: "complete-word",
    name: "Complete the Word",
    category: "Word Skills",
    description: "Fill in the missing letter to complete familiar everyday words.",
    route: "/games/complete-word",
    icon: "✏️",
    color: "bg-fuchsia-500",
    difficulty: "Gentle",
    benefits: "Language fluency, cognitive recall"
  },
  {
    id: "picture-memory",
    name: "Picture Memory",
    category: "Image Recall",
    description: "Take a good look at familiar pictures and recall them accurately.",
    route: "/games/picture-memory",
    icon: "🖼️",
    color: "bg-rose-500",
    difficulty: "Gentle",
    benefits: "Visual recognition, episodic memory"
  },
  {
    id: "what-was-missing",
    name: "What Was Missing?",
    category: "Image Recall",
    description: "Several items are shown, then one vanishes. Which one was it?",
    route: "/games/what-was-missing",
    icon: "👀",
    color: "bg-pink-500",
    difficulty: "Gentle",
    benefits: "Short-term visual retention, vigilance"
  },
  {
    id: "tap-the-target",
    name: "Tap the Target",
    category: "Reaction",
    description: "Gently tap the target circle whenever it appears on screen.",
    route: "/games/tap-the-target",
    icon: "⏱️",
    color: "bg-lime-600",
    difficulty: "Gentle",
    benefits: "Hand-eye coordination, motor speed"
  },
  {
    id: "quick-response",
    name: "Quick Response",
    category: "Reaction",
    description: "Listen or read the prompt and select the correct matching button.",
    route: "/games/quick-response",
    icon: "⚡",
    color: "bg-yellow-500",
    difficulty: "Gentle to Moderate",
    benefits: "Cognitive flexibility, processing speed"
  }
];

// Persistent user progress store (local JSON file)
const DATA_FILE = path.join(__dirname, "user_progress.json");

function loadProgress() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    }
  } catch (err) {
    console.error("Failed to read progress file:", err);
  }
  return {
    totalPlayed: 12,
    starsEarned: 34,
    streakDays: 4,
    lastPlayedDate: new Date().toISOString().split("T")[0],
    history: [
      { gameId: "card-matching", score: 100, stars: 3, date: new Date().toISOString() },
      { gameId: "number-sequence", score: 80, stars: 2, date: new Date().toISOString() }
    ],
    categoryStats: {
      Memory: 5,
      "Number Skills": 3,
      "Pattern Recognition": 2,
      Attention: 1,
      "Word Skills": 1,
      "Image Recall": 0,
      Reaction: 0
    }
  };
}

function saveProgress(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Failed to save progress file:", err);
  }
}

let userProgress = loadProgress();

// --- Health Check ---
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "NeuroSathi Backend API",
    geminiEnabled: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// --- Games Catalog ---
app.get("/api/games", (req, res) => {
  res.json({ games: GAMES_CATALOG });
});

// --- Daily Challenge ---
app.get("/api/daily-challenge", (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  // Curate 3 games daily
  res.json({
    date: today,
    title: "Daily Mind Refresh Routine",
    description: "Complete these 3 gentle exercises today to keep your mind sharp and active!",
    games: [
      GAMES_CATALOG.find((g) => g.id === "card-matching"),
      GAMES_CATALOG.find((g) => g.id === "number-sequence"),
      GAMES_CATALOG.find((g) => g.id === "quick-response")
    ],
    targetStars: 9
  });
});

// --- Progress Endpoints ---
app.get("/api/progress", (req, res) => {
  res.json(userProgress);
});

app.post("/api/progress", (req, res) => {
  const { gameId, category, stars = 1, score = 10 } = req.body;

  userProgress.totalPlayed += 1;
  userProgress.starsEarned += stars;

  if (category && userProgress.categoryStats[category] !== undefined) {
    userProgress.categoryStats[category] += 1;
  } else if (category) {
    userProgress.categoryStats[category] = 1;
  }

  const today = new Date().toISOString().split("T")[0];
  if (userProgress.lastPlayedDate !== today) {
    userProgress.streakDays += 1;
    userProgress.lastPlayedDate = today;
  }

  userProgress.history.unshift({
    gameId,
    category,
    stars,
    score,
    date: new Date().toISOString()
  });

  if (userProgress.history.length > 50) {
    userProgress.history = userProgress.history.slice(0, 50);
  }

  saveProgress(userProgress);
  res.json({ success: true, progress: userProgress });
});

// --- Rule-based Intelligent Companion Engine (Fallback & Instant response) ---
function generateCompanionResponse(userMessage, conversationHistory = []) {
  const lower = userMessage.toLowerCase().trim();

  // Navigation intents
  if (lower.includes("card") || lower.includes("match") || lower.includes("flip")) {
    return {
      reply: "Card Matching is wonderful for strengthening visual memory and concentration! Let's flip some cards together.",
      action: { type: "NAVIGATE", path: "/games/card-matching", gameTitle: "Card Matching" },
      quickReplies: ["Start Card Matching!", "Show other memory games", "Tell me the rules"]
    };
  }

  if (lower.includes("sudoku") || (lower.includes("number") && lower.includes("grid"))) {
    return {
      reply: "Simple Sudoku is a relaxing 4x4 puzzle with numbers 1 to 4! Perfect for your daily logical exercise. Shall we start?",
      action: { type: "NAVIGATE", path: "/games/simple-sudoku", gameTitle: "Simple Sudoku" },
      quickReplies: ["Start Simple Sudoku!", "I want something easier", "Tell me the rules"]
    };
  }

  if (lower.includes("sequence") || lower.includes("order")) {
    if (lower.includes("number") || lower.includes("math")) {
      return {
        reply: "Number Sequence exercises your arithmetic deduction by finding missing numbers. Ready to give it a try?",
        action: { type: "NAVIGATE", path: "/games/number-sequence", gameTitle: "Number Sequence" },
        quickReplies: ["Start Number Sequence!", "Try Sequence Memory instead", "Back to Home"]
      };
    }
    return {
      reply: "Remember the Sequence is a great memory challenge! Watch the flashing sequence and repeat it. Let's go!",
      action: { type: "NAVIGATE", path: "/games/remember-sequence", gameTitle: "Remember the Sequence" },
      quickReplies: ["Start Sequence Game!", "Try Number Sequence", "Explain how it works"]
    };
  }

  if (lower.includes("number") || lower.includes("math") || lower.includes("calculate")) {
    return {
      reply: "I love numbers! We have two great number activities: 'Number Sequence' for spotting arithmetic patterns, and 'Simple Sudoku' (4x4). Which sounds more fun?",
      action: { type: "SUGGEST_GAMES", games: ["number-sequence", "simple-sudoku"] },
      quickReplies: ["Number Sequence", "Simple Sudoku", "Surprise me!"]
    };
  }

  if (lower.includes("memory") || lower.includes("remember") || lower.includes("recall")) {
    return {
      reply: "Memory exercises are so rewarding! You can try 'Card Matching', 'Remember the Sequence', 'Word Recall', or 'Picture Memory'. Where would you like to start?",
      action: { type: "SUGGEST_GAMES", games: ["card-matching", "remember-sequence", "word-recall", "picture-memory"] },
      quickReplies: ["Card Matching 🃏", "Word Recall 🗣️", "Picture Memory 🖼️", "Remember Sequence 🔢"]
    };
  }

  if (lower.includes("word") || lower.includes("spell") || lower.includes("letter") || lower.includes("vocabulary")) {
    return {
      reply: "Word games keep language and fluency vibrant! Would you like to recall words or fill in missing letters in 'Complete the Word'?",
      action: { type: "SUGGEST_GAMES", games: ["complete-word", "word-recall"] },
      quickReplies: ["Complete the Word ✏️", "Word Recall 🗣️", "Back to all games"]
    };
  }

  if (lower.includes("pattern") || lower.includes("shape")) {
    return {
      reply: "Pattern recognition is soothing and keeps visual thinking sharp! 'Complete the Pattern' is ready for you.",
      action: { type: "NAVIGATE", path: "/games/complete-pattern", gameTitle: "Complete the Pattern" },
      quickReplies: ["Let's play Patterns! 🔵", "Try Odd One Out 🔺", "Show all games"]
    };
  }

  if (lower.includes("odd") || lower.includes("different") || lower.includes("spot")) {
    return {
      reply: "Odd One Out is great fun! You spot the item that looks different. Shall we begin?",
      action: { type: "NAVIGATE", path: "/games/odd-one-out", gameTitle: "Odd One Out" },
      quickReplies: ["Start Odd One Out!", "Try Find Object", "Show other games"]
    };
  }

  if (lower.includes("attention") || lower.includes("find") || lower.includes("search") || lower.includes("focus")) {
    return {
      reply: "For gentle focus and attention, I recommend 'Find the Object' or 'Target Search'! Both are unhurried and enjoyable.",
      action: { type: "SUGGEST_GAMES", games: ["find-object", "target-search"] },
      quickReplies: ["Find the Object 🔎", "Target Search 🎯", "Suggest another"]
    };
  }

  if (lower.includes("reaction") || lower.includes("reflex") || lower.includes("fast") || lower.includes("speed")) {
    return {
      reply: "Let's test your reflexes at a relaxing, friendly pace! 'Tap the Target' and 'Quick Response' are gentle and responsive.",
      action: { type: "NAVIGATE", path: "/games/tap-the-target", gameTitle: "Tap the Target" },
      quickReplies: ["Tap the Target ⏱️", "Quick Response ⚡", "I want a thinking game"]
    };
  }

  if (lower.includes("relax") || lower.includes("calm") || lower.includes("easy") || lower.includes("gentle")) {
    return {
      reply: "Take a deep breath and take your time. 'Card Matching' or 'Picture Memory' are very relaxing with no rush at all. Would you like to play Card Matching?",
      action: { type: "NAVIGATE", path: "/games/card-matching", gameTitle: "Card Matching" },
      quickReplies: ["Yes, Card Matching 🃏", "Picture Memory 🖼️", "Complete the Word ✏️"]
    };
  }

  if (lower.includes("challenge") || lower.includes("daily")) {
    return {
      reply: "Today's Daily Challenge combines 3 fun exercises: Card Matching, Number Sequence, and Quick Response! Ready to earn today's stars?",
      action: { type: "TRIGGER_DAILY" },
      quickReplies: ["Start Daily Challenge! 🌟", "Just show all games", "Check My Progress 📊"]
    };
  }

  if (lower.includes("progress") || lower.includes("score") || lower.includes("star") || lower.includes("streak")) {
    return {
      reply: `You're doing fantastic! You have earned ${userProgress.starsEarned} stars with a ${userProgress.streakDays}-day streak! Would you like to view your progress report?`,
      action: { type: "TRIGGER_PROGRESS" },
      quickReplies: ["Open My Progress 📊", "Play a game now", "Back to Home"]
    };
  }

  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey") || lower.includes("good morning") || lower.includes("good evening") || lower.includes("namaste")) {
    return {
      reply: "Hello there! I'm Sheru, your friendly guide dog 🐕. I'm here to help you navigate and find enjoyable games for your mind today. How are you feeling right now?",
      quickReplies: ["Feeling energetic! 💪", "Want something relaxing 🌿", "Exercise my memory 🧠", "Challenge my numbers 🔢"]
    };
  }

  if (lower.includes("how are you") || lower.includes("who are you")) {
    return {
      reply: "I'm Sheru, your loyal companion! My tail is wagging because you're here. Just tell me what kind of exercise you'd like today, or ask me any question!",
      quickReplies: ["Suggest a fun game 🎲", "Take me to all games 🎮", "Show today's challenge 🌟"]
    };
  }

  if (lower.includes("energetic") || lower.includes("ready") || lower.includes("good") || lower.includes("great")) {
    return {
      reply: "That's wonderful energy! Let's channel it into a lively game of 'Remember the Sequence' or 'Target Search'!",
      action: { type: "NAVIGATE", path: "/games/remember-sequence", gameTitle: "Remember the Sequence" },
      quickReplies: ["Remember the Sequence 🔢", "Target Search 🎯", "Show other games"]
    };
  }

  if (lower.includes("tired") || lower.includes("bored") || lower.includes("slow")) {
    return {
      reply: "I understand completely. We'll take things nice and easy. 'Odd One Out' or 'Complete the Word' is light, soothing, and enjoyable.",
      action: { type: "NAVIGATE", path: "/games/odd-one-out", gameTitle: "Odd One Out" },
      quickReplies: ["Odd One Out 🔺", "Complete the Word ✏️", "Card Matching 🃏"]
    };
  }

  if (lower.includes("all games") || lower.includes("list") || lower.includes("menu")) {
    return {
      reply: "Here is our full games library! We have 14 games across Memory, Numbers, Patterns, Attention, Words, Images, and Reflexes.",
      action: { type: "NAVIGATE", path: "/games", gameTitle: "Games Library" },
      quickReplies: ["Go to Games Library 🎮", "Daily Challenge 🌟", "Suggest one for me"]
    };
  }

  // Default friendly guidance
  return {
    reply: "I'm right here with you! Tell me what you'd like to exercise today—memory, numbers, words, patterns, or quick reactions—and I will take you right there!",
    quickReplies: ["Exercise Memory 🧠", "Number Skills 🔢", "Words & Spelling ✏️", "Calm & Relaxing 🌿"]
  };
}

// --- AI Chat Endpoint (Gemini with Fallback Companion) ---
app.post("/api/chat", async (req, res) => {
  const { message = "", history = [] } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message is required" });
  }

  // 1. If Gemini API key is configured, use official Google GenAI SDK
  if (process.env.GEMINI_API_KEY) {
    try {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      const systemInstruction = `
You are "Sheru", a gentle, warm, respectful golden retriever therapy dog and companion for elderly senior citizens on the NeuroSathi cognitive gaming website.
Always talk in warm, cheerful, easy-to-understand language. Keep responses concise (1 to 3 gentle sentences).
The user might ask for recommendations, how to play, express how they feel, or ask to navigate to a game.

Our available games and routes are:
- Card Matching (/games/card-matching) [Memory]
- Remember the Sequence (/games/remember-sequence) [Memory]
- Number Sequence (/games/number-sequence) [Numbers]
- Simple Sudoku (/games/simple-sudoku) [Numbers, 4x4 grid]
- Complete the Pattern (/games/complete-pattern) [Patterns]
- Odd One Out (/games/odd-one-out) [Patterns]
- Find the Object (/games/find-object) [Attention]
- Target Search (/games/target-search) [Attention]
- Word Recall (/games/word-recall) [Words]
- Complete the Word (/games/complete-word) [Words]
- Picture Memory (/games/picture-memory) [Images]
- What Was Missing? (/games/what-was-missing) [Images]
- Tap the Target (/games/tap-the-target) [Reaction]
- Quick Response (/games/quick-response) [Reaction]
- All Games (/games)
- Home (/)

Respond ONLY in valid JSON with this exact structure:
{
  "reply": "Your warm comforting message to the senior citizen",
  "action": { "type": "NAVIGATE", "path": "/games/card-matching", "gameTitle": "Card Matching" } (or null if just conversing),
  "quickReplies": ["Option 1", "Option 2", "Option 3"]
}
`;

      const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || "gemini-3.5-flash",
        contents: [
          ...history.map((h) => ({
            role: h.sender === "user" ? "user" : "model",
            parts: [{ text: h.text }]
          })),
          { role: "user", parts: [{ text: message }] }
        ],
        config: {
          systemInstruction,
          responseMimeType: "application/json"
        }
      });

      const text = response.text?.trim();
      if (text) {
        try {
          const parsed = JSON.parse(text);
          return res.json({
            reply: parsed.reply,
            action: parsed.action || null,
            quickReplies: parsed.quickReplies || ["Take me there!", "Show other games", "Tell me more"],
            source: "gemini"
          });
        } catch (e) {
          console.warn("Failed to parse Gemini JSON output:", e);
        }
      }
    } catch (err) {
      console.warn("Gemini API call failed, falling back to built-in companion:", err.message);
    }
  }

  // 2. Intelligent built-in companion engine (deterministic, instant, high-empathy)
  const result = generateCompanionResponse(message, history);
  return res.json({
    ...result,
    source: "built-in-companion"
  });
});

app.listen(PORT, () => {
  console.log(`🐾 NeuroSathi Backend running on http://localhost:${PORT}`);
});
