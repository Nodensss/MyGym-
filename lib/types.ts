export interface Exercise {
  id: string;
  name: string;
  group: string;
  target: string;
  hint: string;
  unit: string;
  step: number;
  defaultW: number;
  defaultR: number;
  isNew?: boolean;
  noWeight?: boolean;
}

export type WorkoutKind = 'gym' | 'bodyweight';

export interface WorkoutProgram {
  kind: WorkoutKind;
  name: string;
  shortName: string;
  scheme: string;
  exercises: Exercise[];
}

export interface WorkoutSet {
  w: number;
  r: number;
}

export type WorkoutSets = Record<string, WorkoutSet[]>;

export interface WarmupStats {
  time: number;
  distance: number;
}

export interface WatchStats {
  duration: number;
  calories: number;
  avgHr: number;
  maxHr: number;
}

export interface Workout {
  id: string;
  kind?: WorkoutKind;
  number?: number;
  label: string;
  date: string;
  warmup: WarmupStats;
  sets: WorkoutSets;
  watch?: WatchStats;
  notes: string;
  currentEx?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Recommendation {
  name: string;
  suggestion: string;
  change: 'up' | 'same' | 'down';
}

export type TabId = 'home' | 'history' | 'progress';
