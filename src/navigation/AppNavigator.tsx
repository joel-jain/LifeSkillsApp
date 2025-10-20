import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';

// Define the types for the screens in this tab bar
export type AppTabParamList = {
  Home: undefined;
  // We will add more tabs like 'Attendance' and 'Profile' later
};

const Tab = createBottomTabNavigator<AppTabParamList>();

export const AppNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          // We can add icons here later
          // tabBarIcon: ({ color, size }) => ( ... )
        }}
      />
      {/* We will add more Tab.Screen components here */}
    </Tab.Navigator>
  );
};