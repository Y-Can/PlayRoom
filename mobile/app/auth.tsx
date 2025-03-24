import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useUserStore } from '../store/useUserStore';
import { useRouter } from 'expo-router';

const getRandomName = () => {
  const adjectives = ['Cool', 'Dark', 'Swift', 'Fire', 'Silent', 'Epic'];
  const animals = ['Panther', 'Wolf', 'Eagle', 'Ninja', 'Tiger', 'Shadow'];
  return (
    adjectives[Math.floor(Math.random() * adjectives.length)] +
    animals[Math.floor(Math.random() * animals.length)] +
    Math.floor(Math.random() * 100)
  );
};

export default function AuthScreen() {
  const [pseudo, setPseudo] = useState(getRandomName());
  const avatar = `https://api.dicebear.com/6.x/bottts/svg?seed=${pseudo}`;
  const setUser = useUserStore((state: { setUser: any; }) => state.setUser);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:3000/auth/guest');
      setUser({ ...res.data.user, token: res.data.token });
      router.replace('/tabs/home');
    } catch (err) {
      console.error(err);
      Alert.alert('Erreur', "Impossible de se connecter");
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Bienvenue sur PlayRoom</Text>
      <Image source={{ uri: avatar }} style={{ width: 100, height: 100, marginBottom: 20 }} />
      <TextInput
        value={pseudo}
        onChangeText={setPseudo}
        placeholder="Entre ton pseudo"
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, width: '100%', marginBottom: 20 }}
      />
      <TouchableOpacity onPress={handleLogin} style={{ backgroundColor: '#007bff', padding: 15, borderRadius: 5 }}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Entrer dans PlayRoom</Text>
      </TouchableOpacity>
    </View>
  );
}
