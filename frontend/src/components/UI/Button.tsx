import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
        const baseStyles = "relative inline-flex items-center justify-center font-bold uppercase tracking-wider transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed clip-corner-br";

        const variants = {
            primary: "bg-neon-red/10 border border-neon-red text-neon-red hover:bg-neon-red hover:text-black hover:shadow-[0_0_20px_rgba(255,0,51,0.5)]",
            secondary: "bg-white/5 border border-white/20 text-white hover:bg-white/10 hover:border-white/40",
            danger: "bg-red-900/20 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white",
            ghost: "bg-transparent text-white/70 hover:text-white hover:bg-white/5",
        };

        const sizes = {
            sm: "h-8 px-4 text-xs",
            md: "h-10 px-6 text-sm",
            lg: "h-12 px-8 text-base",
        };

        return (
            <button
                ref={ref}
                className={twMerge(baseStyles, variants[variant], sizes[size], className)}
                {...props}
            >
                {isLoading ? (
                    <span className="animate-pulse">LOADING...</span>
                ) : (
                    <>
                        {children}
                        {/* Decorative corner accent */}
                        {variant === 'primary' && (
                            <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neon-red" />
                        )}
                    </>
                )}
            </button>
        );
    }
);

Button.displayName = "Button";
