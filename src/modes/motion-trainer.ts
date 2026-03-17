import { VimEngine } from '../core/vim-engine.ts';
import { EditorUI } from '../ui/editor.ts';
import { StatuslineUI } from '../ui/statusline.ts';
import { FeedbackUI } from '../ui/feedback.ts';
import { Exercise } from '../exercises/types.ts';

export class MotionTrainer {
  private engine: VimEngine;
  private editorUI: EditorUI;
  private statuslineUI: StatuslineUI;
  private feedbackUI: FeedbackUI;
  private currentExercise: Exercise | null = null;
  private keystrokes = 0;
  private onComplete: ((exerciseId: string, keystrokes: number) => void) | null = null;

  constructor(
    engine: VimEngine,
    editorUI: EditorUI,
    statuslineUI: StatuslineUI,
    feedbackUI: FeedbackUI
  ) {
    this.engine = engine;
    this.editorUI = editorUI;
    this.statuslineUI = statuslineUI;
    this.feedbackUI = feedbackUI;
  }

  setOnComplete(callback: (exerciseId: string, keystrokes: number) => void): void {
    this.onComplete = callback;
  }

  loadExercise(exercise: Exercise): void {
    this.currentExercise = exercise;
    this.keystrokes = 0;

    this.engine.reset(exercise.initialBuffer, exercise.initialCursor);

    if (exercise.targetCursor) {
      this.editorUI.setTarget(exercise.targetCursor);
    } else {
      this.editorUI.setTarget(null);
    }

    this.render();
    this.feedbackUI.setKeystrokes(0);
  }

  handleKey(key: string): boolean {
    if (!this.currentExercise) return false;

    const result = this.engine.handleKey(key);

    if (result.handled) {
      this.keystrokes++;
      this.feedbackUI.setKeystrokes(this.keystrokes);
      this.render();

      // Check completion for motion exercises
      if (this.currentExercise.targetCursor) {
        const state = this.engine.getState();
        const cursor = state.cursor;
        const target = this.currentExercise.targetCursor;

        if (cursor.getLine() === target.line && cursor.getCol() === target.col) {
          this.complete();
        }
      }
    }

    return result.handled;
  }

  private complete(): void {
    if (!this.currentExercise) return;

    this.feedbackUI.flashSuccess();
    this.feedbackUI.showCompletionModal({
      keystrokes: this.keystrokes,
      optimal: this.currentExercise.optimalKeystrokes,
    });

    this.onComplete?.(this.currentExercise.id, this.keystrokes);
  }

  reset(): void {
    if (this.currentExercise) {
      this.loadExercise(this.currentExercise);
    }
  }

  private render(): void {
    const state = this.engine.getState();
    this.editorUI.setMode(state.mode);
    this.editorUI.render(state.buffer, state.cursor);
    this.statuslineUI.render(
      state.mode,
      state.cursor.getLine(),
      state.cursor.getCol(),
      state.commandBuffer
    );
  }
}
