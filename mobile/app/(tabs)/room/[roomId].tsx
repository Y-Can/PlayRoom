// app/(tabs)/room/[roomId].tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUserStore } from '@/store/useUserStore';
import { useSocket } from '@/hooks/useSocket';

interface ChatMessage {
  pseudo: string;
  message: string;
  avatar: string;
  timestamp: number;
}

export default function RoomScreen() {
  const { roomId } = useLocalSearchParams();
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const socket = useSocket();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [players, setPlayers] = useState<any[]>([]);

  useEffect(() => {
    if (!socket || !roomId || !user) return;

    socket.emit('joinRoom', {
      roomId,
      pseudo: user.pseudo,
      avatar: user.avatar,
    });

    socket.on('newMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('roomUpdate', (data) => {
      setPlayers(data.users);
    });

    socket.on('nextQuestion', (questionData) => {
      router.replace({
        pathname: '/(tabs)/quizz',
        params: {
          roomId: String(roomId),
          round: String(questionData.round),
          total: String(questionData.totalRounds),
        },
      });
    });

    return () => {
      socket.off('newMessage');
      socket.off('roomUpdate');
      socket.off('nextQuestion');
    };
  }, [socket, roomId]);

  const sendMessage = () => {
    if (!message.trim() || !socket) return;
    socket.emit('chatMessage', {
      roomId,
      message,
      pseudo: user.pseudo,
      avatar: user.avatar,
    });
    setMessage('');
  };

  const startGame = () => {
    if (socket && roomId) {
      socket.emit('startGame', { roomId });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Salon : {roomId}</Text>

      <View style={styles.playersWrap}>
        {players.map((p) => (
          <View key={p.clientId} style={{ alignItems: 'center', marginRight: 10 }}>
            <Image source={{ uri: p.avatar }} style={{ width: 40, height: 40, borderRadius: 20 }} />
            <Text style={{ fontSize: 12 }}>{p.pseudo}</Text>
          </View>
        ))}
      </View>

      <FlatList
        data={messages}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 10 }}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.messageBubble}>
            <Text style={styles.messageUser}>{item.pseudo}</Text>
            <Text>{item.message}</Text>
          </View>
        )}
      />

      <View style={styles.inputWrap}>
        <TextInput
          placeholder="Message..."
          value={message}
          onChangeText={setMessage}
          style={styles.input}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Text style={{ color: '#fff' }}>Envoyer</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.gameBtn} onPress={startGame}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>🎮 Lancer la partie</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  playersWrap: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  messageBubble: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  messageUser: { fontWeight: 'bold', marginBottom: 2 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  sendBtn: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 6,
    marginLeft: 8,
  },
  gameBtn: {
    marginTop: 10,
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
});
