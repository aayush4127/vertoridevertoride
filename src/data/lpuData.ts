import { CampusLocation, StudentProfile, Ride, MyBooking } from '../types';

export const LPU_LOCATIONS: CampusLocation[] = [
  // Campus Gates & Entrances
  {
    id: 'loc-maingate',
    name: 'LPU Main Gate (GT Road)',
    category: 'Campus Gate',
    isOffCampus: false,
    distanceFromMainGateKm: 0.0,
    x: 500,
    y: 520,
    description: 'Main entrance on NH-44 / GT Road, key e-rickshaw & auto hub'
  },
  {
    id: 'loc-lawgate',
    name: 'Law Gate (Back Gate Market)',
    category: 'Campus Gate',
    isOffCampus: false,
    distanceFromMainGateKm: 1.5,
    x: 220,
    y: 420,
    description: 'Popular student market, cafes, food stalls, and stationery'
  },
  // Campus Hubs & Dining
  {
    id: 'loc-openaudi',
    name: 'LPU Open Audi Road (Central Campus)',
    category: 'Campus Hub',
    isOffCampus: false,
    distanceFromMainGateKm: 0.6,
    x: 470,
    y: 315,
    description: 'Central campus heart on Open Audi Road (GPS: 31.255228° N, 75.704727° E) connecting UniMall, Unipolis & Academic blocks',
    gpsCoords: { lat: 31.255228, lng: 75.704727 },
    mapsUrl: 'https://maps.app.goo.gl/9mhLf4ZKg2RzUr2F9'
  },
  {
    id: 'loc-unimall',
    name: 'UniMall & Central Food Court',
    category: 'Campus Hub',
    isOffCampus: false,
    distanceFromMainGateKm: 0.5,
    x: 520,
    y: 360,
    description: 'Central campus retail, dining, Nescafe, Dominoes, and bank kiosks',
    gpsCoords: { lat: 31.2546, lng: 75.7041 }
  },
  {
    id: 'loc-library',
    name: 'Central Library & Admin Block',
    category: 'Campus Hub',
    isOffCampus: false,
    distanceFromMainGateKm: 0.7,
    x: 480,
    y: 280,
    description: 'Heart of academic zone, student resource center, central auditorium'
  },
  {
    id: 'loc-unipolis',
    name: 'Baldev Raj Mittal Unipolis',
    category: 'Campus Hub',
    isOffCampus: false,
    distanceFromMainGateKm: 0.6,
    x: 420,
    y: 330,
    description: 'Massive open-air auditorium for mega campus events and fests'
  },
  // Hostels (Support 1 to 13)
  {
    id: 'loc-bh',
    name: 'Boys Hostel (BH)',
    category: 'Hostel',
    isOffCampus: false,
    distanceFromMainGateKm: 1.1,
    x: 320,
    y: 240,
    description: 'Boys residential complex (BH-1 through BH-13) near sports grounds',
    hostelType: 'BH'
  },
  {
    id: 'loc-gh',
    name: 'Girls Hostel (GH)',
    category: 'Hostel',
    isOffCampus: false,
    distanceFromMainGateKm: 0.8,
    x: 680,
    y: 260,
    description: 'Girls residential complex (GH-1 through GH-13) with biometric turnstiles',
    hostelType: 'GH'
  },
  // Academic Blocks
  {
    id: 'loc-block34',
    name: 'Block 34 (School of Computer Science)',
    category: 'Academic Block',
    isOffCampus: false,
    distanceFromMainGateKm: 0.9,
    x: 380,
    y: 170,
    description: 'Engineering & Technology labs, Apple iOS Dev Center'
  },
  {
    id: 'loc-block38',
    name: 'Block 38 (Mittal School of Business)',
    category: 'Academic Block',
    isOffCampus: false,
    distanceFromMainGateKm: 0.8,
    x: 580,
    y: 190,
    description: 'Management, Commerce, Economics & Humanities classrooms'
  },
  {
    id: 'loc-block55',
    name: 'Block 55 (Bio-Sciences & Agriculture)',
    category: 'Academic Block',
    isOffCampus: false,
    distanceFromMainGateKm: 1.3,
    x: 260,
    y: 140,
    description: 'Agriculture farm research, Biotechnology & Pharmacy departments'
  },
  // Sports & Campus Health
  {
    id: 'loc-sports',
    name: 'Shanti Devi Mittal Indoor Sports Arena',
    category: 'Sports & Health',
    isOffCampus: false,
    distanceFromMainGateKm: 1.2,
    x: 340,
    y: 350,
    description: 'Olympic-size swimming pool, badminton, basketball, and gym'
  },
  {
    id: 'loc-hospital',
    name: 'UniHospital & Health Center',
    category: 'Sports & Health',
    isOffCampus: false,
    distanceFromMainGateKm: 0.9,
    x: 650,
    y: 340,
    description: '24x7 emergency medical service and campus pharmacy'
  },
  {
    id: 'loc-cricket',
    name: 'LPU Cricket Ground & Central Park',
    category: 'Sports & Health',
    isOffCampus: false,
    distanceFromMainGateKm: 0.8,
    x: 480,
    y: 120,
    description: 'Turf cricket stadium, running track, and lush green lawns'
  }
];

