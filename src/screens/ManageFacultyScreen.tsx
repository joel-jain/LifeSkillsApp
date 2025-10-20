import React from 'react';
// 1. Import SafeAreaView
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ManageFacultyScreen = () => {
  return (
    // 2. Use SafeAreaView as the root
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Manage Faculty</Text>
        <Text>A list of faculty members will go here.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // 3. Add safeArea style
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default ManageFacultyScreen;