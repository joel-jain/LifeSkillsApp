import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ManageStudentsScreen from '../screens/ManageStudentsScreen';
import AddStudentScreen from '../screens/AddStudentScreen';
import EditStudentScreen from '../screens/EditStudentScreen';
// 1. Import the new screen
import GeofenceSettingsScreen from '../screens/GeofenceSettingsScreen';

// Define the screens and their params in this stack
export type ManageStackParamList = {
  ManageStudents: undefined; // The main list screen
  AddStudent: undefined; // The form to add a new student
  EditStudent: { studentId: string }; // The form to edit a student
  GeofenceSettings: undefined; // 2. Add the new screen to the type
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
      {/* 3. Add the new screen to the stack */}
      <Stack.Screen
        name="GeofenceSettings"
        component={GeofenceSettingsScreen}
      />
    </Stack.Navigator>
  );
};