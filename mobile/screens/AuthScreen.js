import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useUserStore } from '../store/useUserStore';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../constants/api';

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
  const setUser = useUserStore((state) => state.setUser);
  const [pseudo, setPseudo] = useState(getRandomName());
  const avatar = `https://api.dicebear.com/6.x/bottts/svg?seed=${pseudo}`;
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_URL}/auth/guest`);
      setUser({ ...res.data.user, token: res.data.token });
      navigation.navigate('Home');
    } catch (err) {
      console.error(err);
      Alert.alert('Erreur', "Impossible de se connecter");
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-6">
      <Text className="text-2xl font-bold mb-4">Bienvenue sur PlayRoom</Text>

      <Image source={{ uri: avatar }} style={{ width: 100, height: 100, marginBottom: 20 }} />

      <TextInput
        value={pseudo}
        onChangeText={setPseudo}
        placeholder="Entre ton pseudo"
        className="border border-gray-300 rounded px-4 py-2 w-full mb-4"
      />

      <TouchableOpacity onPress={handleLogin} className="bg-blue-500 p-3 rounded w-full items-center">
        <Text className="text-white font-bold">Entrer dans PlayRoom</Text>
      </TouchableOpacity>
    </View>
  );
}
