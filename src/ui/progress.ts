const STORAGE_KEY = 'vim-trainer-progress';

export interface ProgressData {
  completedExercises: Set<string>;
  stats: {
    totalKeystrokes: number;
    totalExercises: number;
    totalTime: number;
  };
}

export class ProgressTracker {
  private data: ProgressData;

  constructor() {
    this.data = this.load();
  }

  private load(): ProgressData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          completedExercises: new Set(parsed.completedExercises || []),
          stats: parsed.stats || { totalKeystrokes: 0, totalExercises: 0, totalTime: 0 },
        };
      }
    } catch {
      // Ignore parse errors
    }
    return {
      completedExercises: new Set(),
      stats: { totalKeystrokes: 0, totalExercises: 0, totalTime: 0 },
    };
  }

  private save(): void {
    const toStore = {
      completedExercises: Array.from(this.data.completedExercises),
      stats: this.data.stats,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }

  markCompleted(exerciseId: string, keystrokes: number, time?: number): void {
    if (!this.data.completedExercises.has(exerciseId)) {
      this.data.completedExercises.add(exerciseId);
      this.data.stats.totalExercises++;
    }
    this.data.stats.totalKeystrokes += keystrokes;
    if (time !== undefined) {
      this.data.stats.totalTime += time;
    }
    this.save();
  }

  isCompleted(exerciseId: string): boolean {
    return this.data.completedExercises.has(exerciseId);
  }

  getCompletedCount(): number {
    return this.data.completedExercises.size;
  }

  getStats(): ProgressData['stats'] {
    return { ...this.data.stats };
  }

  reset(): void {
    this.data = {
      completedExercises: new Set(),
      stats: { totalKeystrokes: 0, totalExercises: 0, totalTime: 0 },
    };
    this.save();
  }
}
