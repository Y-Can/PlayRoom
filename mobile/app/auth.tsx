// app/(auth)/auth.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserStore } from '@/store/useUserStore';
import { useRouter } from 'expo-router';

export default function AuthScreen() {
  const setUser = useUserStore((state) => state.setUser);
  const [pseudo, setPseudo] = useState('Player' + Math.floor(Math.random() * 1000));
  const avatar = `https://api.dicebear.com/6.x/bottts/svg?seed=${pseudo}`;
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStoredUser = async () => {
      try {
        const stored = await AsyncStorage.getItem('playroom_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          router.replace('/(tabs)/home');
        }
      } catch (err) {
        console.error('Erreur AsyncStorage', err);
      } finally {
        setLoading(false);
      }
    };

    checkStoredUser();
  }, []);

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://192.168.1.79:3000/auth/guest');
      const userData = { ...res.data.user, token: res.data.token };
      setUser(userData);
      await AsyncStorage.setItem('playroom_user', JSON.stringify(userData));
      router.replace('/(tabs)/home');
    } catch (err) {
      alert("Erreur de connexion au serveur");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Bienvenue sur PlayRoom</Text>
      <Text style={styles.subtitle}>Crée ton profil pour commencer</Text>

      <Image source={{ uri: avatar }} style={styles.avatar} />

      <TextInput
        placeholder="Entre ton pseudo"
        value={pseudo}
        onChangeText={setPseudo}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrer dans PlayRoom</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
