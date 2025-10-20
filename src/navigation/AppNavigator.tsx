import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../store/AuthContext';

// Import all our role-specific screens
import HomeScreen from '../screens/HomeScreen';
import ManageStudentsScreen from '../screens/ManageStudentsScreen';
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
          // We'll add icons here later
        }}
      />

      {/* Management tab */}
      {role === 'management' && (
        <Tab.Screen
          name="Manage"
          component={ManageStudentsScreen}
          options={{
            title: 'Manage Students',
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