import React, { useState } from 'react';
import { CampusLocation, PageTab } from '../types';
import { LPU_LOCATIONS, POPULAR_DESTINATIONS } from '../data/lpuData';
import { HostelSelector } from './HostelSelector';
import { CampusRidePolicyDetail } from './CampusRidePolicyDetail';
import { VertoRideIcon } from './VertoRideLogo';
import { VertoPayWidget } from './VertoPayWidget';
import { 
  MapPin, 
  Navigation, 
  Users, 
  Search, 
  ShieldCheck, 
  Clock, 
  PlusCircle, 
  ArrowRight,
  TrendingDown,
  Sparkles,
  CheckCircle2,
  Utensils,
  Car,
  Building,
  Info
} from 'lucide-react';

interface HomeSectionProps {
  onSearchRides: (pickupId: string, destId: string, seats: number) => void;
  onNavigate: (tab: PageTab) => void;
  onOpenCreateRide: () => void;
  activeRidesCount: number;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  onSearchRides,
  onNavigate,
  onOpenCreateRide,
  activeRidesCount
}) => {
  const [pickupId, setPickupId] = useState<string>('loc-maingate');
  const [pickupHostelNo, setPickupHostelNo] = useState<number>(1);
  const [destinationId, setDestinationId] = useState<string>('loc-unimall');
  const [destHostelNo, setDestHostelNo] = useState<number>(1);
  const [seats, setSeats] = useState<number>(1);
  const [departureTimeChoice, setDepartureTimeChoice] = useState<string>('now');

  const isPickupHostel = pickupId === 'loc-bh' || pickupId === 'loc-gh';
  const pickupHostelType = pickupId === 'loc-bh' ? 'BH' : 'GH';

  const isDestHostel = destinationId === 'loc-bh' || destinationId === 'loc-gh';
  const destHostelType = destinationId === 'loc-bh' ? 'BH' : 'GH';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchRides(pickupId, destinationId, seats);
    onNavigate('book');
  };

  const handleSelectPopularDest = (targetLocationId: string) => {
    setDestinationId(targetLocationId);
    onSearchRides(pickupId, targetLocationId, seats);
    onNavigate('book');
  };

  const getDestinationIcon = (iconName: string) => {
    switch (iconName) {
      case 'utensils':
        return <Utensils className="w-5 h-5 text-amber-600" />;
      case 'navigation':
        return <Navigation className="w-5 h-5 text-indigo-600" />;
      default:
        return <MapPin className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero & Search Engine */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 sm:pb-20 bg-gradient-to-b from-indigo-50/70 via-slate-50 to-white border-b border-slate-200">
        {/* Soft background decor */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-indigo-200/20 blur-3xl pointer-events-none rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            
            {/* Tag Badge & GPS Location Badge */}
            <div className="inline-flex flex-wrap items-center justify-center gap-2 mb-6">
              <button
                type="button"
                onClick={() => onNavigate('live')}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-100/90 hover:bg-indigo-200 text-indigo-800 border border-indigo-200 shadow-xs transition-all cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 text-indigo-600" />
                <span>View Current Campus Auto Paths & Routes</span>
                <ArrowRight className="w-3 h-3 text-indigo-600" />
              </button>

              <a
                href="https://maps.app.goo.gl/9mhLf4ZKg2RzUr2F9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white text-slate-700 hover:text-indigo-600 border border-slate-200 shadow-xs transition-all"
                title="Open verified location in Google Maps"
              >
                <MapPin className="w-3 h-3 text-red-500" />
                <span>Open Audi Road (GPS 31.255228, 75.704727)</span>
              </a>
            </div>

            {/* Title with Logo Mark */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2">
              <VertoRideIcon size={52} className="drop-shadow-md" />
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight">
                VERTO<span className="text-indigo-600">RIDE</span>
              </h1>
            </div>

            <p className="mt-3 text-lg sm:text-xl text-slate-600 font-medium max-w-2xl mx-auto">
              Find students going your way. Share the ride. Save money.
            </p>

            <p className="mt-2 text-sm text-slate-500 max-w-xl mx-auto">
              No expensive solo rides or walking long distances across campus in the Punjab heat. Connect with verified Vertos traveling between campus gates, academic blocks, and hostel blocks.
            </p>
          </div>

          {/* Core Booking / Search Widget */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl shadow-indigo-950/5 border border-slate-200 p-4 sm:p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                
                {/* Pickup Location */}
                <div className="md:col-span-5 space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-indigo-600" />
                    Pickup Location
                  </label>
                  <div className="relative">
                    <select
                      id="home-pickup-select"
                      value={pickupId}
                      onChange={(e) => setPickupId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 hover:border-slate-400 focus:border-indigo-600 rounded-xl px-3.5 py-3 text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
                    >
                      <optgroup label="Hostel Blocks (Select BH or GH)">
                        {LPU_LOCATIONS.filter((l) => l.category === 'Hostel').map((loc) => (
                          <option key={loc.id} value={loc.id}>
                            {loc.name}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Campus Gates & Hubs">
                        {LPU_LOCATIONS.filter((l) => l.category === 'Campus Gate' || l.category === 'Campus Hub').map((loc) => (
                          <option key={loc.id} value={loc.id}>
                            {loc.name}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Academic & Sports Blocks">
                        {LPU_LOCATIONS.filter((l) => l.category === 'Academic Block' || l.category === 'Sports & Health').map((loc) => (
                          <option key={loc.id} value={loc.id}>
                            {loc.name}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  {/* If BH or GH is selected for pickup, show Hostel Number Selector 1 to 13 */}
                  {isPickupHostel && (
                    <HostelSelector
                      type={pickupHostelType}
                      value={pickupHostelNo}
                      onChange={setPickupHostelNo}
                      theme="indigo"
                      label={`Pickup ${pickupHostelType === 'BH' ? 'Boys Hostel' : 'Girls Hostel'} Number:`}
                    />
                  )}

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
                    <span>Quick pick:</span>
                    <button
                      type="button"
                      onClick={() => setPickupId('loc-maingate')}
                      className="text-indigo-600 hover:underline font-medium cursor-pointer"
                    >
                      Main Gate
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setPickupId('loc-bh')}
                      className="text-indigo-600 hover:underline font-medium cursor-pointer"
                    >
                      Boys Hostel (BH)
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setPickupId('loc-gh')}
                      className="text-indigo-600 hover:underline font-medium cursor-pointer"
                    >
                      Girls Hostel (GH)
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setPickupId('loc-unimall')}
                      className="text-indigo-600 hover:underline font-medium cursor-pointer"
                    >
                      UniMall
                    </button>
                  </div>
                </div>

                {/* Switch indicator */}
                <div className="hidden md:flex md:col-span-2 justify-center items-center pt-8">
                  <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>

                {/* Destination Location */}
                <div className="md:col-span-5 space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-purple-600" />
                    Destination
                  </label>
                  <div className="relative">
                    <select
                      id="home-destination-select"
                      value={destinationId}
                      onChange={(e) => setDestinationId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 hover:border-slate-400 focus:border-indigo-600 rounded-xl px-3.5 py-3 text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
                    >
                      <optgroup label="Campus Hubs & Dining">
                        {LPU_LOCATIONS.filter((l) => l.category === 'Campus Hub').map((loc) => (
                          <option key={loc.id} value={loc.id}>
                            {loc.name}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Hostel Blocks (Select BH or GH)">
                        {LPU_LOCATIONS.filter((l) => l.category === 'Hostel').map((loc) => (
                          <option key={loc.id} value={loc.id}>
                            {loc.name}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Campus Gates">
                        {LPU_LOCATIONS.filter((l) => l.category === 'Campus Gate').map((loc) => (
                          <option key={loc.id} value={loc.id}>
                            {loc.name}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Academic & Sports Blocks">
                        {LPU_LOCATIONS.filter((l) => l.category === 'Academic Block' || l.category === 'Sports & Health').map((loc) => (
                          <option key={loc.id} value={loc.id}>
                            {loc.name}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  {/* If BH or GH is selected for destination, show Hostel Number Selector 1 to 13 */}
                  {isDestHostel && (
                    <HostelSelector
                      type={destHostelType}
                      value={destHostelNo}
                      onChange={setDestHostelNo}
                      theme="purple"
                      label={`Destination ${destHostelType === 'BH' ? 'Boys Hostel' : 'Girls Hostel'} Number:`}
                    />
                  )}

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
                    <span>Quick pick:</span>
                    <button
                      type="button"
                      onClick={() => setDestinationId('loc-unimall')}
                      className="text-indigo-600 hover:underline font-medium cursor-pointer"
                    >
                      UniMall
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setDestinationId('loc-bh')}
                      className="text-indigo-600 hover:underline font-medium cursor-pointer"
                    >
                      BH (1-13)
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setDestinationId('loc-gh')}
                      className="text-indigo-600 hover:underline font-medium cursor-pointer"
                    >
                      GH (1-13)
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setDestinationId('loc-library')}
                      className="text-indigo-600 hover:underline font-medium cursor-pointer"
                    >
                      Central Library
                    </button>
                  </div>
                </div>

              </div>

              {/* Requirement 2: Small detail below the destination booking option */}
              <CampusRidePolicyDetail />

              {/* Bottom Options Row: Seats + Departure Time + CTA */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                
                {/* Seats Selector */}
                <div className="sm:col-span-4 space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    Seats Needed
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setSeats(num)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                          seats === num
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Departure Time */}
                <div className="sm:col-span-4 space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    Departure Time
                  </label>
                  <select
                    value={departureTimeChoice}
                    onChange={(e) => setDepartureTimeChoice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
                  >
                    <option value="now">Leaving Right Now (Next 10 mins)</option>
                    <option value="30mins">Leaving in 30 mins</option>
                    <option value="1hour">Leaving in 1 hour</option>
                    <option value="evening">Evening after lectures (5 PM)</option>
                  </select>
                </div>

                {/* Find Rides CTA Button */}
                <div className="sm:col-span-4 sm:pt-5">
                  <button
                    type="submit"
                    id="find-rides-main-btn"
                    className="w-full py-3 px-6 rounded-xl font-extrabold text-sm bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white transition-all shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    <span>Find Rides</span>
                  </button>
                </div>

              </div>

            </form>
          </div>

          {/* VertoPay Live Balance & Quick Recharge Banner (Below Booking Options) */}
          <div className="mt-6 max-w-4xl mx-auto">
            <VertoPayWidget variant="dashboard-banner" />
          </div>

          {/* Quick Stats Banner */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-center">
            <div className="bg-white/80 backdrop-blur-xs border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs">
              <span className="text-xl sm:text-2xl font-extrabold text-indigo-600 block">₹10 - ₹20</span>
              <span className="text-xs text-slate-500 font-medium">Standard Campus Share Fare</span>
            </div>
            <div className="bg-white/80 backdrop-blur-xs border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900 block">BH 1–13 & GH 1–13</span>
              <span className="text-xs text-slate-500 font-medium">All Hostels Connected</span>
            </div>
            <div className="bg-white/80 backdrop-blur-xs border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs">
              <span className="text-xl sm:text-2xl font-extrabold text-emerald-600 block">100% Verified</span>
              <span className="text-xs text-slate-500 font-medium">LPU Registration ID</span>
            </div>
            <div className="bg-white/80 backdrop-blur-xs border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs">
              <span className="text-xl sm:text-2xl font-extrabold text-indigo-600 block">Zero Fee</span>
              <span className="text-xs text-slate-500 font-medium">Direct UPI / Cash to Driver</span>
            </div>
          </div>

        </div>
      </section>

      {/* Popular Campus Destinations Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              High-Frequency Routes
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Popular Campus Destinations
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Find rides instantly to frequently traveled campus hubs, hostels, and academic departments.
            </p>
          </div>

          <button
            onClick={() => onNavigate('book')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>View All Campus Rides</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {POPULAR_DESTINATIONS.map((dest, idx) => (
            <div
              key={idx}
              id={`popular-dest-card-${idx}`}
              className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all p-5 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                    {getDestinationIcon(dest.icon)}
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" />
                    {dest.savings}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                  {dest.title}
                </h3>
                
                <p className="text-xs text-slate-500 mt-0.5">
                  {dest.distance} • {dest.category}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Shared Ride Rate:</span>
                    <span className="font-bold text-indigo-600">{dest.avgShareFare}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>Solo Auto:</span>
                    <span className="line-through">{dest.soloFare}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1">
                    <span className="font-semibold text-slate-700">Peak hours:</span> {dest.popularTimes}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3">
                <button
                  type="button"
                  onClick={() => handleSelectPopularDest(dest.targetLocationId)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-50 group-hover:bg-indigo-600 text-slate-700 group-hover:text-white border border-slate-200 group-hover:border-indigo-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Find Rides to {dest.title.split(' ')[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How VERTORIDE Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Campus-First Carpooling
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
              Built Exclusively for LPU Campus Students
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-2">
              Say goodbye to expensive solo autos or walking across the 600-acre campus in the heat. Share rides easily between hostels BH 1–13, GH 1–13, UniMall, and academic blocks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold mb-4">
                1
              </div>
              <h4 className="font-bold text-base text-white mb-1.5">LPU ID Verified</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Only students with verified @lpu.in registration numbers and university ID cards can join or offer rides.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold mb-4">
                2
              </div>
              <h4 className="font-bold text-base text-white mb-1.5">Fair Fare Split</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Pre-agreed student rates (₹10 to ₹20 per seat). Pay the driver directly upon boarding via UPI or cash with zero platform commission.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold mb-4">
                3
              </div>
              <h4 className="font-bold text-base text-white mb-1.5">Hostel & Gate Routing</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Specific block routing for Boys Hostels BH 1–13 and Girls Hostels GH 1–13 directly to academic buildings and Main/Law Gate.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold mb-4">
                4
              </div>
              <h4 className="font-bold text-base text-white mb-1.5">Boarding OTP & Safety</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Safe travel with verified 4-digit boarding OTP, girls-only carpool option, and direct campus security hotline.
              </p>
            </div>

          </div>

          {/* Banner bottom CTA */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-200">
                Over <strong>18,400+ shared campus rides</strong> completed across Lovely Professional University this semester.
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('live')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-indigo-900 hover:bg-slate-100 transition-all cursor-pointer"
              >
                View Campus Auto Paths
              </button>
              <button
                onClick={() => onNavigate('find-students')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
              >
                Find Students Going Your Way
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
