import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ManageStudentsScreen from '../screens/ManageStudentsScreen';
import AddStudentScreen from '../screens/AddStudentScreen';
import EditStudentScreen from '../screens/EditStudentScreen';
import GeofenceSettingsScreen from '../screens/GeofenceSettingsScreen';
import SafetyIncidentReportScreen from '../screens/SafetyIncidentReportScreen'; // 1. Import

// Define the screens and their params in this stack
export type ManageStackParamList = {
  ManageStudents: undefined;
  AddStudent: undefined;
  EditStudent: { studentId: string };
  GeofenceSettings: undefined;
  SafetyIncidentReport: undefined; // Already added in previous step
};

const Stack = createStackNavigator<ManageStackParamList>();

export const ManageStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="ManageStudents"
        component={ManageStudentsScreen}
      />
      <Stack.Screen name="AddStudent" component={AddStudentScreen} />
      <Stack.Screen name="EditStudent" component={EditStudentScreen} />
      <Stack.Screen
        name="GeofenceSettings"
        component={GeofenceSettingsScreen}
      />
      {/* 2. Add the new screen */}
      <Stack.Screen
        name="SafetyIncidentReport"
        component={SafetyIncidentReportScreen}
      />
    </Stack.Navigator>
  );
};