export interface VimCommand {
  key: string;
  description: string;
  details: string;
  example?: string;
  tags: string[];
}

export interface CheatsheetCategory {
  id: string;
  name: string;
  description: string;
  commands: VimCommand[];
}

export const cheatsheetData: CheatsheetCategory[] = [
  {
    id: 'mode-switching',
    name: 'Mode Switching',
    description: 'Switch between Vim modes',
    commands: [
      { key: 'i', description: 'Insert before cursor', details: 'Enter insert mode before the cursor position. The most common way to start typing.', tags: ['insert', 'mode'] },
      { key: 'I', description: 'Insert at line start', details: 'Move to first non-blank character and enter insert mode.', tags: ['insert', 'mode', 'line'] },
      { key: 'a', description: 'Append after cursor', details: 'Enter insert mode after the cursor.', tags: ['insert', 'mode', 'append'] },
      { key: 'A', description: 'Append at line end', details: 'Move to end of line and enter insert mode. Great for adding semicolons.', example: 'A; adds semicolon at line end', tags: ['insert', 'mode', 'line'] },
      { key: 'o', description: 'Open line below', details: 'Create new line below and enter insert mode with auto-indent.', tags: ['insert', 'mode', 'line'] },
      { key: 'O', description: 'Open line above', details: 'Create new line above and enter insert mode.', tags: ['insert', 'mode', 'line'] },
      { key: 'v', description: 'Visual mode', details: 'Character-wise visual selection. Move cursor to expand selection.', tags: ['visual', 'mode', 'select'] },
      { key: 'V', description: 'Visual line mode', details: 'Select entire lines. Perfect for selecting code blocks.', tags: ['visual', 'mode', 'line'] },
      { key: 'Ctrl+v', description: 'Visual block mode', details: 'Select rectangular regions. Edit multiple lines at once.', example: 'Select column, I, type "//", Esc - comments multiple lines', tags: ['visual', 'mode', 'block'] },
      { key: 'Esc', description: 'Normal mode', details: 'Return to normal mode. Cancels pending commands. The most important key.', tags: ['normal', 'mode', 'escape'] },
    ]
  },
  {
    id: 'basic-motions',
    name: 'Basic Motions',
    description: 'Fundamental cursor movement',
    commands: [
      { key: 'h', description: 'Move left', details: 'Move cursor one character left. Use count: 5h moves 5 left.', tags: ['motion', 'basic'] },
      { key: 'j', description: 'Move down', details: 'Move cursor down one line.', tags: ['motion', 'basic'] },
      { key: 'k', description: 'Move up', details: 'Move cursor up one line.', tags: ['motion', 'basic'] },
      { key: 'l', description: 'Move right', details: 'Move cursor one character right.', tags: ['motion', 'basic'] },
    ]
  },
  {
    id: 'word-motions',
    name: 'Word Motions',
    description: 'Navigate by words efficiently',
    commands: [
      { key: 'w', description: 'Next word start', details: 'Jump to beginning of next word. Words are alphanumeric sequences.', tags: ['motion', 'word'] },
      { key: 'W', description: 'Next WORD start', details: 'Jump to next WORD (space-delimited). Treats "obj.method()" as one WORD.', tags: ['motion', 'word', 'WORD'] },
      { key: 'e', description: 'End of word', details: 'Jump to end of current/next word.', tags: ['motion', 'word', 'end'] },
      { key: 'E', description: 'End of WORD', details: 'Jump to end of WORD (space-delimited).', tags: ['motion', 'word', 'WORD'] },
      { key: 'b', description: 'Previous word', details: 'Jump backwards to start of word.', tags: ['motion', 'word', 'backward'] },
      { key: 'B', description: 'Previous WORD', details: 'Jump backwards to start of WORD.', tags: ['motion', 'word', 'WORD', 'backward'] },
      { key: 'ge', description: 'End of previous word', details: 'Jump to end of previous word.', tags: ['motion', 'word', 'backward'] },
    ]
  },
  {
    id: 'line-motions',
    name: 'Line Motions',
    description: 'Navigate within current line',
    commands: [
      { key: '0', description: 'Start of line', details: 'Move to column 0 (absolute start).', tags: ['motion', 'line', 'start'] },
      { key: '^', description: 'First non-blank', details: 'Move to first non-whitespace character. Better than 0 for code.', tags: ['motion', 'line', 'start'] },
      { key: '$', description: 'End of line', details: 'Move to last character of line.', tags: ['motion', 'line', 'end'] },
      { key: 'g_', description: 'Last non-blank', details: 'Move to last non-whitespace character.', tags: ['motion', 'line', 'end'] },
    ]
  },
  {
    id: 'find-character',
    name: 'Find Character',
    description: 'Jump to characters on current line - extremely powerful',
    commands: [
      { key: 'f{char}', description: 'Find forward (on)', details: 'Jump to next {char}. Cursor lands ON the character.', example: 'f( jumps to next opening paren', tags: ['motion', 'find', 'character'] },
      { key: 'F{char}', description: 'Find backward (on)', details: 'Jump backward to {char}.', tags: ['motion', 'find', 'character', 'backward'] },
      { key: 't{char}', description: 'Till forward (before)', details: 'Jump to just BEFORE {char}. Perfect for ct) to change up to paren.', example: 'ct) changes text up to )', tags: ['motion', 'find', 'character', 'till'] },
      { key: 'T{char}', description: 'Till backward (after)', details: 'Jump backward to just after {char}.', tags: ['motion', 'find', 'character', 'backward'] },
      { key: ';', description: 'Repeat find', details: 'Repeat last f/F/t/T in same direction.', tags: ['motion', 'find', 'repeat'] },
      { key: ',', description: 'Repeat find reverse', details: 'Repeat last f/F/t/T in opposite direction.', tags: ['motion', 'find', 'repeat'] },
    ]
  },
  {
    id: 'file-motions',
    name: 'File Navigation',
    description: 'Move through the entire file',
    commands: [
      { key: 'gg', description: 'Go to first line', details: 'Jump to first line of file.', tags: ['motion', 'file', 'top'] },
      { key: 'G', description: 'Go to last line', details: 'Jump to last line. Use {n}G for line n.', example: '50G goes to line 50', tags: ['motion', 'file', 'bottom'] },
      { key: '{n}G', description: 'Go to line n', details: 'Jump to specific line number.', tags: ['motion', 'file', 'line'] },
      { key: '%', description: 'Matching bracket', details: 'Jump to matching (), [], {}. Essential for code navigation.', example: 'On "(", % jumps to matching ")"', tags: ['motion', 'bracket', 'match'] },
      { key: '{', description: 'Previous paragraph', details: 'Jump to previous blank line. Great for moving between functions.', tags: ['motion', 'paragraph'] },
      { key: '}', description: 'Next paragraph', details: 'Jump to next blank line.', tags: ['motion', 'paragraph'] },
      { key: 'H', description: 'Screen top', details: 'Move to top of visible screen.', tags: ['motion', 'screen'] },
      { key: 'M', description: 'Screen middle', details: 'Move to middle of visible screen.', tags: ['motion', 'screen'] },
      { key: 'L', description: 'Screen bottom', details: 'Move to bottom of visible screen.', tags: ['motion', 'screen'] },
    ]
  },
  {
    id: 'text-objects',
    name: 'Text Objects',
    description: 'Select semantic units - the key to efficient editing',
    commands: [
      { key: 'iw', description: 'Inner word', details: 'The word under cursor, no surrounding space. Use ciw to change word.', example: 'ciw changes word regardless of cursor position', tags: ['text-object', 'word', 'inner'] },
      { key: 'aw', description: 'A word', details: 'Word plus one surrounding space. Use daw for clean deletion.', tags: ['text-object', 'word', 'around'] },
      { key: 'i"', description: 'Inner quotes', details: 'Text inside double quotes. ci" changes string content.', example: '"hello" - ci" lets you replace content', tags: ['text-object', 'quotes', 'inner', 'string'] },
      { key: 'a"', description: 'Around quotes', details: 'Text including the quotes.', tags: ['text-object', 'quotes', 'around', 'string'] },
      { key: "i'", description: 'Inner single quotes', details: 'Text inside single quotes.', tags: ['text-object', 'quotes', 'inner'] },
      { key: 'i`', description: 'Inner backticks', details: 'Text inside backticks. Great for template literals.', tags: ['text-object', 'backtick', 'inner'] },
      { key: 'i)', description: 'Inner parentheses', details: 'Text inside (). Also i( or ib. Critical for function args.', example: 'ci) changes function arguments', tags: ['text-object', 'parentheses', 'inner', 'bracket'] },
      { key: 'a)', description: 'Around parentheses', details: 'Text including (). Also a( or ab.', tags: ['text-object', 'parentheses', 'around', 'bracket'] },
      { key: 'i]', description: 'Inner brackets', details: 'Text inside []. Also i[. Great for array indexing.', example: 'ci] changes array index', tags: ['text-object', 'brackets', 'inner', 'array'] },
      { key: 'a]', description: 'Around brackets', details: 'Text including [].', tags: ['text-object', 'brackets', 'around', 'array'] },
      { key: 'i}', description: 'Inner braces', details: 'Text inside {}. Also i{ or iB. Essential for code blocks.', example: 'ci{ changes object/block contents', tags: ['text-object', 'braces', 'inner', 'block'] },
      { key: 'a}', description: 'Around braces', details: 'Text including {}. Also a{ or aB.', tags: ['text-object', 'braces', 'around', 'block'] },
      { key: 'i>', description: 'Inner angle brackets', details: 'Text inside <>. Useful for generics, HTML.', tags: ['text-object', 'angle', 'inner', 'tag'] },
      { key: 'it', description: 'Inner tag', details: 'Content between HTML/XML tags.', example: '<div>text</div> - cit changes "text"', tags: ['text-object', 'tag', 'inner', 'html'] },
      { key: 'at', description: 'Around tag', details: 'Entire tag including opening and closing.', tags: ['text-object', 'tag', 'around', 'html'] },
      { key: 'ip', description: 'Inner paragraph', details: 'Text block separated by blank lines.', tags: ['text-object', 'paragraph', 'inner'] },
      { key: 'ap', description: 'A paragraph', details: 'Paragraph plus trailing blank line.', tags: ['text-object', 'paragraph', 'around'] },
      { key: 'is', description: 'Inner sentence', details: 'The sentence under cursor.', tags: ['text-object', 'sentence', 'inner'] },
    ]
  },
  {
    id: 'delete',
    name: 'Delete Commands',
    description: 'Remove text (goes to register for pasting)',
    commands: [
      { key: 'x', description: 'Delete character', details: 'Delete char under cursor. 5x deletes 5 chars.', tags: ['delete', 'character'] },
      { key: 'X', description: 'Delete char before', details: 'Delete character before cursor (backspace).', tags: ['delete', 'character'] },
      { key: 'dd', description: 'Delete line', details: 'Delete entire line. 3dd deletes 3 lines.', tags: ['delete', 'line'] },
      { key: 'D', description: 'Delete to line end', details: 'Delete from cursor to end of line. Same as d$.', tags: ['delete', 'line'] },
      { key: 'd{motion}', description: 'Delete with motion', details: 'Delete text covered by motion.', example: 'dw=word, d$=to end, dG=to file end', tags: ['delete', 'motion', 'operator'] },
      { key: 'dw', description: 'Delete word', details: 'Delete to next word start.', tags: ['delete', 'word'] },
      { key: 'diw', description: 'Delete inner word', details: 'Delete word under cursor (any position).', tags: ['delete', 'word', 'text-object'] },
      { key: 'daw', description: 'Delete a word', details: 'Delete word plus surrounding space.', tags: ['delete', 'word', 'text-object'] },
      { key: 'di"', description: 'Delete inside quotes', details: 'Delete text inside quotes, keep quotes.', example: '"hello" becomes ""', tags: ['delete', 'quotes', 'text-object'] },
      { key: 'da"', description: 'Delete around quotes', details: 'Delete text including quotes.', tags: ['delete', 'quotes', 'text-object'] },
      { key: 'di)', description: 'Delete inside parens', details: 'Delete inside (). Also di( or dib.', example: 'func(arg) becomes func()', tags: ['delete', 'parentheses', 'text-object'] },
      { key: 'di{', description: 'Delete inside braces', details: 'Delete inside {}. Also diB.', tags: ['delete', 'braces', 'text-object'] },
      { key: 'dit', description: 'Delete inside tag', details: 'Delete content between HTML tags.', tags: ['delete', 'tag', 'html', 'text-object'] },
      { key: 'd%', description: 'Delete to matching bracket', details: 'With cursor on bracket, delete to match.', tags: ['delete', 'bracket', 'match'] },
      { key: 'dgg', description: 'Delete to file start', details: 'Delete from current line to beginning.', tags: ['delete', 'file'] },
      { key: 'dG', description: 'Delete to file end', details: 'Delete from current line to end.', tags: ['delete', 'file'] },
    ]
  },
  {
    id: 'change',
    name: 'Change Commands',
    description: 'Delete and enter insert mode - the power combo',
    commands: [
      { key: 'c{motion}', description: 'Change with motion', details: 'Delete text and enter insert mode.', example: 'cw=word, c$=to end, c%=to bracket', tags: ['change', 'motion', 'operator'] },
      { key: 'cc', description: 'Change line', details: 'Delete line content (keep indent), enter insert.', tags: ['change', 'line'] },
      { key: 'C', description: 'Change to line end', details: 'Delete to end of line, enter insert. Same as c$.', tags: ['change', 'line'] },
      { key: 'cw', description: 'Change word', details: 'Delete to word end, enter insert.', tags: ['change', 'word'] },
      { key: 'ciw', description: 'Change inner word', details: 'Change entire word regardless of cursor position. The workhorse.', example: 'Cursor anywhere in "variable" - ciw replaces it', tags: ['change', 'word', 'text-object'] },
      { key: 'caw', description: 'Change a word', details: 'Change word plus surrounding space.', tags: ['change', 'word', 'text-object'] },
      { key: 'ci"', description: 'Change inside quotes', details: 'Change string content, keep quotes.', example: '"old" - ci" to type new content', tags: ['change', 'quotes', 'text-object', 'string'] },
      { key: 'ci)', description: 'Change inside parens', details: 'Change function arguments.', example: 'func(old) - ci) to type new args', tags: ['change', 'parentheses', 'text-object'] },
      { key: 'ci{', description: 'Change inside braces', details: 'Change block/object contents.', tags: ['change', 'braces', 'text-object'] },
      { key: 'ci[', description: 'Change inside brackets', details: 'Change array index.', tags: ['change', 'brackets', 'text-object'] },
      { key: 'cit', description: 'Change inside tag', details: 'Change HTML tag content.', example: '<span>old</span> - cit to replace', tags: ['change', 'tag', 'html', 'text-object'] },
      { key: 'ct{char}', description: 'Change till char', details: 'Delete up to (not including) {char}, enter insert.', example: 'ct) changes up to closing paren', tags: ['change', 'find', 'character'] },
      { key: 's', description: 'Substitute char', details: 'Delete character, enter insert. Same as cl.', tags: ['change', 'character', 'substitute'] },
      { key: 'S', description: 'Substitute line', details: 'Delete line content, enter insert. Same as cc.', tags: ['change', 'line', 'substitute'] },
      { key: 'r{char}', description: 'Replace character', details: 'Replace single char without entering insert mode.', example: 'Change "tset" to "test": on "s", press rt', tags: ['change', 'replace', 'character'] },
      { key: 'R', description: 'Replace mode', details: 'Enter replace mode - typing overwrites existing text.', tags: ['change', 'replace', 'mode'] },
    ]
  },
  {
    id: 'yank-paste',
    name: 'Yank & Paste',
    description: 'Copy and paste operations',
    commands: [
      { key: 'y{motion}', description: 'Yank with motion', details: 'Copy text covered by motion.', example: 'yw=word, y$=to end, yG=to file end', tags: ['yank', 'copy', 'motion'] },
      { key: 'yy', description: 'Yank line', details: 'Copy entire line. 3yy copies 3 lines.', tags: ['yank', 'copy', 'line'] },
      { key: 'Y', description: 'Yank line', details: 'Same as yy (traditionally).', tags: ['yank', 'copy', 'line'] },
      { key: 'yiw', description: 'Yank inner word', details: 'Copy word under cursor.', tags: ['yank', 'copy', 'word', 'text-object'] },
      { key: 'yi"', description: 'Yank inside quotes', details: 'Copy text inside quotes.', tags: ['yank', 'copy', 'quotes', 'text-object'] },
      { key: 'yi)', description: 'Yank inside parens', details: 'Copy text inside parentheses.', tags: ['yank', 'copy', 'parentheses', 'text-object'] },
      { key: 'p', description: 'Paste after', details: 'Paste after cursor. For lines, pastes below.', example: 'yy then p duplicates line below', tags: ['paste', 'after'] },
      { key: 'P', description: 'Paste before', details: 'Paste before cursor. For lines, pastes above.', tags: ['paste', 'before'] },
      { key: '"+y', description: 'Yank to clipboard', details: 'Copy to system clipboard.', example: '"+yy copies line to system clipboard', tags: ['yank', 'clipboard', 'system'] },
      { key: '"+p', description: 'Paste from clipboard', details: 'Paste from system clipboard.', tags: ['paste', 'clipboard', 'system'] },
      { key: '"{reg}y', description: 'Yank to register', details: 'Copy to named register (a-z).', example: '"ayy copies line to register a', tags: ['yank', 'register'] },
      { key: '"{reg}p', description: 'Paste from register', details: 'Paste from named register.', example: '"ap pastes from register a', tags: ['paste', 'register'] },
    ]
  },
  {
    id: 'undo-repeat',
    name: 'Undo & Repeat',
    description: 'Undo changes and repeat commands',
    commands: [
      { key: 'u', description: 'Undo', details: 'Undo last change. 5u undoes 5 changes.', tags: ['undo', 'history'] },
      { key: 'Ctrl+r', description: 'Redo', details: 'Redo last undone change.', tags: ['redo', 'history'] },
      { key: '.', description: 'Repeat last change', details: 'Repeat last edit. One of Vim\'s killer features.', example: 'ciw + new text, then . repeats everywhere', tags: ['repeat', 'dot'] },
      { key: 'U', description: 'Undo line', details: 'Undo all changes on current line.', tags: ['undo', 'line'] },
    ]
  },
  {
    id: 'search',
    name: 'Search',
    description: 'Find text in file',
    commands: [
      { key: '/{pattern}', description: 'Search forward', details: 'Search forward. Supports regex. n for next match.', example: '/function finds "function"', tags: ['search', 'forward'] },
      { key: '?{pattern}', description: 'Search backward', details: 'Search backward.', tags: ['search', 'backward'] },
      { key: 'n', description: 'Next match', details: 'Jump to next search result.', tags: ['search', 'next'] },
      { key: 'N', description: 'Previous match', details: 'Jump to previous search result.', tags: ['search', 'previous'] },
      { key: '*', description: 'Search word forward', details: 'Search forward for word under cursor.', tags: ['search', 'word', 'forward'] },
      { key: '#', description: 'Search word backward', details: 'Search backward for word under cursor.', tags: ['search', 'word', 'backward'] },
      { key: 'gd', description: 'Go to definition', details: 'Jump to local definition of word.', tags: ['search', 'definition'] },
      { key: ':noh', description: 'Clear highlight', details: 'Turn off search highlighting.', tags: ['search', 'highlight'] },
    ]
  },
  {
    id: 'substitute',
    name: 'Search & Replace',
    description: 'Find and replace text',
    commands: [
      { key: ':s/old/new/', description: 'Replace first on line', details: 'Replace first occurrence on current line.', tags: ['substitute', 'replace'] },
      { key: ':s/old/new/g', description: 'Replace all on line', details: 'Replace all occurrences on current line.', tags: ['substitute', 'replace'] },
      { key: ':%s/old/new/g', description: 'Replace all in file', details: 'Replace all in entire file.', example: ':%s/var/const/g changes all var to const', tags: ['substitute', 'replace', 'file'] },
      { key: ':%s/old/new/gc', description: 'Replace with confirm', details: 'Replace all with confirmation for each.', tags: ['substitute', 'replace', 'confirm'] },
      { key: ":'<,'>s/old/new/g", description: 'Replace in selection', details: 'Replace in visual selection.', tags: ['substitute', 'replace', 'visual'] },
    ]
  },
  {
    id: 'visual-ops',
    name: 'Visual Mode Ops',
    description: 'Operations on visual selection',
    commands: [
      { key: 'd', description: 'Delete selection', details: 'Delete visually selected text.', tags: ['visual', 'delete'] },
      { key: 'y', description: 'Yank selection', details: 'Copy visually selected text.', tags: ['visual', 'yank'] },
      { key: 'c', description: 'Change selection', details: 'Delete selection and enter insert.', tags: ['visual', 'change'] },
      { key: '>', description: 'Indent', details: 'Shift selection right.', tags: ['visual', 'indent'] },
      { key: '<', description: 'Unindent', details: 'Shift selection left.', tags: ['visual', 'indent'] },
      { key: '=', description: 'Auto-indent', details: 'Auto-indent selection.', tags: ['visual', 'indent', 'format'] },
      { key: 'u', description: 'Lowercase', details: 'Convert selection to lowercase.', tags: ['visual', 'case'] },
      { key: 'U', description: 'Uppercase', details: 'Convert selection to uppercase.', tags: ['visual', 'case'] },
      { key: 'J', description: 'Join lines', details: 'Join selected lines.', tags: ['visual', 'join'] },
      { key: 'o', description: 'Other end', details: 'Move cursor to other end of selection.', tags: ['visual', 'cursor'] },
      { key: 'gv', description: 'Reselect', details: 'Reselect last visual selection.', tags: ['visual', 'reselect'] },
      { key: 'I', description: 'Block insert', details: 'In block mode, insert at start of each line.', example: 'Comment multiple lines with //', tags: ['visual', 'block', 'insert'] },
      { key: 'A', description: 'Block append', details: 'In block mode, append at end of each line.', tags: ['visual', 'block', 'append'] },
    ]
  },
  {
    id: 'indent',
    name: 'Indentation',
    description: 'Adjust code indentation',
    commands: [
      { key: '>>', description: 'Indent line', details: 'Shift line right. 3>> indents 3 lines.', tags: ['indent', 'right'] },
      { key: '<<', description: 'Unindent line', details: 'Shift line left.', tags: ['indent', 'left'] },
      { key: '==', description: 'Auto-indent line', details: 'Auto-indent current line.', tags: ['indent', 'auto'] },
      { key: 'gg=G', description: 'Auto-indent file', details: 'Auto-indent entire file.', tags: ['indent', 'auto', 'file'] },
    ]
  },
  {
    id: 'marks',
    name: 'Marks & Jumps',
    description: 'Bookmarks and jump navigation',
    commands: [
      { key: 'm{a-z}', description: 'Set local mark', details: 'Set mark at cursor. Lowercase = local to file.', example: 'ma sets mark "a"', tags: ['mark', 'bookmark'] },
      { key: 'm{A-Z}', description: 'Set global mark', details: 'Set global mark (works across files).', tags: ['mark', 'bookmark', 'global'] },
      { key: '`{mark}', description: 'Jump to mark', details: 'Jump to exact position of mark.', example: '`a jumps to mark "a"', tags: ['mark', 'jump'] },
      { key: "'{mark}", description: 'Jump to mark line', details: 'Jump to line of mark.', tags: ['mark', 'jump', 'line'] },
      { key: '``', description: 'Previous position', details: 'Jump back to position before last jump.', tags: ['jump', 'previous'] },
      { key: '`.', description: 'Last edit position', details: 'Jump to position of last change.', tags: ['jump', 'edit'] },
      { key: 'Ctrl+o', description: 'Jump back', details: 'Navigate backward through jump history.', tags: ['jump', 'back', 'history'] },
      { key: 'Ctrl+i', description: 'Jump forward', details: 'Navigate forward through jump history.', tags: ['jump', 'forward', 'history'] },
    ]
  },
  {
    id: 'macros',
    name: 'Macros',
    description: 'Record and replay command sequences',
    commands: [
      { key: 'q{a-z}', description: 'Start recording', details: 'Start recording into register. Press q to stop.', example: 'qa starts recording into "a"', tags: ['macro', 'record'] },
      { key: 'q', description: 'Stop recording', details: 'Stop macro recording.', tags: ['macro', 'stop'] },
      { key: '@{a-z}', description: 'Play macro', details: 'Execute macro. 10@a plays 10 times.', example: '@a plays macro in register "a"', tags: ['macro', 'play'] },
      { key: '@@', description: 'Repeat macro', details: 'Replay last executed macro.', tags: ['macro', 'repeat'] },
    ]
  },
  {
    id: 'windows',
    name: 'Windows & Tabs',
    description: 'Split windows and tab management',
    commands: [
      { key: ':sp', description: 'Split horizontal', details: 'Split window horizontally.', tags: ['window', 'split'] },
      { key: ':vsp', description: 'Split vertical', details: 'Split window vertically.', tags: ['window', 'split'] },
      { key: 'Ctrl+w h/j/k/l', description: 'Navigate windows', details: 'Move between windows in direction.', tags: ['window', 'navigate'] },
      { key: 'Ctrl+w c', description: 'Close window', details: 'Close current window.', tags: ['window', 'close'] },
      { key: 'Ctrl+w o', description: 'Only window', details: 'Close all other windows.', tags: ['window', 'close'] },
      { key: ':tabnew', description: 'New tab', details: 'Open new tab.', tags: ['tab', 'new'] },
      { key: 'gt', description: 'Next tab', details: 'Go to next tab.', tags: ['tab', 'navigate'] },
      { key: 'gT', description: 'Previous tab', details: 'Go to previous tab.', tags: ['tab', 'navigate'] },
    ]
  },
  {
    id: 'files',
    name: 'File Operations',
    description: 'Save, open, and manage files',
    commands: [
      { key: ':w', description: 'Save', details: 'Write/save current file.', tags: ['file', 'save'] },
      { key: ':q', description: 'Quit', details: 'Quit. Fails if unsaved changes.', tags: ['file', 'quit'] },
      { key: ':wq', description: 'Save and quit', details: 'Write and quit.', tags: ['file', 'save', 'quit'] },
      { key: ':q!', description: 'Force quit', details: 'Quit without saving.', tags: ['file', 'quit', 'force'] },
      { key: 'ZZ', description: 'Save and quit', details: 'Quick save and quit.', tags: ['file', 'save', 'quit'] },
      { key: ':e {file}', description: 'Open file', details: 'Edit/open a file.', tags: ['file', 'open'] },
      { key: ':e!', description: 'Reload', details: 'Reload file, discard changes.', tags: ['file', 'reload'] },
      { key: ':bn', description: 'Next buffer', details: 'Go to next buffer.', tags: ['buffer', 'navigate'] },
      { key: ':bp', description: 'Previous buffer', details: 'Go to previous buffer.', tags: ['buffer', 'navigate'] },
      { key: ':bd', description: 'Close buffer', details: 'Delete/close buffer.', tags: ['buffer', 'close'] },
    ]
  },
  {
    id: 'scrolling',
    name: 'Scrolling',
    description: 'Control viewport position',
    commands: [
      { key: 'Ctrl+f', description: 'Page down', details: 'Scroll forward one page.', tags: ['scroll', 'page'] },
      { key: 'Ctrl+b', description: 'Page up', details: 'Scroll backward one page.', tags: ['scroll', 'page'] },
      { key: 'Ctrl+d', description: 'Half page down', details: 'Scroll down half page.', tags: ['scroll', 'half'] },
      { key: 'Ctrl+u', description: 'Half page up', details: 'Scroll up half page.', tags: ['scroll', 'half'] },
      { key: 'zz', description: 'Center cursor', details: 'Scroll to center cursor line.', tags: ['scroll', 'center'] },
      { key: 'zt', description: 'Cursor to top', details: 'Scroll to put cursor at top.', tags: ['scroll', 'top'] },
      { key: 'zb', description: 'Cursor to bottom', details: 'Scroll to put cursor at bottom.', tags: ['scroll', 'bottom'] },
    ]
  },
  {
    id: 'misc',
    name: 'Miscellaneous',
    description: 'Other useful commands',
    commands: [
      { key: 'J', description: 'Join lines', details: 'Join current line with next, adding space.', tags: ['join', 'line'] },
      { key: 'gJ', description: 'Join (no space)', details: 'Join lines without adding space.', tags: ['join', 'line'] },
      { key: '~', description: 'Toggle case', details: 'Toggle case of character under cursor.', tags: ['case', 'toggle'] },
      { key: 'gu{motion}', description: 'Lowercase', details: 'Make text lowercase.', example: 'guiw lowercases word', tags: ['case', 'lower'] },
      { key: 'gU{motion}', description: 'Uppercase', details: 'Make text uppercase.', example: 'gUiw uppercases word', tags: ['case', 'upper'] },
      { key: 'Ctrl+a', description: 'Increment number', details: 'Increment number under cursor.', tags: ['number', 'increment'] },
      { key: 'Ctrl+x', description: 'Decrement number', details: 'Decrement number under cursor.', tags: ['number', 'decrement'] },
      { key: ':!{cmd}', description: 'Run shell command', details: 'Execute external command.', example: ':!ls shows files', tags: ['shell', 'command'] },
      { key: 'K', description: 'Help for word', details: 'Look up keyword under cursor.', tags: ['help'] },
    ]
  },
  {
    id: 'folding',
    name: 'Code Folding',
    description: 'Collapse and expand code',
    commands: [
      { key: 'za', description: 'Toggle fold', details: 'Toggle fold open/closed.', tags: ['fold', 'toggle'] },
      { key: 'zo', description: 'Open fold', details: 'Open fold at cursor.', tags: ['fold', 'open'] },
      { key: 'zc', description: 'Close fold', details: 'Close fold at cursor.', tags: ['fold', 'close'] },
      { key: 'zR', description: 'Open all folds', details: 'Open all folds in file.', tags: ['fold', 'open', 'all'] },
      { key: 'zM', description: 'Close all folds', details: 'Close all folds in file.', tags: ['fold', 'close', 'all'] },
    ]
  }
];

export function searchCommands(query: string): { cmd: VimCommand; category: string }[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const results: Array<{ cmd: VimCommand; category: string; score: number }> = [];

  for (const category of cheatsheetData) {
    for (const cmd of category.commands) {
      let score = 0;

      if (cmd.key.toLowerCase() === q) score += 100;
      else if (cmd.key.toLowerCase().includes(q)) score += 50;
      if (cmd.description.toLowerCase().includes(q)) score += 30;
      if (cmd.details.toLowerCase().includes(q)) score += 20;
      if (cmd.tags.some(tag => tag.includes(q))) score += 25;
      if (cmd.example?.toLowerCase().includes(q)) score += 15;

      if (score > 0) {
        results.push({ cmd, category: category.name, score });
      }
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.map(r => ({ cmd: r.cmd, category: r.category }));
}

export function getAllCommands(): { cmd: VimCommand; category: string }[] {
  return cheatsheetData.flatMap(c =>
    c.commands.map(cmd => ({ cmd, category: c.name }))
  );
}
