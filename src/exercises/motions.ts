import { Exercise } from './types.ts';

export const motionExercises: Exercise[] = [
  // Basic motions - h, j, k, l
  {
    id: 'motion-h-basic',
    title: 'Move Left (h)',
    description: 'Use h to move the cursor left to the target position.',
    initialBuffer: ['Hello, world!'],
    initialCursor: { line: 0, col: 7 },
    targetCursor: { line: 0, col: 0 },
    hints: ['Press h to move left one character', 'You can use a count like 7h to move 7 characters'],
    optimalKeystrokes: 2, // 7h
    category: 'motion',
    difficulty: 'beginner',
  },
  {
    id: 'motion-l-basic',
    title: 'Move Right (l)',
    description: 'Use l to move the cursor right to the target position.',
    initialBuffer: ['Hello, world!'],
    initialCursor: { line: 0, col: 0 },
    targetCursor: { line: 0, col: 7 },
    hints: ['Press l to move right one character', 'You can use a count like 7l to move 7 characters'],
    optimalKeystrokes: 2, // 7l
    category: 'motion',
    difficulty: 'beginner',
  },
  {
    id: 'motion-j-basic',
    title: 'Move Down (j)',
    description: 'Use j to move the cursor down to the target line.',
    initialBuffer: ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5'],
    initialCursor: { line: 0, col: 0 },
    targetCursor: { line: 4, col: 0 },
    hints: ['Press j to move down one line', 'You can use a count like 4j to move 4 lines'],
    optimalKeystrokes: 2, // 4j
    category: 'motion',
    difficulty: 'beginner',
  },
  {
    id: 'motion-k-basic',
    title: 'Move Up (k)',
    description: 'Use k to move the cursor up to the target line.',
    initialBuffer: ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5'],
    initialCursor: { line: 4, col: 0 },
    targetCursor: { line: 0, col: 0 },
    hints: ['Press k to move up one line', 'You can use a count like 4k to move 4 lines'],
    optimalKeystrokes: 2, // 4k
    category: 'motion',
    difficulty: 'beginner',
  },

  // Word motions - w, b, e
  {
    id: 'motion-w-basic',
    title: 'Word Forward (w)',
    description: 'Use w to jump to the start of the next word.',
    initialBuffer: ['The quick brown fox jumps over'],
    initialCursor: { line: 0, col: 0 },
    targetCursor: { line: 0, col: 10 },
    hints: ['Press w to move to the next word', 'The cursor lands on the first character of the word'],
    optimalKeystrokes: 2, // 2w
    category: 'motion',
    difficulty: 'beginner',
  },
  {
    id: 'motion-b-basic',
    title: 'Word Backward (b)',
    description: 'Use b to jump to the start of the previous word.',
    initialBuffer: ['The quick brown fox jumps over'],
    initialCursor: { line: 0, col: 20 },
    targetCursor: { line: 0, col: 10 },
    hints: ['Press b to move to the previous word', 'The cursor lands on the first character'],
    optimalKeystrokes: 2, // 2b
    category: 'motion',
    difficulty: 'beginner',
  },
  {
    id: 'motion-e-basic',
    title: 'End of Word (e)',
    description: 'Use e to jump to the end of the current/next word.',
    initialBuffer: ['The quick brown fox'],
    initialCursor: { line: 0, col: 0 },
    targetCursor: { line: 0, col: 8 },
    hints: ['Press e to move to the end of a word', 'The cursor lands on the last character'],
    optimalKeystrokes: 2, // 2e
    category: 'motion',
    difficulty: 'beginner',
  },

  // Line motions - 0, ^, $
  {
    id: 'motion-0-basic',
    title: 'Line Start (0)',
    description: 'Use 0 to jump to the beginning of the line.',
    initialBuffer: ['    const x = 42;'],
    initialCursor: { line: 0, col: 10 },
    targetCursor: { line: 0, col: 0 },
    hints: ['Press 0 to go to column 0', 'This goes to the absolute start, including whitespace'],
    optimalKeystrokes: 1, // 0
    category: 'motion',
    difficulty: 'beginner',
  },
  {
    id: 'motion-caret-basic',
    title: 'First Non-Blank (^)',
    description: 'Use ^ to jump to the first non-blank character.',
    initialBuffer: ['    const x = 42;'],
    initialCursor: { line: 0, col: 14 },
    targetCursor: { line: 0, col: 4 },
    hints: ['Press ^ to go to the first non-blank', 'This skips leading whitespace'],
    optimalKeystrokes: 1, // ^
    category: 'motion',
    difficulty: 'beginner',
  },
  {
    id: 'motion-dollar-basic',
    title: 'Line End ($)',
    description: 'Use $ to jump to the end of the line.',
    initialBuffer: ['Hello, world!'],
    initialCursor: { line: 0, col: 0 },
    targetCursor: { line: 0, col: 12 },
    hints: ['Press $ to go to the last character', 'In vim the cursor stays on the last char, not after it'],
    optimalKeystrokes: 1, // $
    category: 'motion',
    difficulty: 'beginner',
  },

  // Find character - f, t
  {
    id: 'motion-f-basic',
    title: 'Find Character (f)',
    description: 'Use f{char} to jump to the next occurrence of a character.',
    initialBuffer: ['function calculateTotal(items) {'],
    initialCursor: { line: 0, col: 0 },
    targetCursor: { line: 0, col: 24 },
    hints: ['Press f followed by a character to find it', 'Try f( to jump to the parenthesis'],
    optimalKeystrokes: 2, // f(
    category: 'motion',
    difficulty: 'intermediate',
  },
  {
    id: 'motion-t-basic',
    title: 'Till Character (t)',
    description: 'Use t{char} to jump to just before the next occurrence.',
    initialBuffer: ['const name = "Alice";'],
    initialCursor: { line: 0, col: 0 },
    targetCursor: { line: 0, col: 12 },
    hints: ['Press t followed by a character', 't stops one character before the target'],
    optimalKeystrokes: 2, // t"
    category: 'motion',
    difficulty: 'intermediate',
  },
  {
    id: 'motion-F-basic',
    title: 'Find Backward (F)',
    description: 'Use F{char} to find a character backward.',
    initialBuffer: ['items.filter(x => x > 0)'],
    initialCursor: { line: 0, col: 20 },
    targetCursor: { line: 0, col: 12 },
    hints: ['F works like f but searches backward', 'Try F( to find the opening parenthesis'],
    optimalKeystrokes: 2, // F(
    category: 'motion',
    difficulty: 'intermediate',
  },

  // File motions - gg, G
  {
    id: 'motion-gg-basic',
    title: 'Go to First Line (gg)',
    description: 'Use gg to jump to the first line of the file.',
    initialBuffer: ['First line', 'Second line', 'Third line', 'Fourth line', 'Fifth line'],
    initialCursor: { line: 4, col: 0 },
    targetCursor: { line: 0, col: 0 },
    hints: ['Press gg to go to the first line', 'The cursor also moves to the first non-blank'],
    optimalKeystrokes: 2, // gg
    category: 'motion',
    difficulty: 'beginner',
  },
  {
    id: 'motion-G-basic',
    title: 'Go to Last Line (G)',
    description: 'Use G to jump to the last line of the file.',
    initialBuffer: ['First line', 'Second line', 'Third line', 'Fourth line', 'Last line'],
    initialCursor: { line: 0, col: 0 },
    targetCursor: { line: 4, col: 0 },
    hints: ['Press G to go to the last line', 'You can also use {number}G to go to a specific line'],
    optimalKeystrokes: 1, // G
    category: 'motion',
    difficulty: 'beginner',
  },

  // Combined motions
  {
    id: 'motion-combined-1',
    title: 'Navigate to Function Name',
    description: 'Navigate from the end of the line to the function name.',
    initialBuffer: ['function processUserInput(data) {'],
    initialCursor: { line: 0, col: 32 },
    targetCursor: { line: 0, col: 9 },
    hints: ['You can use ^ then w, or use F and search backward', 'Try ^w or Fp'],
    optimalKeystrokes: 2, // ^w or Fp
    category: 'motion',
    difficulty: 'intermediate',
  },
  {
    id: 'motion-combined-2',
    title: 'Jump to Closing Brace',
    description: 'Navigate to the closing brace of the object.',
    initialBuffer: ['const obj = { name: "test", value: 42 };'],
    initialCursor: { line: 0, col: 0 },
    targetCursor: { line: 0, col: 37 },
    hints: ['Try f} to find the closing brace directly'],
    optimalKeystrokes: 2, // f}
    category: 'motion',
    difficulty: 'intermediate',
  },
  {
    id: 'motion-multiline',
    title: 'Navigate Multi-line',
    description: 'Navigate to the return statement.',
    initialBuffer: [
      'function add(a, b) {',
      '  const sum = a + b;',
      '  return sum;',
      '}',
    ],
    initialCursor: { line: 0, col: 0 },
    targetCursor: { line: 2, col: 2 },
    hints: ['Use j to go down lines, then ^ to go to first non-blank', 'Try 2j^'],
    optimalKeystrokes: 3, // 2j^
    category: 'motion',
    difficulty: 'intermediate',
  },

  // Advanced motions
  {
    id: 'motion-repeat-find',
    title: 'Repeat Find (;)',
    description: 'Use ; to repeat the last f/t motion.',
    initialBuffer: ['a = b + c + d + e'],
    initialCursor: { line: 0, col: 0 },
    targetCursor: { line: 0, col: 14 },
    hints: ['First use f+ to find +, then use ; to repeat', 'Each ; jumps to the next +'],
    optimalKeystrokes: 4, // f+;;
    category: 'motion',
    difficulty: 'advanced',
  },
  {
    id: 'motion-big-word',
    title: 'WORD Motion (W)',
    description: 'Use W to move by WORD (whitespace-delimited).',
    initialBuffer: ['user.name = "John"; user.age = 30;'],
    initialCursor: { line: 0, col: 0 },
    targetCursor: { line: 0, col: 20 },
    hints: ['W moves by whitespace-separated words', 'w stops at punctuation, W does not'],
    optimalKeystrokes: 2, // 2W
    category: 'motion',
    difficulty: 'advanced',
  },
];
