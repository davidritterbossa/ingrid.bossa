import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#c89f81',
          DEFAULT: '#a36d46',
          dark: '#7f4f2c',
        },
        champagne: {
          50: '#fdfbf7',
          100: '#f9f5ee',
          200: '#f3ebd9',
          300: '#ebdcb9',
          400: '#dfc794',
          500: '#cda863',
          600: '#b78c4a',
          700: '#946c37',
          800: '#75542f',
          900: '#5e4327',
        },
        rosebronze: {
          50: '#fcf8f6',
          100: '#f8f0ec',
          200: '#f1dfd6',
          300: '#e5c6b6',
          400: '#d5a48d',
          500: '#c58569',
          600: '#b46d4f',
          700: '#96553d',
          800: '#7c4634',
          900: '#643b2d',
        },
        surface: {
          dark: '#141211',
          darker: '#0d0c0b',
          card: '#1c1917',
          light: '#fdfcfb',
        },
        accent: {
          light: '#dfb095',
          DEFAULT: '#b87d5b',
          dark: '#8e5433',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(20, 18, 17, 0.08), 0 0 1px 1px rgba(20, 18, 17, 0.04)',
        'luxury-hover': '0 30px 60px -20px rgba(184, 125, 91, 0.2), 0 0 1px 1px rgba(184, 125, 91, 0.15)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
