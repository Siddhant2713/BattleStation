import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CyberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export const CyberInput: React.FC<CyberInputProps> = ({ label, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="relative group">
            <label className={`absolute left-0 -top-6 text-xs font-mono transition-colors duration-300 ${isFocused ? 'text-neon-crimson' : 'text-gray-500'}`}>
                {label}
            </label>

            <div className="relative">
                <input
                    {...props}
                    onFocus={(e) => { setIsFocused(true); props.onFocus?.(e); }}
                    onBlur={(e) => { setIsFocused(false); props.onBlur?.(e); }}
                    className="w-full bg-obsidian-dark/50 border-b-2 border-white/10 text-white font-mono py-3 px-4 focus:outline-none focus:border-neon-crimson transition-all duration-300 placeholder-gray-700"
                />

                {/* Animated Bottom Glow */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isFocused ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-neon-crimson shadow-[0_0_10px_#FF003C]"
                />

                {/* Corner Accents */}
                <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r transition-colors duration-300 ${isFocused ? 'border-neon-crimson' : 'border-white/10'}`} />
                <div className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l transition-colors duration-300 ${isFocused ? 'border-neon-crimson' : 'border-white/10'}`} />
            </div>
        </div>
    );
};
