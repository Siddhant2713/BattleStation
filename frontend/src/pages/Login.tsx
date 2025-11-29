import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
import { LoginScene } from '../components/3d/LoginScene';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { login, signup } from '../services/auth';
import { useUserStore } from '../store/useUserStore';

export const Login = () => {
    const navigate = useNavigate();
    const setUser = useUserStore((state) => state.login);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 5 });
        if (titleRef.current) {
            // Glitch Effect
            tl.to(titleRef.current, { skewX: 20, duration: 0.05, ease: "power4.inOut" })
                .to(titleRef.current, { skewX: -20, duration: 0.05, ease: "power4.inOut" })
                .to(titleRef.current, { skewX: 0, duration: 0.05, ease: "power4.inOut" })
                .to(titleRef.current, { opacity: 0.8, duration: 0.05, yoyo: true, repeat: 3 }, "-=0.2")
                .to(titleRef.current, { textShadow: "2px 2px 0px #FF0033, -2px -2px 0px #00FFFF", duration: 0.1 })
                .to(titleRef.current, { textShadow: "0 0 20px rgba(255,0,51,0.5)", duration: 0.1 });
        }
        return () => { tl.kill(); };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            let data;
            if (isLogin) {
                data = await login(username, password);
            } else {
                data = await signup(username, password);
            }

            // Mock token if not provided by backend yet
            setUser(data.user, data.token || 'mock-token');

            // Cinematic Transition
            setSuccess(true);
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);

        } catch (err) {
            setError('Authentication failed. Check credentials.');
            setIsLoading(false);
        }
    };

    return (
        <div className="relative w-full h-screen bg-black overflow-hidden">
            {/* Red Wipe Transition */}
            <AnimatePresence>
                {success && (
                    <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        exit={{ scaleY: 0 }}
                        transition={{ duration: 0.8, ease: "circIn" }}
                        className="absolute inset-0 z-50 bg-neon-red origin-bottom"
                    />
                )}
            </AnimatePresence>

            <div className="absolute inset-0 z-0">
                <Canvas>
                    <LoginScene />
                </Canvas>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center h-full pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="w-full max-w-md p-8 pointer-events-auto"
                >
                    <div className="mb-12 text-center">
                        <h1
                            ref={titleRef}
                            className="text-6xl font-black text-white tracking-tighter mb-2 brand-font select-none relative"
                            style={{ textShadow: '0 0 20px rgba(255,0,51,0.5)' }}
                        >
                            BATTLE<span className="text-neon-red">STATION</span>
                        </h1>
                        <p className="text-white/50 font-mono tracking-[0.5em] text-sm">
                            SYSTEM INITIALIZATION
                        </p>
                    </div>

                    <div className="glass-panel p-8 rounded-lg clip-corner-tl relative overflow-hidden border border-white/10 bg-black/40 backdrop-blur-md">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-red to-transparent opacity-50" />

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                label="Operator ID"
                                placeholder="ENTER USERNAME"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <Input
                                label="Access Key"
                                type="password"
                                placeholder="••••••••"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            {error && (
                                <div className="text-red-500 text-xs font-mono border border-red-500/20 bg-red-500/10 p-2">
                                    ERROR: {error}
                                </div>
                            )}

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    className="w-full relative overflow-hidden group"
                                    size="lg"
                                    isLoading={isLoading}
                                >
                                    <span className="relative z-10">{isLogin ? 'INITIALIZE SYSTEM' : 'CREATE PROFILE'}</span>
                                    <div className="absolute inset-0 bg-neon-red/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                </Button>
                            </div>
                        </form>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-xs text-white/30 font-mono hover:text-white transition-colors"
                            >
                                {isLogin ? 'NEW OPERATIVE? REGISTER' : 'ALREADY REGISTERED? LOGIN'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
