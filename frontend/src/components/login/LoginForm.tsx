import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/useUserStore';
import { login, signup } from '../../services/auth';
import { CyberInput } from './CyberInput';
import { CinematicButton } from './CinematicButton';

export const LoginForm = () => {
    const navigate = useNavigate();
    const setUser = useUserStore((state) => state.login);
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Simulate API delay for effect
            await new Promise(resolve => setTimeout(resolve, 1500));

            let data;
            if (isLogin) {
                data = await login(username, password);
            } else {
                data = await signup(username, password);
            }

            setUser(data.user, data.token || 'mock-token');
            navigate('/dashboard');
        } catch (err) {
            setError('AUTHENTICATION FAILED. ACCESS DENIED.');
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md relative z-10">
            {/* Glass Panel Container */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="glass-panel p-8 relative overflow-hidden clip-corner-tl"
            >
                {/* Top Gradient Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-crimson to-transparent opacity-50" />

                {/* Hex Pattern Overlay */}
                <div className="absolute inset-0 bg-hex-pattern opacity-5 pointer-events-none" />

                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                    <CyberInput
                        label="OPERATOR ID"
                        placeholder="ENTER ID"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <CyberInput
                        label="ACCESS KEY"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-neon-crimson text-xs font-mono border border-neon-crimson/30 bg-neon-crimson/10 p-3 flex items-center gap-2"
                        >
                            <span className="w-2 h-2 bg-neon-crimson rounded-full animate-pulse" />
                            {error}
                        </motion.div>
                    )}

                    <div className="pt-4">
                        <CinematicButton type="submit" isLoading={isLoading}>
                            {isLogin ? 'INITIALIZE SYSTEM' : 'REGISTER OPERATIVE'}
                        </CinematicButton>
                    </div>
                </form>

                {/* Footer Toggle */}
                <div className="mt-8 text-center relative z-10">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-xs text-carbon-light/50 font-mono hover:text-neon-crimson transition-colors tracking-widest uppercase group"
                    >
                        <span className="group-hover:mr-2 transition-all">
                            {isLogin ? 'Request New Clearance' : 'Return to Login'}
                        </span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
