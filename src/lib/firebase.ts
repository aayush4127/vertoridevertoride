import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton using official platform provisioned credentials
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore Database (using the provisioned databaseId if provided)
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

// Initialize Firebase Auth
export const auth = getAuth(app);
