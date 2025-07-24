import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { GameState, GameAction, Player, Rock } from "@shared/game";

const initialGameState: GameState = {
  gameMode: "menu",
  localPlayer: null,
  otherPlayers: [],
  rocks: [],
  gameSettings: {
    maxHealth: 100,
    rockDamage: 25,
    respawnTime: 3000,
    movementSpeed: 5,
    throwForce: 15,
  },
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "SET_GAME_MODE":
      return { ...state, gameMode: action.payload };

    case "SET_USERNAME":
      if (state.localPlayer) {
        return {
          ...state,
          localPlayer: { ...state.localPlayer, username: action.payload },
        };
      }
      return {
        ...state,
        localPlayer: {
          id: Math.random().toString(36).substr(2, 9),
          username: action.payload,
          position: [0, 2, 0],
          rotation: [0, 0, 0],
          health: state.gameSettings.maxHealth,
          maxHealth: state.gameSettings.maxHealth,
          killStreak: 0,
          isAlive: true,
          lastDamageTime: 0,
        },
      };

    case "UPDATE_PLAYER_POSITION":
      if (!state.localPlayer) return state;
      return {
        ...state,
        localPlayer: {
          ...state.localPlayer,
          position: action.payload.position,
          rotation: action.payload.rotation,
        },
      };

    case "SPAWN_ROCK":
      const newRock: Rock = {
        ...action.payload,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: Date.now(),
      };
      return {
        ...state,
        rocks: [...state.rocks, newRock],
      };

    case "UPDATE_ROCKS":
      return {
        ...state,
        rocks: action.payload,
      };

    case "DAMAGE_PLAYER":
      if (
        !state.localPlayer ||
        state.localPlayer.id !== action.payload.playerId
      )
        return state;

      const newHealth = Math.max(
        0,
        state.localPlayer.health - action.payload.damage,
      );
      const isDead = newHealth <= 0;

      return {
        ...state,
        localPlayer: {
          ...state.localPlayer,
          health: newHealth,
          isAlive: !isDead,
          killStreak: isDead ? 0 : state.localPlayer.killStreak,
          lastDamageTime: Date.now(),
        },
      };

    case "RESPAWN_PLAYER":
      if (!state.localPlayer || state.localPlayer.id !== action.payload)
        return state;

      return {
        ...state,
        localPlayer: {
          ...state.localPlayer,
          health: state.gameSettings.maxHealth,
          isAlive: true,
          position: [Math.random() * 20 - 10, 2, Math.random() * 20 - 10], // Random spawn
        },
      };

    case "UPDATE_SETTINGS":
      return {
        ...state,
        gameSettings: { ...state.gameSettings, ...action.payload },
      };

    default:
      return state;
  }
}

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  actions: {
    setGameMode: (mode: GameState["gameMode"]) => void;
    setUsername: (username: string) => void;
    updatePlayerPosition: (
      position: [number, number, number],
      rotation: [number, number, number],
    ) => void;
    throwRock: (
      position: [number, number, number],
      velocity: [number, number, number],
    ) => void;
    damagePlayer: (
      playerId: string,
      damage: number,
      attackerId: string,
    ) => void;
    respawnPlayer: (playerId: string) => void;
  };
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  // Auto-respawn after death
  useEffect(() => {
    if (state.localPlayer && !state.localPlayer.isAlive) {
      const timer = setTimeout(() => {
        dispatch({ type: "RESPAWN_PLAYER", payload: state.localPlayer!.id });
      }, state.gameSettings.respawnTime);

      return () => clearTimeout(timer);
    }
  }, [state.localPlayer?.isAlive, state.gameSettings.respawnTime]);

  // Clean up old rocks
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const filteredRocks = state.rocks.filter(
        (rock) => now - rock.createdAt < 5000,
      ); // Remove rocks after 5 seconds
      if (filteredRocks.length !== state.rocks.length) {
        dispatch({ type: "UPDATE_ROCKS", payload: filteredRocks });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [state.rocks]);

  const actions = {
    setGameMode: useCallback((mode: GameState["gameMode"]) => {
      dispatch({ type: "SET_GAME_MODE", payload: mode });
    }, []),

    setUsername: useCallback((username: string) => {
      dispatch({ type: "SET_USERNAME", payload: username });
    }, []),

    updatePlayerPosition: useCallback(
      (
        position: [number, number, number],
        rotation: [number, number, number],
      ) => {
        dispatch({
          type: "UPDATE_PLAYER_POSITION",
          payload: { position, rotation },
        });
      },
      [],
    ),

    throwRock: useCallback(
      (
        position: [number, number, number],
        velocity: [number, number, number],
      ) => {
        if (!state.localPlayer) return;
        dispatch({
          type: "SPAWN_ROCK",
          payload: {
            position,
            velocity,
            playerId: state.localPlayer.id,
            damage: state.gameSettings.rockDamage,
          },
        });
      },
      [state.localPlayer, state.gameSettings.rockDamage],
    ),

    damagePlayer: useCallback(
      (playerId: string, damage: number, attackerId: string) => {
        dispatch({
          type: "DAMAGE_PLAYER",
          payload: { playerId, damage, attackerId },
        });
      },
      [],
    ),

    respawnPlayer: useCallback((playerId: string) => {
      dispatch({ type: "RESPAWN_PLAYER", payload: playerId });
    }, []),
  };

  return (
    <GameContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
