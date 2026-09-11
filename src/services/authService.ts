import { StudentProfile, SignUpPayload } from '../types';
import { CURRENT_USER } from '../data/lpuData';

// Storage keys for local persistence until Firebase Auth is connected
const AUTH_STORAGE_KEY = 'vertoride_auth_user';
const USERS_STORAGE_KEY = 'vertoride_registered_users';

// Pre-seeded demo student accounts for rapid testing & evaluation
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
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  phone: '+91 98765-11223',
  rating: 4.95,
  totalRides: 32,
  moneySaved: 1920,
  verifiedStudent: true,
  blockOrHostel: 'GH-2, Room 308',
  gender: 'Female'
};

/**
 * =========================================================================
 * FIREBASE AUTH INTEGRATION BLUEPRINT:
 * 
 * When you configure Firebase in your project:
 * 1. Initialize Firebase in a `firebaseConfig.ts`:
 *    `import { initializeApp } from 'firebase/app';`
 *    `import { getAuth } from 'firebase/auth';`
 *    `import { getFirestore } from 'firebase/firestore';`
 * 2. In this authService:
 *    - Replace `signInWithEmail` with `signInWithEmailAndPassword(auth, email, password)`
 *    - Replace `signUpWithEmail` with `createUserWithEmailAndPassword(auth, email, password)`
 *      and save the profile to `setDoc(doc(db, 'users', userCredential.user.uid), profileData)`
 *    - Replace `signOutUser` with `signOut(auth)`
 *    - Listen to `onAuthStateChanged(auth, (user) => ...)`
 * 
 * All UI components consume `useAuth()` and require ZERO changes when Firebase is plugged in!
 * =========================================================================
 */

// Helper to retrieve all registered accounts
const getStoredAccounts = (): Record<string, { profile: StudentProfile; passwordHash: string }> => {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      // Initialize with demo accounts
      const initial: Record<string, { profile: StudentProfile; passwordHash: string }> = {
        [DEMO_STUDENT_MALE.email.toLowerCase()]: {
          profile: DEMO_STUDENT_MALE,
          passwordHash: 'verto123'
        },
        [DEMO_STUDENT_FEMALE.email.toLowerCase()]: {
          profile: DEMO_STUDENT_FEMALE,
          passwordHash: 'verto123'
        }
      };
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read registered accounts from localStorage', err);
    return {};
  }
};

/**
 * Sign In with Email and Password
 */
export async function signInWithEmail(email: string, password: string): Promise<StudentProfile> {
  // Simulate network latency (250ms)
  await new Promise((resolve) => setTimeout(resolve, 250));

  const cleanEmail = email.trim().toLowerCase();
  const accounts = getStoredAccounts();

  // Also allow login by Reg Number
  let match = accounts[cleanEmail];
  if (!match) {
    const byReg = Object.values(accounts).find(
      (a) => a.profile.regNumber.toLowerCase() === cleanEmail
    );
    if (byReg) match = byReg;
  }

  if (!match) {
    throw new Error('No account found with this email or registration number. Please sign up first.');
  }

  if (match.passwordHash && match.passwordHash !== password) {
    throw new Error('Incorrect password. For demo accounts, use password "verto123".');
  }

  // Persist session
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(match.profile));
  return match.profile;
}

/**
 * Sign Up a new student
 */
export async function signUpWithEmail(payload: SignUpPayload): Promise<StudentProfile> {
  // Simulate network latency (300ms)
  await new Promise((resolve) => setTimeout(resolve, 300));

  const cleanEmail = payload.email.trim().toLowerCase();
  const accounts = getStoredAccounts();

  if (accounts[cleanEmail]) {
    throw new Error('An account with this email address already exists. Please sign in.');
  }

  // Check if reg number already used
  const existingReg = Object.values(accounts).find(
    (a) => a.profile.regNumber.toLowerCase() === payload.regNumber.trim().toLowerCase()
  );
  if (existingReg) {
    throw new Error(`Registration number ${payload.regNumber} is already registered.`);
  }

  const newId = `user-${Date.now()}`;
  const newProfile: StudentProfile = {
    id: newId,
    uid: newId, // Firebase UID compatibility
    name: payload.name.trim(),
    email: cleanEmail,
    regNumber: payload.regNumber.trim(),
    course: payload.course.trim() || 'B.Tech CSE',
    batch: '2024 - 2028',
    avatar: payload.gender === 'Female'
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    phone: payload.phone.trim() || '+91 98000-00000',
    rating: 5.0,
    totalRides: 0,
    moneySaved: 0,
    verifiedStudent: true,
    blockOrHostel: payload.blockOrHostel || (payload.gender === 'Female' ? 'GH-1' : 'BH-1'),
    gender: payload.gender
  };

  // Save in local storage
  accounts[cleanEmail] = {
    profile: newProfile,
    passwordHash: payload.password || 'verto123'
  };
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(accounts));

  // Auto sign in
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newProfile));

  return newProfile;
}

/**
 * Sign Out Current User
 */
export async function signOutUser(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

/**
 * Get currently authenticated session
 */
export function getStoredSessionUser(): StudentProfile | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
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

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));

  // Update in accounts store as well
  const accounts = getStoredAccounts();
  const emailKey = current.email.toLowerCase();
  if (accounts[emailKey]) {
    accounts[emailKey].profile = updated;
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(accounts));
  }

  return updated;
}
