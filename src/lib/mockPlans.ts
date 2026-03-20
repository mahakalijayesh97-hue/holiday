// lib/mockPlans.ts
import { ITravelPlan } from '@/models/Inquiry';

// ─── Fallback static data for known cities ────────────────────────────────────
const LITE_CITY_DATA: Record<
  string,
  { morning: string; afternoon: string; evening: string; highlights: string[] }
> = {
  ahmedabad: {
    morning: 'Sabarmati Ashram & Heritage Walk',
    afternoon: 'Adalaj Stepwell & Science City',
    evening: 'Kankaria Lake (Illuminated View)',
    highlights: [
      'Sabarmati Ashram visit',
      'Old City Heritage Tour',
      'Authentic Gujarati Thali',
      'Kankaria Lake sunset',
    ],
  },
  mumbai: {
    morning: 'Gateway of India & Taj Palace',
    afternoon: 'Marine Drive & Mani Bhavan Museum',
    evening: 'Juhu Beach (Street Food Experience)',
    highlights: [
      'Colaba Heritage walk',
      'Marine Drive Sunset',
      'Bandra-Worli Sealink view',
      'Elephanta Caves tour',
    ],
  },
  goa: {
    morning: 'Old Goa Churches (Basilica of Bom Jesus)',
    afternoon: 'Baga & Calangute Beach adventure',
    evening: 'Dona Paula Viewpoint or Casino Cruise',
    highlights: [
      'Beach hopping in North Goa',
      'Water sports at Calangute',
      'South Goa spice plantation',
      'Sunset dinner',
    ],
  },
  paris: {
    morning: 'Eiffel Tower & Trocadéro Gardens',
    afternoon: 'Louvre Museum & Seine River stroll',
    evening: 'Montmartre Artists Square & Sacré-Cœur',
    highlights: [
      'Eiffel Tower Summit',
      'Louvre Masterpieces',
      'Seine Dinner Cruise',
      'Champs-Élysées shopping',
    ],
  },
  tokyo: {
    morning: 'Senso-ji Temple & Asakusa',
    afternoon: 'Shibuya Crossing & Harajuku',
    evening: 'Shinjuku Neon Lights & Izakaya',
    highlights: [
      'Mt. Fuji Day Trip',
      'Tsukiji Fish Market',
      'teamLab Digital Art',
      'Akihabara Electronics',
    ],
  },
  bali: {
    morning: 'Tanah Lot Temple at Sunrise',
    afternoon: 'Ubud Rice Terraces & Monkey Forest',
    evening: 'Seminyak Beach Sunset Bar',
    highlights: [
      'Uluwatu Kecak Dance',
      'Tegalalang Rice Terraces',
      'Balinese Cooking Class',
      'Mount Batur Sunrise Trek',
    ],
  },
  dubai: {
    morning: 'Burj Khalifa Sky Deck & Dubai Mall',
    afternoon: 'Dubai Creek & Gold Souk',
    evening: 'Desert Safari & BBQ Dinner',
    highlights: [
      'Palm Jumeirah Tour',
      'Dubai Frame Visit',
      'Burj Al Arab Exterior',
      'Dubai Marina Dhow Cruise',
    ],
  },
  london: {
    morning: 'Tower of London & Tower Bridge',
    afternoon: 'British Museum & Covent Garden',
    evening: 'West End Show & Soho Dinner',
    highlights: [
      'Buckingham Palace Guard',
      'Hyde Park Stroll',
      'Borough Market Food Tour',
      'Thames River Cruise',
    ],
  },
  nyc: {
    morning: 'Statue of Liberty & Ellis Island',
    afternoon: 'Central Park & Metropolitan Museum',
    evening: 'Times Square & Broadway Show',
    highlights: [
      'Brooklyn Bridge Walk',
      'High Line Park',
      'Empire State Building',
      'Chelsea Market Food Tour',
    ],
  },
  rome: {
    morning: 'Colosseum & Roman Forum',
    afternoon: 'Vatican Museums & Sistine Chapel',
    evening: 'Trastevere Dinner & Gelato Walk',
    highlights: [
      'Trevi Fountain Toss',
      'Pantheon Visit',
      'Borghese Gallery',
      'Authentic Roman Pasta',
    ],
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface DayPlan {
  day: number;
  title: string;
  places: string[];
  route: string;
  activities: string[];
}

// ─── Helper: generate days from city data ─────────────────────────────────────
function buildDaysFromCityData(
  dest: string,
  days: number,
  theme: string,
  cityData: (typeof LITE_CITY_DATA)[string]
): DayPlan[] {
  return Array.from({ length: days }, (_, i) => {
    const dayNum = i + 1;

    if (dayNum === 1) {
      return {
        day: 1,
        title: `Day 1: Arrival & ${cityData.morning}`,
        places: [cityData.morning, `${dest} City Center`, 'Hotel Check-in'],
        route: `Airport → ${dest} City Center → Hotel`,
        activities: ['City orientation walk', 'Welcome dinner', 'Rest & refresh'],
      };
    }
    if (dayNum === days) {
      return {
        day: days,
        title: `Day ${days}: ${cityData.evening} & Farewell`,
        places: [cityData.evening, 'Souvenir Shopping', `${dest} Airport`],
        route: `Hotel → ${cityData.evening} → Airport Departure`,
        activities: ['Last sightseeing', 'Souvenir shopping', 'Departure'],
      };
    }
    if (dayNum % 2 === 0) {
      return {
        day: dayNum,
        title: `Day ${dayNum}: ${cityData.afternoon}`,
        places: [cityData.afternoon, cityData.morning, 'Local Restaurant'],
        route: `Hotel → ${cityData.afternoon} → Lunch → ${cityData.morning} → Hotel`,
        activities: [`${theme} experience`, 'Local cuisine tasting', 'Photography tour'],
      };
    }
    return {
      day: dayNum,
      title: `Day ${dayNum}: ${cityData.evening}`,
      places: [cityData.evening, cityData.afternoon, 'Night Viewpoint'],
      route: `Hotel → ${cityData.afternoon} → ${cityData.evening} → Hotel`,
      activities: ['Sunset viewing', 'Street food tasting', 'Evening stroll'],
    };
  });
}

// ─── Helper: generic days for unknown cities ──────────────────────────────────
function buildGenericDays(dest: string, days: number, theme: string): DayPlan[] {
  return Array.from({ length: days }, (_, i) => {
    const dayNum = i + 1;
    return {
      day: dayNum,
      title:
        dayNum === 1
          ? `Day 1: Arrival & Orientation in ${dest}`
          : dayNum === days
          ? `Day ${days}: Final Exploration & Departure`
          : `Day ${dayNum}: Exploring ${dest} — ${theme}`,
      places:
        dayNum === 1
          ? [`${dest} International Airport`, `${dest} City Center`, 'Hotel Check-in']
          : dayNum === days
          ? [`${dest} Old Market`, 'Souvenir Shopping', `${dest} Airport Departure`]
          : [`${dest} Main Attraction`, `${dest} Cultural Museum`, `${dest} Local Market`],
      route: `Hotel → ${dest} Landmark → Local Eatery → Hotel`,
      activities: [`${theme} experience`, 'Local cuisine tasting', 'Photography tour'],
    };
  });
}

// ─── Main mock generator (used as fallback) ───────────────────────────────────
export function generateMockPlans(destination: string, days: number): ITravelPlan[] {
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const dest = capitalize(destination.split(',')[0].trim()); // handle "Paris, France"
  const lowerDest = destination.toLowerCase().split(',')[0].trim();

  const cityData = LITE_CITY_DATA[lowerDest];

  const makeHighlights = (fallback: string[]) =>
    cityData ? cityData.highlights : fallback;

  return [
    {
      id: 'plan-budget',
      title: `${dest} Budget Explorer`,
      description: `Experience the best of ${dest} on a shoestring budget. Ideal for backpackers and solo travelers.`,
      budget: 'low',
      estimatedCost: `₹${days * 2500}–₹${days * 4000} per person`,
      highlights: makeHighlights([
        `Local street food tour in ${dest}`,
        'Public transport exploration',
        'Free museums & parks',
        'Budget guesthouses',
      ]),
      bestFor: 'Budget travelers & backpackers',
      days: cityData
        ? buildDaysFromCityData(dest, days, 'Local Explore', cityData)
        : buildGenericDays(dest, days, 'Local Explore'),
    },
    {
      id: 'plan-comfort',
      title: `${dest} Comfort Journey`,
      description: `A well-balanced itinerary mixing comfort stays, guided tours, and must-see attractions in ${dest}.`,
      budget: 'medium',
      estimatedCost: `₹${days * 5000}–₹${days * 8000} per person`,
      highlights: makeHighlights([
        `Guided city tour of ${dest}`,
        '3-star hotel accommodations',
        'Popular landmarks',
        'Day trip excursion',
      ]),
      bestFor: 'Couples & families',
      days: cityData
        ? buildDaysFromCityData(dest, days, 'Cultural', cityData)
        : buildGenericDays(dest, days, 'Cultural'),
    },
    {
      id: 'plan-luxury',
      title: `${dest} Luxury Escape`,
      description: `Indulge in the finest experiences ${dest} has to offer. Premium hotels, private transfers, and VIP access.`,
      budget: 'high',
      estimatedCost: `₹${days * 12000}–₹${days * 20000} per person`,
      highlights: makeHighlights([
        `5-star luxury resorts in ${dest}`,
        'Private guided tours',
        'Fine dining experiences',
        'Helicopter/yacht transfers',
      ]),
      bestFor: 'Luxury seekers & honeymooners',
      days: cityData
        ? buildDaysFromCityData(dest, days, 'Luxury', cityData)
        : buildGenericDays(dest, days, 'Luxury'),
    },
    {
      id: 'plan-adventure',
      title: `${dest} Adventure Quest`,
      description: `For thrill-seekers and outdoor lovers. Push boundaries and discover the wild side of ${dest}.`,
      budget: 'medium',
      estimatedCost: `₹${days * 4500}–₹${days * 7000} per person`,
      highlights: makeHighlights([
        `Outdoor trekking near ${dest}`,
        'Extreme sports activities',
        'Nature & wildlife tours',
        'Camping experiences',
      ]),
      bestFor: 'Adventure seekers & solo travelers',
      days: cityData
        ? buildDaysFromCityData(dest, days, 'Adventure', cityData)
        : buildGenericDays(dest, days, 'Adventure'),
    },
    {
      id: 'plan-cultural',
      title: `${dest} Cultural Immersion`,
      description: `Dive deep into the history, art, and traditions of ${dest}. A journey for the curious mind.`,
      budget: 'medium',
      estimatedCost: `₹${days * 4000}–₹${days * 6500} per person`,
      highlights: makeHighlights([
        `Heritage walking tours in ${dest}`,
        'Local cooking class',
        'Museum & art gallery visits',
        'Traditional performance show',
      ]),
      bestFor: 'History buffs & culture enthusiasts',
      days: cityData
        ? buildDaysFromCityData(dest, days, 'Cultural Immersion', cityData)
        : buildGenericDays(dest, days, 'Cultural Immersion'),
    },
  ];
}