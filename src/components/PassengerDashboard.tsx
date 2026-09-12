import React, { useState, useEffect } from 'react';
import { StudentProfile, RideRequest } from '../types';
import { FirebaseService } from '../services/firebaseService';
import { LPU_LOCATIONS } from '../data/lpuData';
import { VertoPayWidget } from './VertoPayWidget';
import { Navigation, MapPin, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

interface PassengerDashboardProps {
  currentUser: StudentProfile;
}

export const PassengerDashboard: React.FC<PassengerDashboardProps> = ({ currentUser }) => {
  const { balance, triggerNeonWarningToast } = useWallet();
  const [activeRequest, setActiveRequest] = useState<RideRequest | null>(null);
  const [pickupId, setPickupId] = useState<string>('loc-maingate');
  const [destinationId, setDestinationId] = useState<string>('loc-unimall');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = FirebaseService.listenToPassengerRequest(currentUser.uid || currentUser.id, (req) => {
      setActiveRequest(req);
    });
    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    if (!activeRequest || activeRequest.status !== 'waiting') return;
    
    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, activeRequest.expiresAt - now);
      setTimeLeft(remaining);
      
      // Auto expire locally if timer hits 0
      if (remaining === 0 && activeRequest.status === 'waiting') {
        import('firebase/firestore').then(({ doc, updateDoc }) => {
          import('../lib/firebase').then(({ db }) => {
            updateDoc(doc(db, 'rideRequests', activeRequest.id), { status: 'expired' }).catch(console.error);
          });
        });
      }
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeRequest]);

  const handleRequestRide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (balance < 10) {
      triggerNeonWarningToast("Insufficient VertoPay balance. Please recharge at least ₹10.");
      return;
    }
    
    setIsSubmitting(true);
    const pickupLoc = LPU_LOCATIONS.find(l => l.id === pickupId);
    const destLoc = LPU_LOCATIONS.find(l => l.id === destinationId);
    
    if (!pickupLoc || !destLoc) return;

    const now = Date.now();
    const newRequest: RideRequest = {
      id: `req_${now}_${currentUser.uid || currentUser.id}`,
      passengerId: currentUser.uid || currentUser.id,
      passengerName: currentUser.name,
      passengerAvatar: currentUser.avatar,
      pickupId: pickupLoc.id,
      destinationId: destLoc.id,
      pickupName: pickupLoc.name,
      destinationName: destLoc.name,
      status: 'waiting',
      createdAt: now,
      expiresAt: now + 5 * 60 * 1000, // 5 minutes
      rejectedBy: []
    };

    try {
      await FirebaseService.createRideRequest(newRequest);
    } catch (err) {
      console.error(err);
      alert('Failed to request ride');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Passenger Dashboard</h1>
        <p className="text-slate-600">Welcome back, {currentUser.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          
          {/* Active Request View */}
          {activeRequest && activeRequest.status === 'waiting' && timeLeft > 0 && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 text-indigo-700 mb-4">
                <Clock className="w-6 h-6 animate-pulse" />
                <h3 className="font-bold text-lg">Waiting for a driver to accept...</h3>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm text-center mb-4">
                <span className="text-4xl font-mono font-black text-indigo-600">
                  {formatTime(timeLeft)}
                </span>
              </div>
              <div className="space-y-2 text-sm text-indigo-900 font-medium">
                <p><strong>From:</strong> {activeRequest.pickupName}</p>
                <p><strong>To:</strong> {activeRequest.destinationName}</p>
              </div>
            </div>
          )}

          {activeRequest && activeRequest.status === 'waiting' && timeLeft === 0 && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 text-red-700 mb-2">
                <XCircle className="w-6 h-6" />
                <h3 className="font-bold text-lg">No ride available</h3>
              </div>
              <p className="text-red-600 text-sm">No driver accepted your request within 5 minutes. You were not charged.</p>
              <button 
                onClick={() => setActiveRequest(null)}
                className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-sm font-bold transition-all"
              >
                Dismiss
              </button>
            </div>
          )}

          {activeRequest && activeRequest.status === 'accepted' && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 text-emerald-700 mb-4">
                <CheckCircle2 className="w-6 h-6" />
                <h3 className="font-bold text-lg">Ride Accepted!</h3>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm mb-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-xl overflow-hidden shrink-0">
                  {activeRequest.driverAvatar ? (
                    <img src={activeRequest.driverAvatar} alt="Driver" className="w-full h-full object-cover" />
                  ) : activeRequest.driverName?.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{activeRequest.driverName}</p>
                  <p className="text-xs text-slate-500">Your driver is on the way.</p>
                </div>
              </div>
              <p className="text-emerald-800 text-sm font-medium mb-4">
                ₹10 has been securely deducted from your wallet via VertoPay.
              </p>
              <button 
                onClick={() => setActiveRequest(null)}
                className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-sm font-bold transition-all"
              >
                Finish
              </button>
            </div>
          )}

          {/* Booking Form (Only if no active waiting/accepted request) */}
          {(!activeRequest || ['completed', 'cancelled', 'expired'].includes(activeRequest.status) || (activeRequest.status === 'waiting' && timeLeft === 0)) && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Book a Ride</h2>
              <form onSubmit={handleRequestRide} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-indigo-600" />
                    Pickup Location
                  </label>
                  <select
                    value={pickupId}
                    onChange={(e) => setPickupId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-3 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  >
                    {LPU_LOCATIONS.map((loc) => (
                      <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    Destination
                  </label>
                  <select
                    value={destinationId}
                    onChange={(e) => setDestinationId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-3 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  >
                    {LPU_LOCATIONS.map((loc) => (
                      <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-indigo-900">Fixed Fare</p>
                    <p className="text-xs text-indigo-700">Deducted on acceptance</p>
                  </div>
                  <p className="text-lg font-black text-indigo-700">₹10</p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || pickupId === destinationId}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-600/20"
                >
                  {isSubmitting ? 'Requesting...' : 'Request Ride'}
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Right side: Wallet widget */}
        <div className="space-y-6">
          <VertoPayWidget />
        </div>
      </div>
    </div>
  );
};
