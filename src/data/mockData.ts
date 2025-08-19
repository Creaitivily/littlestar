export interface DaughterProfile {
  name: string;
  birthDate: string;
  age: string;
  profileImage: string;
}

export interface GrowthData {
  date: string;
  height: number; // in cm
  weight: number; // in kg
  percentileHeight: number;
  percentileWeight: number;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  achievedDate: string;
  category: 'physical' | 'cognitive' | 'social' | 'emotional';
  isAchieved: boolean;
}

export interface HealthRecord {
  id: string;
  type: 'appointment' | 'vaccination' | 'medication' | 'checkup';
  title: string;
  date: string;
  description: string;
  doctor?: string;
  notes?: string;
  status: 'completed' | 'upcoming' | 'missed';
}

export interface Activity {
  id: string;
  date: string;
  type: 'sleep' | 'meal' | 'play' | 'learning' | 'outdoor';
  title: string;
  duration?: number; // in minutes
  description: string;
  mood: 'happy' | 'neutral' | 'fussy' | 'excited' | 'calm';
  rating: number; // 1-5
}

export interface Memory {
  id: string;
  title: string;
  date: string;
  description: string;
  photos: string[];
  tags: string[];
  favorite: boolean;
}

// Mock Data
export const daughterProfile: DaughterProfile = {
  name: "Emma Rose",
  birthDate: "2021-03-15",
  age: "3 years, 5 months",
  profileImage: "👧"
};

export const growthData: GrowthData[] = [
  { date: "2024-01-15", height: 95, weight: 14.2, percentileHeight: 65, percentileWeight: 60 },
  { date: "2024-02-15", height: 96, weight: 14.5, percentileHeight: 67, percentileWeight: 62 },
  { date: "2024-03-15", height: 97, weight: 14.8, percentileHeight: 68, percentileWeight: 63 },
  { date: "2024-04-15", height: 98, weight: 15.1, percentileHeight: 70, percentileWeight: 65 },
  { date: "2024-05-15", height: 99, weight: 15.4, percentileHeight: 72, percentileWeight: 67 },
  { date: "2024-06-15", height: 100, weight: 15.7, percentileHeight: 73, percentileWeight: 68 },
  { date: "2024-07-15", height: 101, weight: 16.0, percentileHeight: 75, percentileWeight: 70 },
  { date: "2024-08-15", height: 102, weight: 16.3, percentileHeight: 76, percentileWeight: 72 },
];

export const milestones: Milestone[] = [
  {
    id: "1",
    title: "First Steps",
    description: "Took her first independent steps",
    achievedDate: "2022-02-10",
    category: "physical",
    isAchieved: true
  },
  {
    id: "2",
    title: "First Words",
    description: "Said 'mama' and 'dada' clearly",
    achievedDate: "2021-12-05",
    category: "cognitive",
    isAchieved: true
  },
  {
    id: "3",
    title: "Potty Trained",
    description: "Successfully potty trained during the day",
    achievedDate: "2024-01-20",
    category: "physical",
    isAchieved: true
  },
  {
    id: "4",
    title: "Counting to 10",
    description: "Can count from 1 to 10 independently",
    achievedDate: "2024-05-12",
    category: "cognitive",
    isAchieved: true
  },
  {
    id: "5",
    title: "Sharing Toys",
    description: "Learning to share toys with friends",
    achievedDate: "",
    category: "social",
    isAchieved: false
  },
  {
    id: "6",
    title: "Riding a Tricycle",
    description: "Pedaling and steering a tricycle",
    achievedDate: "",
    category: "physical",
    isAchieved: false
  }
];

