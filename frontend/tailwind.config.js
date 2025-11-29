/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                obsidian: {
                    DEFAULT: '#0B0C10',
                    light: '#1F2833',
                    dark: '#050608',
                },
                carbon: {
                    DEFAULT: '#1F2833',
                    light: '#C5C6C7',
                    dark: '#0B0C10',
                },
                neon: {
                    crimson: '#FF003C',
                    yellow: '#F7D51D',
                    blue: '#45A29E',
                    DEFAULT: '#FF003C',
                },
                glass: {
                    DEFAULT: 'rgba(11, 12, 16, 0.7)',
                    border: 'rgba(255, 255, 255, 0.1)',
                }
            },
            fontFamily: {
                sans: ['Rajdhani', 'Inter', 'sans-serif'],
                mono: ['Share Tech Mono', 'monospace'],
                tech: ['Voltage', 'Share Tech Mono', 'monospace'], // Fallback if Voltage isn't available
            },
            backgroundImage: {
                'hex-pattern': "url(\"data:image/svg+xml,%3Csvg width='24' height='40' viewBox='0 0 24 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40c5.523 0 10-4.477 10-10V10c0-5.523 4.477-10 10-10H0v40z' fill='%231F2833' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E\")",
                'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E\")",
            }
        },
    },
    plugins: [],
}
