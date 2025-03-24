import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useUserStore } from '../../store/useUserStore';
import { useSocket } from '../../hooks/useSocket';

export default function HomeScreen() {
    const socket = useSocket();
    const user = useUserStore((state: { user: any; }) => state.user);
  const [roomId, setRoomId] = useState('');

  const joinRoom = () => {
    if (!roomId.trim()) {
      Alert.alert('Erreur', 'Entre un nom de salon valide');
      return;
    }
  
    if (!socket) {
      console.log("⛔ Socket non connecté");
      return;
    }
  
    socket.emit('joinRoom', {
      roomId,
      pseudo: user.pseudo,
      avatar: user.avatar,
    });
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Bienvenue, {user?.pseudo} 👋</Text>

      <TextInput
        placeholder="Nom du salon"
        value={roomId}
        onChangeText={setRoomId}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
        }}
      />

      <TouchableOpacity
        onPress={joinRoom}
        style={{
          backgroundColor: '#28a745',
          padding: 15,
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Rejoindre le salon</Text>
      </TouchableOpacity>
    </View>
  );
}
