import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button, // 1. Import Button
  Alert, // 2. Import Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../store/AuthContext';
import { logOut } from '../services/authService'; // 3. Import logOut

const HomeScreen = () => {
  const { userProfile } = useAuth();

  // 4. Create the logout handler
  const handleLogout = () => {
    Alert.alert(
      'Logout', // Title
      'Are you sure you want to log out?', // Message
      [
        // Button Array
        {
          text: 'Cancel',
          onPress: () => console.log('Logout cancelled'),
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await logOut();
              // AuthContext will handle navigation
            } catch (error) {
              console.error(error);
              Alert.alert('Error', 'Failed to log out.');
            }
          },
          style: 'destructive', // 'destructive' gives it a red color on iOS
        },
      ],
      { cancelable: false } // User must tap a button
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 5. Add a header View to hold the button */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
        <Button title="Logout" onPress={handleLogout} color="#dc3545" />
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome, {userProfile?.firstName}!</Text>
        <Text style={styles.subtitle}>
          You are logged in as: {userProfile?.role}
        </Text>
      </View>
    </SafeAreaView>
  );
};

// 6. Add new styles for the header
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default HomeScreen;