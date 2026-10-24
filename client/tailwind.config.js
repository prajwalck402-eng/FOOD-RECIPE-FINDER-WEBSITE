/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFCF7',
          100: '#FAF7EE',
          200: '#F5EEDC',
          300: '#EFE3C3',
          400: '#E4D2A3',
        },
        terracotta: {
          50: '#FDF6F2',
          100: '#FCEBE3',
          200: '#F8D4C3',
          300: '#F2B397',
          400: '#EA8662',
          500: '#E25C34',
          600: '#D1431B',
          700: '#AE3314',
          800: '#8B2C16',
          900: '#722818',
        },
        amber: {
          50: '#FFFDF5',
          100: '#FEF9E7',
          200: '#FDF0C3',
          300: '#FCE496',
          400: '#F9D154',
          500: '#F5B718',
          600: '#D9930D',
          700: '#B06B0B',
          800: '#8E5110',
          900: '#764311',
        },
        sage: {
          50: '#F4F7F4',
          100: '#E6ECE5',
          200: '#CFDACD',
          300: '#ADC0AA',
          400: '#859F81',
          500: '#5F805B',
          600: '#4A6746',
          700: '#3D533A',
          800: '#344432',
          900: '#2C3A2A',
        },
        saffron: {
          50: '#FFF9EB',
          100: '#FFF1C6',
          200: '#FFE288',
          300: '#FFCE4B',
          400: '#FFBB1C',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        warmgray: {
          50: '#FAF8F5',
          100: '#F3EFEA',
          200: '#E7E0D8',
          300: '#D4C9BC',
          400: '#B8A896',
          500: '#9B8974',
          600: '#7C6C5A',
          700: '#635647',
          800: '#4E4439',
          900: '#2A241E',
          950: '#1B1713',
        }
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'warm-sm': '0 2px 8px -2px rgba(114, 40, 24, 0.06), 0 1px 4px -1px rgba(114, 40, 24, 0.04)',
        'warm-md': '0 8px 24px -4px rgba(114, 40, 24, 0.08), 0 4px 12px -2px rgba(114, 40, 24, 0.05)',
        'warm-lg': '0 16px 36px -6px rgba(114, 40, 24, 0.12), 0 8px 20px -4px rgba(114, 40, 24, 0.08)',
        'warm-xl': '0 24px 48px -12px rgba(114, 40, 24, 0.18), 0 12px 28px -6px rgba(114, 40, 24, 0.10)',
        'glow-amber': '0 0 25px rgba(245, 183, 24, 0.35)',
        'glow-terracotta': '0 0 25px rgba(226, 92, 52, 0.35)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(2deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
