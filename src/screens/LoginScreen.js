import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { loginUser } from '../services/authService';  // Corrected import path

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await loginUser(username, password);
      navigation.replace('Home'); // Navigate to the home screen after successful login
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      {error && <Text>{error}</Text>}
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;
