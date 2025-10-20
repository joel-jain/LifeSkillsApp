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

// ... (keep all existing code)

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