export const CURRENT_USER: StudentProfile = {
  id: 'user-self',
  name: 'Aarav Sharma',
  regNumber: '12115892',
  course: 'B.Tech Computer Science & Engineering',
  batch: '2022 - 2026 (4th Year)',
  avatar: '',
  phone: '+91 98765-43210',
  email: 'aarav.12115892@lpu.in',
  rating: 4.9,
  totalRides: 48,
  moneySaved: 2840,
  verifiedStudent: true,
  blockOrHostel: 'BH-3, Room 412',
  gender: 'Male'
};

export const INITIAL_STUDENTS: StudentProfile[] = [
  {
    id: 'student-rahul',
    name: 'Rahul Verma',
    regNumber: '12204891',
    course: 'B.Tech Mechanical Engg',
    batch: '2022 - 2026',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98123-45678',
    email: 'rahul.12204891@lpu.in',
    rating: 4.8,
    totalRides: 34,
    moneySaved: 1950,
    verifiedStudent: true,
    blockOrHostel: 'BH-4',
    gender: 'Male'
  },
  {
    id: 'student-simran',
    name: 'Simran Kaur',
    regNumber: '12108842',
    course: 'B.A. LL.B (Hons)',
    batch: '2021 - 2026',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98722-11445',
    email: 'simran.12108842@lpu.in',
    rating: 5.0,
    totalRides: 56,
    moneySaved: 3400,
    verifiedStudent: true,
    blockOrHostel: 'GH-2',
    gender: 'Female'
  },
  {
    id: 'student-ananya',
    name: 'Ananya Gupta',
    regNumber: '12314560',
    course: 'MBA Marketing',
    batch: '2023 - 2025',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+91 97801-99881',
    email: 'ananya.12314560@lpu.in',
    rating: 4.9,
    totalRides: 29,
    moneySaved: 1680,
    verifiedStudent: true,
    blockOrHostel: 'GH-5',
    gender: 'Female'
  },
  {
    id: 'student-gurpreet',
    name: 'Gurpreet Singh',
    regNumber: '12019445',
    course: 'B.Tech IT',
    batch: '2021 - 2025',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+91 94172-88229',
    email: 'gurpreet.12019445@lpu.in',
    rating: 4.7,
    totalRides: 42,
    moneySaved: 2310,
    verifiedStudent: true,
    blockOrHostel: 'BH-8',
    gender: 'Male'
  },
  {
    id: 'student-rohit',
    name: 'Rohit Joshi',
    regNumber: '12211904',
    course: 'B.Design Fashion',
    batch: '2022 - 2026',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98884-33110',
    email: 'rohit.12211904@lpu.in',
    rating: 4.9,
    totalRides: 21,
    moneySaved: 1220,
    verifiedStudent: true,
    blockOrHostel: 'BH-3',
    gender: 'Male'
  },
  {
    id: 'student-priya',
    name: 'Priya Nambiar',
    regNumber: '12117732',
    course: 'B.Pharmacy',
    batch: '2022 - 2026',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    phone: '+91 95011-66778',
    email: 'priya.12117732@lpu.in',
    rating: 4.9,
    totalRides: 38,
    moneySaved: 2450,
    verifiedStudent: true,
    blockOrHostel: 'GH-6',
    gender: 'Female'
  }
];

