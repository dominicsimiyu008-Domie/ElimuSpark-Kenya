import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  db,
  doc,
  setDoc,
  getDoc,
  onAuthStateChanged,
  signOut as fbSignOut,
  FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  googleProvider
} from '../services/firebase';

export type UserRole = 'student' | 'teacher' | 'parent';

export interface AppUserProfile {
  uid: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  county: string;
  grade?: string;
  tscNumber?: string;
  qualification?: string;
  childName?: string;
  createdAt: string;
}

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: AppUserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<AppUserProfile>) => Promise<void>;
  registerWithEmail: (email: string, pass: string, profileData: Omit<AppUserProfile, 'uid' | 'email' | 'createdAt'>) => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: (role?: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<AppUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            setUserProfile(snap.data() as AppUserProfile);
          } else {
            // Create default profile if signed in via Google or first time
            const newProfile: AppUserProfile = {
              uid: user.uid,
              email: user.email || '',
              fullName: user.displayName || 'Learner',
              phone: '0704641901',
              role: 'student',
              county: 'Nairobi',
              grade: 'Form 3 (KCSE)',
              createdAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
          }
        } catch (e) {
          console.error('Failed to load user profile from Firestore:', e);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const registerWithEmail = async (
    email: string,
    pass: string,
    profileData: Omit<AppUserProfile, 'uid' | 'email' | 'createdAt'>
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const newProfile: AppUserProfile = {
      ...profileData,
      uid: cred.user.uid,
      email,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'users', cred.user.uid), newProfile);
    setUserProfile(newProfile);
  };

  const loginWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const loginWithGoogle = async (preferredRole: UserRole = 'student') => {
    const result = await signInWithPopup(auth, googleProvider);
    const userDocRef = doc(db, 'users', result.user.uid);
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) {
      const newProfile: AppUserProfile = {
        uid: result.user.uid,
        email: result.user.email || '',
        fullName: result.user.displayName || 'Learner',
        phone: '0704641901',
        role: preferredRole,
        county: 'Nairobi',
        grade: 'Form 3 (KCSE)',
        createdAt: new Date().toISOString(),
      };
      await setDoc(userDocRef, newProfile);
      setUserProfile(newProfile);
    }
  };

  const signOut = async () => {
    await fbSignOut(auth);
    setUserProfile(null);
  };

  const updateProfile = async (data: Partial<AppUserProfile>) => {
    if (!currentUser || !userProfile) return;
    const updated = { ...userProfile, ...data };
    await setDoc(doc(db, 'users', currentUser.uid), updated, { merge: true });
    setUserProfile(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        signOut,
        updateProfile,
        registerWithEmail,
        loginWithEmail,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
