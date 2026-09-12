import React, { useState, useEffect } from 'react';
import { StudentProfile, RideRequest } from '../types';
import { FirebaseService } from '../services/firebaseService';
import { VertoPayWidget } from './VertoPayWidget';
import { Navigation, MapPin, Clock, CheckCircle2, User } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

interface DriverDashboardProps {
  currentUser: StudentProfile;
}

export const DriverDashboard: React.FC<DriverDashboardProps> = ({ currentUser }) => {
  const { triggerNeonWarningToast, triggerSuccessPaymentToast } = useWallet();
  const [availableRequests, setAvailableRequests] = useState<RideRequest[]>([]);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = FirebaseService.listenToAvailableRequests(currentUser.uid || currentUser.id, (reqs) => {
      setAvailableRequests(reqs);
    });
    return () => unsubscribe();
  }, [currentUser]);

  const handleAccept = async (request: RideRequest) => {
    setAcceptingId(request.id);
    try {
      await FirebaseService.acceptRideRequest(request.id, currentUser);
      triggerSuccessPaymentToast(`You accepted the ride from ${request.passengerName}. ₹10 has been added to your wallet!`);
    } catch (err: any) {
      console.error(err);
      if (err.message.includes('insufficient funds')) {
        triggerNeonWarningToast("The passenger does not have enough balance to pay for this ride.");
      } else if (err.message.includes('not found') || err.message.includes('no longer available')) {
        triggerNeonWarningToast("Sorry, this ride has already been accepted by another driver or has expired.");
      } else {
        triggerNeonWarningToast("Failed to accept ride.");
      }
    } finally {
      setAcceptingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await FirebaseService.rejectRideRequest(requestId, currentUser.uid || currentUser.id);
    } catch (err) {
      console.error(err);
    }
  };

  const formatTimeLeft = (expiresAt: number) => {
    const remaining = Math.max(0, expiresAt - Date.now());
    const m = Math.floor(remaining / 60000);
    const s = Math.floor((remaining % 60000) / 1000);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Driver Dashboard</h1>
        <p className="text-slate-600">Find and accept ride requests on campus.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Available requests */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Available Requests
            <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-sm font-black">
              {availableRequests.length}
            </span>
          </h2>

          {availableRequests.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-sm">
              <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-700 mb-1">No requests right now</h3>
              <p className="text-slate-500 text-sm">Stay tuned. New passenger requests will appear here instantly.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {availableRequests.map((req) => (
                <div key={req.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-5">
                  {/* Passenger Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold overflow-hidden shrink-0">
                        {req.passengerAvatar ? (
                          <img src={req.passengerAvatar} alt="Passenger" className="w-full h-full object-cover" />
                        ) : <User className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{req.passengerName}</p>
                        <p className="text-xs text-indigo-600 font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Expires in {formatTimeLeft(req.expiresAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Navigation className="w-4 h-4 text-indigo-500 shrink-0" />
                        <span className="font-medium">{req.pickupName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                        <span className="font-medium">{req.destinationName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Fare */}
                  <div className="flex flex-col justify-between sm:w-32 shrink-0">
                    <div className="text-right mb-4 sm:mb-0">
                      <p className="text-xs text-slate-500 font-medium">Fare</p>
                      <p className="text-xl font-black text-emerald-600">₹10</p>
                    </div>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleAccept(req)}
                        disabled={acceptingId === req.id}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
                      >
                        {acceptingId === req.id ? '...' : 'Accept'}
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        disabled={acceptingId === req.id}
                        className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column: Wallet */}
        <div className="space-y-6">
          <VertoPayWidget />
        </div>
      </div>
    </div>
  );
};
