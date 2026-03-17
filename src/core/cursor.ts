import { Buffer } from './buffer.ts';

export interface Position {
  line: number;
  col: number;
}

export class Cursor {
  private line: number = 0;
  private col: number = 0;
  private desiredCol: number = 0; // For vertical movement memory

  constructor(line: number = 0, col: number = 0) {
    this.line = line;
    this.col = col;
    this.desiredCol = col;
  }

  getPosition(): Position {
    return { line: this.line, col: this.col };
  }

  getLine(): number {
    return this.line;
  }

  getCol(): number {
    return this.col;
  }

  setPosition(line: number, col: number, updateDesired: boolean = true): void {
    this.line = line;
    this.col = col;
    if (updateDesired) {
      this.desiredCol = col;
    }
  }

  clamp(buffer: Buffer): void {
    const lineCount = buffer.getLineCount();
    this.line = Math.max(0, Math.min(this.line, lineCount - 1));

    const lineLength = buffer.getLineLength(this.line);
    const maxCol = Math.max(0, lineLength - 1);
    this.col = Math.max(0, Math.min(this.col, maxCol));
  }

  clampForInsert(buffer: Buffer): void {
    const lineCount = buffer.getLineCount();
    this.line = Math.max(0, Math.min(this.line, lineCount - 1));

    const lineLength = buffer.getLineLength(this.line);
    this.col = Math.max(0, Math.min(this.col, lineLength));
  }

  moveLeft(_buffer: Buffer, count: number = 1): void {
    this.col = Math.max(0, this.col - count);
    this.desiredCol = this.col;
  }

  moveRight(buffer: Buffer, count: number = 1): void {
    const lineLength = buffer.getLineLength(this.line);
    const maxCol = Math.max(0, lineLength - 1);
    this.col = Math.min(maxCol, this.col + count);
    this.desiredCol = this.col;
  }

  moveUp(buffer: Buffer, count: number = 1): void {
    this.line = Math.max(0, this.line - count);
    this.col = Math.min(this.desiredCol, Math.max(0, buffer.getLineLength(this.line) - 1));
  }

  moveDown(buffer: Buffer, count: number = 1): void {
    this.line = Math.min(buffer.getLineCount() - 1, this.line + count);
    this.col = Math.min(this.desiredCol, Math.max(0, buffer.getLineLength(this.line) - 1));
  }

  moveToLineStart(): void {
    this.col = 0;
    this.desiredCol = 0;
  }

  moveToFirstNonBlank(buffer: Buffer): void {
    const line = buffer.getLine(this.line);
    const match = line.match(/^\s*/);
    this.col = match ? match[0].length : 0;
    if (this.col >= line.length) this.col = Math.max(0, line.length - 1);
    this.desiredCol = this.col;
  }

  moveToLineEnd(buffer: Buffer): void {
    const lineLength = buffer.getLineLength(this.line);
    this.col = Math.max(0, lineLength - 1);
    this.desiredCol = Infinity; // Remember we want end of line
  }

  moveToLastNonBlank(buffer: Buffer): void {
    const line = buffer.getLine(this.line);
    const trimmed = line.trimEnd();
    this.col = Math.max(0, trimmed.length - 1);
    this.desiredCol = this.col;
  }

  moveWordForward(buffer: Buffer, count: number = 1, bigWord: boolean = false): void {
    for (let i = 0; i < count; i++) {
      this.nextWordStart(buffer, bigWord);
    }
    this.desiredCol = this.col;
  }

  moveWordBackward(buffer: Buffer, count: number = 1, bigWord: boolean = false): void {
    for (let i = 0; i < count; i++) {
      this.prevWordStart(buffer, bigWord);
    }
    this.desiredCol = this.col;
  }

  moveWordEnd(buffer: Buffer, count: number = 1, bigWord: boolean = false): void {
    for (let i = 0; i < count; i++) {
      this.nextWordEnd(buffer, bigWord);
    }
    this.desiredCol = this.col;
  }

