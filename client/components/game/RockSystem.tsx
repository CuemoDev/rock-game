import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSphere } from '@react-three/cannon';
import { useGame } from '@/hooks/use-game';
import { Vector3 } from 'three';
import * as THREE from 'three';

function Rock({ rock, onCollision }: { rock: any, onCollision: (rockId: string, position: [number, number, number]) => void }) {
  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: rock.position,
    args: [0.2]
  }));

  const position = useRef(rock.position);

  useEffect(() => {
    api.velocity.set(...rock.velocity);
    api.position.subscribe((p) => position.current = p);
  }, [api, rock.velocity]);

  useEffect(() => {
    const unsubscribe = api.collisions.subscribe((e) => {
      if (e.contact) {
        onCollision(rock.id, position.current);
      }
    });
    return unsubscribe;
  }, [api, rock.id, onCollision]);

  // Remove rock if it falls too low or goes too far
  useFrame(() => {
    if (position.current[1] < -10 || 
        Math.abs(position.current[0]) > 60 || 
        Math.abs(position.current[2]) > 60) {
      // Rock is out of bounds, it will be cleaned up by the game state
    }
  });

  return (
    <group>
      <mesh ref={ref} castShadow>
        <sphereGeometry args={[0.2]} />
        <meshStandardMaterial
          color="#2a2a2a"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Trail effect */}
      <mesh position={[0, 0, 0.2]}>
        <sphereGeometry args={[0.05]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

export function RockSystem() {
  const { state, actions } = useGame();

  const handleRockCollision = (rockId: string, position: [number, number, number]) => {
    // Check collision with player
    if (state.localPlayer?.isAlive) {
      const playerPos = new Vector3(...state.localPlayer.position);
      const rockPos = new Vector3(...position);
      const distance = playerPos.distanceTo(rockPos);
      
      if (distance < 1.5) { // Hit radius
        const rock = state.rocks.find(r => r.id === rockId);
        if (rock && rock.playerId !== state.localPlayer.id) {
          // Player was hit by someone else's rock
          actions.damagePlayer(state.localPlayer.id, rock.damage, rock.playerId);
          
          // Remove the rock that hit
          const updatedRocks = state.rocks.filter(r => r.id !== rockId);
          actions.dispatch({ type: 'UPDATE_ROCKS', payload: updatedRocks });
        }
      }
    }
  };

  return (
    <>
      {state.rocks.map(rock => (
        <Rock 
          key={rock.id} 
          rock={rock} 
          onCollision={handleRockCollision}
        />
      ))}
    </>
  );
}
