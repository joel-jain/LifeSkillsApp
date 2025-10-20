import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MyStudentsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Students</Text>
      <Text>A list of students assigned to you will appear here.</Text>
      {/* We will add a FlatList here to show assigned students */}
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

export default MyStudentsScreen;