import { VimEngine } from '../core/vim-engine.ts';
import { Buffer } from '../core/buffer.ts';
import { EditorUI } from '../ui/editor.ts';
import { StatuslineUI } from '../ui/statusline.ts';
import { FeedbackUI } from '../ui/feedback.ts';
import { Exercise } from '../exercises/types.ts';

export class ChallengeMode {
  private engine: VimEngine;
  private editorUI: EditorUI;
  private statuslineUI: StatuslineUI;
  private feedbackUI: FeedbackUI;
  private currentExercise: Exercise | null = null;
  private keystrokes = 0;
  private startTime = 0;
  private timerInterval: number | null = null;
  private onComplete: ((exerciseId: string, keystrokes: number, time: number) => void) | null = null;

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

  setOnComplete(callback: (exerciseId: string, keystrokes: number, time: number) => void): void {
    this.onComplete = callback;
  }

  loadExercise(exercise: Exercise): void {
    this.stopTimer();
    this.currentExercise = exercise;
    this.keystrokes = 0;
    this.startTime = 0;

    this.engine.reset(exercise.initialBuffer, exercise.initialCursor);
    this.editorUI.setTarget(null);

    this.render();
    this.feedbackUI.setKeystrokes(0);
    this.feedbackUI.showTimer(true);
    this.feedbackUI.setTimer(0);
  }

  handleKey(key: string): boolean {
    if (!this.currentExercise) return false;

    // Start timer on first keypress
    if (this.startTime === 0) {
      this.startTimer();
    }

    const result = this.engine.handleKey(key);

    if (result.handled) {
      this.keystrokes++;
      this.feedbackUI.setKeystrokes(this.keystrokes);
      this.render();

      // Check completion
      if (this.checkCompletion()) {
        this.complete();
      }
    }

    return result.handled;
  }

  private checkCompletion(): boolean {
    if (!this.currentExercise) return false;

    const state = this.engine.getState();

    // Check buffer match
    if (this.currentExercise.targetBuffer) {
      const targetBuffer = new Buffer(this.currentExercise.targetBuffer);
      if (state.buffer.equals(targetBuffer)) {
        return true;
      }
    }

    // Check cursor position
    if (this.currentExercise.targetCursor) {
      const cursor = state.cursor;
      const target = this.currentExercise.targetCursor;
      if (cursor.getLine() === target.line && cursor.getCol() === target.col) {
        return true;
      }
    }

    return false;
  }

  private startTimer(): void {
    this.startTime = Date.now();
    this.timerInterval = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      this.feedbackUI.setTimer(elapsed);
    }, 100);
  }

  private stopTimer(): void {
    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private complete(): void {
    this.stopTimer();
    if (!this.currentExercise) return;

    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);

    this.feedbackUI.flashSuccess();
    this.feedbackUI.showCompletionModal({
      keystrokes: this.keystrokes,
      optimal: this.currentExercise.optimalKeystrokes,
      time: elapsed,
    });

    this.onComplete?.(this.currentExercise.id, this.keystrokes, elapsed);
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

  cleanup(): void {
    this.stopTimer();
    this.feedbackUI.showTimer(false);
  }
}
