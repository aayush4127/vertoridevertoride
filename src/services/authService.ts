import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { StudentProfile, SignUpPayload } from '../types';
import { CURRENT_USER } from '../data/lpuData';

// Storage keys for local persistence until Firebase Auth is connected
const AUTH_STORAGE_KEY = 'vertoride_auth_user';

export const DEMO_STUDENT_MALE: StudentProfile = {
  ...CURRENT_USER,
  id: 'user-aarav-demo',
  uid: 'user-aarav-demo',
  name: 'Aarav Sharma',
  email: 'aarav.12115892@lpu.in',
  regNumber: '12115892',
  course: 'B.Tech Computer Science & Engineering',
  batch: '2022 - 2026',
  gender: 'Male',
  blockOrHostel: 'BH-3, Room 412',
  phone: '+91 98765-43210',
  rating: 4.9,
  totalRides: 48,
  moneySaved: 2840,
  verifiedStudent: true
};

export const DEMO_STUDENT_FEMALE: StudentProfile = {
  id: 'user-priya-demo',
  uid: 'user-priya-demo',
  name: 'Priya Patel',
  email: 'priya.12203918@lpu.in',
  regNumber: '12203918',
  course: 'B.Des Fashion & Product Design',
  batch: '2023 - 2027',
  avatar: '',
  phone: '+91 98765-11223',
  rating: 4.95,
  totalRides: 32,
  moneySaved: 1920,
  verifiedStudent: true,
  blockOrHostel: 'GH-2, Room 308',
  gender: 'Female'
};

/**
 * Sign In with Email and Password
 */
export async function signInWithEmail(email: string, password: string): Promise<StudentProfile> {
  const cleanEmail = email.trim().toLowerCase();
  
  if (cleanEmail === DEMO_STUDENT_MALE.email.toLowerCase() && password === 'verto123') {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEMO_STUDENT_MALE));
    return DEMO_STUDENT_MALE;
  }
  if (cleanEmail === DEMO_STUDENT_FEMALE.email.toLowerCase() && password === 'verto123') {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEMO_STUDENT_FEMALE));
    return DEMO_STUDENT_FEMALE;
  }
  
  const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
  const user = userCredential.user;
  
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  let profileData: StudentProfile;
  if (userDoc.exists()) {
    profileData = userDoc.data() as StudentProfile;
  } else {
    // If not exists in Firestore but exists in auth, create a minimal profile
    profileData = {
      id: user.uid,
      uid: user.uid,
      name: user.displayName || 'Verto Student',
      email: user.email || cleanEmail,
      regNumber: 'Unknown',
      course: 'Unknown',
      batch: 'Unknown',
      avatar: user.photoURL || '',
      phone: '',
      rating: 5.0,
      totalRides: 0,
      moneySaved: 0,
      verifiedStudent: true,
      blockOrHostel: 'Unknown',
      gender: 'Male'
    };
    await setDoc(doc(db, 'users', user.uid), profileData);
  }
  
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profileData));
  return profileData;
}

/**
 * Sign Up a new student
 */
export async function signUpWithEmail(payload: SignUpPayload): Promise<StudentProfile> {
  const cleanEmail = payload.email.trim().toLowerCase();
  const password = payload.password || 'verto123';
  
  const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
  const user = userCredential.user;

  const newProfile: StudentProfile = {
    id: user.uid,
    uid: user.uid,
    name: payload.name.trim() || 'Verto Student',
    email: cleanEmail,
    regNumber: payload.regNumber.trim() || `${Math.floor(12100000 + Math.random() * 899999)}`,
    course: payload.course?.trim() || 'B.Tech CSE',
    batch: '2024 - 2028',
    avatar: payload.avatar?.trim() || '',
    phone: payload.phone?.trim() || '+91 98000-00000',
    rating: 5.0,
    totalRides: 0,
    moneySaved: 0,
    verifiedStudent: true,
    blockOrHostel: payload.blockOrHostel || (payload.gender === 'Female' ? 'GH-1' : 'BH-1'),
    gender: payload.gender || 'Male'
  };

  await setDoc(doc(db, 'users', user.uid), newProfile);
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newProfile));

  // Send branded welcome email via server-side Resend integration (non-blocking)
  try {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    fetch('/api/send-welcome-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: newProfile.email,
        name: newProfile.name,
        appUrl: origin
      })
    }).catch((netErr) => {
        console.warn('[Welcome Email] Failed to connect to email API route:', netErr);
    });
  } catch (err) {
    console.warn('[Welcome Email] Error initiating welcome email dispatch:', err);
  }

  return newProfile;
}

/**
 * Sign Out Current User
 */
export async function signOutUser(): Promise<void> {
  await signOut(auth);
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

/**
 * Get currently authenticated session
 */
export function getStoredSessionUser(): StudentProfile | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed: StudentProfile = JSON.parse(raw);
    
    // If the avatar is a legacy auto-populated Unsplash placeholder, clear it
    // so the student's name initials are displayed instead unless they explicitly uploaded a picture
    if (parsed && parsed.avatar && parsed.avatar.includes('images.unsplash.com')) {
      parsed.avatar = '';
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(parsed));
    }
    
    return parsed;
  } catch (e) {
    console.error('Failed to parse auth user', e);
    return null;
  }
}

/**
 * Update user profile details
 */
export async function updateStoredUserProfile(updates: Partial<StudentProfile>): Promise<StudentProfile> {
  const current = getStoredSessionUser();
  if (!current) throw new Error('Not logged in');

  const updated: StudentProfile = {
    ...current,
    ...updates
  };

  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
  } catch (storageErr) {
    console.error('Failed to update session storage', storageErr);
    throw new Error('Storage limit reached. Please select a smaller photo.');
  }

  // Update in Firestore
  try {
    const uid = updated.uid || updated.id;
    if (uid && !uid.includes('demo')) {
      await setDoc(doc(db, 'users', uid), updated, { merge: true });
    }
  } catch (err) {
    console.warn('Could not update profile in Firestore', err);
  }

  return updated;
}
