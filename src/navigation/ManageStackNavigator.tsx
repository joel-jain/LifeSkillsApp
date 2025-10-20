import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ManageStudentsScreen from '../screens/ManageStudentsScreen';
import AddStudentScreen from '../screens/AddStudentScreen';
import EditStudentScreen from '../screens/EditStudentScreen';

// Define the screens and their params in this stack
export type ManageStackParamList = {
  ManageStudents: undefined; // The main list screen
  AddStudent: undefined; // The form to add a new student
  EditStudent: { studentId: string }; // The form to edit a student
};

const Stack = createStackNavigator<ManageStackParamList>();

export const ManageStackNavigator = () => {
  return (
    <Stack.Navigator
      // We hide the header here because the screens
      // will have their own titles.
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="ManageStudents"
        component={ManageStudentsScreen}
      />
      <Stack.Screen name="AddStudent" component={AddStudentScreen} />
      <Stack.Screen name="EditStudent" component={EditStudentScreen} />
    </Stack.Navigator>
  );
};