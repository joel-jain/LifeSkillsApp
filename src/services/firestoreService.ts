import { db } from './firebaseConfig';
import {
    doc,
    setDoc,
    getDoc,
    collection,
    addDoc,
    updateDoc,
    query,
    where,
    getDocs,
  } from 'firebase/firestore';
import type {
  UserProfile,
  StudentDetails,
  UserRole,
} from '../types';
import { GeofenceZone } from '../types'; // 1. Import GeofenceZone type

/**
 * Creates a new user profile document in Firestore.
 * This should be called right after a successful signup.
 * @param uid - The user's unique ID from Firebase Auth.
 * @param email - The user's email.
 * @param firstName - The user's first name.
 * @param lastName - The user's last name.
 * @param role - The user's role (student, teacher, etc.).
 */
export const createUserProfile = async (
  uid: string,
  email: string,
  firstName: string,
  lastName: string,
  role: UserRole
) => {
  // Create the UserProfile object
  const userProfile: UserProfile = {
    uid,
    email: email.toLowerCase(),
    firstName,
    lastName,
    role,
  };

  // Get a reference to the document in the 'users' collection
  const userDocRef = doc(db, 'users', uid);

  // Set the document with the user's profile data
  await setDoc(userDocRef, userProfile);
  
  // If the user is a student, we might also create their details doc
  if (role === 'student') {
    const studentDetailsRef = doc(db, 'studentDetails', uid);
    const newStudentDetails: StudentDetails = {
      caseHistory: 'New student profile created.',
      parentId: '', // Will be linked by management
      assignedFacultyIds: [],
    };
    await setDoc(studentDetailsRef, newStudentDetails);
  }
  // We can add similar logic for 'teacher' or 'parent' if needed
};

/**
 * Fetches a user's profile data from Firestore using their UID.
 * @param uid - The user's unique ID.
 * @returns The UserProfile object, or null if not found.
 */
export const getUserProfile = async (uid: string) => {
  const userDocRef = doc(db, 'users', uid);
  const docSnap = await getDoc(userDocRef);

  if (docSnap.exists()) {
    // Return the document data, cast to our UserProfile type
    return docSnap.data() as UserProfile;
  } else {
    // User profile document doesn't exist
    console.warn('No such user profile document!');
    return null;
  }
};

/**
 * [Management] Adds a new student to the database.
 * NOTE: This is a placeholder. A real flow might involve creating
 * a new auth user for the student first. This function assumes
 * a student's UserProfile already exists.
 * @param studentId - The UID of the student's UserProfile.
 * @param caseHistory - The initial case history.
 * @param parentId - The UID of the linked parent.
 */
export const addStudentDetails = async (
  studentId: string,
  caseHistory: string,
  parentId: string
) => {
  const studentDetails: StudentDetails = {
    caseHistory,
    parentId,
    assignedFacultyIds: [],
  };
  const studentDocRef = doc(db, 'studentDetails', studentId);
  await setDoc(studentDocRef, studentDetails);
};

/**
 * [Management] Updates a student's case history.
 * @param studentId - The UID of the student.
 * @param newCaseHistory - The new case history text.
 */
export const updateStudentCaseHistory = async (
  studentId: string,
  newCaseHistory: string
) => {
  const studentDocRef = doc(db, 'studentDetails', studentId);
  await updateDoc(studentDocRef, {
    caseHistory: newCaseHistory,
  });
};

/**
 * [Management] Fetches all user profiles with the 'student' role.
 */
export const getStudentsByRole = async () => {
  // 1. Create a reference to the 'users' collection
  const usersCollectionRef = collection(db, 'users');

  // 2. Create a query against the collection
  const q = query(usersCollectionRef, where('role', '==', 'student'));

  // 3. Execute the query
  const querySnapshot = await getDocs(q);

  // 4. Map the results to an array
  const students: UserProfile[] = [];
  querySnapshot.forEach((doc) => {
    students.push(doc.data() as UserProfile);
  });

  return students;
};

/**
 * [Management] Fetches a student's details (case history, etc.)
 * @param studentId - The UID of the student.
 */
