import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert,StyleSheet  } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSocket } from '../../hooks/useSocket';
import { useUserStore } from '../../store/useUserStore';


interface Question {
    question: string;
    options: string[];
    answer: string;
  }

  
export default function QuizScreen() {
  const user = useUserStore((s: { user: any; }) => s.user);
  const socket = useSocket();
  const { roomId, round, total } = useLocalSearchParams();
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(10);

  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  
  useEffect(() => {
    if (!question) return;
  
    setSecondsLeft(10); // reset à chaque question
  
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  
    return () => clearInterval(interval);
  }, [question]);

  
  useEffect(() => {
    if (!socket) return;

    socket.on('nextQuestion', (data) => {
      setQuestion(data.currentQuestion);
      setSelected(null);
    });

    socket.on('scoreUpdate', (data) => {
        const correct = data.currentQuestion.answer;
        Alert.alert('Bonne réponse !', `✔️ Réponse correcte : ${correct}`);
      });
      

    socket.on('gameOver', ({ scores, winners }) => {
        router.replace({
          pathname: '/(tabs)/gameover',
          params: {
            winners: winners.join(', '),
            scores: encodeURIComponent(JSON.stringify(scores)),
          },
        });
      });
      

    return () => {
      socket.off('nextQuestion');
      socket.off('scoreUpdate');
      socket.off('gameOver');
    };
  }, [socket]);

  const sendAnswer = (answer: string) => {
    if (!socket || !question || selected || secondsLeft <= 0) return;
    setSelected(answer);
  
    socket.emit('answer', {
      roomId,
      pseudo: user.pseudo,
      answer,
    });
  };
  

  if (!question) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Chargement de la question...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/salons')} style={styles.backBtn}>
        <Text style={styles.backText}>← Accueil</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>
        Question {round} / {total}
      </Text>

      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 24 }}>{question.question}</Text>

      {question.options.map((opt: string) => (
        <TouchableOpacity
          key={opt}
          onPress={() => sendAnswer(opt)}
          disabled={!!selected}
          style={{
            backgroundColor: selected === opt ? '#007bff' : '#f0f0f0',
            padding: 12,
            borderRadius: 8,
            marginBottom: 12,
          }}
        >
          <Text style={{ color: selected === opt ? '#fff' : '#000', fontSize: 16 }}>{opt}</Text>
        </TouchableOpacity>
      ))}

      {selected && (
        <Text style={{ marginTop: 20, fontStyle: 'italic', fontSize: 14 }}>
          Réponse envoyée : {selected}
        </Text>
      )}
    </View>
  );
  
}

const styles = StyleSheet.create({

  backBtn: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  backText: {
    fontSize: 16,
    color: '#007bff',
  },

});