import {
    auth,
    // We'll use db later for creating user profiles
    // db 
  } from './firebaseConfig';
  import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    type User
  } from 'firebase/auth';
  
  /**
   * Signs up a new user using email and password.
   * @param email - The user's email.
   * @param password - The user's password.
   * @returns The signed-up user's credentials.
   */
  export const signUp = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
    // In a later step (3.2), we'll also create a user profile document here.
  };
  
  /**
   * Logs in an existing user using email and password.
   * @param email - The user's email.
   * @param password - The user's password.
   * @returns The logged-in user's credentials.
   */
  export const logIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  
  /**
   * Logs out the currently signed-in user.
   * @returns A promise that resolves when sign-out is complete.
   */
  export const logOut = () => {
    return signOut(auth);
  };
  
  /**
   * Listens for changes to the user's authentication state.
   * @param callback - A function to call when the auth state changes,
   * which receives the User object (or null).
   * @returns The unsubscribe function.
   */
  export const onAuthUserChanged = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  };
  
  /**
   * Gets the currently signed-in user.
   * @returns The current User object or null.
   */
  export const getCurrentUser = () => {
    return auth.currentUser;
  };