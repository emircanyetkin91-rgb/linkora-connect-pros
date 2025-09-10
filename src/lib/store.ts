export interface User {
  id: string;
  name: string;
  headline: string;
  city: string;
  sector: string;
  bio: string;
  tags: string[];
  photos: string[];
  privacy?: {
    public: boolean;
    visibleByCity: boolean;
    visibleBySector: boolean;
  };
}

export interface Match {
  id: string;
  aId: string;
  bId: string;
  connectionType: 'Professional' | 'Social' | 'Personal';
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export interface AppState {
  me: User;
  auth: {
    isSignedIn: boolean;
  };
  userStatus: 'pending' | 'approved' | 'denied';
  demoMode: boolean;
  filters: {
    city: string;
    sector: string;
  };
  likedIds: string[];
  dislikedIds: string[];
  matches: Match[];
  selectedMatchId: string | null;
  messages: Record<string, Message[]>;
  mockProfiles: User[];
}

const STORAGE_KEY = 'nexa_app';

const defaultState: AppState = {
  me: {
    id: "me-001",
    name: "Emir",
    headline: "Product Designer",
    city: "Istanbul",
    sector: "Tech",
    bio: "Curious, coffee & galleries. Open to collabs.",
    tags: ["Expanding my circle", "Open to collaborations"],
    photos: [
      "https://picsum.photos/seed/me1/600/800",
      "https://picsum.photos/seed/me2/600/800"
    ],
    privacy: {
      public: true,
      visibleByCity: true,
      visibleBySector: true
    }
  },
  auth: {
    isSignedIn: false
  },
  userStatus: "pending",
  demoMode: true,
  filters: { city: "All", sector: "All" },
  likedIds: [],
  dislikedIds: [],
  matches: [],
  selectedMatchId: null,
  messages: {},
  mockProfiles: [
    {
      id: "u101",
      name: "Aylin Yılmaz",
      headline: "Software Engineer @ Nova",
      city: "Istanbul",
      sector: "Tech",
      bio: "Into art, AI, and coffee tastings.",
      tags: ["Expanding my circle", "Open to collaborations", "New experiences"],
      photos: ["https://picsum.photos/seed/101/600/800", "https://picsum.photos/seed/201/600/800"]
    },
    {
      id: "u102",
      name: "Kerem Arslan",
      headline: "VC Analyst @ Atlas",
      city: "London",
      sector: "Finance",
      bio: "Early-stage, fintech, and tennis.",
      tags: ["Expanding my circle", "New experiences"],
      photos: ["https://picsum.photos/seed/102/600/800", "https://picsum.photos/seed/202/600/800"]
    },
    {
      id: "u103",
      name: "Lara Demir",
      headline: "Art Director @ Lumen",
      city: "Berlin",
      sector: "Media",
      bio: "Galleries, weekend markets, film photography.",
      tags: ["Open to collaborations", "New experiences"],
      photos: ["https://picsum.photos/seed/103/600/800", "https://picsum.photos/seed/203/600/800"]
    },
    {
      id: "u104",
      name: "Mert Kaya",
      headline: "Founder @ Echo",
      city: "Istanbul",
      sector: "Tech",
      bio: "Building SaaS, running, third-wave coffee.",
      tags: ["Expanding my circle", "Open to collaborations"],
      photos: ["https://picsum.photos/seed/104/600/800", "https://picsum.photos/seed/204/600/800"]
    },
    {
      id: "u105",
      name: "Selin Aydın",
      headline: "Growth Lead @ Nimbus",
      city: "NYC",
      sector: "Media",
      bio: "Performance, PLG, and ramen maps.",
      tags: ["New experiences"],
      photos: ["https://picsum.photos/seed/105/600/800", "https://picsum.photos/seed/205/600/800"]
    },
    {
      id: "u106",
      name: "Cem Ergin",
      headline: "Product Manager @ Atlas",
      city: "London",
      sector: "Tech",
      bio: "Climbing, product strategy, podcasts.",
      tags: ["Open to collaborations"],
      photos: ["https://picsum.photos/seed/106/600/800", "https://picsum.photos/seed/206/600/800"]
    },
    {
      id: "u107",
      name: "Aslı Koç",
      headline: "Fashion Buyer",
      city: "Istanbul",
      sector: "Fashion",
      bio: "Textiles, color stories, museum passes.",
      tags: ["Expanding my circle"],
      photos: ["https://picsum.photos/seed/107/600/800", "https://picsum.photos/seed/207/600/800"]
    },
    {
      id: "u108",
      name: "Deniz Şahin",
      headline: "Game Designer",
      city: "Berlin",
      sector: "Gaming",
      bio: "Indie titles, board games, espresso shots.",
      tags: ["Open to collaborations", "New experiences"],
      photos: ["https://picsum.photos/seed/108/600/800", "https://picsum.photos/seed/208/600/800"]
    },
    {
      id: "u109",
      name: "Baran Uzun",
      headline: "Data Scientist @ Pixel",
      city: "Ankara",
      sector: "Tech",
      bio: "ML ops, jazz vinyl, city walks.",
      tags: ["Expanding my circle"],
      photos: ["https://picsum.photos/seed/109/600/800", "https://picsum.photos/seed/209/600/800"]
    },
    {
      id: "u110",
      name: "Ece Öztürk",
      headline: "UX Researcher",
      city: "London",
      sector: "Tech",
      bio: "Field studies, plants, and croissants.",
      tags: ["New experiences", "Open to collaborations"],
      photos: ["https://picsum.photos/seed/110/600/800", "https://picsum.photos/seed/210/600/800"]
    }
  ]
};

export function loadState(): AppState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultState, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Failed to load state:', error);
  }
  return defaultState;
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state:', error);
  }
}

