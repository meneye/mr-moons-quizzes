import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, CheckCircle, XCircle, Flame, Clock, X } from 'lucide-react';

// Full 0-100 PEG list with matching emojis
const PEG_DATA = [
  { num: 0, word: "Egg", emoji: "🥚" }, { num: 1, word: "Mirror", emoji: "🪞" }, { num: 2, word: "Swan", emoji: "🦢" }, { num: 3, word: "Fork", emoji: "🍴" },
  { num: 4, word: "Car", emoji: "🚗" }, { num: 5, word: "Glove", emoji: "🧤" }, { num: 6, word: "Whistle", emoji: "😙" }, { num: 7, word: "Rainbow", emoji: "🌈" },
  { num: 8, word: "Snowman", emoji: "⛄" }, { num: 9, word: "Balloon", emoji: "🎈" }, { num: 10, word: "Drum", emoji: "🥁" }, { num: 11, word: "Ski", emoji: "🎿" },
  { num: 12, word: "Sun", emoji: "☀️" }, { num: 13, word: "Teenager", emoji: "👦" }, { num: 14, word: "Heart", emoji: "❤️" }, { num: 15, word: "Tennis", emoji: "🎾" },
  { num: 16, word: "Driver's License", emoji: "🪪" }, { num: 17, word: "Magazine", emoji: "📰" }, { num: 18, word: "Octopus", emoji: "🐙" }, { num: 19, word: "Golf", emoji: "⛳" },
  { num: 20, word: "Crown", emoji: "👑" }, { num: 21, word: "Polling Station", emoji: "🗳️" }, { num: 22, word: "Bingo Ball", emoji: "🎱" }, { num: 23, word: "Jersey", emoji: "🎽" },
  { num: 24, word: "Clapperboard", emoji: "🎬" }, { num: 25, word: "Present", emoji: "🎁" }, { num: 26, word: "Foot", emoji: "🦶" }, { num: 27, word: "Land", emoji: "🏝️" },
  { num: 28, word: "Saturn", emoji: "🪐" }, { num: 29, word: "Calendar", emoji: "📅" }, { num: 30, word: "Seal", emoji: "🦭" }, { num: 31, word: "Fireworks", emoji: "🎆" },
  { num: 32, word: "Teeth", emoji: "🦷" }, { num: 33, word: "Mickey Mouse", emoji: "🐭" }, { num: 34, word: "Pizza", emoji: "🍕" }, { num: 35, word: "Camera", emoji: "📷" },
  { num: 36, word: "Compass", emoji: "🧭" }, { num: 37, word: "Hand", emoji: "✋" }, { num: 38, word: "Thermometer", emoji: "🌡️" }, { num: 39, word: "Tank", emoji: "🪖" },
  { num: 40, word: "Thief", emoji: "🥷" }, { num: 41, word: "Mozart", emoji: "🎹" }, { num: 42, word: "Oil Barrel", emoji: "🛢️" }, { num: 43, word: "Grinch", emoji: "👹" },
  { num: 44, word: "Twins", emoji: "👯" }, { num: 45, word: "Dove", emoji: "🕊️" }, { num: 46, word: "Diaper", emoji: "🧷" }, { num: 47, word: "Airplane", emoji: "✈️" },
  { num: 48, word: "Cello", emoji: "🎻" }, { num: 49, word: "Moose", emoji: "🦌" }, { num: 50, word: "Flag", emoji: "🚩" }, { num: 51, word: "Aliens", emoji: "👽" },
  { num: 52, word: "Cards", emoji: "🃏" }, { num: 53, word: "Joker", emoji: "🤡" }, { num: 54, word: "Rubik's Cube", emoji: "🧊" }, { num: 55, word: "Double Nickel", emoji: "🪙" },
  { num: 56, word: "Shopping Mall", emoji: "🛍️" }, { num: 57, word: "Ketchup", emoji: "🍅" }, { num: 58, word: "Lego", emoji: "🧱" }, { num: 59, word: "Slide", emoji: "🛝" },
  { num: 60, word: "Watch", emoji: "⌚" }, { num: 61, word: "Barbie Doll", emoji: "👱‍♀️" }, { num: 62, word: "Guitar", emoji: "🎸" }, { num: 63, word: "Color TV", emoji: "📺" },
  { num: 64, word: "Chessboard", emoji: "♟️" }, { num: 65, word: "Dinosaur", emoji: "🦖" }, { num: 66, word: "Evil", emoji: "😈" }, { num: 67, word: "ATM", emoji: "🏧" },
  { num: 68, word: "Bee", emoji: "🐝" }, { num: 69, word: "Astronaut", emoji: "🧑‍🚀" }, { num: 70, word: "Hockey", emoji: "🏒" }, { num: 71, word: "Starbucks", emoji: "☕" },
  { num: 72, word: "Water", emoji: "💧" }, { num: 73, word: "Cell Phone", emoji: "📱" }, { num: 74, word: "Calculator", emoji: "🖩" }, { num: 75, word: "Diamond", emoji: "💎" },
  { num: 76, word: "Mattress", emoji: "🛏️" }, { num: 77, word: "Lottery Ticket", emoji: "🎫" }, { num: 78, word: "Vinyl Record", emoji: "💿" }, { num: 79, word: "Key", emoji: "🔑" },
  { num: 80, word: "Tower Floor", emoji: "🏢" }, { num: 81, word: "Sudoku", emoji: "🔢" }, { num: 82, word: "NBA", emoji: "🏀" }, { num: 83, word: "Wrestler", emoji: "🤼" },
  { num: 84, word: "Apple Mac", emoji: "💻" }, { num: 85, word: "Paper", emoji: "📄" }, { num: 86, word: "Comet", emoji: "☄️" }, { num: 87, word: "Boomerang", emoji: "🪃" },
  { num: 88, word: "Piano", emoji: "🎹" }, { num: 89, word: "Mummy", emoji: "🤕" }, { num: 90, word: "Soccerball", emoji: "⚽" }, { num: 91, word: "Pokemon", emoji: "⚡" },
  { num: 92, word: "Cartoon Network", emoji: "📺" }, { num: 93, word: "Volcano", emoji: "🌋" }, { num: 94, word: "Coca Cola", emoji: "🥤" }, { num: 95, word: "Briefcase", emoji: "💼" },
  { num: 96, word: "Smiley Face", emoji: "😊" }, { num: 97, word: "Harry Potter", emoji: "🧙‍♂️" }, { num: 98, word: "Playstation", emoji: "🎮" }, { num: 99, word: "Ice Cream", emoji: "🍦" },
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
  { num: 22, correctName: "Grover Cleveland", answers: ["Cleveland", "Grover Cleveland"] },
  { num: 23, correctName: "Benjamin Harrison", answers: ["Harrison", "Benjamin Harrison"] },
  { num: 24, correctName: "Grover Cleveland", answers: ["Cleveland", "Grover Cleveland"] },
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
  { num: 45, correctName: "Donald Trump", answers: ["Trump", "Donald Trump"] },
  { num: 46, correctName: "Joe Biden", answers: ["Biden", "Joe Biden", "Joseph Biden"] },
  { num: 47, correctName: "Donald Trump", answers: ["Trump", "Donald Trump"] }
].map(p => ({
  ...p,
  imageUrl: `/presidents/${p.num}.jpg`
}));

const getOrdinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export default function App() {
  const [route, setRoute] = useState('home');
  const [gameConfig, setGameConfig] = useState({ type: null, mode: null, total: 0 });
  const [score, setScore] = useState(0);

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

  const [floatingPoint, setFloatingPoint] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [totalTime, setTotalTime] = useState(0);
  const [flashState, setFlashState] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(null);

  const inputRef = useRef(null);
  const orderRef = useRef(null);
  const nameRef = useRef(null);

  // End Screen Animation State
  const [revealStep, setRevealStep] = useState(0);

  // ---------- INITIALIZATION LOGIC ---------- //

  const resetGameState = () => {
    setScore(0);
    setStreak(0);
    setHighestStreak(0);
    setMistakes([]);
    setCorrectCount(0);
    setStartTime(Date.now());
    setQuestionStartTime(Date.now());
    setInputValue('');
    setInputOrder('');
    setRevealStep(0);
  };

  const initGame = (type, mode) => {
    resetGameState();
    let total = 0;
    let shuffled = [];

    if (type === 'peg') {
      total = mode === 'practice' ? 25 : 50;
      shuffled = [...PEG_DATA].sort(() => Math.random() - 0.5).slice(0, total);
    } else if (type === 'presidents') {
      total = mode === 'easy' ? 10 : mode === 'medium' ? 20 : 30;
      shuffled = [...PRESIDENTS_DATA].sort(() => Math.random() - 0.5).slice(0, total);
    }

    setGameConfig({ type, mode, total });
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
    setQuestionStartTime(Date.now());

    if (gameConfig.type === 'presidents' && gameConfig.mode === 'easy') {
      generateOptions(nextList[0]);
    } else {
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
        if (orderRef.current) orderRef.current.focus();
      }, 50);
    }
  };

  // ---------- SUBMIT LOGIC ---------- //

  const calculatePoints = () => {
    const responseTime = (Date.now() - questionStartTime) / 1000;
    const questionTimer = 20;
    const cappedTime = Math.min(responseTime, questionTimer);
    return Math.floor((1 - ((cappedTime / questionTimer) / 2)) * 10);
  };

  const handlePegSubmit = (e) => {
    if (e) e.preventDefault();
    if (!currentQuestion || inputValue.trim() === '' || flashState) return;

    const guess = parseInt(inputValue.trim(), 10);
    const isCorrect = guess === currentQuestion.num;

    if (isCorrect) {
      setCorrectCount(c => c + 1);
      const newStreak = streak + 1;
      if (newStreak > highestStreak) setHighestStreak(newStreak);

      const points = calculatePoints();
      setScore(s => s + points);
      setStreak(newStreak);
      setFlashState('correct');
      setFloatingPoint({ id: Date.now(), text: `+${points}`, type: 'positive' });

      setTimeout(() => {
        setFlashState(null);
        pickNextQuestion(availableQuestions);
      }, 250);
    } else {
      setFlashState('wrong');
      setStreak(0);
      
      if (!mistakes.find(m => m.correct === currentQuestion.num && m.guessed === guess)) {
        setMistakes(prev => [...prev, { type: 'peg', word: currentQuestion.word, emoji: currentQuestion.emoji, correct: currentQuestion.num, guessed: isNaN(guess) ? 'Blank' : guess }]);
      }

      if (gameConfig.mode === 'test') {
        setScore(s => s - 1);
        setFloatingPoint({ id: Date.now(), text: '-1', type: 'negative' });
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
      setCorrectCount(c => c + 1);
      const points = calculatePoints();
      setScore(s => s + points);
      setStreak(s => s + 1);
      setFlashState('correct');
      setFloatingPoint({ id: Date.now(), text: `+${points}`, type: 'positive' });
    } else {
      setStreak(0);
      setFlashState('wrong');
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
      setCorrectCount(c => c + 1);
      const newStreak = streak + 1;
      if (newStreak > highestStreak) setHighestStreak(newStreak);

      const points = calculatePoints();
      setScore(s => s + points);
      setStreak(newStreak);
      setFlashState('correct');
      setFloatingPoint({ id: Date.now(), text: `+${points}`, type: 'positive' });
    } else {
      setScore(s => s - 1);
      setStreak(0);
      setFlashState('wrong');
      setMistakes(prev => [...prev, { type: 'president', num: currentQuestion.num, correctName: currentQuestion.correctName, guessed: inputValue.trim() }]);
      setFloatingPoint({ id: Date.now(), text: '-1', type: 'negative' });
    }
    setTimeout(() => {
      setFlashState(null);
      pickNextQuestion(availableQuestions);
    }, 250);
  };

  const handlePresidentsHardSubmit = (e) => {
    if (e) e.preventDefault();
    if (!currentQuestion || inputValue.trim() === '' || inputOrder.trim() === '' || flashState) return;

    const guessName = inputValue.trim().toLowerCase();
    const guessOrder = parseInt(inputOrder.trim(), 10);

    const isNameCorrect = currentQuestion.answers.some(ans => ans.toLowerCase() === guessName);
    let isOrderCorrect = guessOrder === currentQuestion.num;

    if (currentQuestion.correctName === "Grover Cleveland" && (guessOrder === 22 || guessOrder === 24)) {
        isOrderCorrect = true;
    }
    if (currentQuestion.correctName === "Donald Trump" && (guessOrder === 45 || guessOrder === 47)) {
        isOrderCorrect = true;
    }

    const isCorrect = isNameCorrect && isOrderCorrect;

    if (isCorrect) {
      setCorrectCount(c => c + 1);
      const newStreak = streak + 1;
      if (newStreak > highestStreak) setHighestStreak(newStreak);

      const points = calculatePoints();
      setScore(s => s + points);
      setStreak(newStreak);
      setFlashState('correct');
      setFloatingPoint({ id: Date.now(), text: `+${points}`, type: 'positive' });
    } else {
      setScore(s => s - 1);
      setStreak(0);
      setFlashState('wrong');
      setMistakes(prev => [...prev, { 
        type: 'president', 
        num: currentQuestion.num, 
        correctName: currentQuestion.correctName, 
        guessed: `${guessOrder || '?'} - ${inputValue.trim() || '?'}` 
      }]);
      setFloatingPoint({ id: Date.now(), text: '-1', type: 'negative' });
    }
    setTimeout(() => {
      setFlashState(null);
      pickNextQuestion(availableQuestions);
    }, 300);
  };

  // ---------- RENDER HELPERS ---------- //

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Trigger End Screen Animations
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

  // ---------- SCREENS ---------- //

  if (route === 'home') {
    return (
      <div className="min-h-[100dvh] bg-purple-50 flex flex-col items-center justify-center p-6 font-sans">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap');
          * { font-family: 'Bubblegum Sans', cursive !important; }
        `}</style>
        <div className="max-w-md w-full text-center">
          <h1 className="text-6xl md:text-7xl font-extrabold text-purple-800 mb-12 tracking-tight drop-shadow-sm">
            MemoQuiz
          </h1>
          <div className="flex flex-col gap-4">
            <button onClick={() => setRoute('peg-menu')} className="w-full bg-purple-500 hover:bg-purple-400 text-white font-bold text-3xl py-4 rounded-2xl border-b-8 border-purple-700 active:border-b-0 active:mt-[8px] transition-all uppercase tracking-wider shadow-md">
              PEG
            </button>
            <button onClick={() => setRoute('presidents-menu')} className="w-full bg-white hover:bg-purple-50 text-purple-500 border-2 border-purple-200 font-bold text-3xl py-4 rounded-2xl border-b-8 border-purple-200 active:border-b-0 active:mt-[8px] transition-all uppercase tracking-wider shadow-md">
              Presidents
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (route === 'peg-menu') {
    return (
      <div className="min-h-[100dvh] bg-purple-50 flex flex-col items-center justify-center p-6 font-sans">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap');
          * { font-family: 'Bubblegum Sans', cursive !important; }
        `}</style>
        <div className="max-w-md w-full">
          <button onClick={() => setRoute('home')} className="mb-4 flex items-center text-purple-500 font-bold hover:text-purple-700 text-xl">
            <ChevronLeft size={26} /> Back
          </button>
          <h2 className="text-4xl font-extrabold text-purple-800 mb-6 text-center tracking-wide">PEG System</h2>
          <div className="flex flex-col gap-4">
            <button onClick={() => initGame('peg', 'practice')} className="w-full bg-purple-200 hover:bg-purple-100 text-purple-900 font-bold text-2xl py-4 rounded-2xl border-b-8 border-purple-400 active:border-b-0 active:mt-[8px] transition-all tracking-wide shadow-sm">
              Practice
            </button>
            <button onClick={() => initGame('peg', 'test')} className="w-full bg-purple-500 hover:bg-purple-400 text-white font-bold text-2xl py-4 rounded-2xl border-b-8 border-purple-700 active:border-b-0 active:mt-[8px] transition-all tracking-wide shadow-sm">
              Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (route === 'presidents-menu') {
    return (
      <div className="min-h-[100dvh] bg-purple-50 flex flex-col items-center justify-center p-6 font-sans">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap');
          * { font-family: 'Bubblegum Sans', cursive !important; }
        `}</style>
        <div className="max-w-md w-full">
          <button onClick={() => setRoute('home')} className="mb-4 flex items-center text-purple-500 font-bold hover:text-purple-700 text-xl">
            <ChevronLeft size={26} /> Back
          </button>
          <h2 className="text-4xl font-extrabold text-purple-800 mb-6 text-center tracking-wide">Presidents</h2>
          <div className="flex flex-col gap-4">
            <button onClick={() => initGame('presidents', 'easy')} className="w-full bg-purple-200 hover:bg-purple-100 text-purple-900 font-bold text-2xl py-4 rounded-2xl border-b-8 border-purple-400 active:border-b-0 active:mt-[8px] transition-all tracking-wide shadow-sm">
              Easy
            </button>
            <button onClick={() => initGame('presidents', 'medium')} className="w-full bg-purple-400 hover:bg-purple-300 text-white font-bold text-2xl py-4 rounded-2xl border-b-8 border-purple-600 active:border-b-0 active:mt-[8px] transition-all tracking-wide shadow-sm">
              Medium
            </button>
            <button onClick={() => initGame('presidents', 'hard')} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-2xl py-4 rounded-2xl border-b-8 border-purple-800 active:border-b-0 active:mt-[8px] transition-all tracking-wide shadow-sm">
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
    const randomEncouragement = messageList[Math.floor(Math.random() * messageList.length)];

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
          <button onClick={() => setRoute(`${gameConfig.type}-menu`)} className="absolute top-6 left-6 text-gray-400 hover:text-gray-800 transition-colors bg-white p-2 rounded-full shadow-sm border border-gray-200 z-20">
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

            <div className={`transition-all duration-700 transform ${revealStep >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'} mt-4`}>
              <div className="bg-yellow-100 p-6 rounded-3xl border-4 border-yellow-400 flex flex-col items-center justify-center shadow-lg">
                <div className="text-lg font-bold text-yellow-600 uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
                  <Flame size={22} /> Total Points
                </div>
                <div className="text-6xl md:text-7xl font-black text-yellow-500 drop-shadow-sm">
                  {score % 1 !== 0 ? score.toFixed(2) : score}
                </div>
              </div>
            </div>
          </div>

          <div className={`w-full transition-all duration-500 transform ${revealStep >= 5 ? 'opacity-100' : 'opacity-0 pointer-events-none'} mt-4 px-4 pb-12`}>
            <button 
              onClick={() => initGame(gameConfig.type, gameConfig.mode)}
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
                            <span className="text-2xl">{m.emoji}</span>
                            <span className="text-base font-bold text-gray-800">{m.word}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-red-500 font-bold line-through">You: {m.guessed}</div>
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

  // ---------- ACTIVE GAME UI (ZERO-SCROLL MOBILE OPTIMIZED) ---------- //

  return (
    <div className={`h-[100dvh] flex flex-col font-sans overflow-hidden transition-colors duration-200 ${
      flashState === 'correct' ? 'bg-green-400' : 
      flashState === 'wrong' ? 'bg-red-400' : 'bg-white'
    }`}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap');
        * { font-family: 'Bubblegum Sans', cursive !important; }
        @keyframes floatUp { 0% { opacity: 1; transform: translateY(0) scale(1); } 100% { opacity: 0; transform: translateY(-40px) scale(1.3); } }
        .animate-float { animation: floatUp 0.8s ease-out forwards; }
      `}</style>

      {/* TOP HEADER */}
      <div className="py-3 px-4 flex items-center justify-between z-10 max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 px-3 py-1.5 rounded-xl text-gray-500 font-bold text-sm md:text-base border-2 border-gray-200">
            {totalQuestionsCount - availableQuestions.length + 1} <span className="opacity-50">/ {totalQuestionsCount}</span>
          </div>
          <div className="relative flex items-center">
            <div className="text-purple-600 font-black text-xl md:text-2xl min-w-[2.5rem]">
              {score % 1 !== 0 ? score.toFixed(2) : score}
            </div>
            {floatingPoint && (
              <div key={floatingPoint.id} className={`absolute left-full ml-2 text-xl font-black animate-float pointer-events-none whitespace-nowrap ${floatingPoint.type === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                {floatingPoint.text}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {streak > 0 && (
            <div className={`flex items-center gap-1 font-bold ${streak >= 3 ? 'text-orange-500 animate-bounce' : 'text-gray-400'}`} style={{ transform: `scale(${Math.min(1 + (streak * 0.05), 1.4)})` }}>
              <Flame className="w-5 h-5" fill="currentColor" />
              <span className="text-lg">{streak}</span>
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
            
            {/* QUESTION DISPLAY */}
            <div className="flex flex-col items-center justify-center flex-1 w-full my-auto">
              
              {gameConfig.type === 'peg' && (
                <>
                  <div className="text-[90px] md:text-[120px] leading-none mb-3 drop-shadow-md select-none transform transition-transform hover:scale-105">
                    {currentQuestion.emoji}
                  </div>
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
                        src={currentQuestion.imageUrl} 
                        alt="President Portrait" 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentQuestion.correctName)}&background=random&color=fff&size=400`;
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
            </div>

            {/* INPUT / ANSWER AREA */}
            <div className="w-full mt-auto">
              
              {/* Peg & Presidents Medium: Single Input */}
              {(gameConfig.type === 'peg' || gameConfig.mode === 'medium') && (
                <form onSubmit={gameConfig.type === 'peg' ? handlePegSubmit : handlePresidentsMediumSubmit} className="flex flex-col gap-2.5 w-full">
                  <input 
                    type={gameConfig.type === 'peg' ? "number" : "text"} 
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        gameConfig.type === 'peg' ? handlePegSubmit() : handlePresidentsMediumSubmit();
                      }
                    }}
                    placeholder={gameConfig.type === 'peg' ? "Type number..." : "Type Name..."}
                    className="w-full text-center text-2xl font-bold text-gray-800 border-2 border-gray-300 rounded-2xl py-3 px-4 focus:outline-none focus:border-purple-400 focus:bg-purple-50 transition-all placeholder:text-gray-300 bg-white shadow-sm"
                    autoFocus
                    disabled={flashState !== null}
                  />
                  <button type="submit" disabled={flashState !== null || !inputValue.trim()} className="w-full bg-purple-500 hover:bg-purple-400 disabled:bg-gray-300 text-white font-bold text-xl py-3 rounded-2xl border-b-6 border-purple-700 disabled:border-gray-400 active:border-b-0 active:mt-[6px] transition-all uppercase tracking-wider">
                    Check
                  </button>
                </form>
              )}

              {/* Presidents Easy: Multiple Choice */}
              {gameConfig.mode === 'easy' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 w-full">
                  {currentOptions.map((opt, i) => (
                    <button 
                      key={i}
                      onClick={() => handlePresidentsEasySubmit(opt)}
                      disabled={flashState !== null}
                      className="bg-white hover:bg-purple-50 text-purple-900 border-2 border-gray-300 font-bold text-lg py-3 px-3 rounded-2xl border-b-6 active:border-b-0 active:mt-[6px] transition-all text-center shadow-sm"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {/* Presidents Hard: Double Input */}
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
                        } else if (e.key === 'Enter') {
                          handlePresidentsHardSubmit();
                        }
                      }}
                      className="w-2/3 text-center text-lg font-bold text-gray-800 border-2 border-gray-300 rounded-2xl py-3 px-3 focus:outline-none focus:border-red-400 bg-white shadow-sm"
                      disabled={flashState !== null}
                    />
                  </div>
                  <button type="submit" disabled={flashState !== null || !inputValue.trim() || !inputOrder.trim()} className="w-full bg-red-500 hover:bg-red-400 disabled:bg-gray-300 text-white font-bold text-xl py-3 rounded-2xl border-b-6 border-red-700 disabled:border-gray-400 active:border-b-0 active:mt-[6px] transition-all uppercase tracking-wider">
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