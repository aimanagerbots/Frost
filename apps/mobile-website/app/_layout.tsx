import { useEffect } from 'react';
import { View, Pressable, Modal } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts as useSora,
  Sora_400Regular,
  Sora_500Medium,
  Sora_600SemiBold,
  Sora_700Bold,
} from '@expo-google-fonts/sora';
import {
  useFonts as useInter,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  useFonts as useSpaceGrotesk,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import { useAgeGate } from '@/hooks/useAgeGate';
import { Text } from '@/components';
import '../src/global.css';

SplashScreen.preventAutoHideAsync();

function AgeGateModal({ onVerify }: { onVerify: () => void }) {
  return (
    <Modal animationType="fade" transparent={false}>
      <View className="flex-1 bg-base items-center justify-center px-8">
        <View className="w-20 h-20 rounded-full bg-accent-primary/20 items-center justify-center mb-6">
          <Text className="text-4xl">❄️</Text>
        </View>
        <Text variant="display" className="text-3xl text-center mb-3">
          Welcome to Frost
        </Text>
        <Text variant="body" className="text-center text-text-muted mb-8">
          You must be 21 or older to enter this app.
        </Text>
        <Pressable
          onPress={onVerify}
          className="bg-accent-primary px-8 py-4 rounded-xl active:bg-accent-primary-hover"
        >
          <Text className="text-base font-semibold text-text-bright">
            I am 21 or older
          </Text>
        </Pressable>
        <Text variant="caption" className="mt-6 text-center">
          By entering, you confirm you are of legal age{'\n'}to purchase cannabis products.
        </Text>
      </View>
    </Modal>
  );
}

export default function RootLayout() {
  const { verified, verify } = useAgeGate();

  const [soraLoaded] = useSora({
    Sora_400Regular,
    Sora_500Medium,
    Sora_600SemiBold,
    Sora_700Bold,
  });

  const [interLoaded] = useInter({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [spaceGroteskLoaded] = useSpaceGrotesk({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  });

  const fontsLoaded = soraLoaded && interLoaded && spaceGroteskLoaded;

  useEffect(() => {
    if (fontsLoaded && verified !== null) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, verified]);

  if (!fontsLoaded || verified === null) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        {!verified && <AgeGateModal onVerify={verify} />}
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#000000' },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="concierge"
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
          />
          <Stack.Screen name="merch" />
          <Stack.Screen name="info" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
