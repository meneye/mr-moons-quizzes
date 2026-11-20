import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, CheckCircle, XCircle, Flame, Clock, X, User, Edit3, RotateCcw, Lock } from 'lucide-react';

// ==========================================
// 1. CUSTOM HOOK: useProfile (localStorage)
// ==========================================
const STORAGE_KEY = 'memoquiz_arcade_profile';

export function useProfile() {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Failed to read profile from localStorage:', e);
      return null;
    }
  });

  // Sync state with localStorage and across components/tabs
  const saveProfile = useCallback((updater) => {
    setProfile((prev) => {
      const nextState = typeof updater === 'function' ? updater(prev) : updater;
      try {
        if (nextState === null) {
          localStorage.removeItem(STORAGE_KEY);
        } else {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
        }
      } catch (e) {
        console.error('Failed to save profile to localStorage:', e);
      }
      return nextState;
    });
  }, []);

  const createProfile = useCallback((displayName) => {
    const trimmed = displayName.trim();
    if (!trimmed) return;
    saveProfile({
      displayName: trimmed,
      totalScore: 0,
      streak: 0,
      track: null
    });
  }, [saveProfile]);

  const selectTrack = useCallback((track) => {
    saveProfile((prev) => {
      if (!prev || prev.track) return prev;
      return {
        ...prev,
        track
      };
    });
  }, [saveProfile]);

  const addPoints = useCallback((points) => {
    saveProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        totalScore: Math.max(0, (prev.totalScore || 0) + points)
      };
    });
  }, [saveProfile]);

  const updateStreak = useCallback((newStreak) => {
    saveProfile((prev) => {
      if (!prev) return prev;
      const computedStreak = typeof newStreak === 'function' ? newStreak(prev.streak || 0) : newStreak;
      return {
        ...prev,
        streak: computedStreak
      };
    });
  }, [saveProfile]);

  const updateDisplayName = useCallback((newName) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    saveProfile((prev) => (prev ? { ...prev, displayName: trimmed } : null));
  }, [saveProfile]);

  const resetProfile = useCallback(() => {
    saveProfile(null);
  }, [saveProfile]);

  return {
    profile,
    createProfile,
    selectTrack,
    addPoints,
    updateStreak,
    updateDisplayName,
    resetProfile
  };
}

