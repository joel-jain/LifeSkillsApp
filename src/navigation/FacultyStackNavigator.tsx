import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MyStudentsScreen from '../screens/MyStudentsScreen';
import ReportIncidentScreen from '../screens/ReportIncidentScreen';
// We will import ViewStudentAttendanceScreen later

// Define the screens and their params in this stack
export type FacultyStackParamList = {
  MyStudents: undefined; // The main list screen
  ReportIncident: {
    studentId: string;
    studentName: string;
  };
  ViewStudentAttendance: {
    studentId: string;
    studentName: string;
  };
};

const Stack = createStackNavigator<FacultyStackParamList>();

export const FacultyStackNavigator = () => {
  return (
    <Stack.Navigator
      // We hide the header because our screens have their own
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="MyStudents"
        component={MyStudentsScreen}
      />
      <Stack.Screen
        name="ReportIncident"
        component={ReportIncidentScreen}
      />
      {/* We will add ViewStudentAttendanceScreen here later */}
    </Stack.Navigator>
  );
};