export interface Player {
  id: string;
  username: string;
  position: [number, number, number];
  rotation: [number, number, number];
  health: number;
  maxHealth: number;
  killStreak: number;
  isAlive: boolean;
  lastDamageTime: number;
}

export interface Rock {
  id: string;
  position: [number, number, number];
  velocity: [number, number, number];
  playerId: string;
  damage: number;
  createdAt: number;
}

export interface GameState {
  gameMode: 'menu' | 'lobby' | 'playing' | 'paused';
  localPlayer: Player | null;
  otherPlayers: Player[];
  rocks: Rock[];
  gameSettings: {
    maxHealth: number;
    rockDamage: number;
    respawnTime: number;
    movementSpeed: number;
    throwForce: number;
  };
}

export interface GameStats {
  totalKills: number;
  totalDeaths: number;
  bestKillStreak: number;
  gamesPlayed: number;
}

export type GameAction = 
  | { type: 'SET_GAME_MODE'; payload: GameState['gameMode'] }
  | { type: 'SET_USERNAME'; payload: string }
  | { type: 'UPDATE_PLAYER_POSITION'; payload: { position: [number, number, number]; rotation: [number, number, number] } }
  | { type: 'SPAWN_ROCK'; payload: Omit<Rock, 'id' | 'createdAt'> }
  | { type: 'UPDATE_ROCKS'; payload: Rock[] }
  | { type: 'DAMAGE_PLAYER'; payload: { playerId: string; damage: number; attackerId: string } }
  | { type: 'RESPAWN_PLAYER'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<GameState['gameSettings']> };
