import { Buffer } from './buffer.ts';
import { Cursor, Position } from './cursor.ts';

export type VimMode = 'normal' | 'insert' | 'visual';

export interface VimState {
  mode: VimMode;
  buffer: Buffer;
  cursor: Cursor;
  commandBuffer: string;
  register: string;
  lastFind: { char: string; forward: boolean; before: boolean } | null;
}

export interface KeyResult {
  handled: boolean;
  completed: boolean; // True if a command was executed
  description?: string;
}

export class VimEngine {
  private state: VimState;
  private onStateChange: (() => void) | null = null;

  constructor(content: string | string[] = ['']) {
    this.state = {
      mode: 'normal',
      buffer: new Buffer(content),
      cursor: new Cursor(),
      commandBuffer: '',
      register: '',
      lastFind: null,
    };
    this.state.cursor.clamp(this.state.buffer);
  }

  getState(): VimState {
    return this.state;
  }

  setOnStateChange(callback: () => void): void {
    this.onStateChange = callback;
  }

  private emit(): void {
    this.onStateChange?.();
  }

  reset(content: string | string[], cursorPos?: Position): void {
    this.state.buffer = new Buffer(content);
    this.state.cursor = new Cursor(cursorPos?.line ?? 0, cursorPos?.col ?? 0);
    this.state.cursor.clamp(this.state.buffer);
    this.state.mode = 'normal';
    this.state.commandBuffer = '';
    this.emit();
  }

  handleKey(key: string): KeyResult {
    if (this.state.mode === 'insert') {
      return this.handleInsertMode(key);
    }
    return this.handleNormalMode(key);
  }

