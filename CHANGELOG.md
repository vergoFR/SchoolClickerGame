# Changelog

## [v1.1.0] - Current

### Added
- **Native Windows App (source)** — Electron source in `native/` folder. Run `npm install` then `npm run pack` to build `SchoolClicker.exe`. Runs on any fresh Windows install with no npm, Node.js, or Electron required once built
- **Source Code Split** — Separated monolithic `index.html` into `index.html`, `style.css`, and `script.js` for proper project structure
- **Web Single-File Version** — `web/index.html` (CSS and JS inline) for quick browser open with no other files needed
- **Rebirth System** — Reach 1QA (1 quadrillion) score to unlock Rebirth. Resets score and upgrades but grants a permanent +25% bonus per rebirth to passive income and click gains. Rebirth counter and bonus persist across sessions
- **Auto-Save System** — Progress automatically saved to localStorage on every click, every upgrade purchase, every 100ms passive tick, and on page close. Manual Save/Load replaces the auto-save cache so your chosen file becomes the active state

### Fixed
- **NaN Bug (Semi-Fixed)** — Critical Strike upgrade referenced undefined `critMultiplier` instead of `multiplier`, causing `score += perClick * NaN` which permanently poisoned the score. Now correctly reads `data.multiplier`. Added `formatNum` safety net returning `'0'` instead of `'NaN'` string for invalid values

### Changed
- **Background** — Changed from solid blue to animated blue-to-pink diagonal gradient with two cursor-following blobs
- **Title Bar** — Added rebirth counter display and rebirth button (purple gradient, disabled until 1QA score reached)

### Removed
- **Static Gradient** — Old `--bg-gradient` CSS variable removed in favor of animated mesh gradient

## [v1.0.0] - Initial Release

- Core clicker mechanics with per-click and per-second scoring
- 15 upgrades (click, passive, and special types)
- Combo, Critical Strike, Echo Clicks, Momentum, Click Magnet, Synergy Engine, Time Warp systems
- Save/Load via JSON file download
- Liquid glass UI with glassmorphism panels
