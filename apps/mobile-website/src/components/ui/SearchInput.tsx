import { View, TextInput, type TextInputProps } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { Pressable } from 'react-native';
import { colors } from '@/theme';

interface SearchInputProps extends TextInputProps {
  onClear?: () => void;
}

export function SearchInput({ value, onClear, className = '', ...props }: SearchInputProps) {
  return (
    <View className={`flex-row items-center bg-elevated rounded-xl px-3 py-2.5 ${className}`}>
      <Search size={18} color={colors.text.muted} />
      <TextInput
        className="flex-1 ml-2 text-text-default font-sans text-sm"
        placeholderTextColor={colors.text.muted}
        value={value}
        {...props}
      />
      {value && value.length > 0 && onClear && (
        <Pressable onPress={onClear} hitSlop={8}>
          <X size={16} color={colors.text.muted} />
        </Pressable>
      )}
    </View>
  );
}
