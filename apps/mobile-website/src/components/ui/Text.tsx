import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

type TextVariant = 'display' | 'body' | 'mono' | 'label' | 'caption';

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  muted?: boolean;
}

const variantStyles: Record<TextVariant, string> = {
  display: 'font-display text-lg font-semibold text-text-bright',
  body: 'font-sans text-base text-text-default',
  mono: 'font-mono text-sm text-text-default',
  label: 'font-sans text-xs font-semibold uppercase tracking-wide text-text-muted',
  caption: 'font-sans text-xs text-text-muted',
};

export function Text({ variant = 'body', muted, className = '', ...props }: TextProps) {
  const base = variantStyles[variant];
  const mutedClass = muted ? 'text-text-muted' : '';

  return (
    <RNText className={`${base} ${mutedClass} ${className}`} {...props} />
  );
}
