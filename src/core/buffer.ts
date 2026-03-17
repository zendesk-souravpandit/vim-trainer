export class Buffer {
  private lines: string[];

  constructor(content: string | string[]) {
    this.lines = Array.isArray(content) ? [...content] : content.split('\n');
    if (this.lines.length === 0) {
      this.lines = [''];
    }
  }

  getLines(): string[] {
    return [...this.lines];
  }

  getLine(lineNum: number): string {
    return this.lines[lineNum] ?? '';
  }

  getLineCount(): number {
    return this.lines.length;
  }

  getLineLength(lineNum: number): number {
    return this.getLine(lineNum).length;
  }

  getChar(line: number, col: number): string {
    return this.lines[line]?.[col] ?? '';
  }

  setLine(lineNum: number, content: string): void {
    if (lineNum >= 0 && lineNum < this.lines.length) {
      this.lines[lineNum] = content;
    }
  }

  insertLine(lineNum: number, content: string): void {
    this.lines.splice(lineNum, 0, content);
  }

  deleteLine(lineNum: number): string {
    if (this.lines.length === 1) {
      const deleted = this.lines[0];
      this.lines[0] = '';
      return deleted;
    }
    return this.lines.splice(lineNum, 1)[0] ?? '';
  }

  deleteLines(start: number, count: number): string[] {
    const deleted: string[] = [];
    for (let i = 0; i < count; i++) {
      if (start < this.lines.length) {
        deleted.push(this.deleteLine(start));
      }
    }
    return deleted;
  }

  insertChar(line: number, col: number, char: string): void {
    const lineContent = this.getLine(line);
    this.lines[line] = lineContent.slice(0, col) + char + lineContent.slice(col);
  }

  deleteChar(line: number, col: number): string {
    const lineContent = this.getLine(line);
    if (col >= 0 && col < lineContent.length) {
      const char = lineContent[col];
      this.lines[line] = lineContent.slice(0, col) + lineContent.slice(col + 1);
      return char;
    }
    return '';
  }

  deleteRange(line: number, startCol: number, endCol: number): string {
    const lineContent = this.getLine(line);
    const deleted = lineContent.slice(startCol, endCol);
    this.lines[line] = lineContent.slice(0, startCol) + lineContent.slice(endCol);
    return deleted;
  }

  replaceRange(line: number, startCol: number, endCol: number, replacement: string): string {
    const deleted = this.deleteRange(line, startCol, endCol);
    const lineContent = this.getLine(line);
    this.lines[line] = lineContent.slice(0, startCol) + replacement + lineContent.slice(startCol);
    return deleted;
  }

  joinLines(lineNum: number): void {
    if (lineNum < this.lines.length - 1) {
      this.lines[lineNum] += this.lines[lineNum + 1];
      this.lines.splice(lineNum + 1, 1);
    }
  }

  splitLine(lineNum: number, col: number): void {
    const line = this.getLine(lineNum);
    this.lines[lineNum] = line.slice(0, col);
    this.lines.splice(lineNum + 1, 0, line.slice(col));
  }

  getText(): string {
    return this.lines.join('\n');
  }

  clone(): Buffer {
    return new Buffer([...this.lines]);
  }

  equals(other: Buffer): boolean {
    const otherLines = other.getLines();
    if (this.lines.length !== otherLines.length) return false;
    return this.lines.every((line, i) => line === otherLines[i]);
  }
}
