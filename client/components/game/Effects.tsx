import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh } from "three";
import { useGame } from "@/hooks/use-game";

export function DamageEffect({
  position,
}: {
  position: [number, number, number];
}) {
  const meshRef = useRef<Mesh>(null);
  const startTime = useRef(Date.now());

  useFrame(() => {
    if (meshRef.current) {
      const elapsed = Date.now() - startTime.current;
      const progress = elapsed / 1000; // 1 second duration

      if (progress < 1) {
        meshRef.current.position.y = position[1] + progress * 2;
        meshRef.current.material.opacity = Math.max(0, 1 - progress);
        meshRef.current.scale.setScalar(1 + progress * 0.5);
      } else {
        meshRef.current.visible = false;
      }
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.1]} />
      <meshBasicMaterial color="#ff0000" transparent />
    </mesh>
  );
}

export function HitEffect({
  position,
}: {
  position: [number, number, number];
}) {
  const meshRef = useRef<Mesh>(null);
  const startTime = useRef(Date.now());

  useFrame(() => {
    if (meshRef.current) {
      const elapsed = Date.now() - startTime.current;
      const progress = elapsed / 500; // 0.5 second duration

      if (progress < 1) {
        meshRef.current.material.opacity = Math.max(0, 1 - progress);
        meshRef.current.scale.setScalar(progress * 3);
      } else {
        meshRef.current.visible = false;
      }
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <ringGeometry args={[0.5, 1, 16]} />
      <meshBasicMaterial color="#ffff00" transparent side={2} />
    </mesh>
  );
}

export function HealthPulse() {
  const { state } = useGame();
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current && state.localPlayer) {
      const healthPercent =
        state.localPlayer.health / state.localPlayer.maxHealth;

      if (healthPercent < 0.3) {
        // Pulse red when low health
        const pulse = Math.sin(Date.now() * 0.01) * 0.5 + 0.5;
        meshRef.current.material.opacity = pulse * 0.3;
      } else {
        meshRef.current.material.opacity = 0;
      }
    }
  });

  if (!state.localPlayer?.isAlive) return null;

  return (
    <mesh ref={meshRef} position={[0, 0, -1]}>
      <planeGeometry args={[20, 20]} />
      <meshBasicMaterial color="#ff0000" transparent />
    </mesh>
  );
}
