import { doc, setDoc, getDoc, collection, getDocs, updateDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { StudentProfile, Ride, MyBooking } from '../types';

export class FirebaseService {
  /**
   * Sync or save user profile to Firestore
   */
  public static async saveUserProfile(user: StudentProfile): Promise<boolean> {
    try {
      const userRef = doc(db, 'users', user.id);
      const payload: Record<string, any> = {
        ...user,
        updatedAt: new Date().toISOString()
      };

      const walletRef = doc(db, 'wallets', user.id);
      const walletSnap = await getDoc(walletRef);
      if (!walletSnap.exists()) {
        await setDoc(walletRef, {
          userId: user.id,
          balance: 0.0,
          updatedAt: new Date().toISOString()
        });
      }

      await setDoc(userRef, payload, { merge: true });
      console.log('[Firebase] User profile saved successfully:', user.email);

      return true;
    } catch (error) {
      console.error('[Firebase] Error saving user profile:', error);
      return false;
    }
  }

  /**
   * Find user profile by email in Firestore
   */
  public static async getUserByEmail(email: string): Promise<any | null> {
    try {
      const usersCol = collection(db, 'users');
      const q = query(usersCol, where('email', '==', email.toLowerCase().trim()));
      const querySnap = await getDocs(q);

      if (!querySnap.empty) {
        return querySnap.docs[0].data();
      }
      return null;
    } catch (error) {
      console.warn('[Firebase] Error fetching user by email:', error);
      return null;
    }
  }

  /**
   * Save wallet transaction and update balance
   */
  public static async recordTransaction(userId: string, tx: any, newBalance: number): Promise<void> {
    try {
      // 1. Update wallet balance
      const walletRef = doc(db, 'wallets', userId);
      await setDoc(walletRef, {
        userId,
        balance: newBalance,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // 2. Save transaction to subcollection or top-level transactions
      const txRef = doc(db, 'wallets', userId, 'transactions', tx.id);
      await setDoc(txRef, {
        ...tx,
        userId
      });
      console.log('[Firebase] Transaction recorded in Firestore for user:', userId);
    } catch (error) {
      console.warn('[Firebase] Error recording transaction:', error);
    }
  }

  /**
   * Load wallet data from Firestore
   */
  public static async getWalletData(userId: string): Promise<{ balance: number; transactions: any[] } | null> {
    try {
      const walletRef = doc(db, 'wallets', userId);
      const walletSnap = await getDoc(walletRef);

      const txCol = collection(db, 'wallets', userId, 'transactions');
      const txSnap = await getDocs(query(txCol, orderBy('timestamp', 'desc')));

      const balance = walletSnap.exists() ? (walletSnap.data().balance ?? 0.0) : 0.0;
      const transactions: any[] = txSnap.docs.map(d => d.data());

      return { balance, transactions };
    } catch (error) {
      console.warn('[Firebase] Error getting wallet data:', error);
      return null;
    }
  }

  /**
   * Save a newly offered ride to Firestore
   */
  public static async saveRide(ride: Ride): Promise<void> {
    try {
      const rideRef = doc(db, 'rides', ride.id);
      await setDoc(rideRef, {
        ...ride,
        createdAt: new Date().toISOString()
      });
      console.log('[Firebase] Ride created in Firestore:', ride.id);
    } catch (error) {
      console.warn('[Firebase] Error saving ride to Firestore:', error);
    }
  }

  /**
   * Fetch all rides from Firestore
   */
  public static async getAvailableRides(): Promise<Ride[] | null> {
    try {
      const ridesCol = collection(db, 'rides');
      const snap = await getDocs(ridesCol);
      if (snap.empty) return null;

      const rides: Ride[] = snap.docs.map(d => d.data() as Ride);
      return rides.filter(r => r.availableSeats > 0);
    } catch (error) {
      console.warn('[Firebase] Error fetching rides:', error);
      return null;
    }
  }

  /**
   * Save a booking/ticket to Firestore
   */
  public static async saveBooking(booking: MyBooking, userId: string): Promise<void> {
    try {
      const bookingRef = doc(db, 'bookings', booking.id);
      await setDoc(bookingRef, {
        ...booking,
        userId,
        createdAt: new Date().toISOString()
      });

      // Decrement seats on the ride
      const rideRef = doc(db, 'rides', booking.rideId);
      const rideSnap = await getDoc(rideRef);
      if (rideSnap.exists()) {
        const currentSeats = rideSnap.data().availableSeats || 1;
        await updateDoc(rideRef, {
          availableSeats: Math.max(0, currentSeats - booking.seatsBooked)
        });
      }
      console.log('[Firebase] Booking saved in Firestore:', booking.id);
    } catch (error) {
      console.warn('[Firebase] Error saving booking:', error);
    }
  }

  /**
   * Get user booking history from Firestore
   */
  public static async getUserBookings(userId: string): Promise<MyBooking[] | null> {
    try {
      const bookingsCol = collection(db, 'bookings');
      const q = query(bookingsCol, where('userId', '==', userId));
      const snap = await getDocs(q);
      if (snap.empty) return null;

      return snap.docs.map(d => d.data() as MyBooking);
    } catch (error) {
      console.warn('[Firebase] Error fetching user bookings:', error);
      return null;
    }
  }
}

