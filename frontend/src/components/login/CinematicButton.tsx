import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CinematicButtonProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode;
    isLoading?: boolean;
}

export const CinematicButton: React.FC<CinematicButtonProps> = ({ children, isLoading, className, ...props }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative w-full py-4 bg-neon-crimson/10 border border-neon-crimson/50 text-neon-crimson font-tech tracking-widest uppercase overflow-hidden group hover:bg-neon-crimson hover:text-white transition-all duration-300 ${className}`}
            {...props}
        >
            {/* Scanline Overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0wIDBoNHYxSDB6IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')] opacity-30 pointer-events-none" />

            {/* Glow Effect */}
            <div className="absolute inset-0 bg-neon-crimson/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                    <span className="animate-pulse">INITIALIZING...</span>
                ) : (
                    children
                )}
            </span>

            {/* Corner Brackets */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-neon-crimson opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-neon-crimson opacity-50 group-hover:opacity-100 transition-opacity" />
        </motion.button>
    );
};
