import React, { useState } from 'react';
import { Ride, MyBooking, StudentProfile } from '../types';
import { useWallet } from '../context/WalletContext';
import { 
  X, 
  Car, 
  MapPin, 
  Navigation, 
  Users, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Wallet,
  PlusCircle,
  AlertTriangle,
  Zap,
  Ticket
} from 'lucide-react';

interface JoinRideModalProps {
  ride: Ride | null;
  currentUser: StudentProfile;
  onClose: () => void;
  onConfirmBooking: (booking: MyBooking) => void;
}

export const JoinRideModal: React.FC<JoinRideModalProps> = ({
  ride,
  currentUser,
  onClose,
  onConfirmBooking
}) => {
  if (!ride) return null;

  const { balance, deductFare, openRechargeModal, triggerNeonWarningToast } = useWallet();
  const [seatsToBook, setSeatsToBook] = useState<number>(1);
  const [pickupNote, setPickupNote] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [insufficientError, setInsufficientError] = useState<boolean>(false);

  // Exact standard campus pool seat pass fare
  const fareToDeduct = 15;
  const boardingOtp = Math.floor(1000 + Math.random() * 9000).toString();

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. FARE DEDUCTION & BALANCE CHECK LOGIC
    // Check if balance is less than 15 or less than 10
    if (balance < fareToDeduct || balance < 10) {
      setInsufficientError(true);
      // Trigger vibrant floating neon-red warning toast as requested
      triggerNeonWarningToast('Insufficient Balance in VertoPay! Please top up via UPI.');
      return;
    }

    // Deduct exactly ₹15 from localStorage wallet balance
    const deductionResult = deductFare(fareToDeduct, `Campus Pool: ${ride.pickup.name} to ${ride.destination.name}`);
    if (!deductionResult.success) {
      setInsufficientError(true);
      return;
    }

    const newBooking: MyBooking = {
      id: `booking-${Date.now()}`,
      rideId: ride.id,
      ride: {
        ...ride,
        occupiedSeats: ride.occupiedSeats + seatsToBook,
        availableSeats: Math.max(0, ride.availableSeats - seatsToBook)
      },
      seatsBooked: seatsToBook,
      totalPrice: fareToDeduct,
      bookedAt: 'Just now',
      status: 'active',
      boardingOtp: boardingOtp,
      pickupNote: pickupNote || 'Waiting at pickup point',
      coPassengers: [
        { name: `${ride.driver.name} (Driver)`, course: ride.driver.course, phone: ride.driver.phone },
        { name: `${currentUser.name} (You)`, course: currentUser.course, phone: currentUser.phone }
      ]
    };

    setInsufficientError(false);
    setIsSuccess(true);

    setTimeout(() => {
      onConfirmBooking(newBooking);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 relative border border-slate-100">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          /* UNLOCKED DIGITAL TICKET & SUCCESS SCREEN */
          <div className="py-4 text-center space-y-5 animate-in fade-in">
            <div className="relative mx-auto w-16 h-16">
              <div className="absolute inset-0 bg-emerald-400/30 rounded-full blur-lg animate-pulse" />
              <div className="relative w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/40">
                <CheckCircle2 className="w-9 h-9" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Digital Pass Unlocked
              </span>
              <h3 className="text-2xl font-black text-slate-900 pt-1">
                Seat Confirmed & Paid!
              </h3>
              <p className="text-xs text-slate-500">
                ₹15 deducted from VertoPay. Your digital boarding pass is ready.
              </p>
            </div>

            {/* Digital Ticket Card */}
            <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white p-5 rounded-2xl border border-indigo-500/30 shadow-xl text-left space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-indigo-800/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-black tracking-wide text-white uppercase">VertoRide Digital Pass</span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Paid ₹15 via VertoPay
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Driver</span>
                  <span className="font-bold text-white text-sm">{ride.driver.name}</span>
                  <span className="text-[11px] text-indigo-300 block">{ride.vehicleType}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Boarding OTP</span>
                  <span className="text-2xl font-black font-mono text-emerald-400 tracking-wider">
                    {boardingOtp}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-indigo-800/80 flex items-center justify-between text-[11px] text-slate-300">
                <span className="truncate max-w-[200px]">{ride.pickup.name} → {ride.destination.name}</span>
                <span className="font-semibold text-emerald-300">Departure: {ride.departureTime}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Redirecting to your active rides tab...
            </p>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-indigo-600 mb-1">
                <Car className="w-3.5 h-3.5" />
                <span>Confirm Ride Booking & VertoPay Pass</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Join {ride.driver.name}'s Ride
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {ride.vehicleType} • {ride.distanceFromUserKm} km away from your location
              </p>
            </div>

            {/* Driver & Route summary card */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
              
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-indigo-100/80 border border-indigo-200 text-indigo-700 flex items-center justify-center text-base shrink-0">
                  {ride.vehicleType === 'E-Rickshaw' ? '🛺' : (ride.vehicleType === 'Auto-Rickshaw' ? '🚕' : '🚗')}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{ride.driver.name}</h4>
                  <p className="text-[11px] text-slate-500">{ride.driver.course} • ID: {ride.driver.regNumber}</p>
                </div>
                <div className="ml-auto text-right">
                  <span className="text-xs font-extrabold text-indigo-600">★ {ride.driver.rating}</span>
                  <span className="text-[10px] text-slate-400 block">{ride.driver.totalRides} rides</span>
                </div>
              </div>

              {/* Route */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Navigation className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="text-slate-500">From:</span>
                  <span className="font-bold text-slate-800 truncate">{ride.pickup.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span className="text-slate-500">To:</span>
                  <span className="font-bold text-slate-800 truncate">{ride.destination.name}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Departure: {ride.departureTime} (Est. Arrival {ride.estimatedArrival})</span>
                </div>
              </div>

            </div>

            {/* Booking Form */}
            <form onSubmit={handleConfirm} className="space-y-4 text-xs">
              
              {/* Seats selector */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">
                  Select Number of Seats (Max {ride.availableSeats} available)
                </label>
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(ride.availableSeats, 3) }).map((_, idx) => {
                    const count = idx + 1;
                    return (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setSeatsToBook(count)}
                        className={`flex-1 py-2.5 rounded-xl font-bold border transition-all cursor-pointer ${
                          seatsToBook === count
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {count} {count === 1 ? 'Seat' : 'Seats'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pickup location note */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Pickup landmark or note for driver (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Waiting near Main Gate SBI ATM or Nescafe"
                  value={pickupNote}
                  onChange={(e) => setPickupNote(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-indigo-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden"
                />
              </div>

              {/* VertoPay Wallet Payment Breakdown & Balance Check */}
              <div className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                balance < fareToDeduct
                  ? 'bg-rose-50/80 border-rose-200'
                  : 'bg-indigo-50/80 border-indigo-100'
              }`}>
                <div className="flex items-center justify-between pb-2 border-b border-indigo-200/50">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                      <Wallet className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-900 block leading-tight">VertoPay Digital Wallet</span>
                      <span className="text-[10px] text-slate-500">Live Campus Pass Balance</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Current Balance</span>
                    <span className={`text-sm font-black font-mono ${
                      balance < fareToDeduct ? 'text-rose-600' : 'text-emerald-600'
                    }`}>
                      ₹{balance}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Fare to Deduct:</span>
                  <span className="font-black text-slate-900 text-sm">₹{fareToDeduct}</span>
                </div>

                {balance < fareToDeduct ? (
                  <div className="pt-2 border-t border-rose-200 space-y-2">
                    <div className="flex items-start gap-2 text-rose-800 text-[11px] font-semibold">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>
                        Insufficient balance in VertoPay (₹{balance}). ₹15 minimum required to unlock ticket.
                      </span>
                    </div>

                    <button
                      type="button"
                      id="modal-recharge-wallet-btn"
                      onClick={() => openRechargeModal(50)}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md shadow-rose-600/20 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Recharge VertoPay via Mock UPI Now (+₹50)</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Sufficient VertoPay balance. ₹15 will be deducted upon confirmation.</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="confirm-join-ride-btn"
                  className={`px-6 py-2.5 rounded-xl font-extrabold text-white transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-98 ${
                    balance < fareToDeduct
                      ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                      : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
                  }`}
                >
                  <span>{balance < fareToDeduct ? 'Pay & Book Seat (Top Up First)' : 'Confirm & Deduct ₹15'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          </>
        )}

      </div>
    </div>
  );
};

