import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AGE_GATE_KEY = 'frost_age_verified';

export function useAgeGate() {
  const [verified, setVerified] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(AGE_GATE_KEY).then((value) => {
      setVerified(value === 'true');
    });
  }, []);

  const verify = useCallback(async () => {
    await AsyncStorage.setItem(AGE_GATE_KEY, 'true');
    setVerified(true);
  }, []);

  const reset = useCallback(async () => {
    await AsyncStorage.removeItem(AGE_GATE_KEY);
    setVerified(false);
  }, []);

  return { verified, verify, reset };
}
