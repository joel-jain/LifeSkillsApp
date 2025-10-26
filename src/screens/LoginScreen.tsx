import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import { logIn } from '../services/authService';

// --- Our Color Palette ---
const COLORS = {
  primary: '#007AFF', // A nice blue
  background: '#f4f7f8', // Light gray background
  card: '#FFFFFF',
  text: '#333333',
  textSecondary: '#666666',
  input: '#f0f2f5',
  border: '#E0E0E0',
};

// --- Props ---
type LoginScreenProps = StackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();
    try {
      await logIn(normalizedEmail, password);
      // On success, AuthContext handles navigation
    } catch (error: any) {
      console.error(error);
      Alert.alert('Login Failed', error.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Background Pattern */}
      <View style={styles.background}>
        <View style={[styles.bgShape, styles.bgShape1]} />
        <View style={[styles.bgShape, styles.bgShape2]} />
      </View>

      <View style={styles.container}>
        <Text style={styles.headerTitle}>LifeSkills BVET Centre</Text>
        
        {/* Card with Shadow */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Login</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={styles.buttonSpinner} />
          ) : (
            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              testID="loginButton"
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          )}

          <View style={styles.footerContainer}>
            <Text style={styles.secondaryText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  bgShape: {
    position: 'absolute',
    opacity: 0.1,
  },
  bgShape1: {
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: COLORS.primary,
    top: -150,
    left: -100,
  },
  bgShape2: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#00C851', // A secondary color
    bottom: -100,
    right: -80,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 30,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    color: COLORS.text,
    textAlign: 'center',
  },
  input: {
    backgroundColor: COLORS.input,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonSpinner: {
     marginTop: 10,
     paddingVertical: 14,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  secondaryText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  linkText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
});

export default LoginScreen;