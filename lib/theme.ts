// Little Star Theme Configuration
export const littleStarTheme = {
  colors: {
    // Pale pastel primary colors
    lavender: {
      50: '#F8F6FF',
      100: '#F1ECFF',
      200: '#E6E6FA', // Main lavender
      300: '#D8BFD8',
      400: '#DDA0DD',
      500: '#DA70D6',
      600: '#BA55D3',
      700: '#9932CC',
      800: '#8B008B',
      900: '#4B0082',
    },
    mint: {
      50: '#F0FDF9',
      100: '#CCFBEF',
      200: '#99F6E0',
      300: '#5EEAD4', // Main mint
      400: '#2DD4BF',
      500: '#14B8A6',
      600: '#0D9488',
      700: '#0F766E',
      800: '#115E59',
      900: '#134E4A',
    },
    cream: {
      50: '#FFFEF7',
      100: '#FFFBEB',
      200: '#FEF3C7',
      300: '#FDE68A', // Main cream
      400: '#FACC15',
      500: '#EAB308',
      600: '#CA8A04',
      700: '#A16207',
      800: '#854D0E',
      900: '#713F12',
    },
    pink: {
      50: '#FDF2F8',
      100: '#FCE7F3',
      200: '#FBCFE8',
      300: '#F9A8D4', // Main pink
      400: '#F472B6',
      500: '#EC4899',
      600: '#DB2777',
      700: '#BE185D',
      800: '#9D174D',
      900: '#831843',
    },
    // Neutral colors with warm tones
    neutral: {
      50: '#FAFAF9',
      100: '#F5F5F4',
      200: '#E7E5E4',
      300: '#D6D3D1',
      400: '#A8A29E',
      500: '#78716C',
      600: '#57534E',
      700: '#44403C',
      800: '#292524',
      900: '#1C1917',
    },
  },
  gradients: {
    hero: 'bg-gradient-to-br from-lavender-100 via-mint-100 to-pink-100',
    card: 'bg-gradient-to-r from-cream-50 to-lavender-50',
    button: 'bg-gradient-to-r from-lavender-300 to-pink-300',
    section: 'bg-gradient-to-b from-mint-50 to-cream-50',
  },
  shadows: {
    soft: '0 4px 6px -1px rgba(230, 230, 250, 0.1), 0 2px 4px -1px rgba(230, 230, 250, 0.06)',
    medium: '0 10px 15px -3px rgba(230, 230, 250, 0.1), 0 4px 6px -2px rgba(230, 230, 250, 0.05)',
    large: '0 20px 25px -5px rgba(230, 230, 250, 0.1), 0 10px 10px -5px rgba(230, 230, 250, 0.04)',
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
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
    },
  },
};

// Tailwind CSS custom configuration
export const tailwindConfig = {
  theme: {
    extend: {
      colors: {
        lavender: littleStarTheme.colors.lavender,
        mint: littleStarTheme.colors.mint,
        cream: littleStarTheme.colors.cream,
        pink: littleStarTheme.colors.pink,
        neutral: littleStarTheme.colors.neutral,
      },
      fontFamily: littleStarTheme.typography.fontFamily,
      fontSize: littleStarTheme.typography.fontSize,
      boxShadow: {
        'soft': littleStarTheme.shadows.soft,
        'medium': littleStarTheme.shadows.medium,
        'large': littleStarTheme.shadows.large,
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.1)' },
        },
      },
    },
  },
};

// CSS Variables for runtime theme switching
export const cssVariables = `
:root {
  /* Little Star Color Palette */
  --color-lavender-50: 248 246 255;
  --color-lavender-100: 241 236 255;
  --color-lavender-200: 230 230 250;
  --color-lavender-300: 216 191 216;
  --color-lavender-400: 221 160 221;
  --color-lavender-500: 218 112 214;
  --color-lavender-600: 186 85 211;
  --color-lavender-700: 153 50 204;
  --color-lavender-800: 139 0 139;
  --color-lavender-900: 75 0 130;

  --color-mint-50: 240 253 249;
  --color-mint-100: 204 251 239;
  --color-mint-200: 153 246 224;
  --color-mint-300: 94 234 212;
  --color-mint-400: 45 212 191;
  --color-mint-500: 20 184 166;
  --color-mint-600: 13 148 136;
  --color-mint-700: 15 118 110;
  --color-mint-800: 17 94 89;
  --color-mint-900: 19 78 74;

  --color-cream-50: 255 254 247;
  --color-cream-100: 255 251 235;
  --color-cream-200: 254 243 199;
  --color-cream-300: 253 230 138;
  --color-cream-400: 250 204 21;
  --color-cream-500: 234 179 8;
  --color-cream-600: 202 138 4;
  --color-cream-700: 161 98 7;
  --color-cream-800: 133 77 14;
  --color-cream-900: 113 63 18;

  --color-pink-50: 253 242 248;
  --color-pink-100: 252 231 243;
  --color-pink-200: 251 207 232;
  --color-pink-300: 249 168 212;
  --color-pink-400: 244 114 182;
  --color-pink-500: 236 72 153;
  --color-pink-600: 219 39 119;
  --color-pink-700: 190 24 93;
  --color-pink-800: 157 23 77;
  --color-pink-900: 131 24 67;

  /* Semantic Colors */
  --background: var(--color-lavender-50);
  --foreground: var(--color-neutral-900);
  --card: var(--color-cream-50);
  --card-foreground: var(--color-neutral-800);
  --popover: var(--color-lavender-50);
  --popover-foreground: var(--color-neutral-900);
  --primary: var(--color-lavender-300);
  --primary-foreground: var(--color-neutral-800);
  --secondary: var(--color-mint-200);
  --secondary-foreground: var(--color-neutral-800);
  --muted: var(--color-cream-100);
  --muted-foreground: var(--color-neutral-600);
  --accent: var(--color-pink-200);
  --accent-foreground: var(--color-neutral-800);
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --border: var(--color-lavender-200);
  --input: var(--color-cream-100);
  --ring: var(--color-lavender-300);
  --radius: 0.75rem;
}

.dark {
  --background: var(--color-neutral-900);
  --foreground: var(--color-neutral-50);
  --card: var(--color-neutral-800);
  --card-foreground: var(--color-neutral-50);
  --popover: var(--color-neutral-800);
  --popover-foreground: var(--color-neutral-50);
  --primary: var(--color-lavender-400);
  --primary-foreground: var(--color-neutral-900);
  --secondary: var(--color-mint-400);
  --secondary-foreground: var(--color-neutral-900);
  --muted: var(--color-neutral-700);
  --muted-foreground: var(--color-neutral-400);
  --accent: var(--color-pink-400);
  --accent-foreground: var(--color-neutral-900);
  --border: var(--color-neutral-700);
  --input: var(--color-neutral-700);
  --ring: var(--color-lavender-400);
}
`;

export default littleStarTheme;