/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0B1220',      // Deep Navy
          secondary: '#142238',    // Slate Navy
          accent: '#3B82F6',       // Electric Blue
          teal: '#14B8A6',         // Secondary Teal
          bg: '#F5F7FB',           // Light Background
          surface: '#FFFFFF',      // Surface White
          text: '#172033',         // Primary Text
          muted: '#64748B',        // Muted Slate
          success: '#16A34A',      // Success Green
          warning: '#F59E0B',      // Warning Amber
          danger: '#DC2626',       // Danger Red
        },
        navy: {
          950: '#070C16',
          900: '#0B1220',
          850: '#0F1A2E',
          800: '#142238',
          700: '#1E3252',
          600: '#2A436D',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'premium': '0 4px 20px -2px rgba(11, 18, 32, 0.08)',
        'card-hover': '0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)',
        'glow-blue': '0 0 25px -5px rgba(59, 130, 246, 0.3)',
      },
      animation: {
        'scan': 'scan 3s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(100%)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        }
      }
    },
  },
  plugins: [],
}
