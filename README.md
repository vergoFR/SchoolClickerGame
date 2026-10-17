# School Clicker

**Version:** v1.1.0  
**Platform:** Web (browser) + Native Windows (Electron)

A self-contained, offline-first clicker/incremental game with an iOS 26-inspired liquid glass design. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no build step, no external dependencies for the web version.

## Features

- **Click & Idle Mechanics** — Click the big button to score, or let passive upgrades generate points automatically
- **15 Upgrades** across three tiers:
  - **Basic Click** — Improve your per-click score
  - **Passive Upgrades** — Generate points per second (Auto Clicker, Gaming Mouse, Mechanical Keyboard, Click Bot, AI Clicker, Quantum Clicker)
  - **Special Upgrades** — Critical Strike, Combo Master, Echo Clicks, Momentum, Click Magnet, Synergy Engine, Time Warp
- **Synergy Engine** — Owning more upgrades boosts your passive income exponentially
- **Time Warp** — Speeds up game ticks for faster passive generation
- **Combo System** — Rapid clicks build combo multipliers for burst scoring
- **Animated Mesh Gradient** — Blue-to-pink gradient background with two cursor-following blobs that drift and glow
- **Glassmorphism UI** — Frosted glass panels with iOS 26 styling using only `#007AFF` (blue) and `#AF52DE` / `#FF2D92` (purple/pink)
- **Offline-First** — Works entirely offline. No network requests after page load
- **Auto-Save System** — Progress is continuously cached to localStorage (every click, every upgrade purchase, every passive tick, and on page close)
- **Manual Save/Load** — Export your progress to `school-clicker-save.json` and import it later. Manual saves/loads replace the auto-save cache so your chosen file becomes the active state
- **Rebirth System** — When you reach 1QA (1 quadrillion) score, you can Rebirth. This resets score and upgrades but grants a permanent +25% bonus per rebirth to all passive income and click gains. Rebirth counter persists across sessions
- **Cursor-Following Background** — Animated blobs track your mouse cursor precisely

## File Structure

```
SchoolClicker/
├── index.html          # Base web version (references style.css + script.js)
├── style.css           # Extracted CSS (liquid glass styling)
├── script.js           # Extracted JavaScript (game logic)
├── README.md           # This file
├── CHANGELOG.md        # Version history
├── package.json        # Project metadata
├── .gitignore          # Git ignore rules
├── web/
│   └── index.html      # Self-contained single-file version (quick browser open — no other files needed)
└── native/             # Electron Windows app (source only — run `npm install` then `npm run pack` to build)
    ├── main.js         # Electron main process (native window, menu, IPC save/load dialogs)
    ├── preload.js      # Secure context bridge (contextIsolation enabled)
    ├── package.json    # Electron config + build settings
    ├── index.html      # Game UI (references style.css + script.js)
    ├── style.css       # Copy of root style.css
    ├── script.js       # Copy of root script.js
    └── assets/
        └── icon.ico    # App icon
```

## How to Play

1. Open `index.html` in any modern browser (or `web/index.html` for the single-file version)
2. Click the central button to earn points
3. Purchase upgrades from the panels to increase your per-click and per-second rates
4. Reach 1QA score to unlock the **Rebirth** button — rebirth resets your game but grants permanent bonuses
5. Use **Save** to download your progress as a JSON file
6. Use **Load** to restore progress from a previously saved file

## Running Offline

### Web Version
Open `index.html` or `web/index.html` directly in any browser. No server, no npm, no internet needed.

### Native Windows Version
Build from source in the `native/` folder — works on any fresh Windows install with **no npm, no Node.js, and no Electron pre-installed** once built.

```bash
cd native
npm install
npm run pack
```

This produces `dist/SchoolClicker-win32-x64/SchoolClicker.exe` — a standalone executable.

## Colors

- Primary Blue: `#007AFF`
- Primary Purple/Pink: `#AF52DE` / `#FF2D92`
- Gradient: Blue → Pink diagonal

## License

MIT