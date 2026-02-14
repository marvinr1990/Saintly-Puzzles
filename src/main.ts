import './style.css'
import type { LevelData } from './assets';

type TimerMode = 'none' | 'stopwatch' | 'countdown';

// Background is now handled purely via CSS - see #bg-layer in style.css
// This avoids canvas clearing/redraw issues that caused flickering.

// We use an async function with dynamic imports to catch loading errors
(async () => {
  try {
    const appEl = document.querySelector<HTMLDivElement>('#app');
    if (!appEl) throw new Error('App element not found');
    const app = appEl;

    const { PuzzleGame } = await import('./PuzzleGame');
    const { LEVELS, LEVEL_ORDER } = await import('./assets');

    let currentGame: InstanceType<typeof PuzzleGame> | null = null;
    let selectedDifficulty: number = 3;
    let timerInterval: number | null = null;

    const difficultyLabel = (d: number) => d === 3 ? 'Easy' : d === 4 ? 'Medium' : 'Hard';
    const difficultyGrid = (d: number) => d === 3 ? '3 x 3' : d === 4 ? '4 x 4' : '5 x 5';

    // Countdown time limits per difficulty (in seconds)
    const countdownTime = (d: number) => d === 3 ? 120 : d === 4 ? 300 : 600;

    function formatTime(seconds: number): string {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}:${s.toString().padStart(2, '0')}`;
    }

    function clearTimer() {
      if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }

    // --- Screen: Welcome ---
    function showWelcome() {
      clearTimer();
      app.innerHTML = `
        <div class="container">
          <div class="welcome-screen">
            <h1 class="welcome-title">Saintly Sliding Puzzles</h1>
            <p class="welcome-subtitle">Restore the Icons</p>
            <div class="welcome-cross">+</div>
            <p class="welcome-desc">Slide the tiles to reveal sacred images of Christ, Our Lady, and the Saints.</p>
            <button class="btn-primary" id="btn-start">Begin</button>
          </div>
        </div>
      `;
      document.getElementById('btn-start')!.addEventListener('click', showDifficultySelect);
    }

    // --- Screen: Difficulty ---
    function showDifficultySelect() {
      clearTimer();
      const difficulties = [
        { value: 3, label: 'Easy', desc: '3 x 3 grid' },
        { value: 4, label: 'Medium', desc: '4 x 4 grid' },
        { value: 5, label: 'Hard', desc: '5 x 5 grid' },
      ];

      app.innerHTML = `
        <div class="container">
          <header>
            <h1>Choose Difficulty</h1>
            <p class="welcome-subtitle">How many tiles?</p>
          </header>
          <div class="difficulty-grid">
            ${difficulties.map(d => `
              <button class="difficulty-card" data-diff="${d.value}">
                <span class="difficulty-label">${d.label}</span>
                <span class="difficulty-desc">${d.desc}</span>
              </button>
            `).join('')}
          </div>
          <button class="btn-back" id="btn-back-welcome">Back</button>
        </div>
      `;

      document.querySelectorAll<HTMLButtonElement>('.difficulty-card').forEach(btn => {
        btn.addEventListener('click', () => {
          selectedDifficulty = parseInt(btn.dataset.diff!);
          showImageSelect();
        });
      });
      document.getElementById('btn-back-welcome')!.addEventListener('click', showWelcome);
    }

    // --- Screen: Image Select ---
    function showImageSelect() {
      clearTimer();
      // Show all icons regardless of difficulty; the selected difficulty overrides the level's default
      const levelsToShow = LEVEL_ORDER.filter(id => LEVELS[id]);

      app.innerHTML = `
        <div class="container">
          <header>
            <h1>Choose an Icon</h1>
            <p class="welcome-subtitle">${difficultyLabel(selectedDifficulty)} — ${difficultyGrid(selectedDifficulty)}</p>
          </header>
          <div class="image-grid">
            ${levelsToShow.map(id => {
              const level = LEVELS[id];
              return `
                <button class="image-card" data-id="${id}">
                  <div class="image-card-thumb"><img src="${level.imageUrl.replace('/icons/', '/icons/thumbs/')}" alt="${level.name}" loading="lazy"></div>
                  <div class="image-card-info">
                    <span class="image-card-name">${level.name}</span>
                    <p class="image-card-about">${level.about}</p>
                  </div>
                </button>`;
            }).join('')}
          </div>
          <button class="btn-back" id="btn-back-diff">Back</button>
        </div>
      `;

      document.querySelectorAll<HTMLButtonElement>('.image-card').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id!;
          const level = LEVELS[id];
          showTimerSelect({ ...level, difficulty: selectedDifficulty });
        });
      });
      document.getElementById('btn-back-diff')!.addEventListener('click', showDifficultySelect);
    }

    // --- Screen: Timer Select ---
    function showTimerSelect(level: LevelData) {
      const limit = countdownTime(level.difficulty);

      app.innerHTML = `
        <div class="container">
          <header>
            <h1>${level.name}</h1>
            <p class="welcome-subtitle">${difficultyLabel(level.difficulty)} — ${difficultyGrid(level.difficulty)}</p>
          </header>
          <p class="timer-prompt">Would you like to be timed?</p>
          <div class="difficulty-grid">
            <button class="difficulty-card" data-mode="none">
              <span class="difficulty-label">No Timer</span>
              <span class="difficulty-desc">Play at your own pace</span>
            </button>
            <button class="difficulty-card" data-mode="stopwatch">
              <span class="difficulty-label">Stopwatch</span>
              <span class="difficulty-desc">Track your time</span>
            </button>
            <button class="difficulty-card" data-mode="countdown">
              <span class="difficulty-label">Countdown</span>
              <span class="difficulty-desc">${formatTime(limit)} to solve</span>
            </button>
          </div>
          <button class="btn-back" id="btn-back-image">Back</button>
        </div>
      `;

      document.querySelectorAll<HTMLButtonElement>('.difficulty-card').forEach(btn => {
        btn.addEventListener('click', () => {
          showPuzzle(level, btn.dataset.mode as TimerMode);
        });
      });
      document.getElementById('btn-back-image')!.addEventListener('click', showImageSelect);
    }

    // --- Screen: Puzzle ---
    function showPuzzle(level: LevelData, timerMode: TimerMode) {
      clearTimer();
      let elapsed = 0;
      let remaining = countdownTime(level.difficulty);
      let puzzleSolved = false;
      let gameOver = false;

      const timerHTML = timerMode !== 'none'
        ? `<div class="timer-display" id="timer">${timerMode === 'stopwatch' ? '0:00' : formatTime(remaining)}</div>`
        : '';

      app.innerHTML = `
        <div class="container">
          <header>
            <h1>${level.name}</h1>
            <p class="welcome-subtitle">${difficultyLabel(level.difficulty)} — ${difficultyGrid(level.difficulty)}</p>
          </header>

          ${timerHTML}

          <div class="controls">
            <button id="shuffle-btn">Shuffle</button>
            <button id="btn-back-select" class="btn-back-inline">Change Icon</button>
          </div>

          <div id="game-board" class="board"></div>
          
          <div id="message-area" class="message hidden"></div>
          <div id="gameover-overlay" class="gameover-overlay hidden"></div>
        </div>
      `;

      const boardEl = document.getElementById('game-board') as HTMLElement;
      const messageEl = document.getElementById('message-area') as HTMLElement;
      const shuffleBtn = document.getElementById('shuffle-btn') as HTMLButtonElement;
      const timerEl = document.getElementById('timer');
      const gameoverEl = document.getElementById('gameover-overlay') as HTMLElement;

      // Start timer
      if (timerMode !== 'none' && timerEl) {
        timerInterval = window.setInterval(() => {
          if (puzzleSolved || gameOver) return;

          if (timerMode === 'stopwatch') {
            elapsed++;
            timerEl.textContent = formatTime(elapsed);
          } else {
            remaining--;
            timerEl.textContent = formatTime(remaining);

            // Warning state when low on time
            if (remaining <= 30) {
              timerEl.classList.add('timer-warning');
            }
            if (remaining <= 10) {
              timerEl.classList.add('timer-critical');
            }

            if (remaining <= 0) {
              gameOver = true;
              clearTimer();
              timerEl.textContent = '0:00';
              showGameOver();
            }
          }
        }, 1000);
      }

      function showGameOver() {
        gameoverEl.innerHTML = `
          <div class="gameover-content">
            <h2 class="gameover-title">Time's Up</h2>
            <p class="gameover-text">The image remains hidden. Perhaps try again with more time, or at an easier difficulty.</p>
            <div class="message-actions">
              <button id="btn-retry" class="btn-primary">Try Again</button>
              <button id="btn-go-back" class="btn-back-inline">Choose Another Icon</button>
            </div>
          </div>
        `;
        gameoverEl.classList.remove('hidden');
        gameoverEl.classList.add('visible');

        document.getElementById('btn-retry')!.addEventListener('click', () => {
          showPuzzle(level, timerMode);
        });
        document.getElementById('btn-go-back')!.addEventListener('click', showImageSelect);
      }

      currentGame = new PuzzleGame(boardEl, (payload) => {
        puzzleSolved = true;
        clearTimer();

        const timeMsg = timerMode === 'stopwatch'
          ? `<p class="message-time">Completed in ${formatTime(elapsed)}</p>`
          : timerMode === 'countdown'
            ? `<p class="message-time">Completed with ${formatTime(remaining)} remaining</p>`
            : '';

        messageEl.innerHTML = `
          <div class="message-inner">
            <h2 class="message-title">${payload.name}</h2>
            ${timeMsg}
            <p class="message-about">${payload.about}</p>
            <blockquote class="message-quote">${payload.quote}</blockquote>
            ${payload.prayer ? `<div class="message-prayer"><strong>Prayer</strong><p>${payload.prayer}</p></div>` : ''}
            <div class="message-actions">
              <button id="btn-play-again" class="btn-primary">Play Again</button>
              <button id="btn-new-icon" class="btn-back-inline">Choose Another Icon</button>
            </div>
          </div>`;
        messageEl.classList.remove('hidden');
        messageEl.classList.add('visible');

        document.getElementById('btn-play-again')!.addEventListener('click', () => {
          showPuzzle(level, timerMode);
        });
        document.getElementById('btn-new-icon')!.addEventListener('click', showImageSelect);
      });

      currentGame.loadLevel(level);
      currentGame.shuffle();

      shuffleBtn.addEventListener('click', () => {
        if (gameOver) return;
        messageEl.classList.add('hidden');
        messageEl.classList.remove('visible');
        currentGame?.shuffle();
      });

      document.getElementById('btn-back-select')!.addEventListener('click', () => {
        clearTimer();
        showImageSelect();
      });
    }

    // Start the app
    showWelcome();

  } catch (e) {
    console.error('Game failed to start:', e);
    document.body.innerHTML = `
      <div style="color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 20px; margin: 20px; border-radius: 5px; font-family: sans-serif;">
        <h2 style="margin-top:0">Deo Gratias, we found the error:</h2>
        <p>The game script could not load. This usually means a file is missing.</p>
        <pre style="background: rgba(255,255,255,0.5); padding: 10px;">${e instanceof Error ? e.message : String(e)}</pre>
      </div>
    `;
  }
})();
