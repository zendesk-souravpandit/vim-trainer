export class FeedbackUI {
  private editorEl: HTMLElement;
  private progressFill: HTMLElement;
  private keystrokesEl: HTMLElement;
  private timerEl: HTMLElement;
  private timerValueEl: HTMLElement;

  constructor() {
    this.editorEl = document.querySelector('.editor')!;
    this.progressFill = document.querySelector('.progress-fill')!;
    this.keystrokesEl = document.querySelector('.keystrokes strong')!;
    this.timerEl = document.querySelector('.timer')!;
    this.timerValueEl = document.querySelector('.timer strong')!;
  }

  flashSuccess(): void {
    this.editorEl.classList.remove('success-flash', 'error-flash');
    void this.editorEl.offsetWidth; // Trigger reflow
    this.editorEl.classList.add('success-flash');
  }

  flashError(): void {
    this.editorEl.classList.remove('success-flash', 'error-flash');
    void this.editorEl.offsetWidth; // Trigger reflow
    this.editorEl.classList.add('error-flash');
  }

  setProgress(current: number, total: number): void {
    const percentage = total > 0 ? (current / total) * 100 : 0;
    this.progressFill.style.width = `${percentage}%`;
  }

  setKeystrokes(count: number): void {
    this.keystrokesEl.textContent = count.toString();
  }

  showTimer(show: boolean): void {
    this.timerEl.classList.toggle('hidden', !show);
  }

  setTimer(seconds: number): void {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    this.timerValueEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  showCompletionModal(stats: { keystrokes: number; time?: number; optimal: number }): void {
    // Auto-advance to next exercise after a brief delay
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('next-exercise'));
    }, 300);
  }
}
