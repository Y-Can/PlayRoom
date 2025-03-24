import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useUserStore } from '../../store/useUserStore';
import { useSocket } from '../../hooks/useSocket';
import { useLocalSearchParams,useRouter } from 'expo-router';



interface ChatMessage {
  pseudo: string;
  message: string;
  avatar: string;
  timestamp: number;
}



export default function RoomScreen() {
  const router = useRouter();
  const user = useUserStore((state: { user: any; }) => state.user);
  const socket = useSocket();
  const { roomId } = useLocalSearchParams();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [players, setPlayers] = useState<{ pseudo: string; avatar: string; clientId: string }[]>([]);

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
    if (!socket) return;
    socket.emit('startGame', { roomId }); // à gérer côté backend (quiz.gateway.ts)
  };

  useEffect(() => {
    if (!socket) return;

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

    return () => {
      socket.off('newMessage');
      socket.off('roomUpdate');
    };
  }, [socket]);
  
  useEffect(() => {
    if (!socket) return;
    
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
      socket.off('nextQuestion');
    };
  }, [socket]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, padding: 10 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Salon : {roomId}</Text>

      {/* Liste des joueurs */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>Joueurs connectés :</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {players.map((player) => (
            <View key={player.clientId} style={{ alignItems: 'center', marginRight: 10 }}>
              <Image
                source={{ uri: player.avatar || '' }}
                style={{ width: 40, height: 40, borderRadius: 50, marginBottom: 4 }}
              />
              <Text style={{ fontSize: 12 }}>{player.pseudo}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Liste des messages */}
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        style={{ flex: 1, marginBottom: 10 }}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: item.pseudo === user.pseudo ? 'flex-end' : 'flex-start',
              marginBottom: 10,
            }}
          >
            {item.pseudo !== user.pseudo && (
              <Image
                source={{ uri: item.avatar || '' }}
                style={{ width: 35, height: 35, borderRadius: 50, marginRight: 8 }}
              />
            )}
            <View
              style={{
                backgroundColor: item.pseudo === user.pseudo ? '#007bff' : '#eee',
                padding: 10,
                borderRadius: 10,
                maxWidth: '70%',
              }}
            >
              <Text style={{ fontWeight: 'bold', color: item.pseudo === user.pseudo ? '#fff' : '#000' }}>
                {item.pseudo}
              </Text>
              <Text style={{ color: item.pseudo === user.pseudo ? '#fff' : '#000' }}>
                {item.message}
              </Text>
              <Text style={{ fontSize: 10, color: '#ccc', marginTop: 4 }}>
                {item.timestamp
                  ? new Date(item.timestamp).toLocaleTimeString()
                  : ''}
              </Text>
            </View>
            {item.pseudo === user.pseudo && (
              <Image
                source={{ uri: item.avatar || '' }}
                style={{ width: 35, height: 35, borderRadius: 50, marginLeft: 8 }}
              />
            )}
          </View>
        )}
      />

      {/* Input + Envoyer */}
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Message..."
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 6,
            paddingHorizontal: 10,
            paddingVertical: 8,
          }}
        />
        <TouchableOpacity
          onPress={sendMessage}
          style={{ backgroundColor: '#007bff', borderRadius: 6, padding: 10 }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Envoyer</Text>
        </TouchableOpacity>
      </View>

      {/* Lancer le jeu */}
      <TouchableOpacity
        onPress={startGame}
        style={{
          backgroundColor: '#28a745',
          padding: 12,
          borderRadius: 6,
          alignItems: 'center',
          marginTop: 16,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>🎮 Lancer la partie</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