export const INITIAL_AVAILABLE_RIDES: Ride[] = [
  {
    id: 'ride-1',
    driver: INITIAL_STUDENTS[0], // Rahul Verma
    pickup: LPU_LOCATIONS[0], // Main Gate
    destination: {
      ...LPU_LOCATIONS[6], // Boys Hostel (BH)
      name: 'Boys Hostel (BH-4)'
    },
    currentLocationName: 'LPU Main Gate E-Rickshaw Bay',
    distanceFromUserKm: 0.3,
    totalSeats: 4,
    occupiedSeats: 2,
    availableSeats: 2,
    pricePerSeat: 15,
    departureTime: 'Leaving in 5 mins',
    estimatedArrival: '10:35 AM',
    vehicleType: 'E-Rickshaw',
    vehicleNumber: 'PB 09 ER 4812',
    status: 'active',
    routeStops: ['Main Gate (GT Road)', 'UniMall', 'Open Audi Road', 'Central Library', 'Boys Hostel (BH-4)'],
    isGirlsOnly: false,
    notes: 'Heading back to BH-4 from Main Gate via Open Audi Road corridor. 2 seats open.',
    bookedByStudentIds: ['student-rahul'],
    coordinates: {
      start: { x: 500, y: 520 },
      current: { x: 480, y: 440 },
      end: { x: 320, y: 240 }
    },
    roadWaypoints: [
      { x: 500, y: 520 },
      { x: 510, y: 410 },
      { x: 510, y: 360 },
      { x: 470, y: 315 },
      { x: 420, y: 330 },
      { x: 340, y: 350 },
      { x: 320, y: 240 }
    ],
    progressPercentage: 25
  },
  {
    id: 'ride-2',
    driver: INITIAL_STUDENTS[1], // Simran Kaur
    pickup: {
      ...LPU_LOCATIONS[7], // Girls Hostel (GH)
      name: 'Girls Hostel (GH-2)'
    },
    destination: LPU_LOCATIONS[8], // Block 34 (School of Computer Science)
    currentLocationName: 'GH-2 Turnstile Gate',
    distanceFromUserKm: 0.4,
    totalSeats: 3,
    occupiedSeats: 2,
    availableSeats: 1,
    pricePerSeat: 10,
    departureTime: 'Leaving in 8 mins',
    estimatedArrival: '10:45 AM',
    vehicleType: 'E-Rickshaw',
    vehicleNumber: 'PB 08 CX 9042',
    status: 'active',
    routeStops: ['Girls Hostel (GH-2)', 'UniHospital', 'Open Audi Road', 'Central Library', 'Block 34 (CSE)'],
    isGirlsOnly: true,
    notes: 'Girls only sharing to Block 34 for morning lab session.',
    bookedByStudentIds: ['student-simran'],
    coordinates: {
      start: { x: 680, y: 260 },
      current: { x: 580, y: 240 },
      end: { x: 380, y: 170 }
    },
    roadWaypoints: [
      { x: 680, y: 260 },
      { x: 640, y: 330 },
      { x: 510, y: 360 },
      { x: 470, y: 315 },
      { x: 480, y: 270 },
      { x: 410, y: 210 },
      { x: 380, y: 170 }
    ],
    progressPercentage: 35
  },
  {
    id: 'ride-3',
    driver: INITIAL_STUDENTS[3], // Gurpreet Singh
    pickup: LPU_LOCATIONS[1], // Law Gate
    destination: LPU_LOCATIONS[2], // UniMall & Food Court
    currentLocationName: 'Law Gate Auto Stand',
    distanceFromUserKm: 0.6,
    totalSeats: 3,
    occupiedSeats: 1,
    availableSeats: 2,
    pricePerSeat: 15,
    departureTime: 'Leaving in 10 mins',
    estimatedArrival: '10:55 AM',
    vehicleType: 'Auto-Rickshaw',
    vehicleNumber: 'PB 09 ER 1109',
    status: 'active',
    routeStops: ['Law Gate', 'Indoor Sports Arena', 'Unipolis', 'Open Audi Road', 'UniMall'],
    isGirlsOnly: false,
    notes: 'Going to UniMall for lunch via Open Audi Road, 2 empty seats!',
    bookedByStudentIds: ['student-gurpreet'],
    coordinates: {
      start: { x: 220, y: 420 },
      current: { x: 320, y: 380 },
      end: { x: 520, y: 360 }
    },
    roadWaypoints: [
      { x: 220, y: 420 },
      { x: 340, y: 350 },
      { x: 420, y: 330 },
      { x: 470, y: 315 },
      { x: 520, y: 360 }
    ],
    progressPercentage: 30
  },
  {
    id: 'ride-4',
    driver: INITIAL_STUDENTS[4], // Rohit Joshi
    pickup: LPU_LOCATIONS[2], // UniMall
    destination: LPU_LOCATIONS[11], // Shanti Devi Mittal Indoor Sports Arena
    currentLocationName: 'UniMall Nescafe Corner',
    distanceFromUserKm: 0.2,
    totalSeats: 4,
    occupiedSeats: 1,
    availableSeats: 3,
    pricePerSeat: 10,
    departureTime: 'Leaving in 15 mins',
    estimatedArrival: '11:10 AM',
    vehicleType: 'E-Rickshaw',
    vehicleNumber: 'PB 36 B 7880',
    status: 'active',
    routeStops: ['UniMall', 'Open Audi Road', 'Unipolis', 'Sports Arena'],
    isGirlsOnly: false,
    notes: 'Heading to indoor badminton courts & gym. 3 seats open.',
    bookedByStudentIds: ['student-rohit'],
    coordinates: {
      start: { x: 520, y: 360 },
      current: { x: 470, y: 355 },
      end: { x: 340, y: 350 }
    },
    roadWaypoints: [
      { x: 520, y: 360 },
      { x: 470, y: 315 },
      { x: 420, y: 330 },
      { x: 340, y: 350 }
    ],
    progressPercentage: 20
  },
  {
    id: 'ride-5',
    driver: INITIAL_STUDENTS[5], // Priya Nambiar
    pickup: LPU_LOCATIONS[0], // Main Gate
    destination: {
      ...LPU_LOCATIONS[7], // Girls Hostel (GH)
      name: 'Girls Hostel (GH-5)'
    },
    currentLocationName: 'Main Gate Security Turnstile',
    distanceFromUserKm: 0.5,
    totalSeats: 3,
    occupiedSeats: 2,
    availableSeats: 1,
    pricePerSeat: 15,
    departureTime: 'Leaving in 6 mins',
    estimatedArrival: '10:42 AM',
    vehicleType: 'Auto-Rickshaw',
    vehicleNumber: 'PB 08 T 3311',
    status: 'active',
    routeStops: ['Main Gate (GT Road)', 'UniHospital', 'Girls Hostel (GH-5)'],
    isGirlsOnly: true,
    notes: 'Returning to GH-5 from Main Gate, 1 empty seat available.',
    bookedByStudentIds: ['student-priya'],
    coordinates: {
      start: { x: 500, y: 520 },
      current: { x: 570, y: 410 },
      end: { x: 680, y: 260 }
    },
    roadWaypoints: [
      { x: 500, y: 520 },
      { x: 510, y: 400 },
      { x: 550, y: 360 },
      { x: 640, y: 330 },
      { x: 680, y: 260 }
    ],
    progressPercentage: 40
  },
  {
    id: 'ride-6',
    driver: INITIAL_STUDENTS[2], // Ananya Gupta
    pickup: {
      ...LPU_LOCATIONS[6], // Boys Hostel (BH)
      name: 'Boys Hostel (BH-8)'
    },
    destination: LPU_LOCATIONS[9], // Block 38 (Mittal School of Business)
    currentLocationName: 'BH-8 Sports Circle',
    distanceFromUserKm: 0.7,
    totalSeats: 3,
    occupiedSeats: 1,
    availableSeats: 2,
    pricePerSeat: 15,
    departureTime: 'Leaving at 11:30 AM',
    estimatedArrival: '11:45 AM',
    vehicleType: 'E-Rickshaw',
    vehicleNumber: 'PB 09 Y 5521',
    status: 'upcoming',
    routeStops: ['Boys Hostel (BH-8)', 'Unipolis', 'Open Audi Road', 'Central Library', 'Block 38 (Business School)'],
    isGirlsOnly: false,
    notes: 'Going to Block 38 for afternoon presentation.',
    bookedByStudentIds: ['student-ananya'],
    coordinates: {
      start: { x: 320, y: 240 },
      current: { x: 320, y: 240 },
      end: { x: 580, y: 190 }
    },
    roadWaypoints: [
      { x: 320, y: 240 },
      { x: 340, y: 350 },
      { x: 420, y: 330 },
      { x: 470, y: 315 },
      { x: 480, y: 270 },
      { x: 540, y: 230 },
      { x: 580, y: 190 }
    ],
    progressPercentage: 0
  },
  {
    id: 'ride-7',
    driver: {
      id: 'student-vikram',
      name: 'Vikramaditya Rao',
      regNumber: '12104523',
      course: 'B.Tech Aerospace Engg',
      batch: '2022 - 2026',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      phone: '+91 97791-23849',
      email: 'vikram.12104523@lpu.in',
      rating: 4.9,
      totalRides: 41,
      moneySaved: 2600,
      verifiedStudent: true,
      blockOrHostel: 'BH-1',
      gender: 'Male'
    },
    pickup: {
      id: 'loc-openaudi',
      name: 'LPU Open Audi Road (Central Campus)',
      category: 'Campus Hub',
      isOffCampus: false,
      distanceFromMainGateKm: 0.6,
      x: 470,
      y: 315,
      description: 'Central campus heart on Open Audi Road (GPS: 31.255228, 75.704727)',
      gpsCoords: { lat: 31.255228, lng: 75.704727 },
      mapsUrl: 'https://maps.app.goo.gl/9mhLf4ZKg2RzUr2F9'
    },
    destination: {
      id: 'loc-block34',
      name: 'Block 34 (School of Computer Science)',
      category: 'Academic Block',
      isOffCampus: false,
      distanceFromMainGateKm: 0.9,
      x: 380,
      y: 170,
      description: 'Engineering & Technology labs, Apple iOS Dev Center'
    },
    currentLocationName: 'Open Audi Road Junction (31.255228, 75.704727)',
    distanceFromUserKm: 0.2,
    totalSeats: 3,
    occupiedSeats: 1,
    availableSeats: 2,
    pricePerSeat: 10,
    departureTime: 'Leaving now (Live on Campus Road)',
    estimatedArrival: '10:46 AM',
    vehicleType: 'E-Rickshaw',
    vehicleNumber: 'PB 09 ER 3125',
    status: 'active',
    routeStops: ['Open Audi Road (GPS: 31.255228, 75.704727)', 'Central Library Spine', 'Block 34 (CSE)'],
    isGirlsOnly: false,
    notes: 'Campus E-Rickshaw live on Open Audi Road corridor. Sharing to Block 34 labs!',
    bookedByStudentIds: ['student-vikram'],
    coordinates: {
      start: { x: 470, y: 315 },
      current: { x: 470, y: 280 },
      end: { x: 380, y: 170 }
    },
    roadWaypoints: [
      { x: 470, y: 315 },
      { x: 480, y: 270 },
      { x: 430, y: 220 },
      { x: 380, y: 170 }
    ],
    progressPercentage: 50
  }
];

