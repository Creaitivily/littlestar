// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'parent' | 'caregiver' | 'family';
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: NotificationPreferences;
  privacy: PrivacySettings;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  milestones: boolean;
  reminders: boolean;
  familyUpdates: boolean;
  weeklyReports: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'private' | 'family' | 'public';
  allowFamilySharing: boolean;
  dataRetention: number; // in days
  exportData: boolean;
}

// Child/Daughter Types
export interface Child {
  id: string;
  parentId: string;
  firstName: string;
  lastName?: string;
  nickname?: string;
  birthDate: Date;
  gender: 'female' | 'male' | 'other';
  avatar?: string;
  coverImage?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  familyMembers: FamilyMember[];
}

export interface FamilyMember {
  id: string;
  userId: string;
  childId: string;
  relationship: 'parent' | 'grandparent' | 'caregiver' | 'family' | 'other';
  permissions: FamilyPermissions;
  invitedAt: Date;
  acceptedAt?: Date;
  isActive: boolean;
}

export interface FamilyPermissions {
  canView: boolean;
  canEdit: boolean;
  canAddMemories: boolean;
  canViewHealth: boolean;
  canEditHealth: boolean;
  canInviteOthers: boolean;
}

// Growth and Development Types
export interface GrowthRecord {
  id: string;
  childId: string;
  date: Date;
  height: number; // in inches
  weight: number; // in pounds
  headCircumference?: number; // in inches
  notes?: string;
  recordedBy: string;
  createdAt: Date;
}

export interface Milestone {
  id: string;
  childId: string;
  type: MilestoneType;
  title: string;
  description?: string;
  expectedAgeRange: {
    minMonths: number;
    maxMonths: number;
  };
  achievedDate?: Date;
  photos?: string[];
  videos?: string[];
  notes?: string;
  isCustom: boolean;
  recordedBy: string;
  createdAt: Date;
}

export type MilestoneType = 
  | 'physical'
  | 'cognitive'
  | 'social'
  | 'emotional'
  | 'language'
  | 'motor'
  | 'sensory'
  | 'custom';

// Health and Medical Types
export interface HealthRecord {
  id: string;
  childId: string;
  type: HealthRecordType;
  title: string;
  description?: string;
  date: Date;
  provider?: string;
  location?: string;
  attachments?: string[];
  tags?: string[];
  isPrivate: boolean;
  recordedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export type HealthRecordType = 
  | 'checkup'
  | 'vaccination'
  | 'illness'
  | 'medication'
  | 'allergy'
  | 'emergency'
  | 'dental'
  | 'vision'
  | 'specialist'
  | 'therapy'
  | 'other';

export interface Vaccination {
  id: string;
  childId: string;
  vaccine: string;
  brand?: string;
  doseNumber: number;
  totalDoses: number;
  administeredDate: Date;
  nextDueDate?: Date;
  provider: string;
  location: string;
  batchNumber?: string;
  reactions?: string[];
  notes?: string;
  recordedBy: string;
  createdAt: Date;
}

export interface Medication {
  id: string;
  childId: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  prescribedBy: string;
  reason: string;
  sideEffects?: string[];
  instructions?: string;
  isActive: boolean;
  recordedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Activity and Daily Life Types
export interface Activity {
  id: string;
  childId: string;
  type: ActivityType;
  title: string;
  description?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in minutes
  location?: string;
  participants?: string[];
  mood?: MoodRating;
  photos?: string[];
  notes?: string;
  tags?: string[];
  recordedBy: string;
  createdAt: Date;
}

export type ActivityType = 
  | 'feeding'
  | 'sleeping'
  | 'playing'
  | 'learning'
  | 'outdoor'
  | 'social'
  | 'creative'
  | 'reading'
  | 'exercise'
  | 'bathing'
  | 'travel'
  | 'other';

export type MoodRating = 1 | 2 | 3 | 4 | 5;

export interface SleepRecord {
  id: string;
  childId: string;
  bedTime: Date;
  wakeTime?: Date;
  napTimes?: NapTime[];
  totalSleep?: number; // in minutes
  quality: SleepQuality;
  location: 'crib' | 'bed' | 'couch' | 'car' | 'stroller' | 'other';
  notes?: string;
  recordedBy: string;
  createdAt: Date;
}

export interface NapTime {
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
}

export type SleepQuality = 'excellent' | 'good' | 'fair' | 'poor' | 'restless';

// Memory and Photo Types
export interface Memory {
  id: string;
  childId: string;
  title: string;
  description?: string;
  date: Date;
  type: MemoryType;
  media: MediaItem[];
  location?: string;
  tags?: string[];
  participants?: string[];
  isFavorite: boolean;
  isPrivate: boolean;
  mood?: MoodRating;
  weather?: string;
  recordedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export type MemoryType = 
  | 'milestone'
  | 'first'
  | 'holiday'
  | 'birthday'
  | 'vacation'
  | 'family'
  | 'friends'
  | 'school'
  | 'achievement'
  | 'funny'
  | 'everyday'
  | 'other';

export interface MediaItem {
  id: string;
  type: 'photo' | 'video' | 'audio';
  url: string;
  thumbnailUrl?: string;
  filename: string;
  size: number; // in bytes
  duration?: number; // for video/audio in seconds
  caption?: string;
  uploadedAt: Date;
}

// Reminder and Notification Types
export interface Reminder {
  id: string;
  childId: string;
  title: string;
  description?: string;
  type: ReminderType;
  dueDate: Date;
  isCompleted: boolean;
  completedAt?: Date;
  repeatPattern?: RepeatPattern;
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ReminderType = 
  | 'appointment'
  | 'vaccination'
  | 'medication'
  | 'milestone'
  | 'photo'
  | 'measurement'
  | 'feeding'
  | 'activity'
  | 'custom';

export interface RepeatPattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  daysOfWeek?: number[];
  endDate?: Date;
  maxOccurrences?: number;
}

// Analytics and Reports Types
export interface GrowthChart {
  id: string;
  childId: string;
  type: 'height' | 'weight' | 'head_circumference' | 'bmi';
  data: ChartDataPoint[];
  percentiles: PercentileData[];
  generatedAt: Date;
}

export interface ChartDataPoint {
  date: Date;
  value: number;
  ageInMonths: number;
  percentile?: number;
}

export interface PercentileData {
  ageInMonths: number;
  percentile5: number;
  percentile10: number;
  percentile25: number;
  percentile50: number;
  percentile75: number;
  percentile90: number;
  percentile95: number;
}

export interface Report {
  id: string;
  childId: string;
  type: 'weekly' | 'monthly' | 'yearly' | 'custom';
  title: string;
  period: {
    startDate: Date;
    endDate: Date;
  };
  sections: ReportSection[];
  generatedAt: Date;
  generatedBy: string;
}

export interface ReportSection {
  type: 'growth' | 'milestones' | 'health' | 'activities' | 'memories' | 'sleep';
  title: string;
  data: any;
  insights?: string[];
}

// API and Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface SearchFilters {
  query?: string;
  type?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Form and Validation Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'file';
  placeholder?: string;
  required?: boolean;
  validation?: ValidationRule[];
  options?: SelectOption[];
  helpText?: string;
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: any;
  message: string;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// Export default type collections
export type LittleStarTypes = {
  User,
  Child,
  GrowthRecord,
  Milestone,
  HealthRecord,
  Activity,
  Memory,
  Reminder,
  Report,
};