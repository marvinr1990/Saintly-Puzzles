# Saintly Puzzles

A Catholic-themed sliding tile puzzle game built for a game jam. Restore sacred icons of Christ, the Blessed Virgin Mary, and the Saints by sliding tiles into the correct order.

## Features

- **11 sacred images** — Saints, Our Lady, and Christ, each with a unique icon to restore
- **3 difficulty levels** — Easy (3x3), Medium (4x4), and Hard (5x5)
- **Timer options** — Play at your own pace, race a stopwatch, or beat the countdown
- **Learn as you play** — Browse short biographies when selecting a puzzle; completing one reveals a quote and a traditional prayer (intercession prayers for saints, the Hail Mary for Our Lady)
- **Reverent design** — Dark theme with a stained glass background, warm gold accents, and serif typography

## Puzzles

| Icon | Category |
|------|----------|
| St. Francis of Assisi | Saint |
| St. Peter the Apostle | Saint |
| St. Paul the Apostle | Saint |
| St. Michael the Archangel | Saint |
| St. John the Baptist | Saint |
| St. Ignatius of Antioch | Saint |
| St. Joseph | Saint |
| St. Thomas Aquinas | Saint |
| The Virgin Mary | Mary |
| Our Lady of Guadalupe | Mary |
| Jesus Christ (Pantocrator) | Christ |

## Getting Started

### 1. Install Node.js

The game requires **Node.js v18 or later**. Download it from [nodejs.org](https://nodejs.org/) and follow the installer for your platform:

| Platform | How to install |
|----------|---------------|
| **macOS** | Download the `.pkg` installer from [nodejs.org](https://nodejs.org/), or use Homebrew: `brew install node` |
| **Windows** | Download the `.msi` installer from [nodejs.org](https://nodejs.org/) and run it. Make sure "Add to PATH" is checked during setup. |
| **Linux** | Use your package manager (e.g. `sudo apt install nodejs npm` on Ubuntu/Debian, `sudo dnf install nodejs` on Fedora), or install via [nvm](https://github.com/nvm-sh/nvm): `nvm install --lts` |

To verify the installation, open a terminal and run:

```bash
node --version
```

You should see `v18.x.x` or higher.

### 2. Clone the Repository

Open a terminal and run:

```bash
git clone https://github.com/marvinr1990/saintly-puzzles.git
cd saintly-puzzles
```

### 3. Install Dependencies & Run

```bash
npm install
npm run dev
```

The terminal will print a local URL (usually `http://localhost:5173`). Open that link in your browser to play.

### 4. Build for Production (Optional)

To create an optimized build you can deploy to any static hosting service:

```bash
npm run build
npm run preview   # preview the production build locally
```

The output is written to the `dist/` folder.

## Tech Stack

- **TypeScript** — Type-safe game logic
- **Vite** — Fast dev server and production bundler
- **Vanilla DOM** — No framework; lightweight and portable

## Project Structure

```
├── public/
│   └── icons/          # Puzzle images and stained glass background
├── src/
│   ├── assets.ts       # Puzzle metadata (names, quotes, bios, prayers)
│   ├── PuzzleGame.ts   # Core sliding puzzle engine
│   ├── main.ts         # UI screens and game flow
│   └── style.css       # Dark reverent theme
├── index.html
├── package.json
└── vite.config.ts
```

## License

MIT — see [LICENSE](LICENSE) for details.
