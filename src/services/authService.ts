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
  // Simulate network latency (200ms)
  await new Promise((resolve) => setTimeout(resolve, 200));

  const cleanEmail = email.trim().toLowerCase();
  const accounts = getStoredAccounts();

  // Check direct email match or registration number match
  let match = accounts[cleanEmail];
  if (!match) {
    const byReg = Object.values(accounts).find(
      (a) => a.profile.regNumber.toLowerCase() === cleanEmail
    );
    if (byReg) match = byReg;
  }

  // If found in accounts
  if (match) {
    if (match.passwordHash && password && match.passwordHash !== password) {
      // If demo account password mismatch, allow if it's verto123 or update
      if (cleanEmail === DEMO_STUDENT_MALE.email.toLowerCase() || cleanEmail === DEMO_STUDENT_FEMALE.email.toLowerCase()) {
        throw new Error('Incorrect password. For demo student accounts, use password "verto123".');
      }
    }
    // Update active session
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(match.profile));
    return match.profile;
  }

  // If account was not pre-created, automatically generate a verified student profile
  // so the user can enter the application seamlessly without roadblock
  const derivedName = cleanEmail.includes('@')
    ? cleanEmail.split('@')[0].replace(/[._0-9]/g, ' ').trim() || 'Verto Student'
    : `Student ${cleanEmail}`;

  const formattedName = derivedName
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ') || 'Verto Student';

  const regDigits = cleanEmail.replace(/[^0-9]/g, '');
  const finalReg = regDigits.length >= 6 ? regDigits : `${Math.floor(12100000 + Math.random() * 899999)}`;
  const finalEmail = cleanEmail.includes('@') ? cleanEmail : `${formattedName.toLowerCase().replace(/\s+/g, '')}.${finalReg}@lpu.in`;

  const newId = `user-${Date.now()}`;
  const autoProfile: StudentProfile = {
    id: newId,
    uid: newId,
    name: formattedName,
    email: finalEmail,
    regNumber: finalReg,
    course: 'B.Tech Computer Science & Engineering',
    batch: '2024 - 2028',
    avatar: '',
    phone: '+91 98000-00000',
    rating: 5.0,
    totalRides: 0,
    moneySaved: 0,
    verifiedStudent: true,
    blockOrHostel: 'BH-3',
    gender: 'Male'
  };

  accounts[cleanEmail] = {
    profile: autoProfile,
    passwordHash: password || 'verto123'
  };
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(accounts));
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(autoProfile));

  return autoProfile;
}

/**
 * Sign Up a new student
 */
export async function signUpWithEmail(payload: SignUpPayload): Promise<StudentProfile> {
  // Simulate network latency (200ms)
  await new Promise((resolve) => setTimeout(resolve, 200));

  const cleanEmail = payload.email.trim().toLowerCase();
  const accounts = getStoredAccounts();

  const newId = `user-${Date.now()}`;
  const newProfile: StudentProfile = {
    id: accounts[cleanEmail]?.profile.id || newId,
    uid: accounts[cleanEmail]?.profile.uid || newId,
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

  // Save/overwrite in local storage
  accounts[cleanEmail] = {
    profile: newProfile,
    passwordHash: payload.password || 'verto123'
  };
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(accounts));
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

  // Update in accounts store as well
  try {
    const accounts = getStoredAccounts();
    const emailKey = current.email.toLowerCase();
    if (accounts[emailKey]) {
      accounts[emailKey].profile = updated;
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(accounts));
    }
  } catch (accountsErr) {
    console.warn('Could not update all account backups', accountsErr);
  }

  return updated;
}