export const getStudentDetails = async (studentId: string) => {
    const studentDocRef = doc(db, 'studentDetails', studentId);
    const docSnap = await getDoc(studentDocRef);
  
    if (docSnap.exists()) {
      return docSnap.data() as StudentDetails;
    } else {
      console.error('No such student details document!');
      return null;
    }
  };
  
  /**
   * [Management] Updates a student's case history.
   * (This is a slightly improved version of the one we wrote in 3.2)
   * @param studentId - The UID of the student.
   * @param newCaseHistory - The new case history text.
   */
  export const updateStudentDetails = async (
    studentId: string,
    newCaseHistory: string
  ) => {
    const studentDocRef = doc(db, 'studentDetails', studentId);
    await updateDoc(studentDocRef, {
      caseHistory: newCaseHistory,
    });
  };

  
  /**
   * [Faculty] Fetches all students assigned to a specific faculty member.
   * @param facultyId - The UID of the logged-in faculty member.
   */
  export const getStudentsByFaculty = async (facultyId: string) => {
    // 1. Get references
    const detailsCollectionRef = collection(db, 'studentDetails');
    const usersCollectionRef = collection(db, 'users');
  
    // 2. Query for details where 'assignedFacultyIds' array contains the faculty's ID
    const q = query(
      detailsCollectionRef,
      where('assignedFacultyIds', 'array-contains', facultyId)
    );
    
    const detailsSnapshot = await getDocs(q);
  
    if (detailsSnapshot.empty) {
      return []; // No students found
    }
  
    // 3. Get the UIDs of the matching students
    const studentIds = detailsSnapshot.docs.map((doc) => doc.id);
  
    // 4. Now, fetch the UserProfile for each of those students.
    // We use 'in' query to get all profiles in one go.
    const usersQuery = query(
      usersCollectionRef,
      where('uid', 'in', studentIds)
    );
    
    const usersSnapshot = await getDocs(usersQuery);
  
    // 5. Map the results
    const students: UserProfile[] = [];
    usersSnapshot.forEach((doc) => {
      students.push(doc.data() as UserProfile);
    });
  
    return students;
  };

  // ... (keep all existing code)
import {
    // ... (keep existing imports)
    Timestamp, // 1. Import Timestamp
  } from 'firebase/firestore';
  import { AttendanceRecord } from '../types'; // 2. Import AttendanceRecord type
  
  // ... (keep all existing functions)
  
  /**
   * [Faculty] Marks a student's attendance for today.
   * Creates or overwrites the record for that student for the current day.
   * @param studentId - The UID of the student.
   *a * @param studentName - The student's full name (for easier reporting).
   * @param status - 'present' or 'absent'.
   * @param facultyId - The UID of the faculty member marking attendance.
   */
  export const markAttendance = async (
    studentId: string,
    studentName: string,
    status: 'present' | 'absent',
    facultyId: string
  ) => {
    // 1. Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // 2. Create a unique document ID for this student and this day
    const docId = `${studentId}_${today}`;
    
    // 3. Get a reference to this specific document
    const attendanceDocRef = doc(db, 'attendanceRecords', docId);
  
    // 4. Create the attendance record object
    const record: AttendanceRecord = {
      id: docId,
      studentId: studentId,
      studentName: studentName,
      date: today,
      status: status,
      // Use Firebase's server timestamp for accuracy
      checkInTime: status === 'present' ? Date.now() : 0, 
      checkOutTime: null,
      markedBy: facultyId,
      geofenceEvent: 'manual',
    };
    
    // 5. Use setDoc to create or overwrite the record
    // This ensures a student can only have one record per day
    await setDoc(attendanceDocRef, record);
  };

  /**
   * [Background Task] Logs a geofence event to the attendance records.
   * @param studentId - The UID of the student.
   * @param studentName - The student's full name.
   * @param eventType - 'enter' or 'exit'.
   */
  export const logGeofenceEvent = async (
    studentId: string,
    studentName: string,
    eventType: 'enter' | 'exit'
  ) => {
    // 1. Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // 2. Create the unique doc ID for this student and day
    const docId = `${studentId}_${today}`;
    const attendanceDocRef = doc(db, 'attendanceRecords', docId);

    if (eventType === 'enter') {
      // 3. On ENTER: Create a new record for today
      const newRecord: AttendanceRecord = {
        id: docId,
        studentId: studentId,
        studentName: studentName,
        date: today,
        status: 'present',
        // Store as number to align with current AttendanceRecord type
        checkInTime: Date.now(),
        checkOutTime: null,
        markedBy: 'system', // Marked by geofence
        geofenceEvent: 'enter',
      };
      // Use setDoc with merge: true - creates if missing, preserves manual updates
      await setDoc(attendanceDocRef, newRecord, { merge: true });
    } else if (eventType === 'exit') {
      // 4. On EXIT: Update the existing record for today
      await updateDoc(attendanceDocRef, {
        // Store as number to align with current AttendanceRecord type
        checkOutTime: Date.now(),
        geofenceEvent: 'exit',
      });
    }
  };

// We'll use a consistent ID for the geofence doc to easily find it
const GEOFENCE_DOC_ID = 'main_campus';

/**
 * [Management] Saves or updates the geofence settings.
 * @param center - The latitude and longitude.
 * @param radius - The radius in meters.
 */
export const setGeofenceZone = async (
  center: { latitude: number; longitude: number },
  radius: number
) => {
  const geofenceDocRef = doc(db, 'settings', GEOFENCE_DOC_ID);
  
  const geofenceData: GeofenceZone = {
    id: GEOFENCE_DOC_ID,
    center: center,
    radius: radius,
  };

  // setDoc will create or overwrite the document
  await setDoc(geofenceDocRef, geofenceData);
};

/**
 * Fetches the geofence settings.
 * @returns The GeofenceZone object, or null if not set.
 */
export const getGeofenceZone = async () => {
  const geofenceDocRef = doc(db, 'settings', GEOFENCE_DOC_ID);
  const docSnap = await getDoc(geofenceDocRef);

  if (docSnap.exists()) {
    return docSnap.data() as GeofenceZone;
  } else {
    return null;
  }
};