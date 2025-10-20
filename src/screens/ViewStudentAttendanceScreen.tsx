import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ViewStudentAttendanceScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Attendance</Text>
      <Text>This student's attendance history will appear here.</Text>
      {/* We will load and display a calendar or list of attendance records */}
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

export default ViewStudentAttendanceScreen;