export const INITIAL_USER_BOOKINGS: MyBooking[] = [
  {
    id: 'booking-active-1',
    rideId: 'ride-1',
    ride: INITIAL_AVAILABLE_RIDES[0],
    seatsBooked: 1,
    totalPrice: 15,
    bookedAt: 'Today, 10:15 AM',
    status: 'active',
    boardingOtp: '4892',
    pickupNote: 'Waiting near Main Gate SBI ATM kiosk',
    coPassengers: [
      { name: 'Rahul Verma (Driver/Host)', course: 'B.Tech Mech', phone: '+91 98123-45678' },
      { name: 'Tanmay Saxena', course: 'BBA', phone: '+91 99144-88221' }
    ]
  },
  {
    id: 'booking-past-1',
    rideId: 'ride-hist-1',
    ride: {
      id: 'ride-hist-1',
      driver: INITIAL_STUDENTS[3],
      pickup: LPU_LOCATIONS[1], // Law Gate
      destination: LPU_LOCATIONS[3], // Central Library
      currentLocationName: 'Completed',
      distanceFromUserKm: 0,
      totalSeats: 3,
      occupiedSeats: 3,
      availableSeats: 0,
      pricePerSeat: 15,
      departureTime: 'Yesterday, 4:30 PM',
      estimatedArrival: '4:45 PM',
      vehicleType: 'Auto-Rickshaw',
      vehicleNumber: 'PB 09 AC 7810',
      status: 'completed',
      routeStops: ['Law Gate', 'Indoor Sports Arena', 'Central Library'],
      bookedByStudentIds: ['user-self']
    },
    seatsBooked: 1,
    totalPrice: 15,
    bookedAt: 'Yesterday, 4:20 PM',
    status: 'completed',
    boardingOtp: '3391',
    coPassengers: [
      { name: 'Gurpreet Singh', course: 'B.Tech IT', phone: '+91 94172-88229' },
      { name: 'Harshita Sen', course: 'B.Sc Biotech', phone: '+91 98711-22334' }
    ]
  },
  {
    id: 'booking-past-2',
    rideId: 'ride-hist-2',
    ride: {
      id: 'ride-hist-2',
      driver: INITIAL_STUDENTS[1],
      pickup: LPU_LOCATIONS[2], // UniMall
      destination: {
        ...LPU_LOCATIONS[6],
        name: 'Girls Hostel (GH-2)'
      },
      currentLocationName: 'Completed',
      distanceFromUserKm: 0,
      totalSeats: 4,
      occupiedSeats: 4,
      availableSeats: 0,
      pricePerSeat: 10,
      departureTime: '3 days ago',
      estimatedArrival: '7:45 PM',
      vehicleType: 'E-Rickshaw',
      vehicleNumber: 'PB 08 CD 4421',
      status: 'completed',
      routeStops: ['UniMall', 'Central Library', 'Girls Hostel (GH-2)'],
      bookedByStudentIds: ['user-self']
    },
    seatsBooked: 1,
    totalPrice: 10,
    bookedAt: 'Sep 8, 7:30 PM',
    status: 'completed',
    boardingOtp: '7104'
  }
];

