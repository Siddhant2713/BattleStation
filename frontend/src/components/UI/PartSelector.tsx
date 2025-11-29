import React from 'react';
import { useBuilder } from '../../store/BuilderContext';
import { PART_CATALOG } from '../../constants';
import { PartType, PCPart } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, HardDrive, Box, Zap, Monitor, Fan, Grid, Check, Crosshair } from 'lucide-react';

const icons: Record<string, React.ReactNode> = {
  [PartType.CPU]: <Cpu size={18} />,
  [PartType.GPU]: <Monitor size={18} />,
  [PartType.CASE]: <Box size={18} />,
  [PartType.RAM]: <Grid size={18} />,
  [PartType.STORAGE]: <HardDrive size={18} />,
  [PartType.PSU]: <Zap size={18} />,
  [PartType.FAN]: <Fan size={18} />,
};

// Cast to any for Framer Motion prop issues
const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;

export const PartSelector = () => {
  const { equipPart, build, setDraggingPart } = useBuilder();
  const [activeTab, setActiveTab] = React.useState<PartType>(PartType.CASE);

  const availableParts = PART_CATALOG.filter(p => p.type === activeTab);

  const handleDragStart = (part: PCPart) => {
    setDraggingPart(part);
  };

  const handleDragEnd = (part: PCPart, info: any) => {
    setDraggingPart(null);
    // Simple logic: if dropped far enough to the right (into the canvas area), equip it
    if (info.point.x > 400) {
      equipPart(part);
    }
  };

  return (
    <MotionDiv 
      initial={{ x: -400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80, damping: 15 }}
      className="absolute left-0 top-0 bottom-0 w-[420px] z-20 pointer-events-none flex items-center pl-6"
    >
      <div className="w-full h-[85vh] pointer-events-auto flex flex-col relative group">
        
        {/* Glass Panel Background */}
        <div className="absolute inset-0 glass-panel clip-corner-br -skew-x-2"></div>
        
        {/* Content Container (Un-skewed) */}
        <div className="relative z-10 w-full h-full flex flex-col px-1 py-2 text-white">

          {/* Header */}
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-2 text-[#ff0033] mb-1">
               <Crosshair size={16} className="animate-spin-slow"/>
               <span className="text-[10px] font-mono tracking-[0.3em] text-[#ff0033]/80">ARMORY_ACCESS</span>
            </div>
            <h2 className="text-3xl font-black brand-font italic tracking-tighter text-white">
              LOAD<span className="text-[#ff0033]">OUT</span>
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-1 p-2 bg-black/20">
            {Object.values(PartType).map((type) => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`relative px-3 py-3 flex-grow text-center transition-all group overflow-hidden border border-transparent ${
                  activeTab === type 
                    ? 'bg-[#ff0033]/10 border-[#ff0033]/50 text-[#ff0033]' 
                    : 'text-gray-600 hover:text-gray-300 hover:bg-white/5'
                }`}
              >
                 {/* Selection Corner */}
                 {activeTab === type && <div className="absolute top-0 right-0 w-2 h-2 bg-[#ff0033]" />}
                 
                 <div className="flex justify-center">{icons[type]}</div>
              </button>
            ))}
          </div>

          {/* Parts List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            <AnimatePresence mode='wait'>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {availableParts.map((part) => {
                  const isEquipped = build.parts[part.type]?.id === part.id;
                  return (
                    <MotionDiv
                      key={part.id}
                      drag
                      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                      dragElastic={0.2}
                      dragSnapToOrigin={true}
                      onDragStart={() => handleDragStart(part)}
                      onDragEnd={(_: any, info: any) => handleDragEnd(part, info)}
                      whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 0, 51, 0.1)' }}
                      className={`relative cursor-grab active:cursor-grabbing p-4 border transition-all duration-200 clip-corner-br ${
                        isEquipped 
                          ? 'border-[#ff0033] bg-[#ff0033]/10' 
                          : 'border-white/10 bg-black/40 hover:border-[#ff0033]/50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2 pointer-events-none">
                        <h3 className={`font-bold uppercase tracking-wider text-sm ${isEquipped ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                          {part.name}
                        </h3>
                        {isEquipped && <Check size={16} className="text-[#ff0033]" />}
                      </div>
                      
                      <div className="flex items-center justify-between mt-3 pointer-events-none">
                        <div className="px-2 py-0.5 bg-black/80 border border-white/10 text-[10px] font-mono text-gray-400">
                          {part.specs}
                        </div>
                        <span className="font-mono text-[#ff0033] font-bold text-sm">${part.price}</span>
                      </div>

                      {/* Hover Interaction Hint */}
                      <div className="absolute inset-0 border border-[#ff0033] opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
                    </MotionDiv>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="p-4 border-t border-white/10 bg-black/60 text-center">
            <p className="text-[10px] text-gray-500 font-mono">DRAG COMPONENT TO INSTALL</p>
          </div>

        </div>
      </div>
    </MotionDiv>
  );
};