import React, { useState, useEffect } from 'react';
import { RefreshCw, ArrowDown } from 'lucide-react';

// --- คอมโพเนนต์ลูกเต๋า ---
const Dice = ({ value, isRolling }) => {
  const dots = {
    1: [{ cx: 50, cy: 50 }],
    2: [{ cx: 25, cy: 25 }, { cx: 75, cy: 75 }],
    3: [{ cx: 25, cy: 25 }, { cx: 50, cy: 50 }, { cx: 75, cy: 75 }],
    4: [{ cx: 25, cy: 25 }, { cx: 75, cy: 25 }, { cx: 25, cy: 75 }, { cx: 75, cy: 75 }],
    5: [{ cx: 25, cy: 25 }, { cx: 75, cy: 25 }, { cx: 50, cy: 50 }, { cx: 25, cy: 75 }, { cx: 75, cy: 75 }],
    6: [{ cx: 25, cy: 25 }, { cx: 75, cy: 25 }, { cx: 25, cy: 50 }, { cx: 75, cy: 50 }, { cx: 25, cy: 75 }, { cx: 75, cy: 75 }],
  };

  return (
    <div className={`relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 transition-all duration-200 
      ${isRolling ? 'animate-tumble scale-110' : 'hover:-translate-y-2'} 
      rounded-3xl shadow-[0_10px_20px_rgba(0,0,0,0.15)] bg-white`}
    >
      <div className="absolute inset-0 rounded-3xl border-[3px] border-gray-100 shadow-[inset_0_-8px_0_rgba(0,0,0,0.05)] pointer-events-none"></div>
      <svg viewBox="0 0 100 100" className="w-full h-full p-2">
        {dots[value]?.map((dot, i) => (
          <circle key={i} cx={dot.cx} cy={dot.cy} r="9" fill="#1f2937" className="drop-shadow-sm" />
        ))}
      </svg>
    </div>
  );
};

