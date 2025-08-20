/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // MilestoneBee Custom Palette
        sage: {
          50: '#F0F4F0',
          100: '#E1E9E1',
          200: '#C4D4C4',
          300: '#A6BFA6',
          400: '#89AA89',
          500: '#6B956B',
          600: '#568056',
          700: '#416B41',
          800: '#2C562C',
          900: '#174117',
        },
        honey: {
          50: '#FFFEF5',
          100: '#FEF9E0',
          200: '#FDF4CC',
          300: '#FCEEB8',
          400: '#FBE9A4',
          500: '#FAE390',
          600: '#F9DD7C',
          700: '#F8D768',
          800: '#F7D154',
          900: '#F6CB40',
        },
        peach: {
          50: '#FFF5F2',
          100: '#FFE9E2',
          200: '#FFDDD2',
          300: '#FFD1C2',
          400: '#FFC5B2',
          500: '#FFB9A2',
          600: '#FFAD92',
          700: '#FFA182',
          800: '#FF9572',
          900: '#FF8962',
        },
        mint: {
          50: '#F0FAF5',
          100: '#E0F5EB',
          200: '#D1F0E1',
          300: '#C2EBD7',
          400: '#B3E6CD',
          500: '#A4E1C3',
          600: '#95DCB9',
          700: '#86D7AF',
          800: '#77D2A5',
          900: '#68CD9B',
        },
        // Shadcn/UI Default Colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
        '7xl': '4.5rem',
        '8xl': '6rem',
        '9xl': '8rem',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(230, 230, 250, 0.1), 0 2px 4px -1px rgba(230, 230, 250, 0.06)',
        'medium': '0 10px 15px -3px rgba(230, 230, 250, 0.1), 0 4px 6px -2px rgba(230, 230, 250, 0.05)',
        'large': '0 20px 25px -5px rgba(230, 230, 250, 0.1), 0 10px 10px -5px rgba(230, 230, 250, 0.04)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.1)' },
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-25%)',
            'animation-timing-function': 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            'animation-timing-function': 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'bounce': 'bounce 1s infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #F0F4F0 0%, #D1F0E1 30%, #FEF9E0 60%, #FFE9E2 100%)',
        'card-gradient': 'linear-gradient(135deg, #FFFEF5 0%, #F0F4F0 100%)',
        'button-gradient': 'linear-gradient(135deg, #C4D4C4 0%, #FBE9A4 100%)',
        'section-gradient': 'linear-gradient(to bottom, #F0FAF5 0%, #FEF9E0 100%)',
        'bee-glow': 'radial-gradient(circle, #FAE390 0%, transparent 70%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}