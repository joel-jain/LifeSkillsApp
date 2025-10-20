// src/types/index.ts

// Define the possible roles for a user in our system
export type UserRole = 'student' | 'teacher' | 'parent' | 'management';

// Base User profile, linked to Firebase Auth UID
export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  pushToken?: string; // Expo push notification token
  // We can add more common fields like phoneNumber, profilePicUrl, etc.
}

// Specific profile for a Student, linked to their UserProfile
export interface StudentDetails {
  caseHistory: string;       // Management details
  parentId: string;          // UID of the associated parent
  assignedFacultyIds: string[]; // List of faculty UIDs
}

// Specific profile for a Faculty member
export interface FacultyDetails {
  department: string;
  // We might add assignedStudentIds later
}

// Specific profile for a Parent
export interface ParentDetails {
  childId: string; // UID of their student child
}

// Represents a single attendance entry
export interface AttendanceRecord {
  id: string; // Document ID
  studentId: string;
  studentName: string; // Denormalized for easier report viewing
  date: string; // ISO string (e.g., '2025-10-21')
  status: 'present' | 'absent' | 'leave';
  checkInTime: number;  // Firebase Timestamp (or number: Date.now())
  checkOutTime: number | null; // Firebase Timestamp (or number: Date.now())
  markedBy: string; // UID of faculty or 'system' (for geofence)
  geofenceEvent: 'enter' | 'exit' | 'manual' | null;
}

// Represents a safety incident report
export interface SafetyIncident {
  id: string; // Document ID
  studentId: string;
  studentName: string;
  reportedBy: string; // Faculty UID
  reportedAt: number; // Firebase Timestamp (or number: Date.now())
  description: string;
  severity: 'low' | 'medium' | 'high';
}

// Represents the school's geofence zone
export interface GeofenceZone {
  id: string; // Document ID (e.g., 'main_campus')
  center: {
    latitude: number;
    longitude: number;
  };
  radius: number; // in meters
}