export const POPULAR_DESTINATIONS = [
  {
    title: 'Open Audi Road (Central Spine)',
    category: 'Campus Road',
    distance: 'Heart of Campus (31.255228, 75.704727)',
    avgShareFare: '₹10 - ₹15 / seat',
    soloFare: '₹30',
    savings: 'Save ~₹20 per ride',
    icon: 'navigation',
    popularTimes: 'All-day student transit & lab rush',
    targetLocationId: 'loc-openaudi'
  },
  {
    title: 'UniMall & Food Court',
    category: 'Campus Hub',
    distance: 'Central Hub',
    avgShareFare: '₹10 - ₹15 / seat',
    soloFare: '₹30 - ₹40',
    savings: 'Save ~₹25 per trip',
    icon: 'utensils',
    popularTimes: 'Lunch (12 - 2 PM) & Evening (5 - 8 PM)',
    targetLocationId: 'loc-unimall'
  },
  {
    title: 'Law Gate (Back Gate Market)',
    category: 'Campus Gate',
    distance: '1.5 km across campus',
    avgShareFare: '₹15 - ₹20 / seat',
    soloFare: '₹40 - ₹50',
    savings: 'Save ~₹30 per trip',
    icon: 'map-pin',
    popularTimes: 'Evening food rush & weekend shopping',
    targetLocationId: 'loc-lawgate'
  },
  {
    title: 'Boys Hostels (BH-1 to BH-13)',
    category: 'Hostel Zone',
    distance: 'Residential Zone',
    avgShareFare: '₹10 - ₹15 / seat',
    soloFare: '₹30 - ₹40',
    savings: 'Save ~₹25 with roommates',
    icon: 'navigation',
    popularTimes: 'After 5 PM lectures & curfew return',
    targetLocationId: 'loc-bh'
  },
  {
    title: 'Girls Hostels (GH-1 to GH-13)',
    category: 'Hostel Zone',
    distance: 'Residential Complex',
    avgShareFare: '₹10 - ₹15 / seat',
    soloFare: '₹30 - ₹40',
    savings: 'Save ~₹25 per ride',
    icon: 'navigation',
    popularTimes: 'Post 4:30 PM classes & evening dining',
    targetLocationId: 'loc-gh'
  },
  {
    title: 'Central Library & Admin Block',
    category: 'Academic Hub',
    distance: 'Academic Zone',
    avgShareFare: '₹10 / seat',
    soloFare: '₹30',
    savings: 'Save ~₹20 per trip',
    icon: 'map-pin',
    popularTimes: 'Exam weeks & morning class hours',
    targetLocationId: 'loc-library'
  },
  {
    title: 'Block 34 (Computer Science & Engg)',
    category: 'Academic Block',
    distance: 'Engineering Zone',
    avgShareFare: '₹10 - ₹15 / seat',
    soloFare: '₹35',
    savings: 'Save ~₹20 to labs',
    icon: 'navigation',
    popularTimes: '8:30 AM & 1:30 PM lab rush',
    targetLocationId: 'loc-block34'
  },
  {
    title: 'Indoor Sports Arena & Pool',
    category: 'Sports & Health',
    distance: 'Athletics Zone',
    avgShareFare: '₹15 / seat',
    soloFare: '₹40',
    savings: 'Save ~₹25 for gym/swimming',
    icon: 'navigation',
    popularTimes: 'Morning (6 - 8 AM) & Evening (5 - 8 PM)',
    targetLocationId: 'loc-sports'
  },
  {
    title: 'LPU Main Gate (GT Road)',
    category: 'Campus Entry',
    distance: 'Main Entrance',
    avgShareFare: '₹10 - ₹15 / seat',
    soloFare: '₹35 - ₹45',
    savings: 'Save ~₹25 per ride',
    icon: 'navigation',
    popularTimes: 'Friday departures & Sunday return curfew',
    targetLocationId: 'loc-maingate'
  }
];
