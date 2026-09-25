/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0a0f1a',
        surface: '#111827',
        card: '#1a2332',
        gold: {
          DEFAULT: '#D4AF37',
          light: '#FFD700',
          dark: '#B8860B',
        },
        accent: '#D4AF37',
        primary: {
          DEFAULT: '#D4AF37',
          hover: '#C49B30',
        },
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#3b82f6',
        muted: '#6b7280',
        border: '#2a3548',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        gold: '0 0 15px rgba(212,175,55,0.25)',
        'gold-lg': '0 0 30px rgba(212,175,55,0.35)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
      },
      backgroundImage: {
        'gold-gradient':
          'linear-gradient(135deg,#FFD700 0%,#D4AF37 50%,#B8860B 100%)',
        glass:
          'linear-gradient(135deg, rgba(26,35,50,0.7) 0%, rgba(17,24,39,0.5) 100%)',
      },
      borderRadius: {},
    },
  },
  plugins: [],
};
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#0a0f1a",
        surface: "#111827",
        card: "#1a2332",
        gold: {
          DEFAULT: "#D4AF37",
          light: "#FFD700",
          dark: "#B8860B",
        },
        accent: "#D4AF37",
        primary: {
          DEFAULT: "#D4AF37",
          hover: "#C49B30",
        },
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
        info: "#3b82f6",
        muted: "#6b7280",
        border: "#2a3548",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        gold: "0 0 15px rgba(212,175,55,0.25)",
        "gold-lg": "0 0 30px rgba(212,175,55,0.35)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg,#FFD700 0%,#D4AF37 50%,#B8860B 100%)",
        glass:
          "linear-gradient(135deg, rgba(26,35,50,0.7) 0%, rgba(17,24,39,0.5) 100%)",
      },
      borderRadius: {},
    },
  },
  plugins: [],
};
