import { VimMode } from '../core/vim-engine.ts';

const MODE_HINTS: Record<VimMode, string> = {
  normal: 'Press i to insert, a to append',
  insert: 'Press Esc to return to normal mode',
  visual: 'Press Esc to return to normal mode',
};

export class StatuslineUI {
  private modeEl: HTMLElement;
  private positionEl: HTMLElement;
  private commandBufferEl: HTMLElement;
  private modeBanner: HTMLElement;
  private modeText: HTMLElement;
  private modeHint: HTMLElement;

  constructor(containerSelector: string) {
    const container = document.querySelector(containerSelector);
    if (!container) throw new Error(`Container ${containerSelector} not found`);

    this.modeEl = container.querySelector('.mode')!;
    this.positionEl = container.querySelector('.position')!;
    this.commandBufferEl = container.querySelector('.command-buffer')!;
    this.modeBanner = document.querySelector('.mode-banner')!;
    this.modeText = document.querySelector('.mode-text')!;
    this.modeHint = document.querySelector('.mode-hint')!;
  }

  render(mode: VimMode, line: number, col: number, commandBuffer: string): void {
    // Update mode banner (prominent display)
    this.modeBanner.dataset.mode = mode;
    this.modeText.textContent = `-- ${mode.toUpperCase()} --`;
    this.modeHint.textContent = MODE_HINTS[mode];

    // Update statusline mode display
    this.modeEl.textContent = mode.toUpperCase();
    this.modeEl.className = 'mode';
    if (mode === 'insert') this.modeEl.classList.add('insert');
    if (mode === 'visual') this.modeEl.classList.add('visual');

    // Update position (1-indexed for display)
    this.positionEl.textContent = `${line + 1}:${col + 1}`;

    // Update command buffer
    this.commandBufferEl.textContent = commandBuffer;
  }
}
