// lib/mockPlans.ts
import { ITravelPlan } from '@/models/Inquiry';

// ─── Gujarat Districts & Cities Data (All 33 Districts) ──────────────────────
// Region: North Gujarat
// Region: Central Gujarat
// Region: South Gujarat
// Region: Saurashtra
// Region: Kutch

const GUJARAT_CITY_DATA: Record<
  string,
  {
    district: string;
    region: string;
    morning: string;
    afternoon: string;
    evening: string;
    highlights: string[];
    hotels: {
      budget: { name: string; costPerNight: string }[];
      comfort: { name: string; costPerNight: string }[];
      luxury: { name: string; costPerNight: string }[];
    };
  }
> = {
  // ── NORTH GUJARAT ──────────────────────────────────────────────────────────

  ahmedabad: {
    district: 'Ahmedabad',
    region: 'Central Gujarat',
    morning: 'Sabarmati Ashram & Heritage Walk',
    afternoon: 'Adalaj Stepwell & Science City',
    evening: 'Kankaria Lake (Illuminated View)',
    highlights: [
      'Sabarmati Ashram visit',
      'Old City Heritage Tour (UNESCO)',
      'Authentic Gujarati Thali at Agashiye',
      'Kankaria Lake sunset',
    ],
    hotels: {
      budget: [
        { name: 'Hotel Comfort Inn', costPerNight: '₹800–₹1,200' },
        { name: 'OYO Rooms Navrangpura', costPerNight: '₹600–₹1,000' },
      ],
      comfort: [
        { name: 'The Fern Ahmedabad', costPerNight: '₹3,500–₹5,000' },
        { name: 'Hotel Cambay Grand', costPerNight: '₹3,000–₹4,500' },
      ],
      luxury: [
        { name: 'ITC Narmada', costPerNight: '₹10,000–₹18,000' },
        { name: 'Hyatt Regency Ahmedabad', costPerNight: '₹9,000–₹15,000' },
      ],
    },
  },

  gandhinagar: {
    district: 'Gandhinagar',
    region: 'North Gujarat',
    morning: 'Akshardham Temple & Gardens',
    afternoon: 'Indroda Nature Park & Dinosaur Museum',
    evening: 'Sargasan Lake & Sector 5 Market',
    highlights: [
      'Akshardham Temple – one of the largest in India',
      'Indroda Dinosaur & Fossil Park',
      'Gift City Financial Hub tour',
      'Sarita Udyan Botanical Garden',
    ],
    hotels: {
      budget: [
        { name: 'Hotel Haveli', costPerNight: '₹700–₹1,100' },
        { name: 'Treebo Trend Sector 11', costPerNight: '₹900–₹1,400' },
      ],
      comfort: [
        { name: 'Fortune Inn Haveli', costPerNight: '₹3,500–₹5,500' },
        { name: 'Hotel Anand Regency', costPerNight: '₹2,800–₹4,000' },
      ],
      luxury: [
        { name: 'Marriott Gandhinagar', costPerNight: '₹9,000–₹16,000' },
        { name: 'Leela Gandhinagar', costPerNight: '₹11,000–₹20,000' },
      ],
    },
  },

  mehsana: {
    district: 'Mehsana',
    region: 'North Gujarat',
    morning: 'Modhera Sun Temple',
    afternoon: 'Patan – Rani ki Vav (UNESCO Stepwell)',
    evening: 'Local Dudhsagar Dairy Tour',
    highlights: [
      'Modhera Sun Temple – 11th century marvel',
      "Rani ki Vav – UNESCO World Heritage stepwell",
      'Vadnagar Heritage Town walk',
      'Dudhsagar Dairy – world\'s largest dairy',
    ],
    hotels: {
      budget: [
        { name: 'Hotel Shree Ganesh', costPerNight: '₹600–₹900' },
        { name: 'OYO Mehsana City', costPerNight: '₹500–₹800' },
      ],
      comfort: [
        { name: 'Hotel Paras', costPerNight: '₹1,800–₹3,000' },
        { name: 'Hotel Raj Heritage', costPerNight: '₹1,500–₹2,500' },
      ],
      luxury: [
        { name: 'Natures Inn Resort', costPerNight: '₹4,000–₹6,500' },
        { name: 'Hotel Grand Regency', costPerNight: '₹3,500–₹5,500' },
      ],
    },
  },

  patan: {
    district: 'Patan',
    region: 'North Gujarat',
    morning: "Rani ki Vav Stepwell",
    afternoon: 'Patola Silk Weaving Tour',
    evening: 'Hemchandraacharya North Gujarat University',
    highlights: [
      "Rani ki Vav – UNESCO World Heritage Site",
      'Patola double-ikat silk saree weaving',
      'Sahastralinga Lake ruins',
      'Old Patan Heritage Walk',
    ],
    hotels: {
      budget: [
        { name: 'Hotel Navjivan', costPerNight: '₹500–₹800' },
        { name: 'Shreeji Guest House', costPerNight: '₹400–₹700' },
      ],
      comfort: [
        { name: 'Hotel Suraj', costPerNight: '₹1,200–₹2,200' },
        { name: 'Hotel Heritage Inn', costPerNight: '₹1,500–₹2,500' },
      ],
      luxury: [
        { name: 'Patan Heritage Resort', costPerNight: '₹3,500–₹5,500' },
        { name: 'Tree House Resort', costPerNight: '₹4,000–₹6,000' },
      ],
    },
  },

  banaskantha: {
    district: 'Banaskantha',
    region: 'North Gujarat',
    morning: 'Ambaji Temple – Shakti Peetha',
    afternoon: 'Kumbharia Jain Temples',
    evening: 'Balaram Palace Resort grounds',
    highlights: [
      'Ambaji – one of 51 Shakti Peethas',
      'Kumbharia ancient Jain temples',
      'Balaram Palace & Natural Springs',
      'Danta Wildlife Sanctuary',
    ],
    hotels: {
      budget: [
        { name: 'Dharamshala Ambaji', costPerNight: '₹300–₹600' },
        { name: 'Hotel Ambika', costPerNight: '₹500–₹900' },
      ],
      comfort: [
        { name: 'Hotel Ambaji Darshan', costPerNight: '₹1,500–₹2,500' },
        { name: 'Palanpur Inn', costPerNight: '₹1,200–₹2,000' },
      ],
      luxury: [
        { name: 'Balaram Palace Resort', costPerNight: '₹6,000–₹10,000' },
        { name: 'The Fern Resort Ambaji', costPerNight: '₹4,500–₹7,000' },
      ],
    },
  },

  sabarkantha: {
    district: 'Sabarkantha',
    region: 'North Gujarat',
    morning: 'Idar Fort & Ancient Caves',
    afternoon: 'Polo Forest – Ancient Temple Complex',
    evening: 'Shamlaji Temple Evening Aarti',
    highlights: [
      'Polo Forest – medieval Shiva temples',
      'Shamlaji Temple – ancient Vishnu shrine',
      'Idar Heritage Town',
      'Harnav River camping & trekking',
    ],
    hotels: {
      budget: [
        { name: 'Hotel Shiv Shakti', costPerNight: '₹500–₹800' },
        { name: 'Shamlaji Guest House', costPerNight: '₹400–₹700' },
      ],
      comfort: [
        { name: 'Polo Forest Resort', costPerNight: '₹2,500–₹4,000' },
        { name: 'Hotel Green Valley', costPerNight: '₹1,800–₹3,000' },
      ],
      luxury: [
        { name: 'Polo Heritage Resort', costPerNight: '₹5,000–₹8,000' },
        { name: 'Nature Camp Polo', costPerNight: '₹4,500–₹7,000' },
      ],
    },
  },

  aravalli: {
    district: 'Aravalli',
    region: 'North Gujarat',
    morning: 'Modasa Town Heritage Walk',
    afternoon: 'Bayad Fort & Stepwells',
    evening: 'Local Tribal Market Visit',
    highlights: [
      'Modasa – historic market town',
      'Bayad ancient fort ruins',
      'Vatrak River landscape',
      'Local Garba & folk culture',
    ],
    hotels: {
      budget: [
        { name: 'Hotel Aravalli', costPerNight: '₹500–₹800' },
        { name: 'OYO Modasa', costPerNight: '₹450–₹750' },
      ],
      comfort: [
        { name: 'Hotel Raj Palace', costPerNight: '₹1,500–₹2,500' },
        { name: 'Hotel Natraj', costPerNight: '₹1,200–₹2,000' },
      ],
      luxury: [
        { name: 'Natures Green Resort', costPerNight: '₹3,500–₹5,000' },
        { name: 'The Grand Modasa', costPerNight: '₹3,000–₹4,500' },
      ],
    },
  },

  // ── CENTRAL GUJARAT ────────────────────────────────────────────────────────

  vadodara: {
    district: 'Vadodara',
    region: 'Central Gujarat',
    morning: 'Laxmi Vilas Palace & Museum',
    afternoon: 'Champaner-Pavagadh UNESCO Site',
    evening: 'Sursagar Lake & Kirti Mandir',
    highlights: [
      'Laxmi Vilas Palace – opulent royal residence',
      'Champaner-Pavagadh – UNESCO World Heritage',
      'Sayaji Baug Zoo & Museum',
      'Baroda Museum & Picture Gallery',
    ],
    hotels: {
      budget: [
        { name: 'Hotel Surya', costPerNight: '₹700–₹1,100' },
        { name: 'OYO Alkapuri', costPerNight: '₹600–₹1,000' },
      ],
      comfort: [
        { name: 'Express Inn Vadodara', costPerNight: '₹3,000–₹4,500' },
        { name: 'Hotel Surya Palace', costPerNight: '₹2,500–₹4,000' },
      ],
      luxury: [
        { name: 'Vivanta Vadodara', costPerNight: '₹8,000–₹14,000' },
        { name: 'Laxmi Vilas Palace Hotel', costPerNight: '₹12,000–₹22,000' },
      ],
    },
  },

  anand: {
    district: 'Anand',
    region: 'Central Gujarat',
    morning: 'Amul Dairy & National Dairy Dev. Board',
    afternoon: 'Anand Agricultural University',
    evening: 'Shri Krishna Temple & Local Market',
    highlights: [
      'Amul Dairy – birthplace of White Revolution',
      'NDDB & cooperative movement history',
      'Sardar Vallabhbhai Patel birth home – Karamsad',
      'Anand City market & street food',
    ],
    hotels: {
      budget: [
        { name: 'Hotel Shreeji', costPerNight: '₹600–₹900' },
        { name: 'Hotel Tulsi', costPerNight: '₹500–₹800' },
      ],
      comfort: [
        { name: 'Hotel Harmony', costPerNight: '₹2,000–₹3,500' },
        { name: 'Hotel Centre Point', costPerNight: '₹1,800–₹3,000' },
      ],
      luxury: [
        { name: 'Cambay Resort Anand', costPerNight: '₹5,000–₹8,000' },
        { name: 'The Grand Anand', costPerNight: '₹4,500–₹7,000' },
      ],
    },
  },

  kheda: {
    district: 'Kheda',
    region: 'Central Gujarat',
    morning: 'Dakor – Ranchhodraiji Temple',
    afternoon: 'Kapadwanj Town Heritage Walk',
    evening: 'Vatrak River Sunset Picnic',
    highlights: [
      'Dakor Temple – major Vaishnava pilgrimage',
      'Kheda Satyagraha 1918 historical site',
      'Balasinor Dinosaur Fossil Park',
      'Kapadvanj – ancient walled city',
    ],
    hotels: {
      budget: [
        { name: 'Hotel Ranchhod', costPerNight: '₹400–₹700' },
        { name: 'Dakor Guest House', costPerNight: '₹350–₹600' },
      ],
      comfort: [
        { name: 'Hotel Shreenath', costPerNight: '₹1,500–₹2,500' },
        { name: 'Hotel Jay Somnath', costPerNight: '₹1,200–₹2,000' },
      ],
      luxury: [
        { name: 'Natures Nest Kheda', costPerNight: '₹3,500–₹5,500' },
        { name: 'Dinosaur Resort Balasinor', costPerNight: '₹4,000–₹6,500' },
      ],
    },
  },

  panchmahal: {
    district: 'Panchmahal',
    region: 'Central Gujarat',
    morning: 'Champaner-Pavagadh Hill Fort & Temples',
    afternoon: 'Godhra Town Heritage Walk',
    evening: 'Jambughoda Wildlife Sanctuary',
    highlights: [
      'Champaner – UNESCO World Heritage City',
      'Pavagadh – ancient Kali temple trek',
      'Jambughoda nature & wildlife',
      'Halol industrial & market tour',
    ],
    hotels: {
      budget: [
        { name: 'Hotel Pavagadh', costPerNight: '₹500–₹800' },
        { name: 'Guest House Champaner', costPerNight: '₹400–₹700' },
      ],
      comfort: [
        { name: 'Hotel Anil Farmhouse', costPerNight: '₹2,000–₹3,500' },
        { name: 'Champaner Resort', costPerNight: '₹2,500–₹4,000' },
      ],
      luxury: [
        { name: 'Jambughoda Palace', costPerNight: '₹8,000–₹14,000' },
        { name: 'Heritage Bungalow Champaner', costPerNight: '₹6,000–₹10,000' },
      ],
    },
  },

  dahod: {
    district: 'Dahod',
    region: 'Central Gujarat',
    morning: 'Limdi Tribal Village & Crafts',
    afternoon: 'Ratanmahal Sloth Bear Sanctuary',
    evening: 'Dahod Heritage Town Walk',
    highlights: [
      'Ratanmahal Bear Sanctuary',
      'Tribal Bhil & Bhilala culture',
      'Kadana Dam & reservoir',
      'Aurangzeb birthplace – historical site',
    ],
    hotels: {
      budget: [
        { name: 'Hotel Yuvraj', costPerNight: '₹450–₹750' },
        { name: 'OYO Dahod', costPerNight: '₹400–₹650' },
      ],
      comfort: [
        { name: 'Hotel Shivalik', costPerNight: '₹1,500–₹2,500' },
        { name: 'Hotel Green Park', costPerNight: '₹1,200–₹2,000' },
      ],
      luxury: [
        { name: 'Ratanmahal Forest Resort', costPerNight: '₹4,000–₹7,000' },
        { name: 'Tribal Eco Resort', costPerNight: '₹3,500–₹6,000' },
      ],
    },
  },

  mahisagar: {
    district: 'Mahisagar',
    region: 'Central Gujarat',
    morning: 'Lunawada Palace & Heritage',
    afternoon: 'Kadana Reservoir & Dam',
    evening: 'Mahisagar River Sunset',
    highlights: [
      'Lunawada Palace Hotel – royal stay',
      'Kadana Dam – largest dam of Gujarat',
      'Shri Dudheshwar Mahadev Temple',
      'Tribal art & handcraft market',
    ],
    hotels: {
      budget: [
        { name: 'Hotel Mahisagar', costPerNight: '₹450–₹750' },
        { name: 'Lunawada Rest House', costPerNight: '₹350–₹600' },
      ],
      comfort: [
        { name: 'Hotel Rajkumar', costPerNight: '₹1,500–₹2,500' },
        { name: 'Hotel Kadana View', costPerNight: '₹1,200–₹2,000' },
      ],
      luxury: [
        { name: 'Lunawada Palace Hotel', costPerNight: '₹6,000–₹10,000' },
        { name: 'Eco Resort Mahisagar', costPerNight: '₹4,000–₹6,500' },
      ],
    },
  },

  chhota_udaipur: {
    district: 'Chhota Udaipur',
    region: 'Central Gujarat',
    morning: 'Tribal Museum & Rathwa Art',
    afternoon: 'Kavant Tribal Fair (Seasonal)',
    evening: 'Chhota Udaipur Palace',
    highlights: [
      'Rathwa Pithora tribal mural art',
      'Kavant Fair – largest tribal fair of Gujarat',
      'Zinzari Waterfall trek',
      'Chhota Udaipur Palace heritage',
    ],
    hotels: {
      budget: [
        { name: 'Hotel Tribal View', costPerNight: '₹400–₹700' },
        { name: 'Guest House Chhota Udaipur', costPerNight: '₹350–₹600' },
      ],
      comfort: [
        { name: 'Hotel Subhash', costPerNight: '₹1,500–₹2,500' },
        { name: 'Nature Camp Resort', costPerNight: '₹2,000–₹3,500' },
      ],
      luxury: [
        { name: 'Chhota Udaipur Palace', costPerNight: '₹7,000–₹12,000' },
        { name: 'Rathwa Tribal Resort', costPerNight: '₹5,000–₹8,000' },
      ],
    },
  },

  // ── SOUTH GUJARAT ──────────────────────────────────────────────────────────

  surat: {
    district: 'Surat',
    region: 'South Gujarat',
    morning: 'Surat Castle & Dutch Cemetery',
    afternoon: 'Diamond Bourse & Textile Market',
    evening: 'Dumas Beach & Chowpatty Street Food',
    highlights: [
      'Surat Diamond & Textile Market tour',
      'Dumas Beach sunset stroll',
      'Gopi Dining Hall – massive veg thali',
      'Swaminarayan Temple & Heritage Walk',
    ],
    hotels: {
      budget: [
        { name: 'Hotel Amrut Palace', costPerNight: '₹700–₹1,200' },
        { name: 'OYO Adajan', costPerNight: '₹600–₹1,000' },
      ],
      comfort: [
        { name: 'Lords Inn Surat', costPerNight: '₹3,000–₹4,500' },
        { name: 'Hotel Regency Surat', costPerNight: '₹2,500–₹4,000' },
      ],
      luxury: [
        { name: 'Taj Surat', costPerNight: '₹9,000–₹16,000' },
        { name: 'Marriott Surat', costPerNight: '₹8,000–₹14,000' },
      ],
    },
  },

  bharuch: {
    district: 'Bharuch',
    region: 'South Gujarat',
    morning: 'Bharuch Fort & Golden Bridge',
    afternoon: 'Narmada River & Zarwani Waterfall',
    evening: 'Ambaji Mata Temple Evening Aarti',
    highlights: [
      'Bharuch Fort – 2000-year-old historic fort',
      'Zarwani Waterfalls & Eco Camp',
      'Narmada river dolphin spotting',
      'ONGC industrial heritage tour',
    ],
    hotels: {
      budget: [
        { name: 'Hotel Welcome', costPerNight: '₹600–₹900' },
        { name: 'Hotel Siddhi', costPerNight: '₹500–₹800' },
      ],
      comfort: [
        { name: 'Hotel Lords Eco Inn', costPerNight: '₹2,500–₹4,000' },
        { name: 'Hotel Narmada View', costPerNight: '₹2,000–₹3,500' },
      ],
      luxury: [
        { name: 'Zarwani Jungle Resort', costPerNight: '₹5,000–₹8,500' },
        { name: 'Narmada Eco Camp', costPerNight: '₹4,500–₹7,000' },
      ],
    },
  },

  narmada: {
    district: 'Narmada',
    region: 'South Gujarat',
    morning: 'Statue of Unity – World\'s Tallest Statue',
    afternoon: 'Sardar Sarovar Dam & Valley of Flowers',
    evening: 'Tent City at Narmada River',
    highlights: [
      'Statue of Unity – 182m tall wonder',
      'Sardar Sarovar Dam viewpoint',
      'Valley of Flowers seasonal bloom',
      'Jungle Safari at Kevadia',
    ],
    hotels: {
      budget: [
        { name: 'Tent City Economy', costPerNight: '₹1,500–₹2,500' },
        { name: 'GSTDC Tourist Bungalow', costPerNight: '₹800–₹1,500' },
      ],
      comfort: [
        { name: 'Tent City Narmada', costPerNight: '₹4,000–₹6,500' },
        { name: 'Ekta Cruise Hotel', costPerNight: '₹3,500–₹5,500' },
      ],
      luxury: [
        { name: 'Taj Tent City Narmada', costPerNight: '₹12,000–₹20,000' },
        { name: 'Shrestha Bharat Hotels', costPerNight: '₹9,000–₹15,000' },
      ],
    },
  },

  tapi: {
    district: 'Tapi',
    region: 'South Gujarat',
    morning: 'Vyara Town Heritage & Tapi River',
    afternoon: 'Purna Wildlife Sanctuary',
    evening: 'Tribal Village Cultural Evening',
    highlights: [
      'Purna Wildlife Sanctuary – rare species',
      'Tribal Kunbi & Gamit communities',
      'Tapi River eco trails',
      'Wilson Hills picnic retreat',
    ],
    hotels: {
      budget: [
        { name: 'Hotel Tapi', costPerNight: '₹450–₹750' },
        { name: 'Vyara Rest House', costPerNight: '₹350–₹600' },
      ],
      comfort: [
        { name: 'Hotel Green Valley Tapi', costPerNight: '₹1,500–₹2,500' },
        { name: 'Purna Forest Lodge', costPerNight: '₹2,000–₹3,500' },
      ],
      luxury: [
        { name: 'Wilson Hills Resort', costPerNight: '₹5,000–₹8,000' },
        { name: 'Purna Eco Resort', costPerNight: '₹4,500–₹7,000' },
      ],
    },
  },

  navsari: {
    district: 'Navsari',
    region: 'South Gujarat',
    morning: 'Navsari – Dadabhai Naoroji Heritage',
    afternoon: 'Ubhrat Beach & Parsi Village',
    evening: 'Dandi Beach – Salt Satyagraha Memorial',
    highlights: [
      'Dandi – Gandhi\'s Salt March endpoint',
      'Parsi Fire Temple & Doongerwadi',
      'Ubhrat & Dandi beach walks',
      'Billimora Narrow Gauge Railway',
    ],
    hotels: {
      budget: [
        { name: 'Hotel Ashok', costPerNight: '₹500–₹800' },
        { name: 'Navsari Guest House', costPerNight: '₹400–₹700' },
      ],
      comfort: [
        { name: 'Hotel Shirin', costPerNight: '₹1,800–₹3,000' },
        { name: 'Dandi Beach Resort', costPerNight: '₹2,000–₹3,500' },
      ],
      luxury: [
        { name: 'Parsi Beach Retreat', costPerNight: '₹5,000–₹8,500' },
        { name: 'Navsari Heritage Bungalow', costPerNight: '₹4,000–₹6,500' },
      ],
    },
  },

  valsad: {
    district: 'Valsad',
    region: 'South Gujarat',
    morning: 'Valsad Beach & Tithal Beach',
    afternoon: 'Dharampur Hill Station',
    evening: 'Wilson Hills Sunset Viewpoint',
    highlights: [
      'Tithal Beach – popular coastal destination',
      'Dharampur – cool hill station retreat',
      'Wilson Hills – scenic viewpoint',
      'Parnera Fort Heritage Walk',
    ],
    hotels: {
      budget: [
        { name: 'Hotel Sai Darshan', costPerNight: '₹500–₹800' },
        { name: 'OYO Valsad', costPerNight: '₹450–₹750' },
      ],
      comfort: [
        { name: 'Hotel Mandvi Palace', costPerNight: '₹2,000–₹3,500' },
        { name: 'Tithal Beach Resort', costPerNight: '₹2,500–₹4,000' },
      ],
      luxury: [
        { name: 'Dharampur Forest Resort', costPerNight: '₹6,000–₹10,000' },
        { name: 'Wilson Hills Retreat', costPerNight: '₹5,000–₹8,500' },
      ],
    },
  },

  dang: {
    district: 'Dang',
    region: 'South Gujarat',
    morning: 'Saputara Hill Station',
    afternoon: 'Gira Waterfalls & Tribal Museum',
    evening: 'Dang Darbar Cultural Festival (Holi)',
    highlights: [
      'Saputara – only hill station of Gujarat',
      'Gira Waterfalls – seasonal waterfall',
      'Dang tribal culture & handicrafts',
      'Purna Wildlife Sanctuary forest trek',
    ],
    hotels: {
      budget: [
        { name: 'GSTDC Toran Resort Saputara', costPerNight: '₹800–₹1,500' },
        { name: 'Hotel Lake View', costPerNight: '₹700–₹1,200' },
      ],
      comfort: [
        { name: 'Hotel Saputara', costPerNight: '₹2,500–₹4,000' },
        { name: 'Saptashrungi Resort', costPerNight: '₹3,000–₹4,500' },
      ],
      luxury: [
        { name: 'Saputara Mountain Resort', costPerNight: '₹7,000–₹12,000' },
        { name: 'Tribal Eco Lodge Dang', costPerNight: '₹5,000–₹8,500' },
      ],
    },
  },

  // ── SAURASHTRA ─────────────────────────────────────────────────────────────

  rajkot: {
    district: 'Rajkot',
    region: 'Saurashtra',
    morning: 'Watson Museum & Rotary Doll Museum',
    afternoon: 'Khambhalida Buddhist Caves',
    evening: 'Aji Dam Garden & Kaba Gandhi No Delo',
    highlights: [
      'Watson Museum – heritage collection',
      'Kaba Gandhi No Delo – Gandhi\'s childhood home',
      'Rotary Doll Museum',
      'Swaminarayan Temple & Rajkot Heritage Walk',
    ],
    hotels: {
      budget: [
        { name: 'Hotel Galaxy', costPerNight: '₹700–₹1,100' },
        { name: 'OYO Rajkot Central', costPerNight: '₹600–₹1,000' },
      ],
      comfort: [
        { name: 'The Fern Residency Rajkot', costPerNight: '₹3,000–₹4,500' },
        { name: 'Hotel President', costPerNight: '₹2,500–₹4,000' },
      ],
      luxury: [
        { name: 'Radisson Blu Rajkot', costPerNight: '₹7,000–₹12,000' },
        { name: 'The Imperial Palace Rajkot', costPerNight: '₹6,000–₹10,000' },
      ],
    },
  },

  junagadh: {
    district: 'Junagadh',
    region: 'Saurashtra',
    morning: 'Uparkot Fort & Buddhist Caves',
    afternoon: 'Sakkarbagh Zoo (Asiatic Lions)',
    evening: 'Girnar Hill Pilgrimage (5000 steps)',
    highlights: [
      'Girnar Mountain – Jain & Hindu temples',
      'Sakkarbagh – Asiatic lion conservation',
      'Uparkot Fort – 2300-year history',
      'Junagadh Wildlife Sanctuary',
    ],
    hotels: {
      budget: [
        { name: 'Hotel Girnar', costPerNight: '₹600–₹1,000' },
        { name: 'Hotel Relief', costPerNight: '₹500–₹800' },
      ],
      comfort: [
        { name: 'Hotel Saurashtra', costPerNight: '₹2,000–₹3,500' },
        { name: 'Hotel Siddharth', costPerNight: '₹1,800–₹3,000' },
      ],
      luxury: [
        { name: 'Gir Jungle Resort', costPerNight: '₹8,000–₹14,000' },
        { name: 'The Fern Junagadh', costPerNight: '₹6,000–₹10,000' },
      ],
    },
  },

  gir_somnath: {
    district: 'Gir Somnath',
    region: 'Saurashtra',
    morning: 'Somnath Temple – Jyotirlinga',
    afternoon: 'Gir National Park Jeep Safari',
    evening: 'Bhalka Tirth & Prabhas Patan',
    highlights: [
      'Somnath Temple – first Jyotirlinga of India',
      'Gir Forest – only wild Asiatic lion habitat',
      'Bhalka Tirth – Lord Krishna memorial',
      'Triveni Sangam beach at Somnath',
    ],
    hotels: {
      budget: [
        { name: 'Hotel Mayuram', costPerNight: '₹700–₹1,200' },
        { name: 'GSTDC Tourist Bungalow', costPerNight: '₹800–₹1,300' },
      ],
      comfort: [
        { name: 'Hotel Somnath', costPerNight: '₹2,500–₹4,000' },
        { name: 'Gir Safari Lodge', costPerNight: '₹3,500–₹5,500' },
      ],
      luxury: [
        { name: 'The Gateway Hotel Gir Forest', costPerNight: '₹12,000–₹20,000' },
        { name: 'Amidhara Resort Gir', costPerNight: '₹10,000–₹18,000' },
      ],
    },
  },

  amreli: {
    district: 'Amreli',
    region: 'Saurashtra',
    morning: 'Palitana Jain Temples (Shatrunjaya)',
    afternoon: 'Sasan Gir Wildlife',
    evening: 'Amreli Town Heritage Walk',
    highlights: [
      'Palitana – 3000+ Jain temples on Shatrunjaya hill',
      'Gir lion corridor treks',
      'Bhavnagar port town heritage',
      'Alang Ship Breaking Yard',
    ],
    hotels: {
      budget: [
        { name: 'Hotel Amar', costPerNight: '₹500–₹800' },
        { name: 'Palitana Dharamshala', costPerNight: '₹300–₹600' },
      ],
      comfort: [
        { name: 'Hotel Vijay', costPerNight: '₹1,800–₹3,000' },
        { name: 'Palitana Residency', costPerNight: '₹2,000–₹3,500' },
      ],
      luxury: [
        { name: 'Vijay Vilas Palace Mandvi', costPerNight: '₹9,000–₹16,000' },
        { name: 'Nilambag Palace', costPerNight: '₹8,000–₹14,000' },
      ],
    },
  },

  bhavnagar: {
    district: 'Bhavnagar',
    region: 'Saurashtra',
    morning: 'Takhteshwar Temple & Victoria Park',
    afternoon: 'Palitana Shatrunjaya Jain Temples',
    evening: 'Bhavnagar Heritage Market & Gaurishankar Lake',
    highlights: [
      'Palitana – holy Jain pilgrimage hill',
      'Velavadar Blackbuck Sanctuary',
      'Alang Ship Recycling Yard',
      'Nilambag Palace heritage hotel',
    ],
    hotels: {
      budget: [
        { name: 'Hotel Sun & Shree', costPerNight: '₹600–₹1,000' },
        { name: 'Hotel Apollo', costPerNight: '₹500–₹800' },
      ],
      comfort: [
        { name: 'Hotel Blue Hill', costPerNight: '₹2,500–₹4,000' },
        { name: 'Hotel Jubilee', costPerNight: '₹2,000–₹3,500' },
      ],
      luxury: [
        { name: 'Nilambag Palace Hotel', costPerNight: '₹10,000–₹18,000' },
        { name: 'The Fern Bhavnagar', costPerNight: '₹7,000–₹12,000' },
      ],
    },
  },

  porbandar: {
    district: 'Porbandar',
    region: 'Saurashtra',
    morning: 'Kirti Mandir – Mahatma Gandhi Birthplace',
    afternoon: 'Huzoor Palace & Marine National Park',
    evening: 'Chowpatty Beach & Sudama Temple',
    highlights: [
      'Kirti Mandir – Gandhi\'s exact birth site',
      'Sudama Temple – ancient Krishna devotee shrine',
      'Marine National Park – coral reef',
      'Porbandar beach sunset',
    ],
    hotels: {
      budget: [
        { name: 'Hotel Indraprastha', costPerNight: '₹600–₹900' },
        { name: 'Porbandar Rest House', costPerNight: '₹500–₹800' },
      ],
      comfort: [
        { name: 'Hotel Oceanic', costPerNight: '₹2,000–₹3,500' },
        { name: 'Hotel Moon Palace', costPerNight: '₹1,800–₹3,000' },
      ],
      luxury: [
        { name: 'Huzoor Palace Heritage Hotel', costPerNight: '₹8,000–₹14,000' },
        { name: 'Beach Resort Porbandar', costPerNight: '₹5,000–₹8,500' },
      ],
    },
  },

  jamnagar: {
    district: 'Jamnagar',
    region: 'Saurashtra',
    morning: 'Lakhota Lake & Bala Hanuman Temple',
    afternoon: 'Marine National Park – Coral Islands',
    evening: 'Ranmal Lake & Jamnagar Heritage City',
    highlights: [
      'Marine National Park – first in Asia',
      'Bala Hanuman – non-stop Ramdhun since 1964',
      'Khijadiya Bird Sanctuary',
      'Ranjit Sagar Dam & Lakhoata Museum',
    ],
    hotels: {
      budget: [
        { name: 'Hotel President', costPerNight: '₹600–₹1,000' },
        { name: 'Hotel Aram', costPerNight: '₹500–₹800' },
      ],
      comfort: [
        { name: 'Hotel Seven Seas', costPerNight: '₹2,500–₹4,000' },
        { name: 'Hotel Fortune Park', costPerNight: '₹3,000–₹4,500' },
      ],
      luxury: [
        { name: 'Hotel Aram Jamnagar', costPerNight: '₹7,000–₹12,000' },
        { name: 'The Fern Residency Jamnagar', costPerNight: '₹6,000–₹10,000' },
      ],
    },
  },

  devbhoomi_dwarka: {
    district: 'Devbhoomi Dwarka',
    region: 'Saurashtra',
    morning: 'Dwarkadhish Temple – Char Dham',
    afternoon: 'Bet Dwarka Island & Rukmini Temple',
    evening: 'Gomti Ghat Sunset & Aarti',
    highlights: [
      'Dwarkadhish – one of 4 Char Dhams of Hinduism',
      'Bet Dwarka – original Krishna kingdom island',
      'Nageshwar Jyotirlinga Temple',
      'Gopi Talav sacred lake',
    ],
    hotels: {
      budget: [
        { name: 'Hotel Meera', costPerNight: '₹600–₹1,000' },
        { name: 'ISKCON Guest House', costPerNight: '₹400–₹700' },
      ],
      comfort: [
        { name: 'Hotel Gomti', costPerNight: '₹2,500–₹4,000' },
        { name: 'Hotel Shreenath', costPerNight: '₹2,000–₹3,500' },
      ],
      luxury: [
        { name: 'Radhe Krishna Beach Resort', costPerNight: '₹8,000–₹14,000' },
        { name: 'Dwarka Heritage Hotel', costPerNight: '₹6,000–₹10,000' },
      ],
    },
  },

  surendranagar: {
    district: 'Surendranagar',
    region: 'Saurashtra',
    morning: 'Tarnetar Fair (Seasonal)',
    afternoon: 'Wadhwan Fort & Rangeela Masjid',
    evening: 'Little Rann of Kutch Sunset Safari',
    highlights: [
      'Tarnetar Fair – famous tribal-folk festival',
      'Little Rann of Kutch – Wild Ass Sanctuary',
      'Wadhwan Fort & Chowk Bazaar',
      'Thangadh clay pottery art',
    ],
    hotels: {
      budget: [
        { name: 'Hotel Bhavani', costPerNight: '₹500–₹800' },
        { name: 'OYO Surendranagar', costPerNight: '₹450–₹750' },
      ],
      comfort: [
        { name: 'Hotel Rann View', costPerNight: '₹2,000–₹3,500' },
        { name: 'Hotel City Palace', costPerNight: '₹1,800–₹3,000' },
      ],
      luxury: [
        { name: 'Rann Resort Surendranagar', costPerNight: '₹6,000–₹10,000' },
        { name: 'Wild Ass Eco Camp', costPerNight: '₹5,000–₹8,500' },
      ],
    },
  },

  botad: {
    district: 'Botad',
    region: 'Saurashtra',
    morning: 'Shri Swaminarayan Temple Sarangpur',
    afternoon: 'Botad Town Heritage',
    evening: 'Ghelo River Sunset Walk',
    highlights: [
      'Sarangpur Hanumanji Temple – major pilgrimage',
      'Botad cattle fair & rural Gujarat',
      'Ghelo River picnic spots',
      'Village craft & handloom tradition',
    ],
    hotels: {
      budget: [
        { name: 'Hotel Swagat', costPerNight: '₹400–₹700' },
        { name: 'Dharamshala Sarangpur', costPerNight: '₹200–₹450' },
      ],
      comfort: [
        { name: 'Hotel Riddhi Siddhi', costPerNight: '₹1,200–₹2,200' },
        { name: 'Hotel Navjivan', costPerNight: '₹1,000–₹1,800' },
      ],
      luxury: [
        { name: 'Botad Heritage Bungalow', costPerNight: '₹3,500–₹6,000' },
        { name: 'Sarangpur Pilgrim Resort', costPerNight: '₹4,000–₹6,500' },
      ],
    },
  },

  morbi: {
    district: 'Morbi',
    region: 'Saurashtra',
    morning: 'Green Chowk & Mani Mandir',
    afternoon: 'Ceramics & Clock Factory Tour',
    evening: 'Macchu River & Old Bridge',
    highlights: [
      'Morbi Ceramics Capital of India tour',
      'Mani Mandir – Art Deco royal palace',
      'Green Chowk Heritage Walk',
      'Clock industry manufacturing tour',
    ],
    hotels: {
      budget: [
        { name: 'Hotel Morbi', costPerNight: '₹500–₹800' },
        { name: 'OYO Morbi City', costPerNight: '₹450–₹750' },
      ],
      comfort: [
        { name: 'Hotel Saurashtra', costPerNight: '₹1,800–₹3,000' },
        { name: 'Hotel Royal', costPerNight: '₹1,500–₹2,500' },
      ],
      luxury: [
        { name: 'Mani Mandir Heritage Stay', costPerNight: '₹6,000–₹10,000' },
        { name: 'Morbi Industrial Resort', costPerNight: '₹4,500–₹7,500' },
      ],
    },
  },

  // ── KUTCH ──────────────────────────────────────────────────────────────────

  kutch: {
    district: 'Kutch',
    region: 'Kutch',
    morning: 'Rann Utsav & White Rann of Kutch',
    afternoon: 'Bhuj – Aina Mahal & Prag Mahal',
    evening: 'Kutch Handicraft Village – Ajrakh & Bandhani',
    highlights: [
      'White Rann of Kutch – salt desert wonder',
      'Rann Utsav – world-famous festival (Oct–Mar)',
      'Aina Mahal & Prag Mahal palaces',
      'Kutch Handicrafts – Ajrakh, Bandhani, Embroidery',
    ],
    hotels: {
      budget: [
        { name: 'Hotel Gangaram Bhuj', costPerNight: '₹700–₹1,200' },
        { name: 'OYO Bhuj', costPerNight: '₹600–₹1,000' },
      ],
      comfort: [
        { name: 'Hotel Aaina Bhuj', costPerNight: '₹3,000–₹5,000' },
        { name: 'Hotel City Guest House', costPerNight: '₹2,500–₹4,000' },
      ],
      luxury: [
        { name: 'Rann Utsav Tent City', costPerNight: '₹12,000–₹25,000' },
        { name: 'The Fern Residency Bhuj', costPerNight: '₹8,000–₹14,000' },
      ],
    },
  },
};

