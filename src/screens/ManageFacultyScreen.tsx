import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ManageFacultyScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Faculty</Text>
      <Text>A list of faculty members will go here.</Text>
      {/* We will add a list and a button to add new faculty */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default ManageFacultyScreen;