  private handleNormalMode(key: string): KeyResult {
    const { cursor, buffer, commandBuffer } = this.state;

    // Build up command buffer for multi-key commands
    const cmd = commandBuffer + key;

    // Parse count prefix (but '0' alone is a command, not a count)
    const countMatch = cmd.match(/^([1-9]\d*)(.*)$/);
    const countStr = countMatch?.[1] ?? '';
    const command = countMatch?.[2] || cmd; // If no count, use full command
    const count = countStr ? parseInt(countStr, 10) : 1;

    // Incomplete commands that need more input
    if (command === '' ||
        command === 'd' || command === 'c' || command === 'y' ||
        command === 'f' || command === 'F' || command === 't' || command === 'T' ||
        command === 'g' || command === 'r' ||
        command === 'di' || command === 'ci' || command === 'yi' ||
        command === 'da' || command === 'ca' || command === 'ya') {
      this.state.commandBuffer = cmd;
      this.emit();
      return { handled: true, completed: false };
    }

    // Reset command buffer for completed commands
    this.state.commandBuffer = '';

    // Basic motions
    if (command === 'h') {
      cursor.moveLeft(buffer, count);
      this.emit();
      return { handled: true, completed: true, description: 'move left' };
    }
    if (command === 'l') {
      cursor.moveRight(buffer, count);
      this.emit();
      return { handled: true, completed: true, description: 'move right' };
    }
    if (command === 'j') {
      cursor.moveDown(buffer, count);
      this.emit();
      return { handled: true, completed: true, description: 'move down' };
    }
    if (command === 'k') {
      cursor.moveUp(buffer, count);
      this.emit();
      return { handled: true, completed: true, description: 'move up' };
    }

    // Word motions
    if (command === 'w') {
      cursor.moveWordForward(buffer, count, false);
      this.emit();
      return { handled: true, completed: true, description: 'word forward' };
    }
    if (command === 'W') {
      cursor.moveWordForward(buffer, count, true);
      this.emit();
      return { handled: true, completed: true, description: 'WORD forward' };
    }
    if (command === 'b') {
      cursor.moveWordBackward(buffer, count, false);
      this.emit();
      return { handled: true, completed: true, description: 'word backward' };
    }
    if (command === 'B') {
      cursor.moveWordBackward(buffer, count, true);
      this.emit();
      return { handled: true, completed: true, description: 'WORD backward' };
    }
    if (command === 'e') {
      cursor.moveWordEnd(buffer, count, false);
      this.emit();
      return { handled: true, completed: true, description: 'end of word' };
    }
    if (command === 'E') {
      cursor.moveWordEnd(buffer, count, true);
      this.emit();
      return { handled: true, completed: true, description: 'end of WORD' };
    }

    // Line motions
    if (command === '0') {
      cursor.moveToLineStart();
      this.emit();
      return { handled: true, completed: true, description: 'line start' };
    }
    if (command === '^') {
      cursor.moveToFirstNonBlank(buffer);
      this.emit();
      return { handled: true, completed: true, description: 'first non-blank' };
    }
    if (command === '$') {
      cursor.moveToLineEnd(buffer);
      this.emit();
      return { handled: true, completed: true, description: 'line end' };
    }
    if (command === 'g_') {
      cursor.moveToLastNonBlank(buffer);
      this.emit();
      return { handled: true, completed: true, description: 'last non-blank' };
    }

    // File motions
    if (command === 'gg') {
      cursor.moveToFirstLine(buffer);
      this.emit();
      return { handled: true, completed: true, description: 'first line' };
    }
    if (command === 'G') {
      if (countStr) {
        cursor.moveToLine(buffer, count - 1);
      } else {
        cursor.moveToLastLine(buffer);
      }
      this.emit();
      return { handled: true, completed: true, description: 'last line' };
    }

    // Find character motions
    const findMatch = command.match(/^([fFtT])(.)$/);
    if (findMatch) {
      const [, type, char] = findMatch;
      const forward = type === 'f' || type === 't';
      const before = type === 't' || type === 'T';
      cursor.findChar(buffer, char, forward, before, count);
      this.state.lastFind = { char, forward, before };
      this.emit();
      return { handled: true, completed: true, description: `find '${char}'` };
    }

    // Repeat find
    if (command === ';' && this.state.lastFind) {
      const { char, forward, before } = this.state.lastFind;
      cursor.findChar(buffer, char, forward, before, count);
      this.emit();
      return { handled: true, completed: true, description: 'repeat find' };
    }
    if (command === ',' && this.state.lastFind) {
      const { char, forward, before } = this.state.lastFind;
      cursor.findChar(buffer, char, !forward, before, count);
      this.emit();
      return { handled: true, completed: true, description: 'repeat find reverse' };
    }

    // Delete commands
    if (command === 'x') {
      for (let i = 0; i < count; i++) {
        this.state.register += buffer.deleteChar(cursor.getLine(), cursor.getCol());
      }
      cursor.clamp(buffer);
      this.emit();
      return { handled: true, completed: true, description: 'delete char' };
    }
    if (command === 'X') {
      for (let i = 0; i < count; i++) {
        if (cursor.getCol() > 0) {
          cursor.moveLeft(buffer);
          this.state.register += buffer.deleteChar(cursor.getLine(), cursor.getCol());
        }
      }
      this.emit();
      return { handled: true, completed: true, description: 'delete char before' };
    }
    if (command === 'dd') {
      this.state.register = buffer.deleteLines(cursor.getLine(), count).join('\n');
      cursor.clamp(buffer);
      cursor.moveToFirstNonBlank(buffer);
      this.emit();
      return { handled: true, completed: true, description: 'delete line' };
    }
    if (command === 'D') {
      const line = cursor.getLine();
      this.state.register = buffer.deleteRange(line, cursor.getCol(), buffer.getLineLength(line));
      cursor.clamp(buffer);
      this.emit();
      return { handled: true, completed: true, description: 'delete to end' };
    }

    // Delete with motions
    const deleteMotion = command.match(/^d([weWEB$0^hjkl])$/);
    if (deleteMotion) {
      return this.executeOperatorMotion('d', deleteMotion[1], count);
    }

    // Delete with text objects
    const deleteTextObj = command.match(/^d([ia])([wW"'`\(\)\[\]\{\}<>])$/);
    if (deleteTextObj) {
      return this.executeTextObject('d', deleteTextObj[1] as 'i' | 'a', deleteTextObj[2], count);
    }

    // Change commands
    if (command === 'cc' || command === 'S') {
      const line = cursor.getLine();
      this.state.register = buffer.getLine(line);
      buffer.setLine(line, '');
      cursor.moveToLineStart();
      this.state.mode = 'insert';
      this.emit();
      return { handled: true, completed: true, description: 'change line' };
    }
    if (command === 'C') {
      const line = cursor.getLine();
      this.state.register = buffer.deleteRange(line, cursor.getCol(), buffer.getLineLength(line));
      this.state.mode = 'insert';
      this.emit();
      return { handled: true, completed: true, description: 'change to end' };
    }
    if (command === 's') {
      this.state.register = buffer.deleteChar(cursor.getLine(), cursor.getCol());
      this.state.mode = 'insert';
      this.emit();
      return { handled: true, completed: true, description: 'substitute char' };
    }

    // Change with motions
    const changeMotion = command.match(/^c([weWEB$0^])$/);
    if (changeMotion) {
      const result = this.executeOperatorMotion('c', changeMotion[1], count);
      this.state.mode = 'insert';
      this.emit();
      return result;
    }

    // Change with text objects
    const changeTextObj = command.match(/^c([ia])([wW"'`\(\)\[\]\{\}<>])$/);
    if (changeTextObj) {
      const result = this.executeTextObject('c', changeTextObj[1] as 'i' | 'a', changeTextObj[2], count);
      this.state.mode = 'insert';
      this.emit();
      return result;
    }

    // Yank commands
    if (command === 'yy' || command === 'Y') {
      const lines: string[] = [];
      for (let i = 0; i < count; i++) {
        const lineNum = cursor.getLine() + i;
        if (lineNum < buffer.getLineCount()) {
          lines.push(buffer.getLine(lineNum));
        }
      }
      this.state.register = lines.join('\n');
      this.emit();
      return { handled: true, completed: true, description: 'yank line' };
    }

    // Yank with text objects
    const yankTextObj = command.match(/^y([ia])([wW"'`\(\)\[\]\{\}<>])$/);
    if (yankTextObj) {
      return this.executeTextObject('y', yankTextObj[1] as 'i' | 'a', yankTextObj[2], count);
    }

    // Put commands
    if (command === 'p') {
      this.putAfter(count);
      this.emit();
      return { handled: true, completed: true, description: 'put after' };
    }
    if (command === 'P') {
      this.putBefore(count);
      this.emit();
      return { handled: true, completed: true, description: 'put before' };
    }

    // Replace char
    const replaceMatch = command.match(/^r(.)$/);
    if (replaceMatch) {
      const char = replaceMatch[1];
      const line = cursor.getLine();
      const col = cursor.getCol();
      if (col < buffer.getLineLength(line)) {
        buffer.deleteChar(line, col);
        buffer.insertChar(line, col, char);
      }
      this.emit();
      return { handled: true, completed: true, description: `replace with '${char}'` };
    }

    // Mode changes
    if (command === 'i') {
      this.state.mode = 'insert';
      this.emit();
      return { handled: true, completed: true, description: 'insert mode' };
    }
    if (command === 'a') {
      cursor.moveRight(buffer);
      this.state.mode = 'insert';
      cursor.clampForInsert(buffer);
      this.emit();
      return { handled: true, completed: true, description: 'append' };
    }
    if (command === 'I') {
      cursor.moveToFirstNonBlank(buffer);
      this.state.mode = 'insert';
      this.emit();
      return { handled: true, completed: true, description: 'insert at line start' };
    }
    if (command === 'A') {
      cursor.moveToLineEnd(buffer);
      cursor.moveRight(buffer);
      cursor.clampForInsert(buffer);
      this.state.mode = 'insert';
      this.emit();
      return { handled: true, completed: true, description: 'append at line end' };
    }
    if (command === 'o') {
      const line = cursor.getLine();
      buffer.insertLine(line + 1, '');
      cursor.moveDown(buffer);
      cursor.moveToLineStart();
      this.state.mode = 'insert';
      this.emit();
      return { handled: true, completed: true, description: 'open line below' };
    }
    if (command === 'O') {
      const line = cursor.getLine();
      buffer.insertLine(line, '');
      cursor.moveToLineStart();
      this.state.mode = 'insert';
      this.emit();
      return { handled: true, completed: true, description: 'open line above' };
    }

    // Join lines
    if (command === 'J') {
      for (let i = 0; i < count; i++) {
        if (cursor.getLine() < buffer.getLineCount() - 1) {
          const line = cursor.getLine();
          const endCol = buffer.getLineLength(line);
          buffer.setLine(line, buffer.getLine(line).trimEnd() + ' ' + buffer.getLine(line + 1).trimStart());
          buffer.deleteLine(line + 1);
          cursor.setPosition(line, endCol);
        }
      }
      this.emit();
      return { handled: true, completed: true, description: 'join lines' };
    }

    // Undo (not implemented - just clear state)
    if (command === 'u') {
      this.emit();
      return { handled: true, completed: true, description: 'undo' };
    }

    // Unknown command - clear buffer
    this.state.commandBuffer = '';
    this.emit();
    return { handled: false, completed: false };
  }

  private executeOperatorMotion(operator: string, motion: string, count: number): KeyResult {
    const { cursor, buffer } = this.state;
    const startCol = cursor.getCol();
    const startLine = cursor.getLine();

    // Execute motion
    switch (motion) {
      case 'w': cursor.moveWordForward(buffer, count, false); break;
      case 'W': cursor.moveWordForward(buffer, count, true); break;
      case 'e': cursor.moveWordEnd(buffer, count, false); break;
      case 'E': cursor.moveWordEnd(buffer, count, true); break;
      case 'b': cursor.moveWordBackward(buffer, count, false); break;
      case 'B': cursor.moveWordBackward(buffer, count, true); break;
      case '$': cursor.moveToLineEnd(buffer); break;
      case '0': cursor.moveToLineStart(); break;
      case '^': cursor.moveToFirstNonBlank(buffer); break;
      case 'h': cursor.moveLeft(buffer, count); break;
      case 'j': cursor.moveDown(buffer, count); break;
      case 'k': cursor.moveUp(buffer, count); break;
      case 'l': cursor.moveRight(buffer, count); break;
    }

    const endCol = cursor.getCol();
    const endLine = cursor.getLine();

    // Handle line-wise operations (j, k)
    if (motion === 'j' || motion === 'k') {
      const minLine = Math.min(startLine, endLine);
      const maxLine = Math.max(startLine, endLine);
      const lines: string[] = [];
      for (let i = minLine; i <= maxLine; i++) {
        lines.push(buffer.getLine(i));
      }
      this.state.register = lines.join('\n');

      if (operator === 'd' || operator === 'c') {
        buffer.deleteLines(minLine, maxLine - minLine + 1);
        cursor.setPosition(minLine, 0);
        cursor.clamp(buffer);
        cursor.moveToFirstNonBlank(buffer);
      }
    } else {
      // Character-wise
      const minCol = Math.min(startCol, endCol);
      const maxCol = Math.max(startCol, endCol) + (motion === 'e' || motion === 'E' ? 1 : 0);

      if (operator === 'd' || operator === 'c') {
        this.state.register = buffer.deleteRange(startLine, minCol, maxCol);
        cursor.setPosition(startLine, minCol);
        cursor.clamp(buffer);
      } else if (operator === 'y') {
        this.state.register = buffer.getLine(startLine).slice(minCol, maxCol);
        cursor.setPosition(startLine, startCol);
      }
    }

    this.emit();
    return { handled: true, completed: true, description: `${operator}${motion}` };
  }

  private executeTextObject(operator: string, inner: 'i' | 'a', obj: string, _count: number): KeyResult {
    const { cursor, buffer } = this.state;
    const line = buffer.getLine(cursor.getLine());
    const col = cursor.getCol();

    let start = -1;
    let end = -1;

    if (obj === 'w' || obj === 'W') {
      const bigWord = obj === 'W';
      const isWord = (c: string) => bigWord ? (c !== ' ' && c !== '\t') : /\w/.test(c);

      // Find word boundaries
      start = col;
      while (start > 0 && isWord(line[start - 1])) start--;
      end = col;
      while (end < line.length && isWord(line[end])) end++;

      if (inner === 'a') {
        // Include trailing whitespace
        while (end < line.length && /\s/.test(line[end])) end++;
      }
    } else {
      // Paired delimiters
      const pairs: Record<string, [string, string]> = {
        '"': ['"', '"'], "'": ["'", "'"], '`': ['`', '`'],
        '(': ['(', ')'], ')': ['(', ')'],
        '[': ['[', ']'], ']': ['[', ']'],
        '{': ['{', '}'], '}': ['{', '}'],
        '<': ['<', '>'], '>': ['<', '>'],
      };
      const pair = pairs[obj];
      if (pair) {
        const [open, close] = pair;
        // Find opening
        for (let i = col; i >= 0; i--) {
          if (line[i] === open) { start = i; break; }
        }
        // Find closing
        for (let i = col; i < line.length; i++) {
          if (line[i] === close && i !== start) { end = i + 1; break; }
        }

        if (inner === 'i' && start >= 0 && end > start) {
          start++; end--;
        }
      }
    }

    if (start >= 0 && end > start) {
      const text = line.slice(start, end);

      if (operator === 'd' || operator === 'c') {
        buffer.deleteRange(cursor.getLine(), start, end);
        cursor.setPosition(cursor.getLine(), start);
        cursor.clamp(buffer);
        this.state.register = text;
      } else if (operator === 'y') {
        this.state.register = text;
      }
    }

    this.emit();
    return { handled: true, completed: true, description: `${operator}${inner}${obj}` };
  }

  private putAfter(count: number): void {
    const { cursor, buffer, register } = this.state;
    if (!register) return;

    const isLinewise = register.includes('\n') || register === buffer.getLine(cursor.getLine());

    for (let i = 0; i < count; i++) {
      if (isLinewise) {
        const lines = register.split('\n');
        for (let j = lines.length - 1; j >= 0; j--) {
          buffer.insertLine(cursor.getLine() + 1, lines[j]);
        }
        cursor.moveDown(buffer);
        cursor.moveToFirstNonBlank(buffer);
      } else {
        const line = cursor.getLine();
        const col = cursor.getCol();
        const lineContent = buffer.getLine(line);
        buffer.setLine(line, lineContent.slice(0, col + 1) + register + lineContent.slice(col + 1));
        cursor.setPosition(line, col + register.length);
      }
    }
  }

  private putBefore(count: number): void {
    const { cursor, buffer, register } = this.state;
    if (!register) return;

    const isLinewise = register.includes('\n');

    for (let i = 0; i < count; i++) {
      if (isLinewise) {
        const lines = register.split('\n');
        for (let j = lines.length - 1; j >= 0; j--) {
          buffer.insertLine(cursor.getLine(), lines[j]);
        }
        cursor.moveToFirstNonBlank(buffer);
      } else {
        const line = cursor.getLine();
        const col = cursor.getCol();
        const lineContent = buffer.getLine(line);
        buffer.setLine(line, lineContent.slice(0, col) + register + lineContent.slice(col));
        cursor.setPosition(line, col + register.length - 1);
      }
    }
  }

  private handleInsertMode(key: string): KeyResult {
    const { cursor, buffer } = this.state;

    if (key === 'Escape') {
      this.state.mode = 'normal';
      cursor.moveLeft(buffer);
      cursor.clamp(buffer);
      this.emit();
      return { handled: true, completed: true, description: 'exit insert' };
    }

    if (key === 'Backspace') {
      if (cursor.getCol() > 0) {
        cursor.moveLeft(buffer);
        buffer.deleteChar(cursor.getLine(), cursor.getCol());
      } else if (cursor.getLine() > 0) {
        const prevLineLen = buffer.getLineLength(cursor.getLine() - 1);
        cursor.moveUp(buffer);
        buffer.joinLines(cursor.getLine());
        cursor.setPosition(cursor.getLine(), prevLineLen);
      }
      this.emit();
      return { handled: true, completed: true, description: 'backspace' };
    }

    if (key === 'Enter') {
      buffer.splitLine(cursor.getLine(), cursor.getCol());
      cursor.moveDown(buffer);
      cursor.moveToLineStart();
      this.emit();
      return { handled: true, completed: true, description: 'newline' };
    }

    // Regular character
    if (key.length === 1) {
      buffer.insertChar(cursor.getLine(), cursor.getCol(), key);
      cursor.setPosition(cursor.getLine(), cursor.getCol() + 1);
      this.emit();
      return { handled: true, completed: true, description: `insert '${key}'` };
    }

    return { handled: false, completed: false };
  }
}