// ─── Non-Gujarat city data (existing global cities) ──────────────────────────
const GLOBAL_CITY_DATA: Record<
  string,
  { morning: string; afternoon: string; evening: string; highlights: string[] }
> = {
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

// ─── Gujarat District → City key mapping ─────────────────────────────────────
// Maps user input (city name, district HQ) → Gujarat city data key
export const GUJARAT_CITY_ALIASES: Record<string, string> = {
  // Ahmedabad
  ahmedabad: 'ahmedabad',
  amdavad: 'ahmedabad',
  // Gandhinagar
  gandhinagar: 'gandhinagar',
  // Mehsana
  mehsana: 'mehsana',
  mahesana: 'mehsana',
  'mehsana district': 'mehsana',
  // Patan
  patan: 'patan',
  // Banaskantha
  banaskantha: 'banaskantha',
  palanpur: 'banaskantha',
  ambaji: 'banaskantha',
  // Sabarkantha
  sabarkantha: 'sabarkantha',
  himmatnagar: 'sabarkantha',
  idar: 'sabarkantha',
  // Aravalli
  aravalli: 'aravalli',
  modasa: 'aravalli',
  // Vadodara
  vadodara: 'vadodara',
  baroda: 'vadodara',
  // Anand
  anand: 'anand',
  // Kheda
  kheda: 'kheda',
  nadiad: 'kheda',
  dakor: 'kheda',
  // Panchmahal
  panchmahal: 'panchmahal',
  godhra: 'panchmahal',
  champaner: 'panchmahal',
  // Dahod
  dahod: 'dahod',
  // Mahisagar
  mahisagar: 'mahisagar',
  lunawada: 'mahisagar',
  // Chhota Udaipur
  'chhota udaipur': 'chhota_udaipur',
  chhota_udaipur: 'chhota_udaipur',
  chotaudaipur: 'chhota_udaipur',
  // Surat
  surat: 'surat',
  // Bharuch
  bharuch: 'bharuch',
  broach: 'bharuch',
  // Narmada
  narmada: 'narmada',
  rajpipla: 'narmada',
  kevadia: 'narmada',
  'statue of unity': 'narmada',
  // Tapi
  tapi: 'tapi',
  vyara: 'tapi',
  // Navsari
  navsari: 'navsari',
  dandi: 'navsari',
  // Valsad
  valsad: 'valsad',
  bulsar: 'valsad',
  // Dang
  dang: 'dang',
  ahwa: 'dang',
  saputara: 'dang',
  // Rajkot
  rajkot: 'rajkot',
  // Junagadh
  junagadh: 'junagadh',
  junagarh: 'junagadh',
  // Gir Somnath
  'gir somnath': 'gir_somnath',
  gir_somnath: 'gir_somnath',
  somnath: 'gir_somnath',
  veraval: 'gir_somnath',
  gir: 'gir_somnath',
  // Amreli
  amreli: 'amreli',
  palitana: 'amreli',
  // Bhavnagar
  bhavnagar: 'bhavnagar',
  // Porbandar
  porbandar: 'porbandar',
  // Jamnagar
  jamnagar: 'jamnagar',
  // Devbhoomi Dwarka
  dwarka: 'devbhoomi_dwarka',
  devbhoomi_dwarka: 'devbhoomi_dwarka',
  'devbhoomi dwarka': 'devbhoomi_dwarka',
  // Surendranagar
  surendranagar: 'surendranagar',
  dhrangadhra: 'surendranagar',
  // Botad
  botad: 'botad',
  sarangpur: 'botad',
  // Morbi
  morbi: 'morbi',
  // Kutch
  kutch: 'kutch',
  kachchh: 'kutch',
  bhuj: 'kutch',
  'rann of kutch': 'kutch',
  // Additional Landmarks & Tourist Spots
  modhera: 'mehsana',
  'sun temple': 'mehsana',
  'polo forest': 'sabarkantha',
  shamlaji: 'sabarkantha',
  'sasan gir': 'gir_somnath',
  pavagadh: 'panchmahal',
  'rani ki vav': 'patan',
  akshardham: 'gandhinagar',
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface DayPlan {
  day: number;
  title: string;
  places: string[];
  route: string;
  activities: string[];
}

// ─── Helper: resolve city key ─────────────────────────────────────────────────
function resolveCityKey(destination: string): string | null {
  const lower = destination.toLowerCase().split(',')[0].trim();
  return GUJARAT_CITY_ALIASES[lower] ?? lower;
}

// ─── Helper: build day plans from Gujarat city data ───────────────────────────
function buildDaysFromGujaratData(
  dest: string,
  days: number,
  theme: string,
  cityData: (typeof GUJARAT_CITY_DATA)[string]
): DayPlan[] {
  return Array.from({ length: days }, (_, i) => {
    const dayNum = i + 1;
    if (dayNum === 1) {
      return {
        day: 1,
        title: `Day 1: Arrival & ${cityData.morning}`,
        places: [cityData.morning, `${dest} City Center`, 'Hotel Check-in'],
        route: `Airport/Station → ${dest} City Center → Hotel`,
        activities: ['City orientation walk', 'Welcome Gujarati Thali dinner', 'Rest & refresh'],
      };
    }
    if (dayNum === days) {
      return {
        day: days,
        title: `Day ${days}: ${cityData.evening} & Farewell`,
        places: [cityData.evening, 'Gujarati Handicraft Shopping', `${dest} Departure Point`],
        route: `Hotel → ${cityData.evening} → Shopping → Departure`,
        activities: ['Last sightseeing', 'Souvenir & handicraft shopping', 'Departure'],
      };
    }
    if (dayNum % 2 === 0) {
      return {
        day: dayNum,
        title: `Day ${dayNum}: ${cityData.afternoon}`,
        places: [cityData.afternoon, cityData.morning, 'Local Gujarati Restaurant'],
        route: `Hotel → ${cityData.afternoon} → Lunch → ${cityData.morning} → Hotel`,
        activities: [`${theme} experience`, 'Gujarati cuisine tasting', 'Photography tour'],
      };
    }
    return {
      day: dayNum,
      title: `Day ${dayNum}: ${cityData.evening}`,
      places: [cityData.evening, cityData.afternoon, 'Night Viewpoint'],
      route: `Hotel → ${cityData.afternoon} → ${cityData.evening} → Hotel`,
      activities: ['Sunset viewing', 'Street food & snacks', 'Evening stroll'],
    };
  });
}

// ─── Helper: build day plans from global city data ────────────────────────────
function buildDaysFromGlobalData(
  dest: string,
  days: number,
  theme: string,
  cityData: (typeof GLOBAL_CITY_DATA)[string]
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
          ? [`${dest} Arrival Point`, `${dest} City Center`, 'Hotel Check-in']
          : dayNum === days
          ? [`${dest} Old Market`, 'Souvenir Shopping', `${dest} Departure Point`]
          : [`${dest} Main Attraction`, `${dest} Cultural Museum`, `${dest} Local Market`],
      route: `Hotel → ${dest} Landmark → Local Eatery → Hotel`,
      activities: [`${theme} experience`, 'Local cuisine tasting', 'Photography tour'],
    };
  });
}

