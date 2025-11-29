import React, { useState } from 'react';
import { useBuilder } from '../../store/BuilderContext';
import { GAMES } from '../../constants';
import { analyzeBuildPerformance } from '../../services/geminiService';
import { SimulationResult, GameData, PCPart } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertTriangle, Cpu, BarChart3, Lock, Crosshair } from 'lucide-react';

const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;

export const SimulationPanel = () => {
  const { build } = useBuilder();
  const [selectedGame, setSelectedGame] = useState<GameData | null>(null);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runSimulation = async (game: GameData) => {
    setSelectedGame(game);
    setLoading(true);
    setResult(null);

    const parts = (Object.values(build.parts) as (PCPart | undefined)[]).filter((p): p is PCPart => p !== undefined);
    const data = await analyzeBuildPerformance(parts, game);
    
    setLoading(false);
    setResult(data);
  };

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-8 pointer-events-none">
      
      <MotionDiv 
         initial={{ scale: 0.9, opacity: 0 }}
         animate={{ scale: 1, opacity: 1 }}
         className="w-full max-w-7xl h-[80vh] flex gap-8 pointer-events-auto"
      >
        
        {/* TARGET SELECTOR */}
        <div className="w-80 flex flex-col gap-4">
          <div className="glass-panel p-6 clip-corner-tl h-full border-t-2 border-t-[#ff0033]">
            <h3 className="brand-font text-white text-xl mb-6 flex items-center gap-2">
              <Crosshair className="text-[#ff0033]" /> TARGET
            </h3>
            
            <div className="space-y-4">
              {GAMES.map(game => (
                <MotionButton
                  key={game.id}
                  onClick={() => runSimulation(game)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full relative h-24 overflow-hidden border transition-all ${
                    selectedGame?.id === game.id 
                      ? 'border-[#ff0033] shadow-[0_0_20px_rgba(255,0,51,0.4)]' 
                      : 'border-white/10 opacity-60 hover:opacity-100 hover:border-[#ff0033]'
                  }`}
                >
                  <img src={game.image} alt={game.title} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent flex items-center pl-4">
                    <span className="font-bold brand-font text-white uppercase text-lg italic">{game.title}</span>
                  </div>
                  {selectedGame?.id === game.id && (
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#ff0033]" />
                  )}
                </MotionButton>
              ))}
            </div>
          </div>
        </div>

        {/* ANALYSIS HUD */}
        <div className="flex-1 glass-panel clip-corner-br relative flex flex-col overflow-hidden border-b-2 border-b-[#ff0033]">
          
          <div className="h-14 border-b border-white/10 flex items-center justify-between px-8 bg-black/40">
             <div className="flex items-center gap-3">
               <BarChart3 className="text-[#ff0033]" size={20} />
               <span className="font-mono text-[#ff0033] tracking-[0.2em] text-sm animate-pulse">ANALYSIS_PROTOCOL_ENGAGED</span>
             </div>
          </div>

          <div className="flex-1 p-10 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
             <AnimatePresence mode="wait">
               {!selectedGame ? (
                 <motion.div 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                   className="h-full flex flex-col items-center justify-center text-gray-600"
                 >
                   <div className="p-8 border border-dashed border-gray-800 rounded-full mb-6">
                     <Lock size={48} />
                   </div>
                   <p className="font-mono tracking-widest text-sm uppercase">Select target to initiate scan</p>
                 </motion.div>
               ) : loading ? (
                 <motion.div 
                   key="loading"
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                   className="h-full flex flex-col items-center justify-center"
                 >
                    <div className="text-4xl font-black brand-font text-white mb-4 animate-bounce">CALCULATING</div>
                    <div className="w-64 h-1 bg-gray-900 rounded-full overflow-hidden">
                       <motion.div 
                         animate={{ x: [-256, 256] }} 
                         transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                         className="w-full h-full bg-[#ff0033]" 
                       />
                    </div>
                 </motion.div>
               ) : result ? (
                 <motion.div 
                   key="result"
                   initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                   className="grid grid-cols-2 gap-8"
                 >
                    {/* FPS Big Number */}
                    <div className="col-span-1 bg-black/60 border border-[#ff0033]/30 p-8 clip-corner-tl relative group overflow-hidden">
                       <div className="absolute top-0 right-0 w-20 h-20 bg-[#ff0033]/20 blur-3xl rounded-full group-hover:bg-[#ff0033]/40 transition-all"></div>
                       <div className="text-gray-500 text-xs font-mono mb-2 uppercase tracking-widest">Projected Frame Rate</div>
                       <div className="text-8xl font-black text-white brand-font neon-text italic">
                         {result.fps}<span className="text-3xl text-[#ff0033] ml-2">FPS</span>
                       </div>
                    </div>
                       
                    {/* Verdict */}
                    <div className="col-span-1 bg-black/60 border border-white/10 p-8 flex flex-col justify-center">
                       <div className="text-gray-500 text-xs font-mono mb-2 uppercase tracking-widest">Performance Tier</div>
                       <div className={`text-5xl font-black brand-font uppercase italic ${result.fps > 100 ? 'text-[#ff0033]' : 'text-white'}`}>
                         {result.verdict}
                       </div>
                    </div>

                    {/* Analytics */}
                    <div className="col-span-2 grid grid-cols-2 gap-6">
                        <div className="bg-red-950/20 border-l-4 border-red-600 p-6">
                           <div className="flex items-center gap-3 mb-2">
                             <AlertTriangle className="text-red-500" size={20} />
                             <h4 className="font-bold text-red-400 brand-font">BOTTLENECK DETECTOR</h4>
                           </div>
                           <p className="text-sm text-gray-400 font-mono leading-relaxed">{result.bottleneck || "SYSTEM OPTIMAL. NO DRAG DETECTED."}</p>
                        </div>

                        <div className="bg-blue-950/20 border-l-4 border-blue-600 p-6">
                           <div className="flex items-center gap-3 mb-2">
                             <Cpu className="text-blue-400" size={20} />
                             <h4 className="font-bold text-blue-400 brand-font">AI UPGRADE PATH</h4>
                           </div>
                           <p className="text-sm text-gray-400 font-mono leading-relaxed">{result.recommendation}</p>
                        </div>
                    </div>

                 </motion.div>
               ) : null}
             </AnimatePresence>
          </div>
        </div>
      </MotionDiv>
    </div>
  );
};