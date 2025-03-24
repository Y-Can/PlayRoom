import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/auth'); // Redirige automatiquement vers l'écran d'auth
  }, []);

  return null;
}
