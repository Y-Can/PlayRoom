// app/(tabs)/salons.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios';
import { useUserStore } from '@/store/useUserStore';
import { useRouter } from 'expo-router';

interface Room {
  id: string;
  players: number;
  owner: string;
}

export default function SalonsScreen() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomName, setRoomName] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get('http://192.168.1.79:3000/rooms'); // ✅ Remplace par l’IP de ton backend
        const myRooms = res.data.filter((room: Room) => room.owner === user.pseudo);
        setRooms(myRooms);
      } catch (error) {
        console.error('Erreur de récupération des salons', error);
      }
    };

    fetchRooms();
  }, [user.pseudo]);

  const createRoom = async () => {
    if (!roomName.trim()) {
      Alert.alert('Erreur', 'Entre un nom de salon valide');
      return;
    }

    try {
      const res = await axios.post('http://192.168.1.79:3000/rooms', {
        id: roomName,
        owner: user.pseudo,
      });
      router.push(`/room/${roomName}`);
    } catch (error) {
      console.error('Erreur lors de la création du salon', error);
      Alert.alert('Erreur', 'Impossible de créer le salon');
    }
  };

  const handleJoin = (roomId: string) => {
    router.push(`/room/${roomId}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎮 Mes salons</Text>

      <View style={styles.createContainer}>
        <TextInput
          placeholder="Nom du salon"
          value={roomName}
          onChangeText={setRoomName}
          style={styles.input}
        />
        <TouchableOpacity style={styles.createBtn} onPress={createRoom}>
          <Text style={{ color: '#fff' }}>Créer</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleJoin(item.id)}>
            <Text style={styles.cardTitle}>{item.id}</Text>
            <Text style={styles.cardPlayers}>{item.players} joueurs connectés</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  createContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius:  10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  createBtn: {
    backgroundColor: '#28a745',
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardPlayers: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
});