// ─── Main mock generator ──────────────────────────────────────────────────────
export function generateMockPlans(destination: string, days: number): ITravelPlan[] {
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const dest = capitalize(destination.split(',')[0].trim());
  const cityKey = resolveCityKey(destination);

  const gujaratData = cityKey ? GUJARAT_CITY_DATA[cityKey] : null;
  const globalData = cityKey ? GLOBAL_CITY_DATA[cityKey] : null;

  // ── Hotel name helpers ────────────────────────────────────────────────────
  const getBudgetHotels = () =>
    gujaratData
      ? gujaratData.hotels.budget.map(h => `${h.name} (${h.costPerNight}/night)`).join(', ')
      : `Budget guesthouses in ${dest} (₹500–₹1,200/night)`;

  const getComfortHotels = () =>
    gujaratData
      ? gujaratData.hotels.comfort.map(h => `${h.name} (${h.costPerNight}/night)`).join(', ')
      : `3-star hotels in ${dest} (₹2,000–₹4,500/night)`;

  const getLuxuryHotels = () =>
    gujaratData
      ? gujaratData.hotels.luxury.map(h => `${h.name} (${h.costPerNight}/night)`).join(', ')
      : `5-star resorts in ${dest} (₹9,000–₹20,000/night)`;

  // ── Highlights ────────────────────────────────────────────────────────────
  const getHighlights = (fallback: string[]) =>
    gujaratData
      ? gujaratData.highlights
      : globalData
      ? globalData.highlights
      : fallback;

  // ── Day builder ───────────────────────────────────────────────────────────
  const getDays = (theme: string): DayPlan[] => {
    if (gujaratData) return buildDaysFromGujaratData(dest, days, theme, gujaratData);
    if (globalData) return buildDaysFromGlobalData(dest, days, theme, globalData);
    return buildGenericDays(dest, days, theme);
  };

  // ── District label for Gujarat cities ────────────────────────────────────
  const districtLabel = gujaratData
    ? ` | ${gujaratData.district} District, Gujarat`
    : '';

  return [
    {
      id: 'plan-budget',
      title: `${dest} Budget Explorer${districtLabel}`,
      description: `Experience the best of ${dest} on a shoestring budget. Ideal for backpackers, solo travelers, and pilgrims.`,
      budget: 'low',
      estimatedCost: `₹${days * 2500}–₹${days * 4000} per person`,
      accommodations: getBudgetHotels(),
      highlights: getHighlights([
        `Local street food tour in ${dest}`,
        'Public transport exploration',
        'Free temples & parks',
        'Budget guesthouses & dharamshalas',
      ]),
      bestFor: 'Budget travelers, backpackers & pilgrims',
      days: getDays('Local Explore'),
    },
    {
      id: 'plan-comfort',
      title: `${dest} Comfort Journey${districtLabel}`,
      description: `A well-balanced itinerary mixing comfortable stays, guided tours, and must-see attractions in ${dest}.`,
      budget: 'medium',
      estimatedCost: `₹${days * 5000}–₹${days * 8000} per person`,
      accommodations: getComfortHotels(),
      highlights: getHighlights([
        `Guided city tour of ${dest}`,
        '3-star hotel accommodations',
        'Popular landmarks & temples',
        'Day trip excursion',
      ]),
      bestFor: 'Couples & families',
      days: getDays('Cultural'),
    },
    {
      id: 'plan-luxury',
      title: `${dest} Luxury Escape${districtLabel}`,
      description: `Indulge in the finest experiences ${dest} has to offer — premium hotels, private transfers, and VIP access.`,
      budget: 'high',
      estimatedCost: `₹${days * 12000}–₹${days * 20000} per person`,
      accommodations: getLuxuryHotels(),
      highlights: getHighlights([
        `5-star luxury resorts in ${dest}`,
        'Private guided heritage tours',
        'Fine dining & royal cuisine',
        'Helicopter/yacht/camel transfers',
      ]),
      bestFor: 'Luxury seekers & honeymooners',
      days: getDays('Luxury'),
    },
    {
      id: 'plan-adventure',
      title: `${dest} Adventure Quest${districtLabel}`,
      description: `For thrill-seekers and outdoor lovers. Push boundaries and discover the wild side of ${dest}.`,
      budget: 'medium',
      estimatedCost: `₹${days * 4500}–₹${days * 7000} per person`,
      accommodations: getComfortHotels(),
      highlights: getHighlights([
        `Outdoor trekking near ${dest}`,
        'Wildlife safari & nature tours',
        'Adventure & water sports',
        'Camping & eco stays',
      ]),
      bestFor: 'Adventure seekers & solo travelers',
      days: getDays('Adventure'),
    },
    {
      id: 'plan-cultural',
      title: `${dest} Cultural Immersion${districtLabel}`,
      description: `Dive deep into the history, art, temples, and traditions of ${dest}. A journey for the curious mind.`,
      budget: 'medium',
      estimatedCost: `₹${days * 4000}–₹${days * 6500} per person`,
      accommodations: getComfortHotels(),
      highlights: getHighlights([
        `Heritage walking tours in ${dest}`,
        'Local Gujarati cooking class',
        'Temple & museum visits',
        'Traditional folk performance',
      ]),
      bestFor: 'History buffs & culture enthusiasts',
      days: getDays('Cultural Immersion'),
    },
  ];
}