import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MyAttendanceScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Attendance</Text>
      <Text>Your attendance status and history will appear here.</Text>
      {/* We will load and display your attendance data */}
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

export default MyAttendanceScreen;