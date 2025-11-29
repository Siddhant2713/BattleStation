import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full space-y-1">
                {label && (
                    <label className="text-xs font-mono text-white/60 uppercase tracking-widest">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    <input
                        ref={ref}
                        className={twMerge(
                            "w-full bg-black/50 border-b-2 border-white/10 px-4 py-2 text-white placeholder-white/20 focus:outline-none focus:border-neon-red focus:bg-white/5 transition-all duration-300 font-mono",
                            error && "border-red-500",
                            className
                        )}
                        {...props}
                    />
                    {/* Animated underline effect */}
                    <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-neon-red transition-all duration-300 group-focus-within:w-full" />
                </div>
                {error && (
                    <p className="text-xs text-red-500 font-mono">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";
