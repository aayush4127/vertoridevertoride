import { Ride, CampusLocation } from '../types';

/**
 * Clean algorithmic matching logic without AI or ML.
 * Uses location IDs, campus coordinates, route stop overlap, and seat availability.
 */

export interface MatchResult {
  ride: Ride;
  matchScore: number; // 0 - 100%
  matchReason: string;
  walkingDistanceToPickupKm: number;
}

export function calculateDistanceKm(loc1: CampusLocation, loc2: CampusLocation): number {
  // If either has direct distance from main gate, estimate via difference or 2D grid
  const dx = (loc1.x - loc2.x) * 0.02; // scale factor
  const dy = (loc1.y - loc2.y) * 0.02;
  const euclidean = Math.sqrt(dx * dx + dy * dy);
  return Math.round(euclidean * 10) / 10;
}

export function findMatchingRides(
  allRides: Ride[],
  userPickupId?: string,
  userDestinationId?: string,
  requiredSeats: number = 1,
  filters?: {
    destinationKeyword?: string;
    maxDistanceKm?: number;
    minSeats?: number;
    currentLocationFilter?: string;
    girlsOnlyOnly?: boolean;
    vehicleType?: string;
  }
): MatchResult[] {
  return allRides
    .filter((ride) => {
      // Must have enough seats available
      const minSeatsRequired = filters?.minSeats ?? requiredSeats;
      if (ride.availableSeats < minSeatsRequired) return false;

      // Girls only filter
      if (filters?.girlsOnlyOnly && !ride.isGirlsOnly) {
        return false;
      }

      // Vehicle filter
      if (filters?.vehicleType && filters.vehicleType !== 'All' && ride.vehicleType !== filters.vehicleType) {
        return false;
      }

      // Destination keyword filter
      if (filters?.destinationKeyword && filters.destinationKeyword.trim() !== '') {
        const kw = filters.destinationKeyword.toLowerCase();
        const matchesDest = ride.destination.name.toLowerCase().includes(kw);
        const matchesStops = ride.routeStops.some((s) => s.toLowerCase().includes(kw));
        if (!matchesDest && !matchesStops) return false;
      }

      // Location filter (e.g. Hostels, Campus Gates, City)
      if (filters?.currentLocationFilter && filters.currentLocationFilter !== 'All') {
        const filterVal = filters.currentLocationFilter.toLowerCase();
        const locCat = ride.pickup.category.toLowerCase();
        if (!locCat.includes(filterVal) && !ride.currentLocationName.toLowerCase().includes(filterVal)) {
          return false;
        }
      }

      // Distance from user filter
      if (filters?.maxDistanceKm && ride.distanceFromUserKm > filters.maxDistanceKm) {
        return false;
      }

      return true;
    })
    .map((ride) => {
      let score = 70;
      let reason = 'Active ride with open seats';
      const walkingDist = ride.distanceFromUserKm;

      // Pickup matching
      if (userPickupId) {
        if (ride.pickup.id === userPickupId) {
          score += 20;
          reason = 'Exact pickup location match';
        } else if (ride.routeStops.some((s) => s.toLowerCase().includes(userPickupId.toLowerCase()))) {
          score += 15;
          reason = 'Pickup is an en-route stop';
        } else {
          // Distance penalty
          score -= Math.min(25, Math.floor(walkingDist * 10));
        }
      }

      // Destination matching
      if (userDestinationId) {
        if (ride.destination.id === userDestinationId) {
          score += 20;
          reason = 'Exact destination match (' + ride.destination.name + ')';
        } else if (ride.routeStops.some((s) => s.toLowerCase().includes(userDestinationId.toLowerCase()))) {
          score += 12;
          reason = 'Passes right through your destination';
        } else {
          score -= 10;
        }
      }

      // Closeness bonus
      if (walkingDist <= 0.8) {
        score += 10;
      }

      // Clamp between 30 and 100
      const finalScore = Math.min(100, Math.max(35, score));

      return {
        ride,
        matchScore: finalScore,
        matchReason: reason,
        walkingDistanceToPickupKm: walkingDist
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
