import React, { useState, useEffect } from 'react';
import { PageTab, Ride, MyBooking, StudentProfile } from './types';
import { 
  INITIAL_AVAILABLE_RIDES, 
  INITIAL_USER_BOOKINGS 
} from './data/lpuData';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WalletProvider, useWallet } from './context/WalletContext';
import { AuthPage } from './components/AuthPage';
import { Navbar } from './components/Navbar';

import { HomeSection } from './components/HomeSection';
import { PassengerDashboard } from './components/PassengerDashboard';
import { DriverDashboard } from './components/DriverDashboard';
import { AvailableRidesSection } from './components/AvailableRidesSection';
import { LiveRidesMapSection } from './components/LiveRidesMapSection';
import { FindStudentsSection } from './components/FindStudentsSection';
import { MyRidesSection } from './components/MyRidesSection';
import { ProfileSection } from './components/ProfileSection';
import { JoinRideModal } from './components/JoinRideModal';
import { CreateRideModal } from './components/CreateRideModal';
import { TrackRideModal } from './components/TrackRideModal';
import { VertoPayRechargeModal } from './components/VertoPayRechargeModal';
import { VertoPayToasts } from './components/VertoPayToasts';
import { Footer } from './components/Footer';
import { FirebaseService } from './services/firebaseService';

// Inner component with authenticated user context
interface AuthenticatedAppProps {
  currentUser: StudentProfile;
  onSignOut: () => void;
  onUpdateUser: (updated: Partial<StudentProfile>) => Promise<void>;
}