export const healthRecords: HealthRecord[] = [
  {
    id: "1",
    type: "checkup",
    title: "3-Year Wellness Visit",
    date: "2024-03-15",
    description: "Annual wellness checkup",
    doctor: "Dr. Sarah Johnson",
    notes: "Healthy development, meeting all milestones",
    status: "completed"
  },
  {
    id: "2",
    type: "vaccination",
    title: "MMR Booster",
    date: "2024-03-15",
    description: "Measles, Mumps, Rubella booster shot",
    doctor: "Dr. Sarah Johnson",
    status: "completed"
  },
  {
    id: "3",
    type: "appointment",
    title: "Dental Cleaning",
    date: "2024-09-15",
    description: "First dental cleaning appointment",
    doctor: "Dr. Mike Chen",
    status: "upcoming"
  },
  {
    id: "4",
    type: "checkup",
    title: "4-Year Wellness Visit",
    date: "2025-03-15",
    description: "Next annual wellness checkup",
    doctor: "Dr. Sarah Johnson",
    status: "upcoming"
  }
];

export const activities: Activity[] = [
  {
    id: "1",
    date: "2024-08-18",
    type: "sleep",
    title: "Morning Nap",
    duration: 90,
    description: "Good morning nap after breakfast",
    mood: "calm",
    rating: 4
  },
  {
    id: "2",
    date: "2024-08-18",
    type: "meal",
    title: "Lunch",
    duration: 30,
    description: "Ate all vegetables! Loved the carrots",
    mood: "happy",
    rating: 5
  },
  {
    id: "3",
    date: "2024-08-18",
    type: "play",
    title: "Building Blocks",
    duration: 45,
    description: "Built a tall tower and counted blocks",
    mood: "excited",
    rating: 5
  },
  {
    id: "4",
    date: "2024-08-17",
    type: "outdoor",
    title: "Park Visit",
    duration: 120,
    description: "Played on swings and slides, made new friends",
    mood: "happy",
    rating: 5
  },
  {
    id: "5",
    date: "2024-08-17",
    type: "learning",
    title: "Story Time",
    duration: 20,
    description: "Read 'The Very Hungry Caterpillar'",
    mood: "calm",
    rating: 4
  },
  {
    id: "6",
    date: "2024-08-16",
    type: "sleep",
    title: "Night Sleep",
    duration: 660,
    description: "Slept through the night (11 hours)",
    mood: "calm",
    rating: 5
  }
];

export const memories: Memory[] = [
  {
    id: "1",
    title: "First Day of Preschool",
    date: "2024-08-01",
    description: "Emma's first day at Little Learners Preschool. She was excited and made friends quickly!",
    photos: ["📸", "📷", "🎒"],
    tags: ["school", "milestone", "friends"],
    favorite: true
  },
  {
    id: "2",
    title: "Beach Vacation",
    date: "2024-07-20",
    description: "Family trip to the beach. Emma loved building sandcastles and collecting seashells.",
    photos: ["🏖️", "🏰", "🐚"],
    tags: ["vacation", "beach", "family"],
    favorite: true
  },
  {
    id: "3",
    title: "Learning to Ride a Bike",
    date: "2024-06-15",
    description: "First attempts at riding a tricycle. Still working on coordination but having fun!",
    photos: ["🚲", "🎈"],
    tags: ["milestone", "physical", "outdoor"],
    favorite: false
  },
  {
    id: "4",
    title: "Grandma's Birthday Party",
    date: "2024-05-10",
    description: "Helped bake a cake for Grandma's 70th birthday. Emma was the best little helper!",
    photos: ["🎂", "👵", "🎉"],
    tags: ["family", "celebration", "cooking"],
    favorite: false
  },
  {
    id: "5",
    title: "Zoo Adventure",
    date: "2024-04-22",
    description: "Visited the zoo and saw elephants, giraffes, and penguins. Emma's favorite were the monkeys!",
    photos: ["🐘", "🦒", "🐧", "🐵"],
    tags: ["animals", "education", "outdoor"],
    favorite: true
  }
];

// Summary statistics for dashboard
export const dashboardStats = {
  currentHeight: 102,
  currentWeight: 16.3,
  sleepLastNight: 10.5,
  mealsToday: 3,
  activitiesThisWeek: 12,
  upcomingAppointments: 2,
  milestonesAchieved: 4,
  totalMemories: 25
};