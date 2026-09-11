import React, { useState, useMemo } from 'react';
import { Ride } from '../types';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  ArrowRight,
  ExternalLink,
  Layers,
  CheckCircle2,
  Info,
  ShieldCheck,
  Zap,
  PhoneCall,
  Sparkles
} from 'lucide-react';

interface LiveRidesMapSectionProps {
  rides: Ride[];
  onJoinRide: (ride: Ride) => void;
  onTrackRide: (ride: Ride) => void;
}

// Definition of official campus auto routes & operational paths
export interface CampusAutoPath {
  id: string;
  code: string;
  name: string;
  color: string;
  accentBg: string;
  accentBorder: string;
  badgeBg: string;
  textColor: string;
  description: string;
  fare: string;
  operatingHours: string;
  frequency: string;
  totalAutos: number;
  stops: {
    name: string;
    locationId: string;
    isTransferHub?: boolean;
    coordinatesText?: string;
    description?: string;
  }[];
  assignedRides: Ride[];
}

export const LiveRidesMapSection: React.FC<LiveRidesMapSectionProps> = ({
  rides,
  onJoinRide,
  onTrackRide
}) => {
  const [selectedPathId, setSelectedPathId] = useState<string>('path-openaudi');
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);

  // Target User Location from Google Maps
  const OPEN_AUDI_COORDS = { lat: 31.255228, lng: 75.704727 };
  const OPEN_AUDI_MAPS_URL = 'https://maps.app.goo.gl/9mhLf4ZKg2RzUr2F9';

  // 5 Official Campus Auto Paths (No Map, Pure Directory & Timetable)
  const autoPaths: CampusAutoPath[] = useMemo(() => [
    {
      id: 'path-openaudi',
      code: 'PATH A1',
      name: 'Central Spine & Open Audi Road',
      color: '#10b981',
      accentBg: 'bg-emerald-50',
      accentBorder: 'border-emerald-200',
      badgeBg: 'bg-emerald-600 text-white',
      textColor: 'text-emerald-800',
      description: 'The primary central north-south campus arterial road traversing Open Audi Road (GPS: 31.255228, 75.704727), connecting Main Gate, UniMall, Central Library, and Cricket Stadium.',
      fare: '₹10 / seat (Fixed Campus Fare)',
      operatingHours: '6:00 AM - 10:30 PM',
      frequency: 'Every 2-3 mins',
      totalAutos: 8,
      stops: [
        { name: 'Main Gate (GT Road Highway)', locationId: 'loc-maingate', description: 'Primary university entrance & drop point' },
        { name: 'UniMall & Food Court', locationId: 'loc-unimall', description: 'Main commercial center, dining & student hub' },
        { 
          name: 'Open Audi Road Transfer Hub', 
          locationId: 'loc-openaudi', 
          isTransferHub: true,
          coordinatesText: '31.255228, 75.704727',
          description: 'Key junction between Unipolis & UniMall; transfer to BH & Law Gate'
        },
        { name: 'Central Library & Admin Block', locationId: 'loc-library', description: 'Academic central tower & administrative offices' },
        { name: 'Central Park Academic Quad', locationId: 'loc-centralpark', description: 'Green lawns, open study pergolas & faculty pavilions' },
        { name: 'Cricket Ground & Sports Stadium', locationId: 'loc-cricket', description: 'Northern campus boundary & athletics grounds' }
      ],
      assignedRides: rides.filter(r => 
        r.routeStops.some(s => s.toLowerCase().includes('open audi') || s.toLowerCase().includes('unimall') || s.toLowerCase().includes('main gate'))
      )
    },
    {
      id: 'path-bh',
      code: 'PATH A2',
      name: 'Boys Hostels Ring (BH 1 to BH 13)',
      color: '#3b82f6',
      accentBg: 'bg-blue-50',
      accentBorder: 'border-blue-200',
      badgeBg: 'bg-blue-600 text-white',
      textColor: 'text-blue-800',
      description: 'High-capacity western loop connecting Main Gate and Open Audi Road to the vast Boys Hostel residential complex (BH-1 through BH-13) and Shanti Devi Mittal Sports Arena.',
      fare: '₹10 / seat (Fixed Campus Fare)',
      operatingHours: '6:00 AM - 11:00 PM',
      frequency: 'Every 3-4 mins',
      totalAutos: 7,
      stops: [
        { name: 'Main Gate (GT Road)', locationId: 'loc-maingate', description: 'Main entrance pickup point' },
        { 
          name: 'Open Audi Road Junction', 
          locationId: 'loc-openaudi', 
          isTransferHub: true, 
          coordinatesText: '31.255228, 75.704727',
          description: 'Central connector for hostel shuttles'
        },
        { name: 'Baldev Raj Mittal Unipolis', locationId: 'loc-unipolis', description: 'Mega open-air amphitheater & event center' },
        { name: 'Shanti Devi Mittal Sports Arena', locationId: 'loc-sports', description: 'Gymnasium, swimming pool, badminton & squash' },
        { name: 'Boys Hostel Complex (BH 1-13)', locationId: 'loc-bh', description: 'Major residential sector for male students' }
      ],
      assignedRides: rides.filter(r => 
        r.pickup.id === 'loc-bh' || r.destination.id === 'loc-bh' ||
        r.routeStops.some(s => s.toLowerCase().includes('bh') || s.toLowerCase().includes('boys hostel'))
      )
    },
    {
      id: 'path-gh',
      code: 'PATH A3',
      name: 'Girls Hostels Boulevard (GH 1 to GH 13)',
      color: '#ec4899',
      accentBg: 'bg-pink-50',
      accentBorder: 'border-pink-200',
      badgeBg: 'bg-pink-600 text-white',
      textColor: 'text-pink-800',
      description: 'Dedicated eastern campus pathway linking Main Gate, UniMall, and UniHospital with the Girls Hostel residential complex (GH-1 through GH-13) and Business School.',
      fare: '₹10 / seat (Fixed Campus Fare)',
      operatingHours: '6:00 AM - 10:00 PM',
      frequency: 'Every 3 mins',
      totalAutos: 6,
      stops: [
        { name: 'Main Gate (GT Road)', locationId: 'loc-maingate', description: 'Main security check & drop point' },
        { name: 'UniMall & Shopping Complex', locationId: 'loc-unimall', description: 'Retail stores, salon, pharmacy & food court' },
        { name: 'UniHospital Campus Clinic', locationId: 'loc-unihospital', description: '24/7 campus medical facility & emergency care' },
        { name: 'Girls Hostel Complex (GH 1-13)', locationId: 'loc-gh', description: 'Residential hostels with dedicated security turnstiles' },
        { name: 'Mittal School of Business (Block 38)', locationId: 'loc-block38', description: 'Management studies & corporate conference halls' }
      ],
      assignedRides: rides.filter(r => 
        r.pickup.id === 'loc-gh' || r.destination.id === 'loc-gh' ||
        r.routeStops.some(s => s.toLowerCase().includes('gh') || s.toLowerCase().includes('girls hostel'))
      )
    },
    {
      id: 'path-lawgate',
      code: 'PATH A4',
      name: 'Law Gate Back Market Connector',
      color: '#f59e0b',
      accentBg: 'bg-amber-50',
      accentBorder: 'border-amber-200',
      badgeBg: 'bg-amber-600 text-white',
      textColor: 'text-amber-800',
      description: 'Connects the bustling Law Gate off-campus student hub through the western boundary road directly into Unipolis, Open Audi Road, and UniMall.',
      fare: '₹15 / seat (Campus Border Transit)',
      operatingHours: '7:00 AM - 10:30 PM',
      frequency: 'Every 4-5 mins',
      totalAutos: 5,
      stops: [
        { name: 'Law Gate (Back Gate Market)', locationId: 'loc-lawgate', description: 'External PG colony, cafes, printing & bookstores' },
        { name: 'Indoor Sports Complex', locationId: 'loc-sports', description: 'Recreation center & indoor basketball courts' },
        { name: 'Baldev Raj Mittal Unipolis', locationId: 'loc-unipolis', description: 'Auditorium and cultural fest staging area' },
        { 
          name: 'Open Audi Road Transfer (31.255228, 75.704727)', 
          locationId: 'loc-openaudi', 
          isTransferHub: true,
          coordinatesText: '31.255228, 75.704727',
          description: 'Transfer hub to Central Line and academic blocks'
        },
        { name: 'UniMall Food Court', locationId: 'loc-unimall', description: 'Food court and central transit hub' }
      ],
      assignedRides: rides.filter(r => 
        r.pickup.id === 'loc-lawgate' || r.destination.id === 'loc-lawgate' ||
        r.routeStops.some(s => s.toLowerCase().includes('law gate'))
      )
    },
    {
      id: 'path-academic',
      code: 'PATH A5',
      name: 'Academic Blocks & Labs Loop',
      color: '#06b6d4',
      accentBg: 'bg-cyan-50',
      accentBorder: 'border-cyan-200',
      badgeBg: 'bg-cyan-600 text-white',
      textColor: 'text-cyan-800',
      description: 'Shuttle connecting major academic teaching departments: Computer Science (Block 34), Bio-Sciences & Agriculture (Block 55), Central Library, and Business (Block 38).',
      fare: '₹10 / seat (Fixed Campus Fare)',
      operatingHours: '8:00 AM - 7:00 PM',
      frequency: 'Every 4 mins',
      totalAutos: 5,
      stops: [
        { name: 'Central Library & Admin Block', locationId: 'loc-library', description: 'Digital resource center & study floors' },
        { name: 'School of Computer Science (Block 34)', locationId: 'loc-block34', description: 'IT faculties, coding laboratories & tech auditoriums' },
        { name: 'Bio-Sciences & Agriculture (Block 55)', locationId: 'loc-block55', description: 'Research laboratories & botanical experimental farms' },
        { name: 'Central Park Academic Quad', locationId: 'loc-centralpark', description: 'Outdoor study lawns & central student pavilion' },
        { name: 'Mittal School of Business (Block 38)', locationId: 'loc-block38', description: 'MBA classrooms, seminar halls & incubation wing' }
      ],
      assignedRides: rides.filter(r => 
        r.pickup.category === 'Academic Block' || r.destination.category === 'Academic Block' ||
        r.routeStops.some(s => s.toLowerCase().includes('block'))
      )
    }
  ], [rides]);

  const activePath = autoPaths.find(p => p.id === selectedPathId) || autoPaths[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
            <Navigation className="w-3.5 h-3.5 text-indigo-600" />
            <span>Campus Auto Transit Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex flex-wrap items-center gap-2.5">
            <span>Campus Auto Paths & Routes</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              5 Designated Campus Corridors
            </span>
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Official operational corridors, stops, timetable frequencies, and verified e-rickshaws serving Lovely Professional University.
          </p>
        </div>

        {/* Action Buttons for GPS & Info */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <a
            href={OPEN_AUDI_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-slate-700 hover:text-indigo-600 border border-slate-300 hover:border-indigo-300 shadow-xs transition-all group"
            title="Open verified Open Audi Road location in Google Maps"
          >
            <MapPin className="w-3.5 h-3.5 text-red-500 group-hover:scale-110 transition-transform" />
            <span>Open Audi Road (31.255228, 75.704727)</span>
            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-600" />
          </a>

          <button
            type="button"
            onClick={() => setShowLocationModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all cursor-pointer shadow-xs"
          >
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>Transfer Hub Info</span>
          </button>
        </div>
      </div>

      {/* Transit Key Facts Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold text-base shrink-0">
            ₹10
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-slate-500 block leading-tight">Fixed Campus Fare</span>
            <span className="text-xs font-bold text-slate-900 truncate block">Per Seat Anywhere</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-base shrink-0">
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-slate-500 block leading-tight">High Frequency</span>
            <span className="text-xs font-bold text-slate-900 truncate block">Every 2-4 Minutes</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold text-base shrink-0">
            <MapPin className="w-4 h-4 text-amber-600" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-slate-500 block leading-tight">Central Junction</span>
            <span className="text-xs font-bold text-slate-900 truncate block">Open Audi Road Hub</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-base shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-slate-500 block leading-tight">Verified Fleet</span>
            <span className="text-xs font-bold text-slate-900 truncate block">Security-Approved</span>
          </div>
        </div>
      </div>

      {/* Path Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          type="button"
          onClick={() => setSelectedPathId('all')}
          className={`px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            selectedPathId === 'all'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>All 5 Paths Overview</span>
        </button>

        {autoPaths.map((p) => {
          const isSelected = selectedPathId === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedPathId(p.id)}
              className={`px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2.5 ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-500'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: p.color }}
              />
              <span>{p.code}: {p.name.split('(')[0].trim()}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: WHEN A SPECIFIC PATH IS SELECTED */}
      {/* ========================================================================= */}
      {selectedPathId !== 'all' && (
        <div className="space-y-6">
          
          {/* Path Master Details Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-6">
            
            {/* Top Bar of Path Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${activePath.badgeBg}`}>
                    {activePath.code}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Operating Now
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {activePath.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                  {activePath.description}
                </p>
              </div>

              {/* Badges / Metrics */}
              <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2 shrink-0">
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  {activePath.fare}
                </span>
                <span className="text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {activePath.operatingHours}
                </span>
                <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200">
                  Frequency: {activePath.frequency}
                </span>
              </div>
            </div>

            {/* Visual Route Stops Stepper */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Sequential Stops on this Corridor ({activePath.stops.length} Stops)</span>
                </h3>
                <span className="text-xs text-slate-500 font-medium">Board at any designated stop</span>
              </div>

              {/* Horizontal Stepper for Desktop / Stacked for Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {activePath.stops.map((stop, index) => {
                  const isOpenAudi = stop.isTransferHub || stop.locationId === 'loc-openaudi';

                  return (
                    <div
                      key={index}
                      className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                        isOpenAudi
                          ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-300/60 shadow-xs'
                          : 'bg-slate-50/80 border-slate-200 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isOpenAudi 
                              ? 'bg-amber-500 text-slate-950 font-black' 
                              : 'bg-white border border-slate-300 text-slate-700'
                          }`}
                        >
                          {index + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className={`text-xs font-bold truncate ${isOpenAudi ? 'text-amber-950 font-black' : 'text-slate-900'}`}>
                              {stop.name}
                            </h4>
                            {isOpenAudi && (
                              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">
                                Transfer Hub
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                            {stop.description}
                          </p>
                        </div>
                      </div>

                      {isOpenAudi && (
                        <div className="mt-3 pt-2.5 border-t border-amber-200/60 flex items-center justify-between text-[11px]">
                          <span className="font-mono text-amber-800 font-semibold">
                            GPS: 31.255228, 75.704727
                          </span>
                          <a
                            href={OPEN_AUDI_MAPS_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-amber-900 font-bold hover:underline"
                          >
                            <span>Open Maps</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Active Autos / E-Rickshaws Operating on This Path */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Autos & E-Rickshaws Operating on {activePath.code}</span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {activePath.assignedRides.length} Available Autos
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pre-assigned student and campus shuttles on this route (No profile photos • Verified drivers)
                </p>
              </div>

              <div className="text-xs text-slate-500 font-medium">
                Standard fare: <strong className="text-slate-900">{activePath.fare}</strong>
              </div>
            </div>

            {activePath.assignedRides.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-xl">
                  🛺
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Next Auto Arriving in 2-3 Minutes</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Autos on this corridor operate continuously on a 3-minute turnaround between {activePath.stops[0].name} and {activePath.stops[activePath.stops.length - 1].name}.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activePath.assignedRides.map((ride) => (
                  <div
                    key={ride.id}
                    id={`auto-card-${ride.id}`}
                    className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all space-y-4"
                  >
                    {/* Vehicle & Driver Header (NO PROFILE PICTURE) */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center text-xl shrink-0">
                          {ride.vehicleType === 'E-Rickshaw' ? '🛺' : (ride.vehicleType === 'Auto-Rickshaw' ? '🚕' : '🚗')}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 truncate">
                              {ride.driver.name}
                            </span>
                            <span className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0" title="Verified Campus Auto">
                              ✓
                            </span>
                          </div>
                          <span className="text-xs font-mono font-bold text-slate-500">
                            {ride.vehicleNumber || 'PB 08 LPU Campus'}
                          </span>
                        </div>
                      </div>

                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 shrink-0">
                        {ride.availableSeats} seats open
                      </span>
                    </div>

                    {/* Route Details */}
                    <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-slate-800">
                        <div className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                        <span className="truncate">From: <strong>{ride.pickup.name}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-800">
                        <div className="w-2 h-2 rounded-full bg-purple-600 shrink-0" />
                        <span className="truncate">To: <strong>{ride.destination.name}</strong></span>
                      </div>

                      {/* Stops preview */}
                      {ride.routeStops && ride.routeStops.length > 0 && (
                        <div className="pt-2 border-t border-slate-200/60 flex items-center gap-1 overflow-hidden text-[10px] text-slate-500">
                          <span className="font-semibold text-slate-600">Via:</span>
                          <span className="truncate">{ride.routeStops.join(' → ')}</span>
                        </div>
                      )}
                    </div>

                    {/* Pricing & Timing */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Departs: {ride.departureTime}</span>
                      </div>
                      <span className="text-sm font-extrabold text-indigo-700">
                        ₹{ride.pricePerSeat} <span className="text-[10px] font-normal text-slate-500">/ seat</span>
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => onTrackRide(ride)}
                        className="py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer text-center"
                      >
                        Route Stops
                      </button>
                      <button
                        type="button"
                        onClick={() => onJoinRide(ride)}
                        className="py-2.5 px-3 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer shadow-xs text-center"
                      >
                        Book Seat
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: WHEN "ALL 5 PATHS OVERVIEW" IS SELECTED */}
      {/* ========================================================================= */}
      {selectedPathId === 'all' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {autoPaths.map((path) => (
              <div
                key={path.id}
                onClick={() => setSelectedPathId(path.id)}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${path.badgeBg}`}>
                      {path.code}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {path.fare}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {path.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {path.description}
                    </p>
                  </div>

                  {/* Route Key Stops List */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-1 text-xs">
                    <span className="font-bold text-slate-700 text-[11px] block">Key Stops:</span>
                    <p className="text-[11px] text-slate-600 truncate">
                      {path.stops.map(s => s.name.split('(')[0].trim()).join(' → ')}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    {path.operatingHours} • {path.totalAutos} autos
                  </span>
                  <span className="font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>View Corridor</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* All Campus Autos Directory */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  All Active Campus Autos & E-Rickshaws ({rides.length} Registered)
                </h3>
                <p className="text-xs text-slate-500">
                  Ready to board or pool with other LPU students
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rides.map((ride) => (
                <div
                  key={ride.id}
                  className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all space-y-4"
                >
                  {/* Vehicle & Driver Header (NO PROFILE PICTURE) */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center text-xl shrink-0">
                        {ride.vehicleType === 'E-Rickshaw' ? '🛺' : (ride.vehicleType === 'Auto-Rickshaw' ? '🚕' : '🚗')}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 truncate">
                            {ride.driver.name}
                          </span>
                          <span className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                            ✓
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-500">
                          {ride.vehicleNumber || 'PB 08 LPU Campus'}
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 shrink-0">
                      {ride.availableSeats} seats open
                    </span>
                  </div>

                  {/* Route */}
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-slate-800">
                      <div className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                      <span className="truncate">From: <strong>{ride.pickup.name}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-800">
                      <div className="w-2 h-2 rounded-full bg-purple-600 shrink-0" />
                      <span className="truncate">To: <strong>{ride.destination.name}</strong></span>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div>
                      <span className="text-sm font-extrabold text-indigo-700">₹{ride.pricePerSeat}</span>
                      <span className="text-[10px] text-slate-500"> / seat</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onTrackRide(ride)}
                        className="py-2 px-3 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                      >
                        Stops
                      </button>
                      <button
                        type="button"
                        onClick={() => onJoinRide(ride)}
                        className="py-2 px-3 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer shadow-xs"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Campus Auto Regulations & Boarding Guidelines Footer */}
      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 text-xs text-slate-600 space-y-3">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span>LPU Campus Auto & E-Rickshaw Rules</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="space-y-1">
            <h5 className="font-bold text-slate-800">Fixed Campus Fare</h5>
            <p className="text-[11px] text-slate-500">
              Standard internal campus fare is fixed at ₹10 per seat. No surge or overcharging is permitted. Law Gate crossing transit is ₹15.
            </p>
          </div>
          <div className="space-y-1">
            <h5 className="font-bold text-slate-800">Designated Boarding Stands</h5>
            <p className="text-[11px] text-slate-500">
              Board only at authorized stops: Main Gate Turnstiles, UniMall Plaza, Open Audi Road Junction, BH 1-13 Roundabout, and GH Security Gate.
            </p>
          </div>
          <div className="space-y-1">
            <h5 className="font-bold text-slate-800">24/7 Security Helpline</h5>
            <p className="text-[11px] text-slate-500">
              For any transit disputes, lost items, or late-night emergency escort requests, contact LPU Security Control Room at 01824-517000.
            </p>
          </div>
        </div>
      </div>

      {/* Google Maps Location Detail Modal for Open Audi Road */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 relative border border-slate-100">
            
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">
                    Verified Google Maps Location
                  </span>
                  <h2 className="text-xl font-black text-slate-900">
                    LPU Open Audi Road
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowLocationModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Coordinates Card */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span className="font-semibold">GPS Coordinates:</span>
                <span className="font-mono font-bold text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                  31.255228° N, 75.704727° E
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="font-semibold">Campus Role:</span>
                <span className="font-bold text-indigo-700">Central Transfer Hub (Paths A1, A2, A4 meet here)</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="font-semibold">Postal Location:</span>
                <span className="text-slate-800">Lovely Professional University, Punjab 144411</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Open Audi Road is the central arterial corridor of the LPU campus. Multiple auto routes (Central Line A1, Boys Hostels Line A2, and Law Gate Line A4) pass and transfer students right at this junction between UniMall and Unipolis.
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={OPEN_AUDI_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm text-center flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => {
                  setShowLocationModal(false);
                  setSelectedPathId('path-openaudi');
                }}
                className="py-3 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer"
              >
                View Path A1 Corridor
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
