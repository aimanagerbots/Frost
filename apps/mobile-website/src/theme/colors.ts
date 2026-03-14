export const colors = {
  base: '#000000',
  card: '#0A0A0F',
  cardHover: '#111118',
  elevated: '#161620',

  border: {
    default: 'rgba(255,255,255,0.1)',
    hover: 'rgba(255,255,255,0.15)',
  },

  accent: {
    primary: '#5BB8E6',
    primaryHover: '#4AA8D6',
    primaryLight: 'rgba(91,184,230,0.1)',
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

  text: {
    default: 'rgba(255,255,255,0.9)',
    muted: 'rgba(255,255,255,0.4)',
    bright: '#FFFFFF',
  },

  status: {
    success: '#00E5A0',
    warning: '#FBBF24',
    danger: '#FB7185',
    info: '#38BDF8',
  },
} as const;

export const categoryColors: Record<string, string> = {
  flower: colors.category.flower,
  preroll: colors.category.preroll,
  vaporizer: colors.category.vape,
  concentrate: colors.category.concentrate,
  edible: colors.category.edible,
  beverage: colors.category.beverage,
};

export const strainColors: Record<string, string> = {
  indica: colors.strain.indica,
  sativa: colors.strain.sativa,
  hybrid: colors.strain.hybrid,
  cbd: colors.strain.cbd,
};
