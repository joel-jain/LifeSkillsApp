import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AddStudentScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Student</Text>
      <Text>Form to add student details will go here.</Text>
      {/* We will add TextInputs for name, parent, case history, etc. */}
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

export default AddStudentScreen;