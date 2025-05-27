import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Alert, TextInput } from 'react-native';
import { icons } from '@/constants/icons';
import { signUp, login, getCurrentUser, logOut } from '@/services/appwrite';

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await signUp(name, email, password);
      Alert.alert(
        'Success',
        'Account created successfully! You can now log in.',
      );
      setIsSigningUp(false);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in email and password');
      return;
    }
    setLoading(true);
    try {
      const loggedUser = await login(email, password);
      setUser(loggedUser);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Login error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      setUser(null);
      setEmail('');
      setPassword('');
      setName('');
    } catch (error: any) {
      Alert.alert('Error', 'Error during logout');
    }
  };

  if (user) {
    return (
      <View className="flex-1 items-center justify-center bg-primary px-10">
        <Text className="mb-4 text-xl text-white">
          Welcome, {user.name || user.email}
        </Text>
        <TouchableOpacity
          onPress={handleLogout}
          className="rounded-md bg-red-600 px-6 py-3"
        >
          <Text className="font-bold text-white">Log out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center bg-primary px-10">
      {isSigningUp ? (
        <>
          <TextInput
            placeholder="Nom"
            placeholderTextColor="#aaa"
            value={name}
            onChangeText={setName}
            className="mb-4 rounded-xl bg-dark-100 px-5 py-6 text-xl text-white"
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            className="mb-4 rounded-xl bg-dark-100 px-5 py-6 text-xl text-white"
          />
          <TextInput
            placeholder="Mot de passe"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            className="mb-6 rounded-xl bg-dark-100 px-5 py-6 text-xl text-white"
          />
          <TouchableOpacity
            onPress={handleSignUp}
            className="items-center rounded-xl bg-accent py-6"
            disabled={loading}
          >
            <Text className="text-xl font-bold text-white">
              {loading ? 'Creating...' : 'Sign up'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsSigningUp(false)}
            className="mt-4"
          >
            <Text className="text-center text-lg text-white underline">
              Already have an account? Log in
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            className="mb-4 rounded-xl bg-dark-100 px-5 py-6 text-xl text-white"
          />
          <TextInput
            placeholder="Mot de passe"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            className="mb-6 rounded-xl bg-dark-100 px-5 py-6 text-xl text-white"
          />
          <TouchableOpacity
            onPress={handleLogin}
            className="items-center rounded-xl bg-accent py-6"
            disabled={loading}
          >
            <Text className="text-xl font-bold text-white">
              {loading ? 'Logging in...' : 'Log in'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsSigningUp(true)}
            className="mt-4"
          >
            <Text className="text-center text-lg text-white underline">
              Don't have an account yet? Sign up
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default Profile;