function AuthenticatedApp({ currentUser, onSignOut, onUpdateUser }: AuthenticatedAppProps) {
  const { isRechargeModalOpen, closeRechargeModal, rechargePresetAmount } = useWallet();
  const [currentTab, setCurrentTab] = useState<PageTab>('home');
  const [rides, setRides] = useState<Ride[]>(INITIAL_AVAILABLE_RIDES);
  const [bookings, setBookings] = useState<MyBooking[]>([]);

  // Sync real-time ride history from Firestore (Passenger or Driver)
  useEffect(() => {
    if (!currentUser?.id && !currentUser?.uid) return;
    const userId = currentUser.uid || currentUser.id;
    const isDriver = currentUser.accountType === 'driver';

    const unsubscribe = FirebaseService.listenToUserRideHistory(userId, isDriver, (reqs) => {
      const realBookings: MyBooking[] = reqs.map((req) => {
        const isAccepted = req.status === 'accepted';
        const isCompleted = req.status === 'completed';
        const isCancelled = req.status === 'cancelled' || req.status === 'expired';

        return {
          id: req.id,
          rideId: req.id,
          ride: {
            id: req.id,
            driver: {
              id: req.driverId || 'driver-id',
              name: req.driverName || (isDriver ? currentUser.name : 'Waiting for Driver'),
              email: 'driver@lpu.in',
              course: 'Driver Partner',
              phone: '+91 98765-43210',
              gender: 'Other',
              blockOrHostel: 'Campus Hub',
              avatar: req.driverAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              accountType: 'driver'
            },
            pickup: { id: req.pickupId, name: req.pickupName, x: 100, y: 100 },
            destination: { id: req.destinationId, name: req.destinationName, x: 300, y: 300 },
            vehicleType: 'Auto-Rickshaw',
            vehicleNumber: 'PB08-AUTO-1234',
            departureTime: new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            totalSeats: 1,
            availableSeats: isAccepted ? 0 : 1,
            occupiedSeats: isAccepted ? 1 : 0,
            pricePerSeat: 10,
            status: isAccepted ? 'active' : (isCompleted ? 'completed' : 'cancelled'),
            currentLocationName: req.pickupName,
            bookedByStudentIds: [req.passengerId],
            routeStops: [req.pickupName, req.destinationName],
            estimatedArrival: '10 mins'
          },
          seatsBooked: 1,
          boardingOtp: '4892',
          bookedAt: new Date(req.createdAt).toLocaleDateString(),
          status: isAccepted ? 'active' : (isCompleted ? 'completed' : (isCancelled ? 'cancelled' : 'upcoming')),
          totalPrice: 10
        };
      });

      if (realBookings.length > 0) {
        setBookings(realBookings);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Search presets from Home
  const [searchPresets, setSearchPresets] = useState<{
    pickupId?: string;
    destinationId?: string;
    seats?: number;
  }>({});

  // Modals state
  const [joinModalRide, setJoinModalRide] = useState<Ride | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [trackModalRide, setTrackModalRide] = useState<Ride | null>(null);

  // Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Handlers
  const handleSearchFromHome = (pickupId: string, destId: string, seats: number) => {
    setSearchPresets({
      pickupId,
      destinationId: destId,
      seats
    });
    setCurrentTab('book');
  };

  const handleOpenJoinRide = (ride: Ride) => {
    setJoinModalRide(ride);
  };

  const handleConfirmBooking = (newBooking: MyBooking) => {
    // Add to bookings
    setBookings((prev) => [newBooking, ...prev]);

    // Update the ride in available rides (decrement available seats, increment occupied)
    setRides((prev) =>
      prev.map((r) => {
        if (r.id === newBooking.rideId) {
          const newOccupied = r.occupiedSeats + newBooking.seatsBooked;
          const newAvailable = Math.max(0, r.totalSeats - newOccupied);
          return {
            ...r,
            occupiedSeats: newOccupied,
            availableSeats: newAvailable,
            bookedByStudentIds: [...r.bookedByStudentIds, currentUser.id]
          };
        }
        return r;
      })
    );

    setJoinModalRide(null);
    showToast(`Ride booked successfully! OTP is ${newBooking.boardingOtp}`);
  };

  const handleCreateRide = (newRide: Ride) => {
    setRides((prev) => [newRide, ...prev]);
    setIsCreateModalOpen(false);
    showToast('Your campus ride has been offered to students!');
    setCurrentTab('book');
  };

  const handleCancelBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    // Update booking status
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );

    // Free up seats in ride
    setRides((prev) =>
      prev.map((r) => {
        if (r.id === booking.rideId) {
          const newOccupied = Math.max(0, r.occupiedSeats - booking.seatsBooked);
          const newAvailable = Math.min(r.totalSeats, r.availableSeats + booking.seatsBooked);
          return {
            ...r,
            occupiedSeats: newOccupied,
            availableSeats: newAvailable
          };
        }
        return r;
      })
    );

    showToast('Booking cancelled successfully.');
  };

  const activeRidesCount = rides.filter((r) => r.status === 'upcoming' && r.availableSeats > 0).length;
  const myActiveBookingsCount = bookings.filter((b) => b.status === 'upcoming').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* Top Universal Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenCreateRide={() => setIsCreateModalOpen(true)}
        activeRidesCount={activeRidesCount}
        myActiveBookingsCount={myActiveBookingsCount}
        currentUser={currentUser}
        onSignOut={onSignOut}
      />

      {/* Main View Container */}
      <main className="flex-1">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-4 sm:right-8 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="ml-2 text-slate-400 hover:text-white font-mono cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* 1. Home Page / Dashboard */}
        {currentTab === 'home' && (
          <>
            {(!currentUser.accountType || currentUser.accountType === 'passenger') && (
              <PassengerDashboard currentUser={currentUser} />
            )}
            {currentUser.accountType === 'driver' && (
              <DriverDashboard currentUser={currentUser} />
            )}
          </>
        )}

        {/* 2. Available Rides Page */}
        {currentTab === 'book' && (
          <AvailableRidesSection
            rides={rides}
            onJoinRide={handleOpenJoinRide}
            onOpenCreateRide={() => setIsCreateModalOpen(true)}
            presetPickupId={searchPresets.pickupId}
            presetDestinationId={searchPresets.destinationId}
            presetSeats={searchPresets.seats}
          />
        )}

        {/* 3. Campus Auto Paths & Routes */}
        {currentTab === 'live' && (
          <LiveRidesMapSection
            rides={rides}
            onJoinRide={handleOpenJoinRide}
            onTrackRide={(r) => setTrackModalRide(r)}
          />
        )}

        {/* 4. Find Students Going Your Way */}
        {currentTab === 'find-students' && (
          <FindStudentsSection
            rides={rides}
            onJoinRide={handleOpenJoinRide}
            onOpenCreateRide={() => setIsCreateModalOpen(true)}
          />
        )}

        {/* 5. My Rides */}
        {currentTab === 'my-rides' && (
          <MyRidesSection
            bookings={bookings}
            onTrackRide={(r) => setTrackModalRide(r)}
            onCancelBooking={handleCancelBooking}
            onNavigate={setCurrentTab}
            onOpenCreateRide={() => setIsCreateModalOpen(true)}
          />
        )}

        {/* 6. Student Profile */}
        {currentTab === 'profile' && (
          <ProfileSection
            user={currentUser}
            onUpdateUser={async (updated) => {
              try {
                await onUpdateUser(updated);
                showToast('Student profile updated successfully!');
              } catch (e: any) {
                showToast(e?.message || 'Failed to update profile');
              }
            }}
            onSignOut={onSignOut}
          />
        )}

      </main>

      {/* Global Modals */}
      {joinModalRide && (
        <JoinRideModal
          ride={joinModalRide}
          currentUser={currentUser}
          onClose={() => setJoinModalRide(null)}
          onConfirmBooking={handleConfirmBooking}
        />
      )}

      {isCreateModalOpen && (
        <CreateRideModal
          currentUser={currentUser}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateRide={handleCreateRide}
        />
      )}

      {trackModalRide && (
        <TrackRideModal
          ride={trackModalRide}
          onClose={() => setTrackModalRide(null)}
        />
      )}

      {/* VertoPay Recharge Modal & Floating Toasts */}
      <VertoPayRechargeModal
        isOpen={isRechargeModalOpen}
        onClose={closeRechargeModal}
        presetAmount={rechargePresetAmount}
      />
      <VertoPayToasts />

      {/* Footer */}
      <Footer onNavigate={setCurrentTab} />

    </div>
  );
}

// Auth Gatekeeper component
function AppContent() {
  const { user, loading, signOut, updateUser } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Connecting to LPU Campus Session...
        </span>
      </div>
    );
  }

  // If not logged in, enforce Sign In / Sign Up page first
  if (!user) {
    return <AuthPage />;
  }

  // Logged in user enters website
  return (
    <AuthenticatedApp
      currentUser={user}
      onSignOut={signOut}
      onUpdateUser={updateUser}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WalletProvider>
        <AppContent />
      </WalletProvider>
    </AuthProvider>
  );
}