export function getAvailableProfiles(state: AppState): User[] {
  if (state.userStatus !== 'approved') return [];
  
  return state.mockProfiles.filter(profile => {
    // Exclude already liked/disliked
    if (state.likedIds.includes(profile.id) || state.dislikedIds.includes(profile.id)) {
      return false;
    }
    
    // Apply filters
    if (state.filters.city !== 'All' && profile.city !== state.filters.city) {
      return false;
    }
    
    if (state.filters.sector !== 'All' && profile.sector !== state.filters.sector) {
      return false;
    }
    
    return true;
  });
}

export function getCurrentCard(state: AppState): User | null {
  const available = getAvailableProfiles(state);
  return available.length > 0 ? available[0] : null;
}

export function pickConnectionType(): 'Professional' | 'Social' | 'Personal' {
  const types: ('Professional' | 'Social' | 'Personal')[] = ['Professional', 'Social', 'Personal'];
  return types[Math.floor(Math.random() * types.length)];
}

export function createMatch(state: AppState, aId: string, bId: string, connectionType: 'Professional' | 'Social' | 'Personal'): AppState {
  // Ensure stable pair order
  const pair = [aId, bId].sort();
  const matchId = `m-${pair[0]}-${pair[1]}`;
  
  // Check if match already exists
  if (state.matches.find(m => m.id === matchId)) {
    return state;
  }
  
  const newMatch: Match = {
    id: matchId,
    aId: pair[0],
    bId: pair[1],
    connectionType,
    createdAt: new Date().toISOString()
  };
  
  return {
    ...state,
    matches: [...state.matches, newMatch],
    messages: {
      ...state.messages,
      [matchId]: state.messages[matchId] || []
    },
    selectedMatchId: matchId
  };
}

export function getMatchedUser(state: AppState, matchId: string): User | null {
  const match = state.matches.find(m => m.id === matchId);
  if (!match) return null;
  
  const otherUserId = match.aId === state.me.id ? match.bId : match.aId;
  return state.mockProfiles.find(p => p.id === otherUserId) || null;
}