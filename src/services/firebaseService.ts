import { doc, setDoc, getDoc, collection, getDocs, updateDoc, query, where, orderBy, runTransaction, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { StudentProfile, Ride, MyBooking, RideRequest } from '../types';

export class FirebaseService {
  /**
   * Create a new ride request
   */
  public static async createRideRequest(request: RideRequest): Promise<void> {
    try {
      const ref = doc(db, 'rideRequests', request.id);
      await setDoc(ref, request);
    } catch (error) {
      console.error('[Firebase] Error creating ride request:', error);
      throw error;
    }
  }

  /**
   * Reject ride request for a specific driver
   */
  public static async rejectRideRequest(requestId: string, driverId: string): Promise<void> {
    try {
      const ref = doc(db, 'rideRequests', requestId);
      await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(ref);
        if (!snap.exists()) throw new Error('Ride request does not exist!');
        
        const data = snap.data() as RideRequest;
        const rejectedBy = data.rejectedBy || [];
        if (!rejectedBy.includes(driverId)) {
          rejectedBy.push(driverId);
          transaction.update(ref, { rejectedBy });
        }
      });
    } catch (error) {
      console.error('[Firebase] Error rejecting ride:', error);
      throw error;
    }
  }

  /**
   * Secure Atomic Ride Acceptance Transaction
   * Deducts 10 from passenger, adds 10 to driver.
   */
  public static async acceptRideRequest(requestId: string, driver: StudentProfile): Promise<boolean> {
    const rideRef = doc(db, 'rideRequests', requestId);
    
    try {
      await runTransaction(db, async (transaction) => {
        const rideSnap = await transaction.get(rideRef);
        if (!rideSnap.exists()) throw new Error('Ride request not found');
        
        const rideData = rideSnap.data() as RideRequest;
        
        // Ensure ride is still waiting
        if (rideData.status !== 'waiting') {
          throw new Error('Ride is no longer available');
        }

        const passengerId = rideData.passengerId;
        const passengerWalletRef = doc(db, 'wallets', passengerId);
        const driverWalletRef = doc(db, 'wallets', driver.id || driver.uid || '');

        const passWalletSnap = await transaction.get(passengerWalletRef);
        const drvWalletSnap = await transaction.get(driverWalletRef);

        const passBal = passWalletSnap.exists() ? passWalletSnap.data().balance : 0;
        const drvBal = drvWalletSnap.exists() ? drvWalletSnap.data().balance : 0;

        if (passBal < 10) {
          throw new Error('Passenger has insufficient funds');
        }

        // Deduct from Passenger
        const newPassBal = passBal - 10;
        transaction.update(passengerWalletRef, { balance: newPassBal, updatedAt: new Date().toISOString() });
        
        // Add to Driver
        const newDrvBal = drvBal + 10;
        if (drvWalletSnap.exists()) {
          transaction.update(driverWalletRef, { balance: newDrvBal, updatedAt: new Date().toISOString() });
        } else {
          transaction.set(driverWalletRef, { userId: driver.id || driver.uid || '', balance: newDrvBal, updatedAt: new Date().toISOString() });
        }

        // Create transaction logs
        const txId = `tx-${Date.now()}`;
        const passTxRef = doc(db, 'wallets', passengerId, 'transactions', `${txId}-pass`);
        transaction.set(passTxRef, {
          id: `${txId}-pass`,
          type: 'debit',
          amount: 10,
          description: `Ride Payment to Driver: ${driver.name}`,
          timestamp: new Date().toISOString(),
          method: 'VertoPay Instant Auto Pass',
          status: 'success',
          referenceId: rideData.id,
          userId: passengerId
        });

        const drvTxRef = doc(db, 'wallets', driver.id || driver.uid || '', 'transactions', `${txId}-drv`);
        transaction.set(drvTxRef, {
          id: `${txId}-drv`,
          type: 'credit',
          amount: 10,
          description: `Ride Fare from Passenger: ${rideData.passengerName}`,
          timestamp: new Date().toISOString(),
          method: 'VertoPay Instant Auto Pass',
          status: 'success',
          referenceId: rideData.id,
          userId: driver.id || driver.uid || ''
        });

        // Finally, update ride status
        transaction.update(rideRef, {
          status: 'accepted',
          driverId: driver.id || driver.uid || '',
          driverName: driver.name,
          driverAvatar: driver.avatar || '',
          acceptedAt: Date.now()
        });
      });
      
      return true;
    } catch (error) {
      console.error('[Firebase] Transaction failed: ', error);
      throw error;
    }
  }
  /**
   * Listen to active ride request for a passenger
   */
  public static listenToPassengerRequest(passengerId: string, callback: (request: RideRequest | null) => void): () => void {
    const q = query(collection(db, 'rideRequests'), where('passengerId', '==', passengerId));
    return onSnapshot(q, (snap) => {
      // Find the most recent active request
      const reqs = snap.docs.map(d => d.data() as RideRequest)
        .sort((a, b) => b.createdAt - a.createdAt);
      
      const active = reqs.find(r => r.status === 'waiting' || r.status === 'accepted');
      if (active) {
        callback(active);
      } else if (reqs.length > 0) {
        callback(reqs[0]); // Return the most recent one (could be expired/completed)
      } else {
        callback(null);
      }
    });
  }

  /**
   * Listen to all ride requests/history for a user (passenger or driver)
   */
  public static listenToUserRideHistory(userId: string, isDriver: boolean, callback: (requests: RideRequest[]) => void): () => void {
    const field = isDriver ? 'driverId' : 'passengerId';
    const q = query(collection(db, 'rideRequests'), where(field, '==', userId));
    return onSnapshot(q, (snap) => {
      const reqs = snap.docs.map(d => d.data() as RideRequest)
        .sort((a, b) => b.createdAt - a.createdAt);
      callback(reqs);
    });
  }

  /**
   * Listen to available waiting requests for drivers
   */
  public static listenToAvailableRequests(driverId: string, callback: (requests: RideRequest[]) => void): () => void {
    const q = query(collection(db, 'rideRequests'), where('status', '==', 'waiting'));
    return onSnapshot(q, (snap) => {
      const allRequests = snap.docs.map(d => d.data() as RideRequest);
      const now = Date.now();
      // Filter out expired ones immediately on the client (just in case they haven't been swept) and rejected ones
      const available = allRequests.filter(r => 
        r.expiresAt > now && 
        !(r.rejectedBy && r.rejectedBy.includes(driverId))
      );
      callback(available);
    });
  }
  
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
   * Listen to wallet data in real-time
   */
  public static listenToWallet(userId: string, callback: (data: { balance: number; transactions: any[] }) => void): () => void {
    const walletRef = doc(db, 'wallets', userId);
    const txCol = collection(db, 'wallets', userId, 'transactions');
    
    return onSnapshot(walletRef, async (walletSnap) => {
      try {
        const txSnap = await getDocs(query(txCol, orderBy('timestamp', 'desc')));
        const balance = walletSnap.exists() ? (walletSnap.data().balance ?? 0.0) : 0.0;
        const transactions: any[] = txSnap.docs.map(d => d.data());
        callback({ balance, transactions });
      } catch (e) {
        console.warn('[Firebase] Error in wallet snapshot:', e);
      }
    });
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

