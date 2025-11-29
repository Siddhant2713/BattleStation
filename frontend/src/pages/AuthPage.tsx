import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AppStage } from '../types';
import { useBuilder } from '../store/BuilderContext';
import { login, signup } from '../services/auth';
import { Crosshair, Lock, User, ArrowRight } from 'lucide-react';

export const AuthPage = () => {
    const { setStage } = useBuilder();
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                await login(username, password);
            } else {
                await signup(username, password);
            }
            setStage(AppStage.BUILDING);
        } catch (err) {
            setError('Authentication failed. Check credentials.');
        }
    };

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-auto">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative z-10 w-full max-w-md p-1"
            >
                {/* Decorative Border */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff0033] to-transparent opacity-50 clip-corner-br" />

                <div className="relative bg-black border border-white/10 p-8 clip-corner-br">
                    <div className="flex items-center gap-3 mb-8">
                        <Crosshair className="text-[#ff0033]" size={32} />
                        <h2 className="text-3xl font-black brand-font italic text-white">
                            {isLogin ? 'SYSTEM_LOGIN' : 'NEW_OPERATIVE'}
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-gray-500 tracking-widest">CODENAME</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 p-3 pl-10 text-white focus:border-[#ff0033] focus:outline-none transition-colors font-mono"
                                    placeholder="ENTER_ID"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono text-gray-500 tracking-widest">ACCESS_KEY</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 p-3 pl-10 text-white focus:border-[#ff0033] focus:outline-none transition-colors font-mono"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-[#ff0033] text-xs font-mono border border-[#ff0033]/20 bg-[#ff0033]/10 p-2">
                                ERROR: {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-[#ff0033] text-white font-bold py-4 clip-corner-br hover:bg-[#ff1a1a] transition-colors flex items-center justify-center gap-2 group"
                        >
                            <span className="tracking-widest">{isLogin ? 'AUTHENTICATE' : 'INITIALIZE'}</span>
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-xs text-gray-500 hover:text-white font-mono tracking-wider transition-colors"
                        >
                            {isLogin ? 'REQUEST_NEW_ACCESS' : 'ALREADY_OPERATIVE?'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
