import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../store/AuthContext';

// Import all our role-specific screens & navigators
import HomeScreen from '../screens/HomeScreen';
import { ManageStackNavigator } from './ManageStackNavigator';
// 1. IMPORT THE NEW FACULTY STACK NAVIGATOR
import { FacultyStackNavigator } from './FacultyStackNavigator';
import MyChildAttendanceScreen from '../screens/MyChildAttendanceScreen';
import MyAttendanceScreen from '../screens/MyAttendanceScreen';

// Define the types for ALL possible tabs
export type AppTabParamList = {
  Home: undefined;
  Manage: undefined;
  MyStudents: undefined;
  MyChildAttendance: undefined;
  MyAttendance: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

export const AppNavigator = () => {
  // Get the user's role from our auth context
  const { role } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // Hide header for all tabs
      }}
    >
      {/* Home tab (Visible to EVERYONE) */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
        }}
      />

      {/* Management tab */}
      {role === 'management' && (
        <Tab.Screen
          name="Manage"
          component={ManageStackNavigator}
          options={{
            title: 'Manage',
          }}
        />
      )}

      {/* Faculty/Teacher tab */}
      {role === 'teacher' && (
        <Tab.Screen
          name="MyStudents"
          // 2. USE THE STACK NAVIGATOR AS THE COMPONENT
          component={FacultyStackNavigator}
          options={{
            title: 'My Students',
          }}
        />
      )}

      {/* Parent tab */}
      {role === 'parent' && (
        <Tab.Screen
          name="MyChildAttendance"
          component={MyChildAttendanceScreen}
          options={{
            title: "Child's Attendance",
          }}
        />
      )}

      {/* Student tab */}
      {role === 'student' && (
        <Tab.Screen
          name="MyAttendance"
          component={MyAttendanceScreen}
          options={{
            title: 'My Attendance',
          }}
        />
      )}
    </Tab.Navigator>
  );
};