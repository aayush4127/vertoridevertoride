export type VehicleType = 'Auto-Rickshaw' | 'E-Rickshaw' | 'Shared Cab' | 'Scooter/Bike' | 'Car';

export type RideStatus = 'active' | 'upcoming' | 'completed' | 'cancelled';

export interface CampusLocation {
  id: string;
  name: string;
  category: 'Campus Gate' | 'Hostel' | 'Academic Block' | 'Campus Hub' | 'Sports & Health';
  isOffCampus: boolean;
  distanceFromMainGateKm: number; // in km
  x: number; // relative map coordinate 0-1000
  y: number; // relative map coordinate 0-600
  description?: string;
  hostelType?: 'BH' | 'GH';
  gpsCoords?: { lat: number; lng: number };
  mapsUrl?: string;
}

export interface StudentProfile {
  id: string;
  uid?: string; // Firebase Auth UID compatibility
  name: string;
  regNumber: string; // e.g. "12115892"
  course: string; // e.g. "B.Tech CSE"
  batch: string; // e.g. "2022-2026"
  avatar?: string;
  phone: string;
  email: string;
  rating: number;
  totalRides: number;
  moneySaved: number;
  verifiedStudent: boolean;
  blockOrHostel?: string;
  gender?: 'Male' | 'Female' | 'Other';
  walletBalance?: number;
}

export interface SignUpPayload {
  name: string;
  email: string;
  password?: string;
  regNumber: string;
  course: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  blockOrHostel?: string;
  avatar?: string;
}

export type AuthUser = StudentProfile;

export interface Ride {
  id: string;
  driver: StudentProfile;
  pickup: CampusLocation;
  destination: CampusLocation;
  currentLocationName: string;
  distanceFromUserKm: number; // e.g. 0.8 km
  totalSeats: number;
  occupiedSeats: number;
  availableSeats: number;
  pricePerSeat: number; // in INR e.g. 30
  departureTime: string; // e.g. "10:30 AM"
  estimatedArrival: string; // e.g. "11:00 AM"
  vehicleType: VehicleType;
  vehicleNumber?: string;
  status: RideStatus;
  routeStops: string[];
  isGirlsOnly?: boolean;
  notes?: string;
  bookedByStudentIds: string[];
  // For live map visualization
  coordinates?: {
    current: { x: number; y: number };
    start: { x: number; y: number };
    end: { x: number; y: number };
  };
  roadWaypoints?: { x: number; y: number }[];
  progressPercentage?: number; // 0 to 100
}

export interface MyBooking {
  id: string;
  rideId: string;
  ride: Ride;
  seatsBooked: number;
  totalPrice: number;
  bookedAt: string;
  status: RideStatus;
  boardingOtp: string;
  pickupNote?: string;
  coPassengers?: { name: string; course: string; phone: string }[];
}

export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  timestamp: string;
  method?: string;
  status?: 'success' | 'pending' | 'failed';
  referenceId?: string;
}

export type PageTab = 'home' | 'book' | 'live' | 'find-students' | 'my-rides' | 'profile';
