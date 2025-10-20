import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MyChildAttendanceScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Child's Attendance</Text>
      <Text>Your child's attendance status and history will appear here.</Text>
      {/* We will load and display the child's attendance data */}
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

export default MyChildAttendanceScreen;