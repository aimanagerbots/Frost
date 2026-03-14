import { View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SafeScreenProps extends ViewProps {
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

export function SafeScreen({ edges = ['top'], className = '', children, ...props }: SafeScreenProps) {
  return (
    <SafeAreaView edges={edges} className={`flex-1 bg-base ${className}`} {...props}>
      {children}
    </SafeAreaView>
  );
}
