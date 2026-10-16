# School Clicker

A self-contained, offline-first clicker/incremental game with an iOS 26-inspired liquid glass design. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no build step, no external dependencies.

## Features

- **Click & Idle Mechanics** — Click the big cookie-like button to score, or let passive upgrades generate points automatically
- **15 Upgrades** across three tiers:
  - **Basic Click** — Improve your per-click score
  - **Passive Upgrades** — Generate points per second (Combo Master, Echo Clicks, Momentum, Click Magnet, Synergy Engine, Time Warp)
  - **Special Upgrades** — Critical Strike, Combo Mastery, Elemental Resonance, Chaos Amplification, Temporal Distortion, Gravity Shift, Void Absorption
- **Synergy Engine** — Owning more upgrades boosts your passive income exponentially
- **Time Warp** — Speeds up game ticks for faster passive generation
- **Combo System** — Rapid clicks build combo multipliers for burst scoring
- **Animated Mesh Gradient** — Blue-to-pink gradient background with two cursor-following blobs that drift and glow
- **Glassmorphism UI** — Frosted glass panels with iOS 26 styling using only `#007AFF` (blue) and `#AF52DE`/`#FF2D92` (purple/pink)
- **Offline-First** — Works entirely offline. No network requests after page load
- **File-Based Save/Load** — Export your progress to `school-clicker-save.json` and import it later. No account required, no server needed

## How to Play

1. Open `index.html` in any modern browser
2. Click the central button to earn points
3. Purchase upgrades from the panels to increase your per-click and per-second rates
4. Use **Save** to download your progress as a JSON file
5. Use **Load** to restore progress from a previously saved file

## Colors

- Primary Blue: `#007AFF`
- Primary Purple/Pink: `#AF52DE` / `#FF2D92`
- Gradient: Blue → Pink diagonal

## File Structure

```
school-clicker/
├── index.html    # Complete game (HTML + CSS + JS in one file)
└── README.md
```

## Running Offline

The game runs entirely in the browser with no server required:

```bash
# Option 1: Open directly
open index.html

# Option 2: Serve locally (optional)
python3 -m http.server 8000
# Then visit http://localhost:8000
```

No `npm install`, no bundler, no API keys needed.

## Save Format

Save files are standard JSON:

```json
{
  "score": 1234567,
  "perClick": 100,
  "perSecond": 5000,
  "totalClicks": 500,
  "lastClickTime": 1700000000000,
  "comboCounter": 0,
  "upgrades": { ... }
}
```

## License

MIT