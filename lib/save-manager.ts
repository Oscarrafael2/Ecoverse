export interface SaveData {
  biome: string;
  gameState: any;
  timestamp: number;
  difficultyLevel: number;
}

export class SaveManager {
  private static SAVE_KEY = 'ecoverse_save';

  static saveGame(biome: string, gameState: any, difficultyLevel: number): boolean {
    if (typeof window === 'undefined') return false;

    try {
      const saveData: SaveData = {
        biome,
        gameState,
        timestamp: Date.now(),
        difficultyLevel,
      };

      localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
      return true;
    } catch (error) {
      console.error('Error saving game:', error);
      return false;
    }
  }

  static loadGame(): SaveData | null {
    if (typeof window === 'undefined') return null;

    try {
      const saved = localStorage.getItem(this.SAVE_KEY);
      if (!saved) return null;

      const saveData: SaveData = JSON.parse(saved);
      return saveData;
    } catch (error) {
      console.error('Error loading game:', error);
      return null;
    }
  }

  static hasSave(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(this.SAVE_KEY) !== null;
  }

  static deleteSave(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.SAVE_KEY);
  }

  static getLastSaveDate(): Date | null {
    const saveData = this.loadGame();
    return saveData ? new Date(saveData.timestamp) : null;
  }
}
