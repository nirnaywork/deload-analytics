import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../lib/firebase.js';

const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account',
});

const authErrorMessages = {
  'auth/account-exists-with-different-credential':
    'An account already exists for this email using another sign-in method.',
  'auth/cancelled-popup-request': 'Another Google sign-in attempt is already in progress.',
  'auth/email-already-in-use': 'An account already exists for this email.',
  'auth/invalid-credential': 'The email or password is incorrect.',
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/network-request-failed': 'Network request failed. Check your connection and try again.',
  'auth/operation-not-allowed': 'This sign-in method is not enabled in Firebase Authentication.',
  'auth/popup-blocked': 'The Google sign-in popup was blocked by the browser.',
  'auth/popup-closed-by-user': 'Google sign-in was closed before completion.',
  'auth/too-many-requests': 'Too many attempts. Try again in a few minutes.',
  'auth/unauthorized-domain': 'This domain is not authorized in your Firebase Authentication settings.',
  'auth/user-not-found': 'No account exists for this email.',
  'auth/weak-password': 'Use a password with at least 6 characters.',
  'auth/wrong-password': 'The email or password is incorrect.',
};

function getAuthErrorMessage(error) {
  return authErrorMessages[error?.code] || 'Authentication failed. Please try again.';
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthReady(true);
    });

    return unsubscribe;
  }, []);

  const signUp = async ({ name, email, password }) => {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);

      if (name.trim()) {
        await updateProfile(credential.user, { displayName: name.trim() });
      }

      return credential.user;
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  };

  const logIn = async ({ email, password }) => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      return credential.user;
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  };

  const signInWithGoogle = async () => {
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      return credential.user;
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  };

  const logOut = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  };

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      isAuthReady,
      logIn,
      logOut,
      resetPassword,
      signInWithGoogle,
      signUp,
    }),
    [currentUser, isAuthReady],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
