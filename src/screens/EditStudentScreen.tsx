import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EditStudentScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Student Details</Text>
      <Text>Form to edit student case history will go here.</Text>
      {/* We will load the student's data and show it in TextInputs */}
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

export default EditStudentScreen;