// --- คอมโพเนนต์วงล้อสุ่ม ---
const WheelOfFortune = () => {
  // เปลี่ยนรายชื่อในวงล้อตามที่กำหนด
  const items = [
    'Skip the opposing team’s turn (1 turn)',
    'Control the opposing team’s move (1 turn)',
    'Increase your energy by 20%',
    'Increase your energy by 40%',
    'Reduce energy by 10%'
  ];
  const colors = ['#22c55e', '#eab308', '#ef4444', '#3b82f6', '#f97316'];
  
  const sliceAngle = 360 / items.length;
  const gradientParts = items.map((_, i) => `${colors[i]} ${i * sliceAngle}deg ${(i + 1) * sliceAngle}deg`);
  const wheelBackground = `conic-gradient(${gradientParts.join(', ')})`;

  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWinner(null);

    const randomDegree = Math.floor(Math.random() * 360);
    const newRotation = rotation + 1800 + randomDegree; 

    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const actualAngle = newRotation % 360;
      const pointerAngleOnWheel = (90 - actualAngle + 360) % 360;
      const winnerIndex = Math.floor(pointerAngleOnWheel / sliceAngle);
      setWinner(items[winnerIndex]);
    }, 4000); 
  };

  return (
    <div className="bg-white/80 backdrop-blur-md p-8 sm:p-12 rounded-[2.5rem] shadow-2xl border border-white/50 flex flex-col items-center w-full max-w-2xl mt-4 mb-10 relative">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 mb-10 text-center">
        Wheel of Fortune! 🎡
      </h2>

      <div className="relative w-72 h-72 sm:w-80 sm:h-80 mb-12">
        <div 
          className="w-full h-full rounded-full overflow-hidden shadow-2xl border-[6px] border-white"
          style={{
            background: wheelBackground,
            transform: `rotate(${rotation}deg)`,
            // ปรับเปลี่ยน transition ใหม่ให้หยุดแบบสนิท ไม่มีอาการเด้งกลับตอนจบ
            transition: 'transform 4s cubic-bezier(0.2, 0.8, 0.2, 1)'
          }}
        >
          {items.map((item, i) => {
            const angle = i * sliceAngle + (sliceAngle / 2);
            return (
              <div key={i} className="absolute top-0 left-0 w-full h-full origin-center" style={{ transform: `rotate(${angle - 90}deg)` }}>
                {/* แก้ไข: ใช้ตำแหน่ง left ช่วยดันข้อความให้ห่างจากจุดศูนย์กลาง และใช้ right กำหนดขอบนอก */}
                <div className="absolute left-[62%] right-[6%] sm:left-[64%] sm:right-[8%] top-1/2 -translate-y-1/2 flex items-center justify-center">
                  <span className="font-bold text-[10px] sm:text-[11.5px] text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)] text-center leading-[1.3]">
                    {item}
                  </span>
                </div>
              </div>
            );
          })}
          <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[inset_0_4px_8px_rgba(0,0,0,0.15)] z-10 border-4 border-gray-100"></div>
        </div>

        <div className="absolute top-1/2 -right-4 sm:-right-6 -translate-y-1/2 z-20">
          <div className="w-0 h-0 border-t-[16px] border-t-transparent border-b-[16px] border-b-transparent border-r-[32px] border-r-blue-600 drop-shadow-lg transform hover:scale-110 transition-transform"></div>
        </div>
      </div>

      <button
        onClick={spinWheel}
        disabled={isSpinning}
        className={`px-10 py-4 text-xl font-bold text-white bg-red-500 rounded-2xl transition-all duration-200 shadow-[0_8px_0_#991b1b] hover:bg-red-400 hover:shadow-[0_6px_0_#991b1b] hover:translate-y-[2px] active:shadow-none active:translate-y-[8px] ${isSpinning ? 'opacity-80 cursor-not-allowed shadow-none translate-y-[8px]' : ''}`}
      >
        Spin the Wheel!
      </button>

      {/* Popup แสดงผลผู้ชนะแบบภาพอ้างอิง */}
      {winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1f2937] w-full max-w-lg rounded-lg overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col transform scale-100 animate-in zoom-in-95 duration-300 border border-gray-600">
            <div className="bg-[#3b82f6] text-white font-bold px-6 py-4 text-2xl flex items-center">
              We have a winner!
            </div>
            {/* ปรับขนาดตัวอักษรใน Popup ให้เล็กลงนิดหน่อย เพื่อรองรับข้อความยาว */}
            <div className="p-8 sm:p-16 flex items-center justify-center min-h-[200px]">
              <span className="text-white text-3xl sm:text-4xl font-light tracking-wide text-center">{winner}</span>
            </div>
            <div className="bg-[#1f2937] px-6 py-4 flex justify-end gap-3">
              <button 
                onClick={() => setWinner(null)}
                className="bg-[#3b82f6] hover:bg-blue-600 text-white font-bold text-sm px-5 py-2.5 rounded-md transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- คอมโพเนนต์หลัก (App) ---
export default function DicePage() {
  const [numDice, setNumDice] = useState(1);
  const [diceValues, setDiceValues] = useState([3]);
  const [isRolling, setIsRolling] = useState(false);

  const getRandomValue = () => Math.floor(Math.random() * 6) + 1;

  const rollDice = () => {
    if (isRolling) return;
    setIsRolling(true);
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setDiceValues(Array.from({ length: numDice }, () => getRandomValue()));
      rollCount++;
      if (rollCount > 12) {
        clearInterval(rollInterval);
        setIsRolling(false);
        setDiceValues(Array.from({ length: numDice }, () => getRandomValue()));
      }
    }, 50);
  };

  const handleNumDiceChange = (e) => {
    const newNum = parseInt(e.target.value, 10);
    setNumDice(newNum);
    setDiceValues(Array.from({ length: newNum }, () => getRandomValue()));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-50 to-purple-100 flex flex-col items-center justify-start py-12 px-6 font-sans">
      
      {/* สไตล์สำหรับแอนิเมชันลูกเต๋า */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes tumble {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(15deg) scale(1.1); }
          50% { transform: rotate(-15deg) scale(1.1); }
          75% { transform: rotate(15deg) scale(1.1); }
          100% { transform: rotate(0deg) scale(1); }
        }
        .animate-tumble {
          animation: tumble 0.3s ease-in-out infinite;
        }
      `}} />

      {/* --- ส่วนของลูกเต๋า --- */}
      <div className="bg-white/60 backdrop-blur-md p-8 sm:p-12 rounded-[2.5rem] shadow-2xl border border-white/50 flex flex-col items-center w-full max-w-2xl mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 mb-10 text-center">
          Fun Dice Roller! 🎲
        </h1>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-12 min-h-[160px] items-center">
          {diceValues.map((val, index) => (
            <Dice key={index} value={val} isRolling={isRolling} />
          ))}
        </div>

        <button
          onClick={rollDice}
          disabled={isRolling}
          className={`group relative flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-4 text-xl font-bold text-white bg-cyan-500 rounded-2xl 
            transition-all duration-200 shadow-[0_8px_0_#0e7490] hover:bg-cyan-400 hover:shadow-[0_6px_0_#0e7490] hover:translate-y-[2px] 
            active:shadow-none active:translate-y-[8px] mb-10
            ${isRolling ? 'opacity-80 cursor-not-allowed shadow-none translate-y-[8px]' : ''}`}
        >
          <span>Roll Dice</span>
          <RefreshCw className={`w-6 h-6 ${isRolling ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
        </button>

        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl shadow-sm border border-gray-100">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shadow-inner">
             <svg viewBox="0 0 100 100" className="w-5 h-5">
                <circle cx="25" cy="25" r="12" fill="#ef4444" />
                <circle cx="75" cy="75" r="12" fill="#1f2937" />
             </svg>
          </div>
          <span className="text-gray-500 font-bold text-lg">x</span>
          <select
            value={numDice}
            onChange={handleNumDiceChange}
            disabled={isRolling}
            className="appearance-none bg-gray-50 border-2 border-gray-200 text-gray-700 font-bold text-xl py-1 pl-4 pr-10 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 cursor-pointer transition-colors"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.5rem center',
              backgroundSize: '1.5em 1.5em'
            }}
          >
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
      </div>

      {/* --- ลูกศรเลื่อนลงมาหาวงล้อ --- */}
      <div className="my-6 text-cyan-600 animate-bounce flex flex-col items-center opacity-70">
        <span className="text-sm font-bold mb-2 tracking-widest uppercase">Scroll down to spin the wheel</span>
        <ArrowDown className="w-10 h-10" />
      </div>

      {/* --- ส่วนของวงล้อ --- */}
      <WheelOfFortune />

    </div>
  );
}