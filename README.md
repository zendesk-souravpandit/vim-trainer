# Vim Trainer

An interactive web app to build muscle memory for Vim motions and commands. Perfect for developers transitioning from IDE-based editors to Neovim.

## Features

- **Motion Practice** - Learn navigation with h/j/k/l, word motions (w/b/e), line motions (0/^/$), and find commands (f/t)
- **Command Drills** - Practice delete, change, yank, and paste operations with text objects
- **Timed Challenges** - Test your skills under pressure with real editing scenarios
- **Searchable Cheat Sheet** - 150+ Vim commands with detailed explanations, searchable and filterable by category

## Tech Stack

- TypeScript
- Vite
- Vanilla CSS

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `n` | Next exercise |
| `H` | Toggle hint |
| `?` | Open cheat sheet |
| `Esc` | Return to trainer / Exit insert mode |

## Exercises

### Motions
- Basic: h, j, k, l
- Words: w, W, b, B, e, E
- Lines: 0, ^, $, g_
- File: gg, G
- Find: f, F, t, T, ;, ,

### Commands
- Delete: x, dd, D, dw, diw, daw, di", da(
- Change: c, cc, C, cw, ciw, ci"
- Yank/Put: y, yy, p, P, yiw, yi"
- Replace: r
- Join: J

### Text Objects
- Words: iw, aw
- Quotes: i", a", i', a'
- Brackets: i(, a(, i[, a[, i{, a{
- Tags: it, at

## License

MIT
