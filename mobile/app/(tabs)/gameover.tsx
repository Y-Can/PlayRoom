import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';

export default function GameOverScreen() {
  const { winners, scores } = useLocalSearchParams();
  const router = useRouter();

  const parsedScores = scores
  ? (JSON.parse(decodeURIComponent(scores as string)) as Record<string, number>)
  : {};

  const sorted = Object.entries(parsedScores).sort((a, b) => b[1] - a[1]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>
        🏁 Fin de la partie !
      </Text>
      <Text style={{ fontSize: 20, marginBottom: 10, textAlign: 'center' }}>
        🎉 Gagnant(s) : {winners}
      </Text>

      <FlatList
        data={sorted}
        keyExtractor={([pseudo]) => pseudo}
        renderItem={({ item, index }) => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 12,
              marginVertical: 4,
              backgroundColor: index === 0 ? '#ffd700' : '#f0f0f0',
              borderRadius: 8,
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>{item[0]}</Text>
            <Text>{item[1]} pts</Text>
          </View>
        )}
      />

      <TouchableOpacity
        onPress={() => router.replace('/tabs/home')}
        style={{ backgroundColor: '#007bff', padding: 14, marginTop: 20, borderRadius: 8, alignItems: 'center' }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Retour à l'accueil</Text>
      </TouchableOpacity>
    </View>
  );
}
