import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, CheckCircle, XCircle, Flame, Clock } from 'lucide-react';

// Full 0-100 PEG list with matching emojis
const PEG_DATA = [
  { num: 0, word: "Egg", emoji: "🥚" },
  { num: 1, word: "Mirror", emoji: "🪞" },
  { num: 2, word: "Swan", emoji: "🦢" },
  { num: 3, word: "Fork", emoji: "🍴" },
  { num: 4, word: "Car", emoji: "🚗" },
  { num: 5, word: "Glove", emoji: "🧤" },
  { num: 6, word: "Whistle", emoji: "😙" },
  { num: 7, word: "Rainbow", emoji: "🌈" },
  { num: 8, word: "Snowman", emoji: "⛄" },
  { num: 9, word: "Balloon", emoji: "🎈" },
  { num: 10, word: "Drum", emoji: "🥁" },
  { num: 11, word: "Ski", emoji: "🎿" },
  { num: 12, word: "Sun", emoji: "☀️" },
  { num: 13, word: "Teenager", emoji: "👦" },
  { num: 14, word: "Heart", emoji: "❤️" },
  { num: 15, word: "Tennis", emoji: "🎾" },
  { num: 16, word: "Driver's License", emoji: "🪪" },
  { num: 17, word: "Magazine", emoji: "📰" },
  { num: 18, word: "Octopus", emoji: "🐙" },
  { num: 19, word: "Golf", emoji: "⛳" },
  { num: 20, word: "Crown", emoji: "👑" },
  { num: 21, word: "Polling Station", emoji: "🗳️" },
  { num: 22, word: "Bingo Ball", emoji: "🎱" },
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
  { num: 33, word: "Mickey Mouse", emoji: "🐭" },
  { num: 34, word: "Pizza", emoji: "🍕" },
  { num: 35, word: "Camera", emoji: "📷" },
  { num: 36, word: "Compass", emoji: "🧭" },
  { num: 37, word: "Hand", emoji: "✋" },
  { num: 38, word: "Thermometer", emoji: "🌡️" },
  { num: 39, word: "Tank", emoji: "🪖" },
  { num: 40, word: "Thief", emoji: "🥷" },
  { num: 41, word: "Mozart", emoji: "🎹" },
  { num: 42, word: "Oil Barrel", emoji: "🛢️" },
  { num: 43, word: "Grinch", emoji: "👹" },
  { num: 44, word: "Twins", emoji: "👯" },
  { num: 45, word: "Dove", emoji: "🕊️" },
  { num: 46, word: "Diaper", emoji: "🧷" },
  { num: 47, word: "Airplane", emoji: "✈️" },
  { num: 48, word: "Cello", emoji: "🎻" },
  { num: 49, word: "Moose", emoji: "🦌" },
  { num: 50, word: "Flag", emoji: "🚩" },
  { num: 51, word: "Aliens", emoji: "👽" },
  { num: 52, word: "Cards", emoji: "🃏" },
  { num: 53, word: "Joker", emoji: "🤡" },
  { num: 54, word: "Rubik's Cube", emoji: "🧊" },
  { num: 55, word: "Double Nickel", emoji: "🪙" },
  { num: 56, word: "Shopping Mall", emoji: "🛍️" },
  { num: 57, word: "Ketchup", emoji: "🍅" },
  { num: 58, word: "Lego", emoji: "🧱" },
  { num: 59, word: "Slide", emoji: "🛝" },
  { num: 60, word: "Watch", emoji: "⌚" },
  { num: 61, word: "Barbie Doll", emoji: "👱‍♀️" },
  { num: 62, word: "Guitar", emoji: "🎸" },
  { num: 63, word: "Color TV", emoji: "📺" },
  { num: 64, word: "Chessboard", emoji: "♟️" },
  { num: 65, word: "Dinosaur", emoji: "🦖" },
  { num: 66, word: "Evil", emoji: "😈" },
  { num: 67, word: "ATM", emoji: "🏧" },
  { num: 68, word: "Bee", emoji: "🐝" },
  { num: 69, word: "Astronaut", emoji: "🧑‍🚀" },
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
  { num: 89, word: "Mummy", emoji: "🤕" },
  { num: 90, word: "Soccerball", emoji: "⚽" },
  { num: 91, word: "Pokemon", emoji: "⚡" },
  { num: 92, word: "Cartoon Network", emoji: "📺" },
  { num: 93, word: "Volcano", emoji: "🌋" },
  { num: 94, word: "Coca Cola", emoji: "🥤" },
  { num: 95, word: "Briefcase", emoji: "💼" },
  { num: 96, word: "Smiley Face", emoji: "😊" },
  { num: 97, word: "Harry Potter", emoji: "🧙‍♂️" },
  { num: 98, word: "Playstation", emoji: "🎮" },
  { num: 99, word: "Ice Cream", emoji: "🍦" },
  { num: 100, word: "Trophy", emoji: "🏆" }
];

