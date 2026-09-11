import React, { useState } from 'react';
import { Ride, MyBooking, StudentProfile } from '../types';
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
  ArrowRight
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

  const [seatsToBook, setSeatsToBook] = useState<number>(1);
  const [pickupNote, setPickupNote] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const totalPrice = ride.pricePerSeat * seatsToBook;
  const boardingOtp = Math.floor(1000 + Math.random() * 9000).toString();

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();

    const newBooking: MyBooking = {
      id: `booking-${Date.now()}`,
      rideId: ride.id,
      ride: {
        ...ride,
        occupiedSeats: ride.occupiedSeats + seatsToBook,
        availableSeats: Math.max(0, ride.availableSeats - seatsToBook)
      },
      seatsBooked: seatsToBook,
      totalPrice: totalPrice,
      bookedAt: 'Just now',
      status: 'active',
      boardingOtp: boardingOtp,
      pickupNote: pickupNote || 'Waiting at pickup point',
      coPassengers: [
        { name: `${ride.driver.name} (Driver)`, course: ride.driver.course, phone: ride.driver.phone },
        { name: `${currentUser.name} (You)`, course: currentUser.course, phone: currentUser.phone }
      ]
    };

    setIsSuccess(true);
    setTimeout(() => {
      onConfirmBooking(newBooking);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 relative">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">Ride Joined Successfully!</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your seat has been reserved with <strong>{ride.driver.name}</strong>. Your boarding OTP is <span className="font-mono font-bold text-indigo-600 text-sm">{boardingOtp}</span>. Redirecting to My Rides...
            </p>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-indigo-600 mb-1">
                <Car className="w-3.5 h-3.5" />
                <span>Confirm Ride Booking</span>
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

              {/* Price calculation breakdown */}
              <div className="bg-indigo-50/70 p-3.5 rounded-2xl border border-indigo-100 space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Fare per seat:</span>
                  <span className="font-bold text-slate-800">₹{ride.pricePerSeat}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Seats:</span>
                  <span className="font-bold text-slate-800">× {seatsToBook}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-indigo-900 pt-2 border-t border-indigo-200/60">
                  <span>Total Payable to Driver:</span>
                  <span className="text-base text-indigo-700">₹{totalPrice}</span>
                </div>
                <p className="text-[10px] text-slate-500 pt-1">
                  Pay the driver directly via UPI (Google Pay/Paytm/PhonePe) or cash when boarding. Zero platform fee!
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="confirm-join-ride-btn"
                  className="px-6 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer"
                >
                  <span>Confirm & Reserve Seat</span>
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
