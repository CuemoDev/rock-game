import { usePlane } from "@react-three/cannon";
import { Plane } from "@react-three/drei";
import * as THREE from "three";

export function Terrain() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    type: "Static",
  }));

  return (
    <>
      {/* Ground plane with grass texture effect */}
      <mesh ref={ref} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          color="#2d5016"
          roughness={0.8}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Arena boundaries - walls with better materials */}
      <mesh position={[0, 5, -50]} receiveShadow castShadow>
        <boxGeometry args={[100, 10, 1]} />
        <meshStandardMaterial color="#4a5568" roughness={0.9} metalness={0.1} />
      </mesh>

      <mesh position={[0, 5, 50]} receiveShadow castShadow>
        <boxGeometry args={[100, 10, 1]} />
        <meshStandardMaterial color="#4a5568" roughness={0.9} metalness={0.1} />
      </mesh>

      <mesh position={[-50, 5, 0]} receiveShadow castShadow>
        <boxGeometry args={[1, 10, 100]} />
        <meshStandardMaterial color="#4a5568" roughness={0.9} metalness={0.1} />
      </mesh>

      <mesh position={[50, 5, 0]} receiveShadow castShadow>
        <boxGeometry args={[1, 10, 100]} />
        <meshStandardMaterial color="#4a5568" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Enhanced cover objects */}
      <mesh position={[10, 1.5, 10]} castShadow receiveShadow>
        <boxGeometry args={[3, 3, 3]} />
        <meshStandardMaterial color="#8b4513" roughness={0.8} metalness={0.2} />
      </mesh>

      <mesh position={[-15, 1.5, -8]} castShadow receiveShadow>
        <boxGeometry args={[2, 3, 4]} />
        <meshStandardMaterial color="#a0522d" roughness={0.7} metalness={0.1} />
      </mesh>

      <mesh position={[20, 1, -20]} castShadow receiveShadow>
        <cylinderGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#654321" roughness={0.9} metalness={0.1} />
      </mesh>

      <mesh position={[-25, 1, 15]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 2]} />
        <meshStandardMaterial color="#8b6914" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Additional decorative elements */}
      <mesh position={[0, 0.5, 0]} receiveShadow>
        <cylinderGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#696969" roughness={0.6} metalness={0.4} />
      </mesh>
    </>
  );
}