  private isWordChar(char: string, bigWord: boolean): boolean {
    if (bigWord) {
      return char !== ' ' && char !== '\t' && char !== '';
    }
    return /\w/.test(char);
  }

  private nextWordStart(buffer: Buffer, bigWord: boolean): void {
    const line = buffer.getLine(this.line);
    let { line: l, col: c } = this;

    // Skip current word
    while (c < line.length && this.isWordChar(line[c], bigWord)) {
      c++;
    }
    // Skip whitespace/punctuation
    while (c < line.length && !this.isWordChar(line[c], bigWord)) {
      c++;
    }

    if (c >= line.length && l < buffer.getLineCount() - 1) {
      // Move to next line
      l++;
      c = 0;
      const nextLine = buffer.getLine(l);
      // Skip leading whitespace
      while (c < nextLine.length && /\s/.test(nextLine[c])) {
        c++;
      }
    }

    this.line = l;
    this.col = Math.min(c, Math.max(0, buffer.getLineLength(l) - 1));
  }

  private prevWordStart(buffer: Buffer, bigWord: boolean): void {
    let { line: l, col: c } = this;

    // Move back at least one char
    if (c > 0) c--;
    else if (l > 0) {
      l--;
      c = Math.max(0, buffer.getLineLength(l) - 1);
    }

    let line = buffer.getLine(l);

    // Skip whitespace/punctuation
    while (c >= 0 && !this.isWordChar(line[c] ?? '', bigWord)) {
      if (c === 0 && l > 0) {
        l--;
        line = buffer.getLine(l);
        c = line.length - 1;
      } else {
        c--;
      }
    }

    // Skip to beginning of word
    while (c > 0 && this.isWordChar(line[c - 1] ?? '', bigWord)) {
      c--;
    }

    this.line = l;
    this.col = Math.max(0, c);
  }

  private nextWordEnd(buffer: Buffer, bigWord: boolean): void {
    let line = buffer.getLine(this.line);
    let { line: l, col: c } = this;

    // Move forward at least one char
    c++;
    if (c >= line.length && l < buffer.getLineCount() - 1) {
      l++;
      c = 0;
      line = buffer.getLine(l);
    }

    // Skip whitespace
    while (c < line.length && !this.isWordChar(line[c], bigWord)) {
      c++;
    }

    // Move to end of word
    while (c < line.length - 1 && this.isWordChar(line[c + 1] ?? '', bigWord)) {
      c++;
    }

    this.line = l;
    this.col = Math.min(c, Math.max(0, buffer.getLineLength(l) - 1));
  }

  findChar(buffer: Buffer, char: string, forward: boolean, before: boolean, count: number = 1): boolean {
    const line = buffer.getLine(this.line);
    let found = -1;
    let occurrences = 0;

    if (forward) {
      for (let i = this.col + 1; i < line.length; i++) {
        if (line[i] === char) {
          occurrences++;
          if (occurrences === count) {
            found = before ? i - 1 : i;
            break;
          }
        }
      }
    } else {
      for (let i = this.col - 1; i >= 0; i--) {
        if (line[i] === char) {
          occurrences++;
          if (occurrences === count) {
            found = before ? i + 1 : i;
            break;
          }
        }
      }
    }

    if (found >= 0) {
      this.col = found;
      this.desiredCol = this.col;
      return true;
    }
    return false;
  }

  moveToLine(buffer: Buffer, lineNum: number): void {
    this.line = Math.max(0, Math.min(lineNum, buffer.getLineCount() - 1));
    this.moveToFirstNonBlank(buffer);
  }

  moveToFirstLine(buffer: Buffer): void {
    this.moveToLine(buffer, 0);
  }

  moveToLastLine(buffer: Buffer): void {
    this.moveToLine(buffer, buffer.getLineCount() - 1);
  }

  clone(): Cursor {
    const c = new Cursor(this.line, this.col);
    c.desiredCol = this.desiredCol;
    return c;
  }

  equals(other: Position): boolean {
    return this.line === other.line && this.col === other.col;
  }
}
