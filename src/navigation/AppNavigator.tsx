import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../store/AuthContext';

// Import all our role-specific screens & navigators
import HomeScreen from '../screens/HomeScreen';
// 1. IMPORT THE NEW STACK NAVIGATOR
import { ManageStackNavigator } from './ManageStackNavigator';
import MyStudentsScreen from '../screens/MyStudentsScreen';
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
    <Tab.Navigator>
      {/* Home tab (Visible to EVERYONE) */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          headerShown: false, // Let's hide the header for all screens
        }}
      />

      {/* Management tab */}
      {role === 'management' && (
        <Tab.Screen
          name="Manage"
          // 2. USE THE STACK NAVIGATOR AS THE COMPONENT
          component={ManageStackNavigator}
          options={{
            title: 'Manage',
            headerShown: false, // Hide the tab navigator's header
          }}
        />
      )}

      {/* Faculty/Teacher tab */}
      {role === 'teacher' && (
        <Tab.Screen
          name="MyStudents"
          component={MyStudentsScreen}
          options={{
            title: 'My Students',
            headerShown: false,
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
            headerShown: false,
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
            headerShown: false,
          }}
        />
      )}
    </Tab.Navigator>
  );
};