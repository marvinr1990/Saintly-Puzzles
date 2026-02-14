import type { LevelData } from './assets';

export interface WinPayload {
  name: string;
  quote: string;
  about: string;
  prayer?: string;
}

export class PuzzleGame {
  private static readonly MAX_SIZE = 400;

  private boardEl: HTMLElement;
  private tiles: number[] = [];
  private gridSize: number = 3;
  private emptyIndex: number = 0;
  private isSolved: boolean = false;
  private onWin: (payload: WinPayload) => void;
  private currentLevel: LevelData | null = null;

  // Actual board dimensions (adapts to image aspect ratio)
  private boardWidth: number = PuzzleGame.MAX_SIZE;
  private boardHeight: number = PuzzleGame.MAX_SIZE;

  constructor(boardElement: HTMLElement, onWinCallback: (payload: WinPayload) => void) {
    this.boardEl = boardElement;
    this.onWin = onWinCallback;
  }

  public loadLevel(level: LevelData) {
    this.currentLevel = level;
    this.gridSize = level.difficulty;
    this.isSolved = false;
    
    // Initialize grid (0 to N-1)
    // The last index is the "empty" tile
    this.tiles = Array.from({ length: this.gridSize * this.gridSize }, (_, i) => i);
    this.emptyIndex = this.tiles.length - 1;

    // Default to square while waiting for image
    this.boardWidth = PuzzleGame.MAX_SIZE;
    this.boardHeight = PuzzleGame.MAX_SIZE;
    this.applyBoardSize();
    this.setupGridCSS();
    this.render();

    // Preload image to get its natural aspect ratio, then resize board
    const img = new Image();
    const applyImageSize = () => {
      if (!img.naturalWidth || !img.naturalHeight) return;
      const M = PuzzleGame.MAX_SIZE;
      const ratio = img.naturalWidth / img.naturalHeight;
      if (ratio >= 1) {
        this.boardWidth = M;
        this.boardHeight = Math.round(M / ratio);
      } else {
        this.boardHeight = M;
        this.boardWidth = Math.round(M * ratio);
      }
      this.applyBoardSize();
      this.setupGridCSS();
      this.render();
    };
    img.onload = applyImageSize;
    img.src = level.imageUrl;
    // Handle already-cached images
    if (img.complete && img.naturalWidth) {
      applyImageSize();
    }
  }

  private applyBoardSize() {
    this.boardEl.style.width = `${this.boardWidth}px`;
    this.boardEl.style.height = `${this.boardHeight}px`;
  }

  public shuffle() {
    if (!this.currentLevel) return;
    
    // Simulate random valid moves to shuffle (ensures solvability)
    let previousIndex = -1;
    const shuffleMoves = 150;

    for (let i = 0; i < shuffleMoves; i++) {
      const neighbors = this.getNeighbors(this.emptyIndex);
      // Avoid moving the piece we just moved
      const validNeighbors = neighbors.filter(n => n !== previousIndex);
      
      const randomNeighbor = validNeighbors[Math.floor(Math.random() * validNeighbors.length)];
      
      this.swap(this.emptyIndex, randomNeighbor);
      previousIndex = this.emptyIndex;
      this.emptyIndex = randomNeighbor;
    }
    
    this.isSolved = false;
    this.render();
  }

  private setupGridCSS() {
    this.boardEl.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
    this.boardEl.style.gridTemplateRows = `repeat(${this.gridSize}, 1fr)`;
  }

  private getNeighbors(index: number): number[] {
    const neighbors: number[] = [];
    const row = Math.floor(index / this.gridSize);
    const col = index % this.gridSize;

    if (row > 0) neighbors.push(index - this.gridSize); // Up
    if (row < this.gridSize - 1) neighbors.push(index + this.gridSize); // Down
    if (col > 0) neighbors.push(index - 1); // Left
    if (col < this.gridSize - 1) neighbors.push(index + 1); // Right

    return neighbors;
  }

  private swap(i: number, j: number) {
    [this.tiles[i], this.tiles[j]] = [this.tiles[j], this.tiles[i]];
  }

  private handleTileClick(visualIndex: number) {
    if (this.isSolved) return;

    const neighbors = this.getNeighbors(this.emptyIndex);

    if (neighbors.includes(visualIndex)) {
      this.swap(visualIndex, this.emptyIndex);
      this.emptyIndex = visualIndex;
      this.render();
      this.checkWin();
    }
  }

  private checkWin() {
    const won = this.tiles.every((val, index) => val === index);
    if (won && this.currentLevel) {
      this.isSolved = true;
      this.render(true); // Render full image
      this.onWin({
        name: this.currentLevel.name,
        quote: this.currentLevel.winQuote,
        about: this.currentLevel.about,
        prayer: this.currentLevel.prayer
      });
    }
  }

  private render(showFull: boolean = false) {
    this.boardEl.innerHTML = '';
    const n = this.gridSize;

    // Use percentage-based sizing so tile slicing is always correct
    // regardless of actual rendered pixel dimensions.
    // background-size of N*100% makes the full image N times larger than each tile,
    // so each tile shows exactly 1/N of the image in each axis.
    const bgSize = `${n * 100}% ${n * 100}%`;

    this.tiles.forEach((tileValue, visualIndex) => {
      const tile = document.createElement('div');
      tile.className = 'tile';

      const isEmptyTile = tileValue === (n * n) - 1;

      if (isEmptyTile && !showFull) {
        tile.classList.add('empty');
      } else {
        const originalRow = Math.floor(tileValue / n);
        const originalCol = tileValue % n;

        // Percentage position: 0% is left/top edge, 100% is right/bottom edge
        const percentX = n > 1 ? (originalCol / (n - 1)) * 100 : 0;
        const percentY = n > 1 ? (originalRow / (n - 1)) * 100 : 0;

        tile.style.backgroundImage = `url('${this.currentLevel?.imageUrl}')`;
        tile.style.backgroundSize = bgSize;
        tile.style.backgroundPosition = `${percentX}% ${percentY}%`;
      }

      tile.onclick = () => this.handleTileClick(visualIndex);
      this.boardEl.appendChild(tile);
    });
  }
}
