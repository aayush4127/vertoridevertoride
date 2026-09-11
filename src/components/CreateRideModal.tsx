import React, { useState } from 'react';
import { Ride, CampusLocation, StudentProfile, VehicleType } from '../types';
import { LPU_LOCATIONS } from '../data/lpuData';
import { HostelSelector } from './HostelSelector';
import { CampusRidePolicyDetail } from './CampusRidePolicyDetail';
import { 
  X, 
  PlusCircle, 
  Car, 
  Navigation, 
  MapPin, 
  Users, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Building
} from 'lucide-react';

interface CreateRideModalProps {
  currentUser: StudentProfile;
  onClose: () => void;
  onCreateRide: (ride: Ride) => void;
}

export const CreateRideModal: React.FC<CreateRideModalProps> = ({
  currentUser,
  onClose,
  onCreateRide
}) => {
  const [pickupId, setPickupId] = useState<string>('loc-maingate');
  const [pickupHostelNo, setPickupHostelNo] = useState<number>(1);
  const [destinationId, setDestinationId] = useState<string>('loc-unimall');
  const [destHostelNo, setDestHostelNo] = useState<number>(1);
  const [vehicleType, setVehicleType] = useState<VehicleType>('E-Rickshaw');
  const [vehicleNumber, setVehicleNumber] = useState<string>('');
  const [totalSeats, setTotalSeats] = useState<number>(3);
  const [departureTime, setDepartureTime] = useState<string>('Leaving in 10 mins');
  const [estimatedArrival, setEstimatedArrival] = useState<string>('In 20 mins');
  const [currentLocationName, setCurrentLocationName] = useState<string>('LPU Main Gate Waiting Bay');
  const [isGirlsOnly, setIsGirlsOnly] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const isPickupHostel = pickupId === 'loc-bh' || pickupId === 'loc-gh';
  const pickupHostelType = pickupId === 'loc-bh' ? 'BH' : 'GH';

  const isDestHostel = destinationId === 'loc-bh' || destinationId === 'loc-gh';
  const destHostelType = destinationId === 'loc-bh' ? 'BH' : 'GH';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let pickupLoc = LPU_LOCATIONS.find(l => l.id === pickupId) || LPU_LOCATIONS[0];
    let destLoc = LPU_LOCATIONS.find(l => l.id === destinationId) || LPU_LOCATIONS[1];

    if (isPickupHostel) {
      pickupLoc = {
        ...pickupLoc,
        name: `${pickupHostelType === 'BH' ? 'Boys Hostel' : 'Girls Hostel'} BH-${pickupHostelNo}`
      };
    }

    if (isDestHostel) {
      destLoc = {
        ...destLoc,
        name: `${destHostelType === 'BH' ? 'Boys Hostel' : 'Girls Hostel'} ${destHostelType}-${destHostelNo}`
      };
    }

    const newRide: Ride = {
      id: `ride-${Date.now()}`,
      driver: currentUser,
      pickup: pickupLoc,
      destination: destLoc,
      currentLocationName: currentLocationName || `${pickupLoc.name} Area`,
      distanceFromUserKm: 0.3,
      totalSeats: totalSeats,
      occupiedSeats: 0,
      availableSeats: totalSeats,
      pricePerSeat: 15,
      departureTime: departureTime,
      estimatedArrival: estimatedArrival,
      vehicleType: vehicleType,
      vehicleNumber: vehicleNumber || 'Campus Ride',
      status: 'active',
      routeStops: [pickupLoc.name, 'Campus Ring Road', destLoc.name],
      isGirlsOnly: isGirlsOnly,
      notes: notes || 'Splitting standard campus auto fare with co-passengers!',
      bookedByStudentIds: [currentUser.id],
      coordinates: {
        start: { x: pickupLoc.x, y: pickupLoc.y },
        current: { x: pickupLoc.x, y: pickupLoc.y },
        end: { x: destLoc.x, y: destLoc.y }
      },
      progressPercentage: 10
    };

    setIsSuccess(true);
    setTimeout(() => {
      onCreateRide(newRide);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 relative my-8">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">Your Ride is Live!</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              LPU classmates heading towards your campus destination can now find your empty seats on the campus board.
            </p>
          </div>
        ) : (
          <>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-indigo-600 mb-1">
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Offer Empty Seats</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Create a Campus Ride
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Have extra seats in an e-rickshaw, auto, or campus cab? Share with verified students!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Pickup & Destination */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pickup Location</label>
                  <select
                    value={pickupId}
                    onChange={(e) => setPickupId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-indigo-600 rounded-xl px-3 py-2.5 font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
                  >
                    {LPU_LOCATIONS.map((loc) => (
                      <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                  </select>

                  {/* If BH or GH is selected for pickup, show Hostel Selector 1 to 13 */}
                  {isPickupHostel && (
                    <HostelSelector
                      type={pickupHostelType}
                      value={pickupHostelNo}
                      onChange={setPickupHostelNo}
                      theme="indigo"
                      label={`Pickup ${pickupHostelType === 'BH' ? 'Boys Hostel' : 'Girls Hostel'} Number:`}
                    />
                  )}
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Destination</label>
                  <select
                    value={destinationId}
                    onChange={(e) => setDestinationId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-indigo-600 rounded-xl px-3 py-2.5 font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
                  >
                    {LPU_LOCATIONS.map((loc) => (
                      <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                  </select>

                  {/* If BH or GH is selected for destination, show Hostel Selector 1 to 13 */}
                  {isDestHostel && (
                    <HostelSelector
                      type={destHostelType}
                      value={destHostelNo}
                      onChange={setDestHostelNo}
                      theme="purple"
                      label={`Destination ${destHostelType === 'BH' ? 'Boys Hostel' : 'Girls Hostel'} Number:`}
                    />
                  )}
                </div>
              </div>

              {/* Small detail below destination booking option as requested */}
              <CampusRidePolicyDetail />

              {/* Vehicle & Seats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Vehicle Type</label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-indigo-600 rounded-xl px-3 py-2.5 font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
                  >
                    <option value="E-Rickshaw">E-Rickshaw</option>
                    <option value="Auto-Rickshaw">Auto-Rickshaw</option>
                    <option value="Scooter/Bike">Scooter/Bike</option>
                    <option value="Shared Cab">Shared Cab</option>
                    <option value="Car">Personal Car</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Seats Available</label>
                  <select
                    value={totalSeats}
                    onChange={(e) => setTotalSeats(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-indigo-600 rounded-xl px-3 py-2.5 font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
                  >
                    <option value={1}>1 Seat</option>
                    <option value={2}>2 Seats</option>
                    <option value={3}>3 Seats</option>
                    <option value={4}>4 Seats</option>
                  </select>
                </div>
              </div>

              {/* Timing & Live Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Departure Timing</label>
                  <input
                    type="text"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    placeholder="e.g. Leaving in 10 mins"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-indigo-600 rounded-xl px-3 py-2.5 font-semibold text-slate-800 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Current Waiting Spot</label>
                  <input
                    type="text"
                    value={currentLocationName}
                    onChange={(e) => setCurrentLocationName(e.target.value)}
                    placeholder="e.g. Near Main Gate Auto Stand"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-indigo-600 rounded-xl px-3 py-2.5 font-semibold text-slate-800 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              {/* Optional Vehicle Reg */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Vehicle Identifier / Plate (Optional)
                </label>
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  placeholder="e.g. PB-08-AB-1234 or Green Auto #12"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-indigo-600 rounded-xl px-3 py-2.5 font-semibold text-slate-800 focus:outline-hidden"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Note to Co-passengers (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Waiting right outside BH-4 entrance"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-indigo-600 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-hidden"
                />
              </div>

              {/* Girls Only Checkbox */}
              <label className="flex items-center gap-2.5 pt-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isGirlsOnly}
                  onChange={(e) => setIsGirlsOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300"
                />
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  Girls-only ride (only female LPU students can join)
                </span>
              </label>

              {/* Submit CTA */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  Publish Campus Ride
                </button>
              </div>

            </form>
          </>
        )}

      </div>
    </div>
  );
};
