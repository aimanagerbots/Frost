/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        base: '#000000',
        card: '#0A0A0F',
        'card-hover': '#111118',
        elevated: '#161620',
        border: {
          default: 'rgba(255,255,255,0.1)',
          hover: 'rgba(255,255,255,0.15)',
        },
        accent: {
          primary: '#5BB8E6',
          'primary-hover': '#4AA8D6',
          'primary-light': 'rgba(91,184,230,0.1)',
        },
        category: {
          flower: '#22C55E',
          concentrate: '#F59E0B',
          vape: '#3B82F6',
          preroll: '#F97316',
          edible: '#8B5CF6',
          beverage: '#14B8A6',
        },
        strain: {
          indica: '#8B5CF6',
          sativa: '#F97316',
          hybrid: '#22C55E',
          cbd: '#5BB8E6',
        },
        'text-default': 'rgba(255,255,255,0.9)',
        'text-muted': 'rgba(255,255,255,0.4)',
        'text-bright': '#FFFFFF',
        success: '#00E5A0',
        warning: '#FBBF24',
        danger: '#FB7185',
        info: '#38BDF8',
      },
      fontFamily: {
        display: ['Sora'],
        sans: ['Inter'],
        mono: ['SpaceGrotesk'],
      },
    },
  },
  plugins: [],
};
