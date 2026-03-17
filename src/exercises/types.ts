import { Position } from '../core/cursor.ts';

export interface Exercise {
  id: string;
  title: string;
  description: string;
  initialBuffer: string[];
  initialCursor: Position;
  targetCursor?: Position;      // For motion exercises
  targetBuffer?: string[];      // For command exercises
  hints: string[];
  optimalKeystrokes: number;
  category: 'motion' | 'command' | 'challenge';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export type ExerciseMode = 'motions' | 'commands' | 'challenges';
