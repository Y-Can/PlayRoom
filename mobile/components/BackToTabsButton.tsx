// components/ui/BackToTabsButton.tsx
import { useRouter } from 'expo-router';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

export function BackToTabsButton() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.replace('/(tabs)/salons')}>
        <Text style={styles.link}>🏠 Accueil</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('./(tabs)/conversations')}>
        <Text style={styles.link}>Messages</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('./(tabs)/settings')}>
        <Text style={styles.link}>Paramètres</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  link: {
    color: '#007bff',
    fontWeight: '600',
    fontSize: 16,
  },
});