export default function App() {
  const [route, setRoute] = useState('home');
  const [score, setScore] = useState(0);
  
  // Quiz State
  const [currentPeg, setCurrentPeg] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [mistakes, setMistakes] = useState([]);
  const [floatingPoint, setFloatingPoint] = useState(null);
  const [availablePegs, setAvailablePegs] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [totalTime, setTotalTime] = useState(0);
  const [flashState, setFlashState] = useState(null); // 'correct' or 'wrong'
  const inputRef = useRef(null);

  // Start the Quiz
  const startPegQuiz = () => {
    setScore(0);
    setStreak(0);
    setHighestStreak(0);
    setMistakes([]);
    setStartTime(Date.now());
    // Limit exactly to 40 random questions
    const shuffled = [...PEG_DATA].sort(() => Math.random() - 0.5).slice(0, 40);
    setAvailablePegs(shuffled);
    setCurrentPeg(shuffled[0]);
    setRoute('peg');
    setInputValue('');
  };

  const pickNextPeg = (currentRemaining) => {
    if (currentRemaining.length <= 1) {
      setTotalTime(Math.floor((Date.now() - startTime) / 1000));
      setRoute('end');
      return;
    }
    const nextList = currentRemaining.slice(1);
    setAvailablePegs(nextList);
    setCurrentPeg(nextList[0]);
    setInputValue('');
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 50);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentPeg || inputValue.trim() === '' || flashState) return;

    const guess = parseInt(inputValue.trim(), 10);
    const isCorrect = guess === currentPeg.num;

    if (isCorrect) {
      const newStreak = streak + 1;
      if (newStreak > highestStreak) setHighestStreak(newStreak);

      let points = 1;
      if (newStreak > 15) points = 2;
      else if (newStreak >= 9) points = 1.5;
      else if (newStreak >= 4) points = 1.25;

      setScore(s => s + points);
      setStreak(newStreak);
      setFlashState('correct');
      setFloatingPoint({ id: Date.now(), text: `+${points}`, type: 'positive' });
    } else {
      setScore(s => s - 1);
      setStreak(0);
      setFlashState('wrong');
      setMistakes(prev => [...prev, { ...currentPeg, guessed: guess }]);
      setFloatingPoint({ id: Date.now(), text: '-1', type: 'negative' });
    }

    setTimeout(() => {
      setFlashState(null);
      pickNextPeg(availablePegs);
    }, 300);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // RENDER HOME ROUTE
  if (route === 'home') {
    return (
      <div className="min-h-screen bg-purple-50 flex flex-col items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-purple-800 mb-12 tracking-tight drop-shadow-sm">
            Memo Quizzes <br/><span className="text-purple-500 text-2xl md:text-3xl mt-3 block font-bold">by Mr.Moon</span>
          </h1>
          
          <div className="flex flex-col gap-4">
            <button 
              onClick={startPegQuiz}
              className="w-full bg-purple-500 hover:bg-purple-400 text-white font-bold text-2xl py-5 rounded-2xl border-b-8 border-purple-700 active:border-b-0 active:mt-[8px] transition-all uppercase tracking-wider"
            >
              PEG
            </button>
            
            <button 
              onClick={() => setRoute('presidents')}
              className="w-full bg-white hover:bg-gray-50 text-purple-500 border-2 border-purple-200 font-bold text-2xl py-5 rounded-2xl border-b-8 border-purple-200 active:border-b-0 active:mt-[8px] transition-all uppercase tracking-wider"
            >
              Presidents
            </button>
          </div>
        </div>
      </div>
    );
  }

  // RENDER PRESIDENTS ROUTE
  if (route === 'presidents') {
    return (
      <div className="min-h-screen bg-purple-50 flex flex-col items-center justify-center p-6 font-sans">
        <div className="bg-white p-10 rounded-3xl border-2 border-purple-100 text-center shadow-sm w-full max-w-sm">
          <h2 className="text-3xl font-extrabold text-purple-600 mb-4">Presidents</h2>
          <p className="text-xl text-purple-400 mb-8 font-bold">Coming Soon! 🔮</p>
          <button 
            onClick={() => setRoute('home')}
            className="w-full bg-purple-500 hover:bg-purple-400 text-white font-bold text-xl py-4 rounded-2xl border-b-4 border-purple-700 active:border-b-0 active:mt-[4px] transition-all flex items-center justify-center gap-2 uppercase"
          >
            <ChevronLeft size={24} /> Back
          </button>
        </div>
      </div>
    );
  }
  
  // RENDER END ROUTE
  if (route === 'end') {
    return (
      <div className="min-h-screen bg-purple-50 flex flex-col items-center py-6 px-4 font-sans overflow-y-auto w-full">
        <div className="bg-white p-6 md:p-10 rounded-3xl border-2 border-purple-100 text-center shadow-sm w-full max-w-2xl flex flex-col items-center gap-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-purple-600">Quiz Complete!</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 w-full">
            <div className="bg-purple-100 p-4 rounded-2xl text-purple-800 flex flex-col items-center border-b-4 border-purple-200">
              <div className="text-xs md:text-sm font-bold uppercase tracking-wider text-purple-500 mb-1">Score</div>
              <div className="text-3xl md:text-4xl font-black">{score % 1 !== 0 ? score.toFixed(2) : score}</div>
            </div>
            <div className="bg-orange-100 p-4 rounded-2xl text-orange-800 flex flex-col items-center border-b-4 border-orange-200">
              <div className="text-xs md:text-sm font-bold uppercase tracking-wider text-orange-500 mb-1 flex items-center gap-1"><Flame size={16}/> Best Streak</div>
              <div className="text-3xl md:text-4xl font-black">{highestStreak}</div>
            </div>
            <div className="bg-yellow-100 p-4 rounded-2xl text-yellow-800 flex flex-col items-center border-b-4 border-yellow-200 col-span-2 md:col-span-1">
              <div className="text-xs md:text-sm font-bold uppercase tracking-wider text-yellow-600 mb-1 flex items-center justify-center gap-1"><Clock size={16}/> Time</div>
              <div className="text-3xl md:text-4xl font-black">{formatTime(totalTime)}</div>
            </div>
          </div>

          {mistakes.length > 0 ? (
            <div className="w-full mt-6 text-left">
              <h3 className="text-2xl font-extrabold text-red-500 mb-4 flex items-center gap-2">
                <XCircle size={24} /> Mistakes ({mistakes.length})
              </h3>
              <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-2 rounded-xl">
                {mistakes.map((m, idx) => (
                  <div key={idx} className="bg-red-50 p-4 rounded-2xl border-2 border-red-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{m.emoji}</span>
                      <span className="text-xl font-bold text-gray-800">{m.word}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-red-500 font-bold line-through">You: {isNaN(m.guessed) ? 'Blank' : m.guessed}</div>
                      <div className="text-lg text-green-600 font-black">Correct: {m.num}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full mt-6 bg-green-100 p-6 rounded-2xl border-2 border-green-200 text-green-700 font-bold text-xl flex items-center justify-center gap-2">
              <CheckCircle size={28} /> Perfect Score! No mistakes.
            </div>
          )}

          <button 
            onClick={() => setRoute('home')}
            className="w-full mt-4 bg-purple-500 hover:bg-purple-400 text-white font-bold text-xl py-4 rounded-2xl border-b-4 border-purple-700 active:border-b-0 active:mt-[4px] transition-all uppercase tracking-wider"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // RENDER PEG QUIZ ROUTE
  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      flashState === 'correct' ? 'bg-green-400' : 
      flashState === 'wrong' ? 'bg-red-400' : 'bg-white'
    }`}>
      
      <style>{`
        @keyframes floatUp {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-40px) scale(1.3); }
        }
        .animate-float {
          animation: floatUp 0.8s ease-out forwards;
        }
      `}</style>

      {/* Header */}
      <div className="p-4 flex items-center justify-between z-10 max-w-4xl mx-auto w-full mt-2">
        <button 
          onClick={() => setRoute('home')}
          className="text-gray-400 hover:text-gray-600 font-bold p-2 transition-colors active:scale-90"
        >
          <XCircle className="w-8 h-8 md:w-10 md:h-10" />
        </button>
        
        <div className="flex-1 flex justify-center text-gray-400 font-bold text-base md:text-lg">
          {40 - availablePegs.length + 1} / 40
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          {streak >= 4 && (
            <div className="flex items-center gap-1 text-orange-500 font-bold animate-bounce drop-shadow-md" style={{ transform: `scale(${Math.min(1 + (streak * 0.05), 1.5)})` }}>
              <Flame className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" />
              <span className="text-xl md:text-2xl">{streak}</span>
            </div>
          )}
          <div className="relative flex items-center">
            <div className="text-purple-600 font-black text-3xl md:text-4xl w-16 md:w-24 text-right">
              {score % 1 !== 0 ? score.toFixed(2) : score}
            </div>
            {/* Floating Point Animation */}
            {floatingPoint && (
              <div 
                key={floatingPoint.id} 
                className={`absolute right-full mr-3 text-2xl md:text-3xl font-black animate-float pointer-events-none drop-shadow-sm whitespace-nowrap ${
                  floatingPoint.type === 'positive' ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {floatingPoint.text}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Quiz Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 w-full max-w-md mx-auto relative">
        {currentPeg && (
          <div className="w-full flex flex-col items-center h-full max-h-[600px] justify-between pb-4 md:pb-8">
            
            <div className="flex flex-col items-center justify-center flex-1 w-full mt-4 md:mt-0">
              <div className="text-[120px] md:text-[140px] leading-none mb-4 md:mb-6 drop-shadow-md select-none transform transition-transform hover:scale-105">
                {currentPeg.emoji}
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 capitalize text-center mb-6 md:mb-8">
                {currentPeg.word}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:gap-4 w-full">
              <input 
                type="number" 
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type number..."
                className="w-full text-center text-3xl font-bold text-gray-800 border-2 border-gray-300 rounded-2xl py-4 px-6 focus:outline-none focus:border-blue-400 focus:bg-blue-50 transition-all placeholder:text-gray-300 bg-white"
                autoFocus
                disabled={flashState !== null}
              />
              <button 
                type="submit"
                disabled={flashState !== null || !inputValue.trim()}
                className={`w-full font-bold text-2xl py-4 rounded-2xl border-b-8 active:border-b-0 active:mt-[8px] transition-all uppercase tracking-wider ${
                  flashState === 'correct' ? 'bg-green-500 border-green-700 text-white' :
                  flashState === 'wrong' ? 'bg-red-500 border-red-700 text-white' :
                  !inputValue.trim() ? 'bg-gray-200 border-gray-300 text-gray-400' :
                  'bg-purple-500 hover:bg-purple-400 border-purple-700 text-white'
                }`}
              >
                Check
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}