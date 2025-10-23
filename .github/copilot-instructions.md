# AI Agent Instructions for LifeSkillsApp

This document provides essential context for AI agents working in the LifeSkillsApp codebase.

## Project Overview

LifeSkillsApp is a React Native mobile application built with Expo and Firebase, designed to manage student attendance and safety using geofencing capabilities. The app supports multiple user roles (students, faculty, parents) with different access levels and features.

## Core Architecture

### Navigation Structure
- `src/navigation/` contains a hierarchical navigation system:
  - `RootNavigator.tsx`: Entry point that handles auth state
  - `AuthNavigator.tsx`: Login/signup flows
  - `AppNavigator.tsx`: Main app navigation
  - Role-specific stacks (Faculty, Manage)

### Key Services
- `src/services/`:
  - `firebaseConfig.ts`: Firebase initialization and core instances
  - `locationService.ts`: Geofencing and location permissions
  - `firestoreService.ts`: Database operations
  - `notificationService.ts`: Push notifications
  - `geofenceTask.ts`: Background location monitoring

## Development Workflow

### Environment Setup
1. Configure Firebase:
   - Update `firebaseConfig.ts` with project credentials
   - Enable Authentication and Firestore in Firebase Console

### Common Commands
```bash
npm install     # Install dependencies
npm start       # Start Expo development server
npm run android # Run on Android
npm run ios     # Run on iOS
```

## Key Patterns and Conventions

### State Management
- Uses React Context (`src/store/AuthContext.tsx`) for global auth state
- Firestore for persistent data
- AsyncStorage for local caching

### Location & Geofencing
- Always check permissions before location operations
- Geofence regions are stored in Firestore and synced locally
- Background tasks must be registered in `App.tsx`

### Type Safety
- TypeScript interfaces defined in `src/types/index.ts`
- Strict type checking enforced by tsconfig.json

## Integration Points

### Firebase Integration
- Auth: `@react-native-firebase/auth` for authentication
- Database: Firestore collections for users, attendance, incidents
- Push Notifications: Expo notifications with Firebase Cloud Messaging

### Maps Integration
- Uses `react-native-maps` for geofence visualization
- Geofence regions must follow the `LocationRegion` type from expo-location

## Common Gotchas

1. Location permissions must be requested in sequence (foreground then background)
2. Firebase config must be updated in both app and console
3. Background tasks require explicit registration and handling in Expo

For detailed implementation examples, refer to the screens in `src/screens/` which demonstrate common patterns and best practices.