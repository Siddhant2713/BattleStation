import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

export const HolographicLogo = () => {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtextRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 });

        if (titleRef.current) {
            // Glitch Animation Sequence
            tl.to(titleRef.current, { skewX: 10, opacity: 0.8, duration: 0.05, ease: "power4.inOut" })
                .to(titleRef.current, { skewX: -10, x: -2, duration: 0.05, ease: "power4.inOut" })
                .to(titleRef.current, { skewX: 0, x: 0, opacity: 1, duration: 0.05, ease: "power4.inOut" })
                .to(titleRef.current, { textShadow: "4px 0px 0px #FF003C, -4px 0px 0px #00FFFF", duration: 0.1 })
                .to(titleRef.current, { textShadow: "0 0 20px rgba(255,0,60,0.8)", duration: 0.1 });
        }
    }, []);

    return (
        <div className="text-center mb-12 relative z-10">
            <motion.h1
                ref={titleRef}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-7xl font-black text-white tracking-tighter mb-2 brand-font select-none relative"
                style={{
                    textShadow: '0 0 30px rgba(255,0,60,0.6)',
                    fontFamily: 'Orbitron, sans-serif' // Ensure brand font
                }}
            >
                BATTLE<span className="text-neon-crimson">STATION</span>
            </motion.h1>

            <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "100%" }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
                className="h-[1px] bg-gradient-to-r from-transparent via-neon-crimson to-transparent mx-auto mb-2"
            />

            <motion.p
                ref={subtextRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ duration: 1, delay: 1 }}
                className="text-neon-blue font-mono tracking-[0.8em] text-xs uppercase"
            >
                System Initialization
            </motion.p>
        </div>
    );
};
