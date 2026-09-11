import React from 'react';
import { Ride } from '../types';
import { 
  X, 
  MapPin, 
  Navigation, 
  Phone, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Car,
  Compass,
  Users
} from 'lucide-react';

interface TrackRideModalProps {
  ride: Ride | null;
  onClose: () => void;
}

export const TrackRideModal: React.FC<TrackRideModalProps> = ({
  ride,
  onClose
}) => {
  if (!ride) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 relative my-8">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Compass className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block">
              Live Ride Tracking
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">
              {ride.pickup.name} → {ride.destination.name}
            </h2>
          </div>
        </div>

        {/* Simulated Live Route Progress */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
          <div className="flex items-center justify-between text-slate-600">
            <span className="font-semibold">Current Location:</span>
            <span className="font-bold text-slate-900 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              {ride.currentLocationName}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-600">
            <span className="font-semibold">Estimated Arrival:</span>
            <span className="font-bold text-indigo-700 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {ride.estimatedArrival} ({ride.departureTime})
            </span>
          </div>

          {/* Progress bar */}
          <div className="pt-2">
            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${ride.progressPercentage || 45}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>Departed {ride.pickup.name.split(' ')[0]}</span>
              <span className="font-bold text-emerald-600">En route GT Road</span>
              <span>Dest: {ride.destination.name.split(' ')[0]}</span>
            </div>
          </div>
        </div>

        {/* Route Stops Checklist */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700 block">Route Waypoints:</span>
            {ride.routeStops.some(s => s.toLowerCase().includes('open audi')) && (
              <a
                href="https://maps.app.goo.gl/9mhLf4ZKg2RzUr2F9"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>GPS: 31.255228, 75.704727</span>
                <span className="text-slate-400">↗</span>
              </a>
            )}
          </div>
          <div className="space-y-2 border-l-2 border-indigo-200 ml-2 pl-3">
            {ride.routeStops.map((stop, idx) => {
              const isPassed = idx === 0;
              return (
                <div key={idx} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full -ml-[19px] flex items-center justify-center ${
                    isPassed ? 'bg-emerald-500 text-white' : 'bg-indigo-300'
                  }`} />
                  <span className={isPassed ? 'font-bold text-slate-800' : 'text-slate-600'}>
                    {stop}
                  </span>
                  {isPassed && <span className="text-[10px] text-emerald-600 font-bold ml-auto">Passed</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Driver Card & Actions (No Profile Picture) */}
        <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center text-base shrink-0">
              {ride.vehicleType === 'E-Rickshaw' ? '🛺' : (ride.vehicleType === 'Auto-Rickshaw' ? '🚕' : '🚗')}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900">{ride.driver.name}</span>
                <span className="text-[10px] text-amber-600 font-bold">★ {ride.driver.rating}</span>
              </div>
              <p className="text-[11px] text-slate-500">
                {ride.vehicleType} • {ride.vehicleNumber || 'Campus Auto'}
              </p>
            </div>
          </div>

          <button
            onClick={() => alert(`Simulating call to driver ${ride.driver.name} at ${ride.driver.phone}`)}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center gap-1.5 font-bold cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Driver</span>
          </button>
        </div>

        {/* Emergency SOS */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <button
            onClick={() => alert('Emergency SOS Alert sent to Lovely Professional University Security Control Room (01824-444444) with your live location!')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Campus Security SOS</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            Close Tracker
          </button>
        </div>

      </div>
    </div>
  );
};