// ==========================================
// 2. ARCADE WELCOME & PROFILE MODAL UI
// ==========================================
function ArcadeProfileOverlay({ profile, onCreate, onUpdateName, onReset, isOpen, onClose }) {
  const [nameInput, setNameInput] = useState(profile?.displayName || '');
  const inputRef = useRef(null);

  useEffect(() => {
    setNameInput(profile?.displayName || '');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, [profile, isOpen]);

  // Show automatically if no profile exists, or when manually opened to edit
  if (profile && !isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    if (!profile) {
      onCreate(nameInput);
    } else {
      onUpdateName(nameInput);
      if (onClose) onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-purple-950/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white border-4 border-purple-300 rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl relative text-center">
        {profile && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-100 p-2 rounded-full transition-colors"
          >
            <X size={22} />
          </button>
        )}

        {/* Empty Profile Picture Square */}
        <div className="w-20 h-20 bg-purple-50 rounded-2xl mx-auto mb-4 border-2 border-purple-200 shadow-inner" />

        <h2 className="text-3xl md:text-4xl font-extrabold text-purple-900 mb-2 tracking-wide">
          {profile ? 'Player Profile' : 'Welcome to MemoQuiz!'}
        </h2>
        <p className="text-purple-500 text-lg mb-6">
          {profile ? 'Update your arcade display name or reset stats.' : 'Enter your display name to jump right in!'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            ref={inputRef}
            type="text"
            maxLength={18}
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Your Display Name..."
            className="w-full text-center text-2xl font-bold text-purple-900 border-2 border-purple-300 rounded-2xl py-3.5 px-4 focus:outline-none focus:border-purple-500 focus:bg-purple-50 transition-all placeholder:text-purple-300 bg-white shadow-inner"
          />

          <button
            type="submit"
            disabled={!nameInput.trim()}
            className="w-full bg-purple-500 hover:bg-purple-400 disabled:bg-gray-300 text-white font-bold text-2xl py-3.5 rounded-2xl border-b-8 border-purple-700 disabled:border-gray-400 active:border-b-0 active:mt-[8px] transition-all uppercase tracking-wider shadow-md"
          >
            {profile ? 'Save Name' : 'Start Playing'}
          </button>
        </form>

        {profile && (
          <div className="mt-6 pt-5 border-t-2 border-gray-100 flex flex-col gap-3">
            <div className="flex justify-around bg-purple-50 p-3 rounded-2xl border border-purple-100">
              <div>
                <div className="text-xs uppercase text-purple-400 font-bold">All-Time Score</div>
                <div className="text-2xl font-black text-purple-700">{profile.totalScore} pts</div>
              </div>
              <div className="border-r border-purple-200" />
              <div>
                <div className="text-xs uppercase text-purple-400 font-bold">Current Streak</div>
                <div className="text-2xl font-black text-orange-500 flex items-center justify-center gap-1">
                  <Flame size={20} fill="currentColor" /> {profile.streak}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onReset();
                if (onClose) onClose();
              }}
              className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 font-bold py-2.5 rounded-xl transition-colors text-base"
            >
              <RotateCcw size={18} /> Reset Profile & Score
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 3. QUIZ DATA & IMAGE PRELOADER
// ==========================================
const PEG_DATA = [
  { num: 0, word: "Egg", emoji: "🥚" }, 
  { num: 1, word: "Mirror", emoji: "🪞" }, 
  { num: 2, word: "Swan", emoji: "🦢" }, 
  { num: 3, word: "Fork", emoji: "🍴" },
  { num: 4, word: "Car", emoji: "🚗" }, 
  { num: 5, word: "Glove", emoji: "🧤" }, 
  { num: 6, word: "Whistle", emoji: "😙", imageUrl: "/pegs/Whistle.png" }, 
  { num: 7, word: "Rainbow", emoji: "🌈" },
  { num: 8, word: "Snowman", emoji: "⛄" }, 
  { num: 9, word: "Balloon", emoji: "🎈" }, 
  { num: 10, word: "Drum", emoji: "🥁" }, 
  { num: 11, word: "Ski", emoji: "🎿" },
  { num: 12, word: "Sun", emoji: "☀️" }, 
  { num: 13, word: "Teenager", emoji: "👦" }, 
  { num: 14, word: "Heart", emoji: "❤️" }, 
  { num: 15, word: "Tennis", emoji: "🎾" },
  { num: 16, word: "Driver's License / Pawns", emoji: "🪪 ♟️" }, 
  { num: 17, word: "Magazine", emoji: "🤩", imageUrl: "/pegs/Magazine.png" }, 
  { num: 18, word: "Octopus / Driver's License", emoji: "🐙 🪪" }, 
  { num: 19, word: "Golf", emoji: "⛳" },
  { num: 20, word: "Crown / Vision", emoji: "👑 👁️" }, 
  { num: 21, word: "Polling Station", emoji: "🗳️" }, 
  { num: 22, word: "Bingo Ball", emoji: "🎱", imageUrl: "/pegs/Bingo Ball.png" }, 
  { num: 23, word: "Jersey", emoji: "🎽" },
  { num: 24, word: "Clapperboard", emoji: "🎬" }, 
  { num: 25, word: "Present", emoji: "🎁" }, 
  { num: 26, word: "Foot", emoji: "🦶" }, 
  { num: 27, word: "Land", emoji: "🏝️" },
  { num: 28, word: "Saturn", emoji: "🪐" }, 
  { num: 29, word: "Calendar", emoji: "📅" }, 
  { num: 30, word: "Seal", emoji: "🦭" }, 
  { num: 31, word: "Fireworks", emoji: "🎆" },
  { num: 32, word: "Teeth", emoji: "🦷" }, 
  { num: 33, word: "Mickey Mouse", emoji: "🐭", imageUrl: "/pegs/Mickey Mouse.png" }, 
  { num: 34, word: "Pizza", emoji: "🍕" }, 
  { num: 35, word: "Camera", emoji: "📷" },
  { num: 36, word: "Compass", emoji: "🧭" }, 
  { num: 37, word: "Hand", emoji: "✋" }, 
  { num: 38, word: "Thermometer", emoji: "🌡️" }, 
  { num: 39, word: "Tank", emoji: "🪖", imageUrl: "/pegs/Tank.png" },
  { num: 40, word: "Thief", emoji: "🥷" }, 
  { num: 41, word: "Mozart", emoji: "🎹", imageUrl: "/pegs/Mozart.png" }, 
  { num: 42, word: "Oil Barrel", emoji: "🛢️" }, 
  { num: 43, word: "Grinch", emoji: "👹", imageUrl: "/pegs/Grinch.png" },
  { num: 44, word: "Twins", emoji: "👯" }, 
  { num: 45, word: "Dove", emoji: "🕊️" }, 
  { num: 46, word: "Diaper", emoji: "🩲" }, 
  { num: 47, word: "Airplane", emoji: "✈️" },
  { num: 48, word: "Cello / Monkey", emoji: "🎻 🐒" }, 
  { num: 49, word: "Moose", emoji: "🦌" }, 
  { num: 50, word: "Flag", emoji: "🏳️" }, 
  { num: 51, word: "Aliens", emoji: "👽" },
  { num: 52, word: "Cards", emoji: "🂡" }, 
  { num: 53, word: "Joker", emoji: "🃏" }, 
  { num: 54, word: "Rubik's Cube", emoji: "🧊", imageUrl: "/pegs/Rubick's Cube.png" }, 
  { num: 55, word: "Double Nickel", emoji: "🪙" },
  { num: 56, word: "Shopping Mall", emoji: "🛍️" }, 
  { num: 57, word: "Ketchup", emoji: "🍅" }, 
  { num: 58, word: "Lego", emoji: "👷" }, 
  { num: 59, word: "Slide", emoji: "🛝" },
  { num: 60, word: "Watch", emoji: "⌚" }, 
  { num: 61, word: "Barbie Doll", emoji: "👱‍♀️" }, 
  { num: 62, word: "Guitar", emoji: "🎸" }, 
  { num: 63, word: "Color TV", emoji: "📺" },
  { num: 64, word: "Chessboard", emoji: "♟️", imageUrl: "/pegs/Chessboard.png" }, 
  { num: 65, word: "Dinosaur", emoji: "🦖" }, 
  { num: 66, word: "Evil / Dominos", emoji: "😈 🀞" }, 
  { num: 67, word: "ATM", emoji: "🏪" },
  { num: 68, word: "Bee", emoji: "🐝" }, 
  { num: 69, word: "Astronaut / Ying Yang", emoji: "🧑‍🚀 ☯︎" }, 
  { num: 70, word: "Hockey", emoji: "🏒" }, 
  { num: 71, word: "Starbucks", emoji: "☕" },
  { num: 72, word: "Water", emoji: "💧" }, 
  { num: 73, word: "Cell Phone", emoji: "📱" }, 
  { num: 74, word: "Calculator", emoji: "🖩" }, 
  { num: 75, word: "Diamond", emoji: "💎" },
  { num: 76, word: "Mattress", emoji: "🛏️" }, 
  { num: 77, word: "Lottery Ticket", emoji: "🎫" }, 
  { num: 78, word: "Vinyl Record", emoji: "💿" }, 
  { num: 79, word: "Key", emoji: "🔑" },
  { num: 80, word: "Tower Floor", emoji: "🏢" }, 
  { num: 81, word: "Sudoku", emoji: "🔢" }, 
  { num: 82, word: "NBA", emoji: "🏀" }, 
  { num: 83, word: "Wrestler", emoji: "🤼" },
  { num: 84, word: "Apple Mac", emoji: "💻" }, 
  { num: 85, word: "Paper", emoji: "📄" }, 
  { num: 86, word: "Comet", emoji: "☄️" }, 
  { num: 87, word: "Boomerang", emoji: "🪃" },
  { num: 88, word: "Piano", emoji: "🎹" }, 
  { num: 89, word: "Mummy", emoji: "🧟", imageUrl: "/pegs/Mummy.png" }, 
  { num: 90, word: "Soccerball", emoji: "⚽" }, 
  { num: 91, word: "Pokemon", emoji: "⚡", imageUrl: "/pegs/Pokemon.png" },
  { num: 92, word: "Cartoon Network", emoji: "🅲𝐍" }, 
  { num: 93, word: "Volcano", emoji: "🌋" }, 
  { num: 94, word: "Coca Cola", emoji: "🥤" }, 
  { num: 95, word: "Briefcase", emoji: "💼" },
  { num: 96, word: "Smiley Face", emoji: "😊" }, 
  { num: 97, word: "Harry Potter", emoji: "🧙‍♂️", imageUrl: "/pegs/Harry Potter.png" }, 
  { num: 98, word: "Playstation", emoji: "🎮" }, 
  { num: 99, word: "Ice Cream", emoji: "🍦" },
  { num: 100, word: "Trophy", emoji: "🏆" }
];

const PRESIDENTS_DATA = [
  { num: 1, correctName: "George Washington", answers: ["Washington", "George Washington"] },
  { num: 2, correctName: "John Adams", answers: ["Adams", "John Adams"] },
  { num: 3, correctName: "Thomas Jefferson", answers: ["Jefferson", "Thomas Jefferson"] },
  { num: 4, correctName: "James Madison", answers: ["Madison", "James Madison"] },
  { num: 5, correctName: "James Monroe", answers: ["Monroe", "James Monroe"] },
  { num: 6, correctName: "John Quincy Adams", answers: ["Adams", "John Quincy Adams", "John Q Adams", "JQ Adams"] },
  { num: 7, correctName: "Andrew Jackson", answers: ["Jackson", "Andrew Jackson"] },
  { num: 8, correctName: "Martin Van Buren", answers: ["Van Buren", "Martin Van Buren", "Buren"] },
  { num: 9, correctName: "William Henry Harrison", answers: ["Harrison", "William Henry Harrison", "William Harrison"] },
  { num: 10, correctName: "John Tyler", answers: ["Tyler", "John Tyler"] },
  { num: 11, correctName: "James K. Polk", answers: ["Polk", "James K. Polk", "James Polk", "James K Polk"] },
  { num: 12, correctName: "Zachary Taylor", answers: ["Taylor", "Zachary Taylor"] },
  { num: 13, correctName: "Millard Fillmore", answers: ["Fillmore", "Millard Fillmore"] },
  { num: 14, correctName: "Franklin Pierce", answers: ["Pierce", "Franklin Pierce"] },
  { num: 15, correctName: "James Buchanan", answers: ["Buchanan", "James Buchanan"] },
  { num: 16, correctName: "Abraham Lincoln", answers: ["Lincoln", "Abraham Lincoln", "Abe Lincoln"] },
  { num: 17, correctName: "Andrew Johnson", answers: ["Johnson", "Andrew Johnson"] },
  { num: 18, correctName: "Ulysses S. Grant", answers: ["Grant", "Ulysses S. Grant", "Ulysses Grant", "Ulysses S Grant"] },
  { num: 19, correctName: "Rutherford B. Hayes", answers: ["Hayes", "Rutherford B. Hayes", "Rutherford Hayes", "Rutherford B Hayes"] },
  { num: 20, correctName: "James A. Garfield", answers: ["Garfield", "James A. Garfield", "James Garfield", "James A Garfield"] },
  { num: 21, correctName: "Chester A. Arthur", answers: ["Arthur", "Chester A. Arthur", "Chester Arthur", "Chester A Arthur"] },
  { num: 22, validOrders: [22, 24], correctName: "Grover Cleveland", answers: ["Cleveland", "Grover Cleveland"] },
  { num: 23, correctName: "Benjamin Harrison", answers: ["Harrison", "Benjamin Harrison"] },
  { num: 24, validOrders: [22, 24], correctName: "Grover Cleveland", answers: ["Cleveland", "Grover Cleveland"] },
  { num: 25, correctName: "William McKinley", answers: ["McKinley", "William McKinley"] },
  { num: 26, correctName: "Theodore Roosevelt", answers: ["Roosevelt", "Theodore Roosevelt", "Teddy Roosevelt"] },
  { num: 27, correctName: "William Howard Taft", answers: ["Taft", "William Howard Taft", "William Taft"] },
  { num: 28, correctName: "Woodrow Wilson", answers: ["Wilson", "Woodrow Wilson"] },
  { num: 29, correctName: "Warren G. Harding", answers: ["Harding", "Warren G. Harding", "Warren Harding", "Warren G Harding"] },
  { num: 30, correctName: "Calvin Coolidge", answers: ["Coolidge", "Calvin Coolidge"] },
  { num: 31, correctName: "Herbert Hoover", answers: ["Hoover", "Herbert Hoover"] },
  { num: 32, correctName: "Franklin D. Roosevelt", answers: ["Roosevelt", "Franklin D. Roosevelt", "Franklin Roosevelt", "Franklin D Roosevelt", "FDR"] },
  { num: 33, correctName: "Harry S. Truman", answers: ["Truman", "Harry S. Truman", "Harry Truman", "Harry S Truman"] },
  { num: 34, correctName: "Dwight D. Eisenhower", answers: ["Eisenhower", "Dwight D. Eisenhower", "Dwight Eisenhower", "Dwight D Eisenhower"] },
  { num: 35, correctName: "John F. Kennedy", answers: ["Kennedy", "John F. Kennedy", "John Kennedy", "John F Kennedy", "JFK"] },
  { num: 36, correctName: "Lyndon B. Johnson", answers: ["Johnson", "Lyndon B. Johnson", "Lyndon Johnson", "Lyndon B Johnson", "LBJ"] },
  { num: 37, correctName: "Richard Nixon", answers: ["Nixon", "Richard Nixon"] },
  { num: 38, correctName: "Gerald Ford", answers: ["Ford", "Gerald Ford"] },
  { num: 39, correctName: "Jimmy Carter", answers: ["Carter", "Jimmy Carter"] },
  { num: 40, correctName: "Ronald Reagan", answers: ["Reagan", "Ronald Reagan"] },
  { num: 41, correctName: "George H.W. Bush", answers: ["Bush", "George H.W. Bush", "George HW Bush", "George H. W. Bush", "George Bush"] },
  { num: 42, correctName: "Bill Clinton", answers: ["Clinton", "Bill Clinton", "William Clinton"] },
  { num: 43, correctName: "George W. Bush", answers: ["Bush", "George W. Bush", "George W Bush", "George Bush"] },
  { num: 44, correctName: "Barack Obama", answers: ["Obama", "Barack Obama"] },
  { num: 45, validOrders: [45, 47], correctName: "Donald Trump", answers: ["Trump", "Donald Trump"] },
  { num: 46, correctName: "Joe Biden", answers: ["Biden", "Joe Biden", "Joseph Biden"] },
  { num: 47, validOrders: [45, 47], correctName: "Donald Trump", answers: ["Trump", "Donald Trump"] }
].map(p => ({
  ...p,
  validOrders: p.validOrders || [p.num],
  imageUrl: `/presidents/${p.num}.jpg`
}));

const getOrdinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

// ==========================================
// HUMAN CALENDAR DATA
// ==========================================
const HC_CENTURIES_DATA = [
  { label: "2000", displayAnswer: "-2", answers: ["-2"] },
  { label: "1900", displayAnswer: "-1", answers: ["-1"] },
  { label: "1800", displayAnswer: "+1", answers: ["+1", "1"] },
  { label: "1700", displayAnswer: "+3", answers: ["+3", "3"] },
  { label: "1600", displayAnswer: "-2", answers: ["-2"] }
];

// Values for Years 1-100 (HERO=0, BUN=1, SHOE=2, TREE=3, DOOR=4, HIVE=5, CHICKENS=6)
const HC_YEAR_VALUES = [
  1, 2, 3, 5, 6, 0, 1, 3, 4, 5, // 1-10
  6, 1, 2, 3, 4, 6, 0, 1, 2, 4, // 11-20
  5, 6, 0, 2, 3, 4, 5, 0, 1, 2, // 21-30
  3, 5, 6, 0, 1, 3, 4, 5, 6, 1, // 31-40
  2, 3, 4, 6, 0, 1, 2, 4, 5, 6, // 41-50
  0, 2, 3, 4, 5, 0, 1, 2, 3, 5, // 51-60
  6, 0, 1, 3, 4, 5, 6, 1, 2, 3, // 61-70
  4, 6, 0, 1, 2, 4, 5, 6, 0, 2, // 71-80
  3, 4, 5, 0, 1, 2, 3, 5, 6, 0, // 81-90
  1, 3, 4, 5, 6, 1, 2, 3, 4, 0  // 91-100
];

const HC_YEARS_DATA = HC_YEAR_VALUES.map((val, idx) => {
  const num = idx + 1;
  const pegMatch = PEG_DATA.find(p => p.num === num);
  return {
    num,
    answer: val,
    hint: pegMatch ? pegMatch.word : ""
  };
});

const HC_MONTHS_DATA = [
  { name: "January-1", answer: 1 },
  { name: "February-2", answer: 4 },
  { name: "March-3", answer: 4 },
  { name: "April-4", answer: 0 },
  { name: "May-5", answer: 2 },
  { name: "June-6", answer: 5 },
  { name: "July-7", answer: 0 },
  { name: "August-8", answer: 3 },
  { name: "September-9", answer: 6 },
  { name: "October-10", answer: 1 },
  { name: "November-11", answer: 4 },
  { name: "December-12", answer: 6 }
];

const HC_DAYS_DATA = Array.from({ length: 31 }, (_, idx) => {
  const day = idx + 1;
  return {
    day,
    label: `${getOrdinal(day)} day`,
    answer: day % 7
  };
});

// Helper to preload a list of image URLs into browser memory
const preloadImageUrl = (url) => {
  if (!url) return;
  const img = new Image();
  img.decoding = 'async';
  img.src = url;
};

export default function App() {
  // Hook into Arcade Profile
  const { profile, createProfile, selectTrack, addPoints, updateStreak, updateDisplayName, resetProfile } = useProfile();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [route, setRoute] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : null;
      if (parsed?.track === 'speed-math') return 'speed-math-menu';
      if (parsed?.track === 'super-memory') return 'super-memory-menu';
    } catch (e) {}
    return 'home';
  });
  const selectedTrack = profile?.track || 'super-memory';
  const [gameConfig, setGameConfig] = useState({ type: null, mode: null, range: null, total: 0 });
  const [totalScore, setTotalScore] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [currentOptions, setCurrentOptions] = useState([]); 
  const [totalQuestionsCount, setTotalQuestionsCount] = useState(0);
  
  const [inputValue, setInputValue] = useState('');
  const [inputOrder, setInputOrder] = useState(''); 
  
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [mistakes, setMistakes] = useState([]);
  const [correctCount, setCorrectCount] = useState(0); 
  const [wrongTries, setWrongTries] = useState(0);
  
  const [floatingPoint, setFloatingPoint] = useState(null);
  const [scoreBump, setScoreBump] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [totalTime, setTotalTime] = useState(0);
  const [flashState, setFlashState] = useState(null); 
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showHint, setShowHint] = useState(false);

  // Password Lock State for Human Calendar -> Years
  const [isYearsUnlocked, setIsYearsUnlocked] = useState(false);
  const [isYearPasswordModalOpen, setIsYearPasswordModalOpen] = useState(false);
  const [yearPasswordInput, setYearPasswordInput] = useState('');
  const [yearPasswordError, setYearPasswordError] = useState(false);
  
  const inputRef = useRef(null);
  const orderRef = useRef(null);
  const nameRef = useRef(null);
  const yearPassInputRef = useRef(null);

  const [revealStep, setRevealStep] = useState(0);

  // Sync route with profile track binding (resetting profile returns to track selection)
  useEffect(() => {
    if (!profile) {
      setRoute('home');
      setIsYearsUnlocked(false);
      setIsYearPasswordModalOpen(false);
    } else if (profile.track && route === 'home') {
      setRoute(profile.track === 'speed-math' ? 'speed-math-menu' : 'super-memory-menu');
    }
  }, [profile, route]);

  useEffect(() => {
    if (isYearPasswordModalOpen) {
      setTimeout(() => yearPassInputRef.current?.focus(), 50);
    }
  }, [isYearPasswordModalOpen]);

  // ==========================================
  // FAST IMAGE PRELOADER (Eliminates PNG delay)
  // ==========================================
  useEffect(() => {
    const urlsToPreload = [];
    PEG_DATA.forEach(item => {
      if (item.imageUrl) {
        urlsToPreload.push(item.imageUrl);
      }
    });
    PRESIDENTS_DATA.forEach(item => {
      if (item.imageUrl) {
        urlsToPreload.push(item.imageUrl);
      }
    });

    let idx = 0;
    const batchInterval = setInterval(() => {
      for (let i = 0; i < 4 && idx < urlsToPreload.length; i++, idx++) {
        preloadImageUrl(urlsToPreload[idx]);
      }
      if (idx >= urlsToPreload.length) clearInterval(batchInterval);
    }, 60);

    return () => clearInterval(batchInterval);
  }, []);

  useEffect(() => {
    if (availableQuestions.length > 1) {
      availableQuestions.slice(1, 6).forEach((q) => {
        if (q.imageUrl) preloadImageUrl(q.imageUrl);
      });
    }
  }, [availableQuestions]);

  useEffect(() => {
    if (totalScore === 0) {
      setDisplayScore(0);
      return;
    }
    
    let startVal = displayScore;
    const endVal = totalScore;
    if (startVal === endVal) return;

    setScoreBump(true);
    const bumpTimer = setTimeout(() => setScoreBump(false), 300);

    const duration = 350;
    const startTimeAnim = performance.now();

    const animateScore = (now) => {
      const progress = Math.min((now - startTimeAnim) / duration, 1);
      const easeOut = progress * (2 - progress);
      const current = Math.round(startVal + (endVal - startVal) * easeOut);
      setDisplayScore(current);

      if (progress < 1) {
        requestAnimationFrame(animateScore);
      } else {
        setDisplayScore(endVal);
      }
    };

    requestAnimationFrame(animateScore);
    return () => clearTimeout(bumpTimer);
  }, [totalScore]);

  useEffect(() => {
    if (floatingPoint) {
      const timer = setTimeout(() => {
        setFloatingPoint(null);
      }, 550);
      return () => clearTimeout(timer);
    }
  }, [floatingPoint]);

  useEffect(() => {
    if (route === 'peg-test' && timeLeft !== null) {
      if (timeLeft <= 0) {
        setTotalTime(300);
        setRoute('end');
        return;
      }
      const timer = setInterval(() => {
        setTimeLeft(prev => (prev !== null ? prev - 1 : null));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [route, timeLeft]);

  const resetGameState = () => {
    setTotalScore(0);
    setDisplayScore(0);
    setStreak(0);
    setHighestStreak(0);
    setMistakes([]);
    setCorrectCount(0);
    setWrongTries(0);
    setFloatingPoint(null);
    setStartTime(Date.now());
    setQuestionStartTime(Date.now());
    setInputValue('');
    setInputOrder('');
    setRevealStep(0);
    setImgError(false);
    setTimeLeft(null);
    setShowHint(false);
  };

  const initGame = (type, mode, range = null) => {
    resetGameState();
    let total = 0;
    let shuffled = [];

    if (type === 'peg') {
      total = mode === 'practice' ? 25 : PEG_DATA.length;
      shuffled = [...PEG_DATA].sort(() => Math.random() - 0.5).slice(0, total);
      if (mode === 'test') {
        setTimeLeft(300); // 5 minutes (300 seconds)
      }
    } else if (type === 'presidents') {
      total = mode === 'easy' ? 10 : mode === 'medium' ? 20 : 30;
      shuffled = [...PRESIDENTS_DATA].sort(() => Math.random() - 0.5).slice(0, total);
    } else if (type === 'human-calendar') {
      if (mode === 'centuries') {
        shuffled = [...HC_CENTURIES_DATA].sort(() => Math.random() - 0.5);
      } else if (mode === 'years') {
        const [minYear, maxYear] = range || [1, 25];
        shuffled = HC_YEARS_DATA.filter(y => y.num >= minYear && y.num <= maxYear)
                                .sort(() => Math.random() - 0.5);
      } else if (mode === 'months') {
        shuffled = [...HC_MONTHS_DATA].sort(() => Math.random() - 0.5);
      } else if (mode === 'days') {
        shuffled = [...HC_DAYS_DATA].sort(() => Math.random() - 0.5);
      }
      total = shuffled.length;
    }

    shuffled.slice(0, 5).forEach(q => {
      if (q.imageUrl) preloadImageUrl(q.imageUrl);
    });

    setGameConfig({ type, mode, range, total });
    setTotalQuestionsCount(total);
    setAvailableQuestions(shuffled);
    setCurrentQuestion(shuffled[0]);
    setRoute(`${type}-${mode}`);
    
    if (type === 'presidents' && mode === 'easy') {
      generateOptions(shuffled[0]);
    } else {
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
        if (orderRef.current) orderRef.current.focus();
      }, 50);
    }
  };

  const generateOptions = (correctQ) => {
    const others = PRESIDENTS_DATA.filter(p => p.num !== correctQ.num)
                                  .sort(() => Math.random() - 0.5)
                                  .slice(0, 3)
                                  .map(p => p.correctName);
    const options = [...others, correctQ.correctName].sort(() => Math.random() - 0.5);
    setCurrentOptions(options);
  };

  const handleEndEarly = () => {
    setTotalTime(Math.floor((Date.now() - startTime) / 1000));
    setRoute('end');
  };

  const pickNextQuestion = (currentRemaining) => {
    if (currentRemaining.length <= 1) {
      handleEndEarly();
      return;
    }
    const nextList = currentRemaining.slice(1);
    setAvailableQuestions(nextList);
    setCurrentQuestion(nextList[0]);
    setInputValue('');
    setInputOrder('');
    setWrongTries(0);
    setQuestionStartTime(Date.now());
    setImgError(false);
    setShowHint(false);
    
    if (gameConfig.type === 'presidents' && gameConfig.mode === 'easy') {
      generateOptions(nextList[0]);
    } else {
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
        if (orderRef.current) orderRef.current.focus();
      }, 50);
    }
  };

  const calculateQuestionPoints = (timeInSeconds, currentWrongTries) => {
    let basePoints = 40;
    if (timeInSeconds <= 1.8) {
      basePoints = 100;
    } else if (timeInSeconds <= 5) {
      basePoints = 100 - ((timeInSeconds - 1.8) / 3.2) * 20;
    } else if (timeInSeconds <= 15) {
      basePoints = 80 - ((timeInSeconds - 5) * 4);
    } else {
      basePoints = 40;
    }

    const rawScore = basePoints - (currentWrongTries * 20);
    return Math.max(20, Math.round(rawScore));
  };

  const awardCorrectAnswer = (points) => {
    setCorrectCount(c => c + 1);
    const newStreak = streak + 1;
    if (newStreak > highestStreak) setHighestStreak(newStreak);

    setTotalScore(s => s + points);
    setStreak(newStreak);
    
    addPoints(points);
    updateStreak(newStreak);

    setFlashState('correct');
    setFloatingPoint({ id: Date.now(), text: `+${points}`, type: 'positive' });
  };

  const handleWrongAttempt = () => {
    setStreak(0);
    updateStreak(0);
    setWrongTries(w => w + 1);
    setFlashState('wrong');
  };

  const handlePegSubmit = (e) => {
    if (e) e.preventDefault();
    if (!currentQuestion || inputValue.trim() === '' || flashState) return;

    const guess = parseInt(inputValue.trim(), 10);
    const isCorrect = guess === currentQuestion.num;

    if (isCorrect) {
      const timeInSeconds = (Date.now() - questionStartTime) / 1000;
      const points = calculateQuestionPoints(timeInSeconds, wrongTries);
      awardCorrectAnswer(points);

      setTimeout(() => {
        setFlashState(null);
        pickNextQuestion(availableQuestions);
      }, 250);
    } else {
      handleWrongAttempt();
      
      if (!mistakes.find(m => m.correct === currentQuestion.num && m.guessed === guess)) {
        setMistakes(prev => [...prev, { 
          type: 'peg', 
          word: currentQuestion.word, 
          emoji: currentQuestion.emoji, 
          imageUrl: currentQuestion.imageUrl,
          correct: currentQuestion.num, 
          guessed: isNaN(guess) ? 'Blank' : guess 
        }]);
      }

      if (gameConfig.mode === 'test') {
        setTimeout(() => {
          setFlashState(null);
          pickNextQuestion(availableQuestions);
        }, 250);
      } else {
        setTimeout(() => {
          setFlashState(null);
          setInputValue('');
          if (inputRef.current) inputRef.current.focus();
        }, 250);
      }
    }
  };

  const handlePresidentsEasySubmit = (guessName) => {
    if (flashState) return;
    const isCorrect = guessName === currentQuestion.correctName;
    
    if (isCorrect) {
      const timeInSeconds = (Date.now() - questionStartTime) / 1000;
      const points = calculateQuestionPoints(timeInSeconds, wrongTries);
      awardCorrectAnswer(points);
    } else {
      handleWrongAttempt();
      setMistakes(prev => [...prev, { type: 'president', num: currentQuestion.num, correctName: currentQuestion.correctName, guessed: guessName }]);
    }
    setTimeout(() => {
      setFlashState(null);
      pickNextQuestion(availableQuestions);
    }, 300);
  };

  const handlePresidentsMediumSubmit = (e) => {
    if (e) e.preventDefault();
    if (!currentQuestion || inputValue.trim() === '' || flashState) return;

    const guess = inputValue.trim().toLowerCase();
    const isCorrect = currentQuestion.answers.some(ans => ans.toLowerCase() === guess);

    if (isCorrect) {
      const timeInSeconds = (Date.now() - questionStartTime) / 1000;
      const points = calculateQuestionPoints(timeInSeconds, wrongTries);
      awardCorrectAnswer(points);
    } else {
      handleWrongAttempt();
      setMistakes(prev => [...prev, {
        type: 'president',
        num: currentQuestion.num,
        correctName: currentQuestion.correctName,
        guessed: inputValue.trim()
      }]);
    }
    setTimeout(() => {
      setFlashState(null);
      pickNextQuestion(availableQuestions);
    }, 300);
  };

  const handlePresidentsHardSubmit = (e) => {
    if (e) e.preventDefault();
    if (!currentQuestion || inputValue.trim() === '' || inputOrder.trim() === '' || flashState) return;

    const guessName = inputValue.trim().toLowerCase();
    const guessOrder = parseInt(inputOrder.trim(), 10);

    const isNameCorrect = currentQuestion.answers.some(ans => ans.toLowerCase() === guessName);
    const validOrders = currentQuestion.validOrders || [currentQuestion.num];
    const isOrderCorrect = validOrders.includes(guessOrder);
    const isCorrect = isNameCorrect && isOrderCorrect;

    if (isCorrect) {
      const timeInSeconds = (Date.now() - questionStartTime) / 1000;
      const points = calculateQuestionPoints(timeInSeconds, wrongTries);
      awardCorrectAnswer(points);
    } else {
      handleWrongAttempt();
      setMistakes(prev => [...prev, {
        type: 'president',
        num: currentQuestion.num,
        correctName: currentQuestion.correctName,
        guessed: `${isNaN(guessOrder) ? '?' : guessOrder} - ${inputValue.trim() || '?'}`
      }]);
    }
    setTimeout(() => {
      setFlashState(null);
      pickNextQuestion(availableQuestions);
    }, 300);
  };

  const handleHumanCalendarSubmit = (e) => {
    if (e) e.preventDefault();
    if (!currentQuestion || inputValue.trim() === '' || flashState) return;

    const rawInput = inputValue.trim();
    let isCorrect = false;
    let promptLabel = '';
    let correctDisplay = '';

    if (gameConfig.mode === 'centuries') {
      isCorrect = currentQuestion.answers.includes(rawInput);
      promptLabel = `Value/Code of ${currentQuestion.label}`;
      correctDisplay = currentQuestion.displayAnswer;
    } else if (gameConfig.mode === 'years') {
      const guessNum = parseInt(rawInput, 10);
      isCorrect = !isNaN(guessNum) && guessNum === currentQuestion.answer;
      promptLabel = `Value/Code of ${currentQuestion.num}`;
      correctDisplay = String(currentQuestion.answer);
    } else if (gameConfig.mode === 'months') {
      const guessNum = parseInt(rawInput, 10);
      isCorrect = !isNaN(guessNum) && guessNum === currentQuestion.answer;
      promptLabel = `Value/Code of ${currentQuestion.name}`;
      correctDisplay = String(currentQuestion.answer);
    } else if (gameConfig.mode === 'days') {
      const guessNum = parseInt(rawInput, 10);
      isCorrect = !isNaN(guessNum) && guessNum === currentQuestion.answer;
      promptLabel = `Value/Code of ${currentQuestion.label}`;
      correctDisplay = String(currentQuestion.answer);
    }

    if (isCorrect) {
      setCorrectCount(c => c + 1);
      setShowHint(false);
      setFlashState('correct');

      setTimeout(() => {
        setFlashState(null);
        pickNextQuestion(availableQuestions);
      }, 250);
    } else {
      setFlashState('wrong');
      if (gameConfig.mode === 'years') {
        setShowHint(true);
      }

      if (!mistakes.find(m => m.type === 'human-calendar' && m.label === promptLabel && m.guessed === rawInput)) {
        setMistakes(prev => [...prev, {
          type: 'human-calendar',
          label: promptLabel,
          correct: correctDisplay,
          guessed: rawInput
        }]);
      }

      setTimeout(() => {
        setFlashState(null);
        setInputValue('');
        if (inputRef.current) inputRef.current.focus();
      }, 250);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  useEffect(() => {
    if (route === 'end') {
      let step = 0;
      const interval = setInterval(() => {
        step++;
        setRevealStep(step);
        if (step >= 5) clearInterval(interval);
      }, 750);
      return () => clearInterval(interval);
    }
  }, [route]);

  const renderMenuHeader = () => (
    <div className="fixed top-4 right-4 z-30">
      {profile && (
        <button
          onClick={() => setIsProfileModalOpen(true)}
          className="bg-white hover:bg-purple-50 border-2 border-purple-200 px-4 py-2 rounded-2xl shadow-sm flex items-center gap-3 transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-500 text-white flex items-center justify-center font-bold text-lg">
            {profile.displayName.charAt(0).toUpperCase()}
          </div>
          <div className="text-left">
            <div className="text-sm font-bold text-purple-900 leading-none flex items-center gap-1">
              {profile.displayName} <Edit3 size={12} className="text-purple-400" />
            </div>
            <div className="text-xs font-bold text-purple-500">
              {profile.totalScore} pts
            </div>
          </div>
        </button>
      )}
    </div>
  );

  if (route === 'home') {
    return (
      <div className="min-h-screen bg-purple-50 flex flex-col items-center justify-center p-6 font-sans relative">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap');
          * { font-family: 'Bubblegum Sans', cursive !important; }
        `}</style>
        
        <ArcadeProfileOverlay
          profile={profile}
          onCreate={createProfile}
          onUpdateName={updateDisplayName}
          onReset={resetProfile}
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
        {renderMenuHeader()}

        <div className="max-w-xl w-full text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-purple-800 mb-4 tracking-tight drop-shadow-sm">
            MemoQuiz
          </h1>
          <p className="text-purple-500 text-lg md:text-xl font-bold mb-10">
            Choose your track to begin
          </p>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                selectTrack('speed-math');
                setRoute('speed-math-menu');
              }}
              className="w-full bg-purple-200 hover:bg-purple-100 text-purple-800 font-bold text-2xl md:text-3xl py-8 px-3 rounded-2xl border-b-8 border-purple-400 active:border-b-0 active:mt-[8px] transition-all uppercase tracking-wider flex items-center justify-center"
            >
              Speed Math
            </button>
            <button
              onClick={() => {
                selectTrack('super-memory');
                setRoute('super-memory-menu');
              }}
              className="w-full bg-purple-500 hover:bg-purple-400 text-white font-bold text-2xl md:text-3xl py-8 px-3 rounded-2xl border-b-8 border-purple-700 active:border-b-0 active:mt-[8px] transition-all uppercase tracking-wider flex items-center justify-center"
            >
              Super Memory
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (route === 'speed-math-menu') {
    return (
      <div className="min-h-screen bg-purple-50 flex flex-col items-center justify-center p-6 font-sans relative">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap');
          * { font-family: 'Bubblegum Sans', cursive !important; }
        `}</style>

        <ArcadeProfileOverlay
          profile={profile}
          onCreate={createProfile}
          onUpdateName={updateDisplayName}
          onReset={resetProfile}
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
        {renderMenuHeader()}

        <div className="max-w-md w-full">
          <h2 className="text-5xl font-extrabold text-purple-800 mb-8 text-center">Speed Math</h2>
          <div className="flex flex-col gap-4">
            <button onClick={() => setRoute('peg-menu')} className="w-full bg-purple-200 hover:bg-purple-100 text-purple-800 font-bold text-2xl md:text-3xl py-4 rounded-2xl border-b-8 border-purple-400 active:border-b-0 active:mt-[8px] transition-all uppercase tracking-wider">
              PEG
            </button>
            <button onClick={() => setRoute('human-calendar-menu')} className="w-full bg-purple-500 hover:bg-purple-400 text-white font-bold text-2xl md:text-3xl py-4 rounded-2xl border-b-8 border-purple-700 active:border-b-0 active:mt-[8px] transition-all uppercase tracking-wider">
              Human Calendar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (route === 'super-memory-menu') {
    return (
      <div className="min-h-screen bg-purple-50 flex flex-col items-center justify-center p-6 font-sans relative">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap');
          * { font-family: 'Bubblegum Sans', cursive !important; }
        `}</style>

        <ArcadeProfileOverlay
          profile={profile}
          onCreate={createProfile}
          onUpdateName={updateDisplayName}
          onReset={resetProfile}
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
        {renderMenuHeader()}

        <div className="max-w-md w-full">
          <h2 className="text-5xl font-extrabold text-purple-800 mb-8 text-center">Super Memory</h2>
          <div className="flex flex-col gap-4">
            <button onClick={() => setRoute('peg-menu')} className="w-full bg-purple-200 hover:bg-purple-100 text-purple-800 font-bold text-2xl md:text-3xl py-4 rounded-2xl border-b-8 border-purple-400 active:border-b-0 active:mt-[8px] transition-all uppercase tracking-wider">
              PEG
            </button>
            <button onClick={() => setRoute('presidents-menu')} className="w-full bg-purple-500 hover:bg-purple-400 text-white font-bold text-2xl md:text-3xl py-4 rounded-2xl border-b-8 border-purple-700 active:border-b-0 active:mt-[8px] transition-all uppercase tracking-wider">
              Presidents
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (route === 'human-calendar-menu') {
    const handleYearPasswordSubmit = (e) => {
      e.preventDefault();
      if (yearPasswordInput.trim() === '7777') {
        setIsYearsUnlocked(true);
        setIsYearPasswordModalOpen(false);
        setYearPasswordInput('');
        setYearPasswordError(false);
        setRoute('hc-years-menu');
      } else {
        setYearPasswordError(true);
        setYearPasswordInput('');
        yearPassInputRef.current?.focus();
      }
    };

    return (
      <div className="min-h-screen bg-purple-50 flex flex-col items-center justify-center p-6 font-sans relative">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap');
          * { font-family: 'Bubblegum Sans', cursive !important; }
        `}</style>

        <ArcadeProfileOverlay
          profile={profile}
          onCreate={createProfile}
          onUpdateName={updateDisplayName}
          onReset={resetProfile}
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
        {renderMenuHeader()}

        {isYearPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-purple-950/75 backdrop-blur-sm p-4">
            <div className="bg-white border-4 border-purple-300 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative text-center">
              <button
                onClick={() => {
                  setIsYearPasswordModalOpen(false);
                  setYearPasswordInput('');
                  setYearPasswordError(false);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-100 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center border-2 border-purple-200">
                <Lock size={32} />
              </div>

              <h3 className="text-3xl font-extrabold text-purple-900 mb-1">Years Locked</h3>
              <p className="text-purple-500 text-base mb-5">Enter password to unlock</p>

              <form onSubmit={handleYearPasswordSubmit} className="flex flex-col gap-3">
                <input
                  ref={yearPassInputRef}
                  type="password"
                  inputMode="numeric"
                  value={yearPasswordInput}
                  onChange={(e) => {
                    setYearPasswordInput(e.target.value);
                    if (yearPasswordError) setYearPasswordError(false);
                  }}
                  placeholder="Password..."
                  className={`w-full text-center text-2xl font-bold text-purple-900 border-2 rounded-2xl py-3 px-4 focus:outline-none transition-all bg-white ${
                    yearPasswordError
                      ? 'border-red-400 bg-red-50 placeholder:text-red-300'
                      : 'border-purple-300 focus:border-purple-500 focus:bg-purple-50 placeholder:text-purple-300'
                  }`}
                />
                {yearPasswordError && (
                  <p className="text-red-500 text-sm font-bold">Incorrect password. Try again!</p>
                )}
                <button
                  type="submit"
                  disabled={!yearPasswordInput.trim()}
                  className="w-full bg-purple-500 hover:bg-purple-400 disabled:bg-gray-300 text-white font-bold text-xl py-3 rounded-2xl border-b-8 border-purple-700 disabled:border-gray-400 active:border-b-0 active:mt-[8px] transition-all uppercase tracking-wider"
                >
                  Unlock
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="max-w-md w-full">
          <button onClick={() => setRoute('speed-math-menu')} className="mb-4 flex items-center text-purple-500 font-bold hover:text-purple-700 text-xl">
            <ChevronLeft size={24} /> Back
          </button>
          <h2 className="text-5xl font-extrabold text-purple-800 mb-8 text-center">Human Calendar</h2>
          <div className="flex flex-col gap-4">
            <button onClick={() => initGame('human-calendar', 'centuries')} className="w-full bg-purple-200 hover:bg-purple-100 text-purple-800 font-bold text-2xl md:text-3xl py-4 rounded-2xl border-b-8 border-purple-400 active:border-b-0 active:mt-[8px] transition-all tracking-wide">
              Centuries
            </button>
            <button
              onClick={() => {
                if (isYearsUnlocked) {
                  setRoute('hc-years-menu');
                } else {
                  setYearPasswordInput('');
                  setYearPasswordError(false);
                  setIsYearPasswordModalOpen(true);
                }
              }}
              className="w-full bg-purple-400 hover:bg-purple-300 text-white font-bold text-2xl md:text-3xl py-4 rounded-2xl border-b-8 border-purple-600 active:border-b-0 active:mt-[8px] transition-all tracking-wide flex items-center justify-center gap-3"
            >
              {!isYearsUnlocked && <Lock size={24} />}
              <span>Years</span>
            </button>
            <button onClick={() => initGame('human-calendar', 'months')} className="w-full bg-purple-500 hover:bg-purple-400 text-white font-bold text-2xl md:text-3xl py-4 rounded-2xl border-b-8 border-purple-700 active:border-b-0 active:mt-[8px] transition-all tracking-wide">
              Months
            </button>
            <button onClick={() => initGame('human-calendar', 'days')} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-2xl md:text-3xl py-4 rounded-2xl border-b-8 border-purple-800 active:border-b-0 active:mt-[8px] transition-all tracking-wide">
              Days
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (route === 'hc-years-menu') {
    return (
      <div className="min-h-screen bg-purple-50 flex flex-col items-center justify-center p-6 font-sans relative">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap');
          * { font-family: 'Bubblegum Sans', cursive !important; }
        `}</style>

        <ArcadeProfileOverlay
          profile={profile}
          onCreate={createProfile}
          onUpdateName={updateDisplayName}
          onReset={resetProfile}
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
        {renderMenuHeader()}

        <div className="max-w-md w-full">
          <button onClick={() => setRoute('human-calendar-menu')} className="mb-4 flex items-center text-purple-500 font-bold hover:text-purple-700 text-xl">
            <ChevronLeft size={24} /> Back
          </button>
          <h2 className="text-5xl font-extrabold text-purple-800 mb-8 text-center">Years</h2>
          <div className="flex flex-col gap-4">
            <button onClick={() => initGame('human-calendar', 'years', [1, 25])} className="w-full bg-purple-200 hover:bg-purple-100 text-purple-800 font-bold text-2xl md:text-3xl py-4 rounded-2xl border-b-8 border-purple-400 active:border-b-0 active:mt-[8px] transition-all tracking-wide">
              1 - 25
            </button>
            <button onClick={() => initGame('human-calendar', 'years', [26, 50])} className="w-full bg-purple-400 hover:bg-purple-300 text-white font-bold text-2xl md:text-3xl py-4 rounded-2xl border-b-8 border-purple-600 active:border-b-0 active:mt-[8px] transition-all tracking-wide">
              26 - 50
            </button>
            <button onClick={() => initGame('human-calendar', 'years', [51, 75])} className="w-full bg-purple-500 hover:bg-purple-400 text-white font-bold text-2xl md:text-3xl py-4 rounded-2xl border-b-8 border-purple-700 active:border-b-0 active:mt-[8px] transition-all tracking-wide">
              51 - 75
            </button>
            <button onClick={() => initGame('human-calendar', 'years', [76, 100])} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-2xl md:text-3xl py-4 rounded-2xl border-b-8 border-purple-800 active:border-b-0 active:mt-[8px] transition-all tracking-wide">
              76 - 100
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (route === 'peg-menu') {
    return (
      <div className="min-h-screen bg-purple-50 flex flex-col items-center justify-center p-6 font-sans relative">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap');
          * { font-family: 'Bubblegum Sans', cursive !important; }
        `}</style>

        <ArcadeProfileOverlay
          profile={profile}
          onCreate={createProfile}
          onUpdateName={updateDisplayName}
          onReset={resetProfile}
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
        {renderMenuHeader()}

        <div className="max-w-md w-full">
          <button
            onClick={() => setRoute(selectedTrack === 'speed-math' ? 'speed-math-menu' : 'super-memory-menu')}
            className="mb-4 flex items-center text-purple-500 font-bold hover:text-purple-700 text-xl"
          >
            <ChevronLeft size={24} /> Back
          </button>
          <h2 className="text-4xl font-extrabold text-purple-800 mb-8 text-center">PEG Practice</h2>
          <div className="flex flex-col gap-4">
            <button onClick={() => initGame('peg', 'practice')} className="w-full bg-purple-200 hover:bg-purple-100 text-purple-800 font-bold text-2xl md:text-3xl py-4 rounded-2xl border-b-8 border-purple-400 active:border-b-0 active:mt-[8px] transition-all tracking-wide">
              Practice
            </button>
            <button onClick={() => initGame('peg', 'test')} className="w-full bg-purple-500 hover:bg-purple-400 text-white font-bold text-2xl md:text-3xl py-4 rounded-2xl border-b-8 border-purple-700 active:border-b-0 active:mt-[8px] transition-all tracking-wide">
              Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (route === 'presidents-menu') {
    return (
      <div className="min-h-screen bg-purple-50 flex flex-col items-center justify-center p-6 font-sans relative">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap');
          * { font-family: 'Bubblegum Sans', cursive !important; }
        `}</style>

        <ArcadeProfileOverlay
          profile={profile}
          onCreate={createProfile}
          onUpdateName={updateDisplayName}
          onReset={resetProfile}
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
        {renderMenuHeader()}

        <div className="max-w-md w-full">
          <button onClick={() => setRoute('super-memory-menu')} className="mb-4 flex items-center text-purple-500 font-bold hover:text-purple-700 text-xl">
            <ChevronLeft size={24} /> Back
          </button>
          <h2 className="text-4xl font-extrabold text-purple-800 mb-8 text-center">Presidents</h2>
          <div className="flex flex-col gap-4">
            <button onClick={() => initGame('presidents', 'easy')} className="w-full bg-purple-200 hover:bg-purple-100 text-purple-800 font-bold text-2xl md:text-3xl py-4 rounded-2xl border-b-8 border-purple-400 active:border-b-0 active:mt-[8px] transition-all tracking-wide">
              Easy
            </button>
            <button onClick={() => initGame('presidents', 'medium')} className="w-full bg-purple-400 hover:bg-purple-300 text-white font-bold text-2xl md:text-3xl py-4 rounded-2xl border-b-8 border-purple-600 active:border-b-0 active:mt-[8px] transition-all tracking-wide">
              Medium
            </button>
            <button onClick={() => initGame('presidents', 'hard')} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-2xl md:text-3xl py-4 rounded-2xl border-b-8 border-purple-800 active:border-b-0 active:mt-[8px] transition-all tracking-wide">
              Hard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (route === 'end') {
    const highMistakesMessages = [
      "It’s okay to make mistakes!",
      "You can ask for help!",
      "Keep going, you’re on the right track.",
      "Every mistake is just proof that you're trying.",
      "Mistakes are stepping stones to learning!",
      "Take a deep breath, you've got this."
    ];
    
    const lowMistakesMessages = [
      "Your hard work is paying off.",
      "I can see your practice is paying off.",
      "Look how your hard work has paid off.",
      "You are doing better than you realize.",
      "You are making progress.",
      "Absolute rockstar performance!"
    ];

    const messageList = mistakes.length > 4 ? highMistakesMessages : lowMistakesMessages;
    const encouragementIndex = (totalTime + correctCount + mistakes.length) % messageList.length;
    const randomEncouragement = messageList[encouragementIndex];

    return (
      <div className="min-h-[100dvh] bg-gray-100 flex flex-col items-center py-6 px-4 font-sans overflow-y-auto w-full relative transition-colors duration-500">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap');
          * { font-family: 'Bubblegum Sans', cursive !important; }
          @keyframes slideFromRight { 
            0% { opacity: 0; transform: translateX(100px); } 
            100% { opacity: 1; transform: translateX(0); } 
          }
          .animate-slide-right { animation: slideFromRight 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        `}</style>
        
        {revealStep >= 5 && (
          <button
            onClick={() => {
              if (gameConfig.type === 'human-calendar') {
                setRoute(gameConfig.mode === 'years' ? 'hc-years-menu' : 'human-calendar-menu');
              } else {
                setRoute(`${gameConfig.type}-menu`);
              }
            }}
            className="absolute top-6 left-6 text-gray-400 hover:text-gray-800 transition-colors bg-white p-2 rounded-full shadow-sm border border-gray-200 z-20"
          >
            <X size={32} />
          </button>
        )}

        <div className="w-full max-w-2xl flex flex-col items-center gap-6 mt-6 relative">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-2 drop-shadow-sm tracking-wide">
            Breakdown
          </h2>

          {revealStep >= 4 && (
            <div className="fixed bottom-6 right-6 z-50 animate-slide-right max-w-sm">
              <div className="bg-purple-600 border-4 border-purple-400 p-4 rounded-3xl text-white shadow-2xl relative overflow-hidden flex items-center gap-4">
                <div className="text-3xl">💡</div>
                <h3 className="text-xl md:text-2xl font-black tracking-wide drop-shadow-sm leading-tight">
                  {randomEncouragement}
                </h3>
              </div>
            </div>
          )}
          
          <div className="w-full flex flex-col gap-4 px-4">
            <div className={`transition-all duration-500 transform ${revealStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="bg-white p-4 rounded-2xl border-l-8 border-gray-300 flex justify-between items-center shadow-md">
                <div className="text-lg font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Clock size={22} /> Time Taken
                </div>
                <div className="text-3xl font-black text-gray-800">{formatTime(totalTime)}</div>
              </div>
            </div>

            <div className={`transition-all duration-500 transform ${revealStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="bg-green-50 p-4 rounded-2xl border-l-8 border-green-500 flex justify-between items-center shadow-md">
                <div className="text-lg font-bold text-green-700 uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle size={22} /> Correct
                </div>
                <div className="text-3xl font-black text-green-600">{correctCount}</div>
              </div>
            </div>

            <div className={`transition-all duration-500 transform ${revealStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="bg-red-50 p-4 rounded-2xl border-l-8 border-red-500 flex justify-between items-center shadow-md">
                <div className="text-lg font-bold text-red-700 uppercase tracking-widest flex items-center gap-2">
                  <XCircle size={22} /> Mistakes
                </div>
                <div className="text-3xl font-black text-red-600">{mistakes.length}</div>
              </div>
            </div>

            {gameConfig.type !== 'human-calendar' && (
              <div className={`transition-all duration-700 transform ${revealStep >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'} mt-4`}>
                <div className="bg-yellow-100 p-6 rounded-3xl border-4 border-yellow-400 flex flex-col items-center justify-center shadow-lg">
                  <div className="text-lg font-bold text-yellow-600 uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
                    <Flame size={22} /> Round Points
                  </div>
                  <div className="text-6xl md:text-7xl font-black text-yellow-500 drop-shadow-sm flex items-baseline gap-2">
                    {totalScore} <span className="text-2xl md:text-3xl text-yellow-600 opacity-80">pts</span>
                  </div>
                  {profile && (
                    <div className="mt-2 text-sm font-bold text-yellow-700 bg-yellow-200/70 px-3 py-1 rounded-full">
                      {profile.displayName}'s Total Career Score: {profile.totalScore} pts
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className={`w-full transition-all duration-500 transform ${revealStep >= 5 ? 'opacity-100' : 'opacity-0 pointer-events-none'} mt-4 px-4 pb-12`}>
            <button 
              onClick={() => initGame(gameConfig.type, gameConfig.mode, gameConfig.range)}
              className="w-full bg-white text-gray-900 hover:bg-gray-50 font-black text-2xl py-4 rounded-2xl border-2 border-b-8 border-gray-300 active:border-b-2 active:mt-[6px] transition-all uppercase tracking-wider shadow-md mb-8"
            >
              Try Again
            </button>

            {mistakes.length > 0 && (
              <div className="w-full text-left bg-white p-5 rounded-3xl border border-gray-200 shadow-md">
                <h3 className="text-lg font-extrabold text-gray-700 mb-3 uppercase tracking-wider border-b border-gray-200 pb-2">
                  Review Mistakes
                </h3>
                <div className="flex flex-col gap-3">
                  {mistakes.map((m, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded-xl flex items-center justify-between border border-gray-100">
                      {m.type === 'peg' ? (
                        <>
                          <div className="flex items-center gap-3">
                            {m.imageUrl ? (
                              <img 
                                src={m.imageUrl} 
                                alt={m.word} 
                                className="w-10 h-10 object-contain rounded-lg"
                                onError={(e) => {
                                  if (e.target.src.endsWith('.png')) {
                                    e.target.src = e.target.src.replace(/\.png$/, '.jpg');
                                  } else {
                                    e.target.style.display = 'none';
                                  }
                                }}
                              />
                            ) : (
                              <span className="text-2xl">{m.emoji}</span>
                            )}
                            <span className="text-base font-bold text-gray-800">{m.word}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-red-500 font-bold line-through">You: {m.guessed}</div>
                            <div className="text-base text-green-600 font-black">Correct: {m.correct}</div>
                          </div>
                        </>
                      ) : m.type === 'human-calendar' ? (
                        <>
                          <div className="flex items-center gap-3">
                            <span className="text-base font-bold text-gray-800">{m.label}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-red-500 font-bold line-through">You: {m.guessed || "Blank"}</div>
                            <div className="text-base text-green-600 font-black">Correct: {m.correct}</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <span className="text-base font-bold text-gray-800">{getOrdinal(m.num)}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-red-500 font-bold line-through truncate max-w-[150px]">You: {m.guessed || "Blank"}</div>
                            <div className="text-base text-green-600 font-black">{m.correctName}</div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-[100dvh] flex flex-col font-sans overflow-hidden transition-colors duration-200 ${
      flashState === 'correct' ? 'bg-green-400' : 
      flashState === 'wrong' ? 'bg-red-400' : 'bg-white'
    }`}>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap');
        * { font-family: 'Bubblegum Sans', cursive !important; }
        @keyframes pointPopMerge {
          0% { opacity: 0; transform: translateY(14px) scale(0.5); }
          35% { opacity: 1; transform: translateY(-6px) scale(1.25); }
          75% { opacity: 1; transform: translateY(-10px) scale(1.1); }
          100% { opacity: 0; transform: translateY(-22px) translateX(-12px) scale(0.6); }
        }
        .animate-point-pop { animation: pointPopMerge 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        @keyframes fireGlow {
          0%, 100% { filter: drop-shadow(0 0 6px rgba(249, 115, 22, 0.85)) drop-shadow(0 -3px 10px rgba(239, 68, 68, 0.65)); }
          50% { filter: drop-shadow(0 0 12px rgba(239, 68, 68, 0.95)) drop-shadow(0 -6px 16px rgba(250, 204, 21, 0.9)); }
        }
        .on-fire-points {
          animation: fireGlow 1s infinite ease-in-out;
        }
        @keyframes blueFireGlow {
          0%, 100% { filter: drop-shadow(0 0 6px rgba(59, 130, 246, 0.85)) drop-shadow(0 -3px 10px rgba(37, 99, 235, 0.65)); }
          50% { filter: drop-shadow(0 0 14px rgba(37, 99, 235, 0.95)) drop-shadow(0 -6px 18px rgba(56, 189, 248, 0.95)); }
        }
        .on-blue-fire-points {
          animation: blueFireGlow 0.8s infinite ease-in-out;
        }
        @keyframes hintPopIn {
          0% { opacity: 0; transform: translateY(10px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-hint-pop {
          animation: hintPopIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>

      {/* ACTIVE GAME HEADER */}
      <div className="py-3 px-4 flex items-center justify-between z-10 max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="bg-gray-100 px-3 py-1.5 rounded-xl text-gray-500 font-bold text-sm md:text-base border-2 border-gray-200">
            {totalQuestionsCount - availableQuestions.length + 1} <span className="opacity-50">/ {totalQuestionsCount}</span>
          </div>
          
          {gameConfig.type !== 'human-calendar' && (
            <div className="relative flex items-center ml-1">
              <div 
                style={{ 
                  transform: `scale(${
                    streak >= 15 
                      ? (scoreBump ? 1.65 : 1.5) 
                      : streak >= 5 
                        ? (scoreBump ? 1.45 : 1.3) 
                        : (scoreBump ? 1.25 : 1)
                  })` 
                }}
                className={`font-black text-2xl md:text-3xl min-w-[3.5rem] flex items-baseline gap-1 transition-all duration-300 origin-left ${
                  streak >= 15 
                    ? 'text-blue-500 on-blue-fire-points'
                    : streak >= 5 
                      ? 'text-orange-500 on-fire-points' 
                      : scoreBump 
                        ? 'text-green-600' 
                        : 'text-purple-600'
                }`}
              >
                {streak >= 5 && (
                  <Flame 
                    className={`w-6 h-6 animate-bounce self-center -mr-0.5 ${streak >= 15 ? 'text-blue-500' : 'text-orange-500'}`} 
                    fill="currentColor" 
                  />
                )}
                <span>{displayScore}</span>
                <span className={`text-sm md:text-base font-bold ${
                  streak >= 15 
                    ? 'text-cyan-500' 
                    : streak >= 5 
                      ? 'text-red-500' 
                      : 'text-purple-400'
                }`}>pts</span>
              </div>
              
              {floatingPoint && (
                <div 
                  key={floatingPoint.id} 
                  className="absolute left-full ml-6 bg-green-500 text-white px-2.5 py-0.5 rounded-full text-lg md:text-xl font-black animate-point-pop pointer-events-none whitespace-nowrap shadow-md border-2 border-white flex items-baseline gap-0.5 z-30"
                >
                  {floatingPoint.text} <span className="text-xs font-bold opacity-90">pts</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {profile && (
            <div className="hidden sm:flex items-center gap-1.5 bg-purple-50 border-2 border-purple-200 px-3 py-1 rounded-xl text-purple-800 text-sm font-bold">
              <User size={15} className="text-purple-500" />
              <span className="truncate max-w-[90px]">{profile.displayName}</span>
            </div>
          )}

          {gameConfig.type === 'peg' && gameConfig.mode === 'test' && timeLeft !== null && (
            <div className={`flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-xl border-2 text-sm md:text-base transition-colors ${
              timeLeft <= 30 
                ? 'bg-red-100 text-red-600 border-red-300 animate-pulse' 
                : 'bg-purple-50 text-purple-700 border-purple-200'
            }`}>
              <Clock size={18} />
              <span>{formatTime(timeLeft)}</span>
            </div>
          )}
          <button 
            onClick={handleEndEarly}
            className="bg-red-100 text-red-500 hover:bg-red-500 hover:text-white font-bold py-1.5 px-3 rounded-xl transition-colors border-2 border-red-200 hover:border-red-600 text-sm"
          >
            END
          </button>
        </div>
      </div>

      {/* MAIN PLAY AREA */}
      <div className="flex-1 flex flex-col items-center justify-between p-4 w-full max-w-xl mx-auto pb-6">
        {currentQuestion && (
          <div className="w-full flex flex-col items-center justify-between h-full">
            
            <div className="flex flex-col items-center justify-center flex-1 w-full my-auto">
              
              {gameConfig.type === 'peg' && (
                <>
                  {currentQuestion.imageUrl && !imgError ? (
                    <div className="mb-3 flex items-center justify-center">
                      <img 
                        key={currentQuestion.imageUrl}
                        src={currentQuestion.imageUrl} 
                        alt={currentQuestion.word} 
                        loading="eager"
                        decoding="sync"
                        fetchPriority="high"
                        onError={(e) => {
                          if (e.target.src.endsWith('.png')) {
                            e.target.src = e.target.src.replace(/\.png$/, '.jpg');
                          } else {
                            setImgError(true);
                          }
                        }}
                        className="w-[115px] h-[115px] md:w-[150px] md:h-[150px] object-contain rounded-2xl drop-shadow-md transform transition-transform hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="text-[115px] md:text-[150px] leading-none mb-3 drop-shadow-md select-none transform transition-transform hover:scale-105 text-center">
                      {currentQuestion.emoji}
                    </div>
                  )}
                  <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 capitalize text-center">
                    {currentQuestion.word}
                  </h2>
                </>
              )}

              {gameConfig.type === 'presidents' && (
                <>
                  {(gameConfig.mode === 'easy' || gameConfig.mode === 'hard') && (
                    <div className="mb-4 bg-white p-2 rounded-2xl shadow-md border-2 border-purple-100">
                      <img 
                        key={currentQuestion.imageUrl}
                        src={currentQuestion.imageUrl} 
                        alt="President Portrait" 
                        loading="eager"
                        decoding="sync"
                        fetchPriority="high"
                        onError={(e) => {
                          if (e.target.src.endsWith('.jpg')) {
                            e.target.src = e.target.src.replace(/\.jpg$/, '.png');
                          } else {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentQuestion.correctName)}&background=random&color=fff&size=400`;
                          }
                        }}
                        className="w-40 h-52 md:w-48 md:h-60 object-cover rounded-xl bg-gray-200 object-top"
                      />
                    </div>
                  )}

                  {gameConfig.mode === 'medium' && (
                    <h2 className="text-2xl md:text-4xl font-extrabold text-gray-800 text-center leading-tight">
                      Who was the <br/>
                      <span className="text-purple-600 text-5xl md:text-6xl block my-2 drop-shadow-sm">{getOrdinal(currentQuestion.num)}</span> 
                      President?
                    </h2>
                  )}

                  {gameConfig.mode === 'easy' && (
                    <h2 className="text-xl font-bold text-gray-600 text-center mb-2">Who is this?</h2>
                  )}

                  {gameConfig.mode === 'hard' && (
                    <h2 className="text-lg font-bold text-gray-600 text-center mb-2">Identify Order & Name</h2>
                  )}
                </>
              )}

              {gameConfig.type === 'human-calendar' && (
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="text-xl md:text-2xl font-bold text-purple-400 uppercase tracking-wider mb-2">
                    Value/Code of
                  </div>
                  <h2 className="text-5xl md:text-7xl font-extrabold text-purple-800 drop-shadow-sm leading-tight">
                    {gameConfig.mode === 'centuries' && `${currentQuestion.label}?`}
                    {gameConfig.mode === 'years' && currentQuestion.num}
                    {gameConfig.mode === 'months' && currentQuestion.name}
                    {gameConfig.mode === 'days' && currentQuestion.label}
                  </h2>

                  {gameConfig.mode === 'years' && showHint && currentQuestion.hint && (
                    <div className="mt-5 animate-hint-pop bg-yellow-100 border-2 border-yellow-400 text-yellow-800 px-5 py-2.5 rounded-2xl shadow-md flex items-center gap-2 text-xl md:text-2xl font-bold">
                      <span>💡</span>
                      <span>{currentQuestion.hint}...</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="w-full mt-auto">
              
              {(gameConfig.type === 'peg' || gameConfig.mode === 'medium' || gameConfig.type === 'human-calendar') && (
                <form
                  onSubmit={
                    gameConfig.type === 'peg'
                      ? handlePegSubmit
                      : gameConfig.type === 'human-calendar'
                        ? handleHumanCalendarSubmit
                        : handlePresidentsMediumSubmit
                  }
                  className="flex flex-col gap-2.5 w-full"
                >
                  <input 
                    type={
                      gameConfig.type === 'peg' || (gameConfig.type === 'human-calendar' && gameConfig.mode !== 'centuries')
                        ? "number"
                        : "text"
                    } 
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={
                      gameConfig.type === 'peg'
                        ? "Type number..."
                        : gameConfig.type === 'human-calendar'
                          ? (gameConfig.mode === 'centuries' ? "Type value (e.g. -2, +1)..." : "Type value (0-6)...")
                          : "Type Name..."
                    }
                    className="w-full text-center text-2xl font-bold text-gray-800 border-2 border-gray-300 rounded-2xl py-3 px-4 focus:outline-none focus:border-purple-400 focus:bg-purple-50 transition-all placeholder:text-gray-300 bg-white shadow-sm"
                    autoFocus
                    disabled={flashState !== null}
                  />
                  <button type="submit" disabled={flashState !== null || !inputValue.trim()} className="w-full bg-purple-500 hover:bg-purple-400 disabled:bg-gray-300 text-white font-bold text-xl py-3 rounded-2xl border-b-[6px] border-purple-700 disabled:border-gray-400 active:border-b-0 active:mt-[6px] transition-all uppercase tracking-wider">
                    Check
                  </button>
                </form>
              )}

              {gameConfig.mode === 'easy' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 w-full">
                  {currentOptions.map((opt, i) => (
                    <button 
                      key={i}
                      onClick={() => handlePresidentsEasySubmit(opt)}
                      disabled={flashState !== null}
                      className="bg-white hover:bg-purple-50 text-purple-900 border-2 border-gray-300 font-bold text-lg py-3 px-3 rounded-2xl border-b-[6px] active:border-b-0 active:mt-[6px] transition-all text-center shadow-sm"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {gameConfig.mode === 'hard' && (
                <form onSubmit={handlePresidentsHardSubmit} className="flex flex-col gap-2.5 w-full">
                  <div className="flex gap-2">
                    <input 
                      type="number"
                      ref={orderRef}
                      placeholder="Order #"
                      value={inputOrder}
                      onChange={(e) => setInputOrder(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowRight' || e.key === 'Enter') {
                          e.preventDefault();
                          nameRef.current?.focus();
                        }
                      }}
                      className="w-1/3 text-center text-lg font-bold text-gray-800 border-2 border-gray-300 rounded-2xl py-3 px-2 focus:outline-none focus:border-red-400 bg-white shadow-sm"
                      disabled={flashState !== null}
                      autoFocus
                    />
                    <input 
                      type="text"
                      ref={nameRef}
                      placeholder="President's Name"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowLeft') {
                          orderRef.current?.focus();
                        }
                      }}
                      className="w-2/3 text-center text-lg font-bold text-gray-800 border-2 border-gray-300 rounded-2xl py-3 px-3 focus:outline-none focus:border-red-400 bg-white shadow-sm"
                      disabled={flashState !== null}
                    />
                  </div>
                  <button type="submit" disabled={flashState !== null || !inputValue.trim() || !inputOrder.trim()} className="w-full bg-red-500 hover:bg-red-400 disabled:bg-gray-300 text-white font-bold text-xl py-3 rounded-2xl border-b-[6px] border-red-700 disabled:border-gray-400 active:border-b-0 active:mt-[6px] transition-all uppercase tracking-wider">
                    Submit
                  </button>
                </form>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}