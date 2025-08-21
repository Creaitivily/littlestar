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
        // New MilestoneBee Color Palette from Image
        cream: {
          50: '#FDFCF8',
          100: '#FAF8F0',
          200: '#F7F5E8',
          300: '#F4F1DE', // Base from image
          400: '#EDE7D3',
          500: '#E5DCC8',
          600: '#D4C5A7',
          700: '#B8A583',
          800: '#8E7F64',
          900: '#5C5242',
        },
        coral: {
          50: '#FDF5F3',
          100: '#FAEAE7',
          200: '#F5D5CF',
          300: '#EFBFB6',
          400: '#E59D8A',
          500: '#E07A5F', // Base from image
          600: '#D55C3B',
          700: '#B64A2E',
          800: '#8F3A24',
          900: '#5E261A',
        },
        navy: {
          50: '#F4F4F6',
          100: '#E6E7EC',
          200: '#CDCFD9',
          300: '#A8ABBD',
          400: '#7B7E96',
          500: '#3D405B', // Base from image
          600: '#313349',
          700: '#272839',
          800: '#1D1E2C',
          900: '#13141D',
        },
        sage: {
          50: '#F0F5F3',
          100: '#E2EBE7',
          200: '#C5D7CF',
          300: '#A8C3B7',
          400: '#81B29A', // Base from image
          500: '#6B9D85',
          600: '#568870',
          700: '#44705A',
          800: '#345544',
          900: '#243A2F',
        },
        peach: {
          50: '#FDFAF5',
          100: '#FAF3E8',
          200: '#F8E9D7',
          300: '#F5DFC3',
          400: '#F2CC8F', // Base from image
          500: '#EFBA6B',
          600: '#E8A34B',
          700: '#D68B2F',
          800: '#B06F23',
          900: '#7A4D18',
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
        'hero-gradient': 'linear-gradient(135deg, #F4F1DE 0%, #81B29A 30%, #F2CC8F 60%, #E07A5F 100%)',
        'card-gradient': 'linear-gradient(135deg, #F4F1DE 0%, #FAF8F0 100%)',
        'button-gradient': 'linear-gradient(135deg, #E07A5F 0%, #F2CC8F 100%)',
        'section-gradient': 'linear-gradient(to bottom, #F4F1DE 0%, #F2CC8F 100%)',
        'bee-glow': 'radial-gradient(circle, #F2CC8F 0%, transparent 70%)',
        'nav-gradient': 'linear-gradient(135deg, #3D405B 0%, #313349 100%)',
        'sage-gradient': 'linear-gradient(135deg, #81B29A 0%, #6B9D85 100%)',
        'warm-gradient': 'linear-gradient(135deg, #E07A5F 0%, #F2CC8F 100%)',
        'cool-gradient': 'linear-gradient(135deg, #81B29A 0%, #3D405B 100%)',
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