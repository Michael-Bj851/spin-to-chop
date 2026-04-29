/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Utensils, RefreshCw, X, Award, Flame, Pizza, Soup } from 'lucide-react';

const FOOD_SPOTS = [
  { name: 'Jaja', color: '#FF6B6B', icon: <Pizza className="w-5 h-5" /> },
  { name: 'New Hall Amala', color: '#4ECDC4', icon: <Soup className="w-5 h-5" /> },
  { name: 'Korede Spaghetti', color: '#FFE66D', icon: <Flame className="w-5 h-5" /> },
  { name: 'Faculty of Arts', color: '#1A535C', icon: <Utensils className="w-5 h-5" /> },
  { name: 'Cook Indomie', color: '#F7FFF7', icon: <Flame className="w-5 h-5" /> },
];

export default function App() {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [winner, setWinner] = useState<typeof FOOD_SPOTS[0] | null>(null);
  
  const spinSoundRef = useRef<HTMLAudioElement | null>(null);

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setShowResult(false);

    // Calculate a random rotation (at least 5 full spins + extra random)
    const extraDegrees = Math.floor(Math.random() * 360);
    const totalSpins = (5 + Math.floor(Math.random() * 5)) * 360;
    const newRotation = rotation + totalSpins + extraDegrees;
    
    setRotation(newRotation);

    // Determine winner based on the final normalized orientation
    // The pointer is at the top (0 degrees). 
    // Rotation moves the wheel clockwise.
    // Normalized degree (0-359) relative to the top.
    const normalizedDegrees = (newRotation % 360);
    // Because the wheel rotates clockwise, the slice at the top is the one that was 
    // at 'normalizedDegrees' counter-clockwise from the start.
    // Or simpler: (360 - normalizedDegrees) % 360 gives the degree on the wheel currently at the top.
    const winningDegree = (360 - normalizedDegrees) % 360;
    const sliceWidth = 360 / FOOD_SPOTS.length;
    const winningIndex = Math.floor(winningDegree / sliceWidth);
    
    setTimeout(() => {
      setIsSpinning(false);
      setWinner(FOOD_SPOTS[winningIndex]);
      setShowResult(true);
    }, 4500); // Wait for animation to finish
  };

  const resetGame = () => {
    setShowResult(false);
    setRotation(0);
    setWinner(null);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center p-4 font-sans text-[#2d3436]">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        <div className="absolute top-20 left-10 transform -rotate-12">
          <Utensils size={120} />
        </div>
        <div className="absolute bottom-20 right-10 transform rotate-45">
          <Soup size={150} />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[40px] shadow-2xl p-8 relative z-10 overflow-hidden border border-gray-100"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black tracking-tight text-[#1a1a1a] mb-2 uppercase italic flex items-center justify-center gap-2">
            <span className="text-[#FF6B6B]">UNILAG</span>
            <span>Foodie</span>
          </h1>
          <p className="text-gray-500 font-medium uppercase text-xs tracking-widest px-4 py-1 bg-gray-100 rounded-full inline-block">
            Fortune Favors the Hungry
          </p>
        </div>

        <div className="relative aspect-square flex items-center justify-center mb-10">
          {/* The Pointer */}
          <div className="absolute -top-4 z-20">
            <div className="w-8 h-8 bg-[#1a1a1a] shadow-lg transform rotate-45 rounded-sm flex items-center justify-center">
               <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[20px] border-t-[#1a1a1a] absolute top-4"></div>
          </div>

          {/* The Wheel */}
          <motion.div
            animate={{ rotate: rotation }}
            transition={{ duration: 4, ease: [0.15, 0, 0.15, 1] }} 
            className="w-full h-full rounded-full border-[10px] border-[#1a1a1a] relative shadow-inner overflow-hidden flex items-center justify-center bg-[#1a1a1a]"
          >
            {FOOD_SPOTS.map((spot, i) => {
               const angle = 360 / FOOD_SPOTS.length;
               const rotate = i * angle;
               return (
                 <div
                   key={i}
                   className="absolute w-1/2 h-1/2 origin-bottom-right"
                   style={{
                     transform: `rotate(${rotate}deg)`,
                     backgroundColor: spot.color,
                     clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
                     right: '50%',
                     bottom: '50%',
                   }}
                 >
                   <div 
                     className="absolute top-12 left-12 transform -rotate-45 text-center flex flex-col items-center justify-center"
                     style={{ color: i === 4 ? '#1a1a1a' : (i === 2 ? '#1a1a1a' : 'white') }}
                   >
                     <div className="mb-1">{spot.icon}</div>
                     <span className="text-[10px] sm:text-xs font-bold leading-tight max-w-[60px] uppercase tracking-tighter">
                       {spot.name}
                     </span>
                   </div>
                 </div>
               );
            })}
            
            {/* Center Cap */}
            <div className="absolute inset-0 m-auto w-12 h-12 bg-[#1a1a1a] rounded-full z-10 flex items-center justify-center shadow-lg border-4 border-white/20">
               <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={spinWheel}
            disabled={isSpinning}
            id="spin-button"
            className={`w-full py-5 rounded-2xl font-black text-xl uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
              isSpinning 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-[#FF6B6B] text-white hover:bg-[#ff5252] cursor-pointer'
            }`}
          >
            {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
          </button>
          
          <button 
            onClick={resetGame}
            className="flex items-center justify-center gap-2 text-gray-400 hover:text-gray-600 font-bold uppercase text-[10px] tracking-widest transition-colors py-2"
          >
            <RefreshCw size={14} />
            Reset Selection
          </button>
        </div>
      </motion.div>

      {/* Result Modal */}
      <AnimatePresence>
        {showResult && winner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl relative border-4"
              style={{ borderColor: winner.color }}
            >
              <button 
                onClick={() => setShowResult(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
              >
                <X size={24} />
              </button>

              <div className="text-center mt-4">
                <div 
                  className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: winner.color }}
                >
                   {winner.icon && <div className="text-white scale-[2]">{winner.icon}</div>}
                </div>
                
                <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-2">
                  Today's Choice
                </p>
                <h2 className="text-3xl font-black text-[#1a1a1a] mb-6 uppercase tracking-tight italic">
                  {winner.name}
                </h2>
                
                <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100 italic">
                  <p className="text-gray-600 text-sm">
                    "A legendary choice for a legendary student. Enjoy your meal!"
                  </p>
                </div>

                <button
                  onClick={() => setShowResult(false)}
                  className="w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-md hover:shadow-lg active:scale-95 text-white"
                  style={{ backgroundColor: winner.color }}
                >
                  Perfect!
                </button>
              </div>

              {/* Confetti effect decoration */}
              <div className="absolute -top-12 -left-12 pointer-events-none opacity-20">
                <Award size={100} className="text-[#FF6B6B]" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <p className="mt-8 text-[10px] uppercase font-bold tracking-[0.3em] text-gray-400 opacity-50">
        Created for the UNILAG Foodies
      </p>
    </div>
  );
}
