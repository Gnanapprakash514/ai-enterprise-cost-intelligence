/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#070a13',         // Dark cosmic space background
          card: 'rgba(13, 20, 38, 0.45)', // Glassmorphic card surface
          cardBorder: 'rgba(255, 255, 255, 0.08)',
          cardBorderHover: 'rgba(6, 182, 212, 0.4)',
          cyan: '#06b6d4',       // Hologram neon cyan
          emerald: '#10b981',    // Health green
          amber: '#f59e0b',      // Warning amber
          rose: '#f43f5e',       // Critical alert red
          violet: '#8b5cf6',     // AI intelligence violet
          blue: '#3b82f6',       // Secondary status blue
          muted: '#64748b',      // Slate text muted
          text: '#e2e8f0',       // Platinum text
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.15)',
        'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.15)',
        'glow-rose': '0 0 20px rgba(244, 63, 94, 0.15)',
        'glow-violet': '0 0 20px rgba(139, 92, 246, 0.15)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'radarScan 6s linear infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { opacity: '0.5', filter: 'drop-shadow(0 0 2px rgba(6, 182, 212, 0.2))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.6))' },
        },
        radarScan: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
