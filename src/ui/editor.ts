import { Buffer } from '../core/buffer.ts';
import { Cursor, Position } from '../core/cursor.ts';
import { VimMode } from '../core/vim-engine.ts';

export class EditorUI {
  private bufferEl: HTMLElement;
  private lineNumbersEl: HTMLElement;
  private targetPosition: Position | null = null;
  private currentMode: VimMode = 'normal';

  constructor(containerSelector: string) {
    const container = document.querySelector(containerSelector);
    if (!container) throw new Error(`Container ${containerSelector} not found`);

    this.bufferEl = container.querySelector('.buffer')!;
    this.lineNumbersEl = container.querySelector('.line-numbers')!;
  }

  setTarget(position: Position | null): void {
    this.targetPosition = position;
  }

  setMode(mode: VimMode): void {
    this.currentMode = mode;
  }

  render(buffer: Buffer, cursor: Cursor): void {
    const lines = buffer.getLines();
    const cursorPos = cursor.getPosition();
    const isInsert = this.currentMode === 'insert';

    // Render line numbers
    this.lineNumbersEl.innerHTML = lines
      .map((_, i) => `<div class="line-num">${i + 1}</div>`)
      .join('');

    // Render buffer with cursor and target highlighting
    this.bufferEl.innerHTML = lines
      .map((line, lineNum) => {
        const chars = line.length === 0 ? [' '] : line.split('');
        const charHtml = chars
          .map((char, col) => {
            const classes: string[] = ['char'];

            // Cursor
            if (lineNum === cursorPos.line && col === cursorPos.col) {
              classes.push('cursor');
              if (isInsert) classes.push('insert-cursor');
            }

            // Target highlight
            if (this.targetPosition &&
                lineNum === this.targetPosition.line &&
                col === this.targetPosition.col) {
              classes.push('target');
            }

            // Escape HTML
            const escaped = char
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/ /g, '&nbsp;');

            return `<span class="${classes.join(' ')}">${escaped}</span>`;
          })
          .join('');

        // Add cursor at end of empty line or after last char
        let extraCursor = '';
        if (lineNum === cursorPos.line && cursorPos.col >= line.length) {
          const isTarget = this.targetPosition &&
            lineNum === this.targetPosition.line &&
            cursorPos.col === this.targetPosition.col;
          const insertClass = isInsert ? ' insert-cursor' : '';
          extraCursor = `<span class="char cursor${insertClass}${isTarget ? ' target' : ''}">&nbsp;</span>`;
        }

        return `<div class="line">${charHtml}${extraCursor}</div>`;
      })
      .join('');
  }
}
