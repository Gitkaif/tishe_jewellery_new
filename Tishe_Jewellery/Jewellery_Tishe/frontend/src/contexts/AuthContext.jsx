// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  updateEmail,
  updatePassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, signInWithGoogle } from '../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function updateUserProfile(user, profile) {
    return updateProfile(user, profile);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Check if the user's email is the admin email
        const adminEmail = ['kaifbscit101@gmail.com','panchirisonal@gmail.com'];
        const userIsAdmin = adminEmail.includes(user.email);
        setCurrentUser({
          ...user,
          isAdmin: userIsAdmin
        });
        setIsAdmin(userIsAdmin);
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sign in with Google
  const signInWithGoogleAuth = async () => {
    try {
      const { user, token } = await signInWithGoogle();
      return { user, token };
    } catch (error) {
      console.error("Error in Google sign in:", error);
      throw error;
    }
  };

  // Update user email
  const updateUserEmail = (email) => {
    return updateEmail(auth.currentUser, email);
  };

  // Update user password
  const updateUserPassword = (password) => {
    return updatePassword(auth.currentUser, password);
  };

  // Reset password
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const value = {
    currentUser,
    isAdmin,
    signup,
    login,
    logout,
    updateUserProfile,
    signInWithGoogle: signInWithGoogleAuth,
    updateUserEmail,
    updateUserPassword,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}