import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text } from 'react-native';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/auth'); // Redirige automatiquement vers l'écran d'auth
    }, 0); // ou 100ms si tu veux être safe

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Chargement...</Text>
    </View>
  );
}
