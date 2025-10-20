import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ManageStudentsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Students</Text>
      <Text>Student list will appear here.</Text>
      {/* We will add a FlatList here later to show students */}
      {/* We will also add a "Add New Student" button */}
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

export default ManageStudentsScreen;