import { usePlane } from '@react-three/cannon';
import { Plane } from '@react-three/drei';
import * as THREE from 'three';

export function Terrain() {
  const [ref] = usePlane(() => ({ 
    rotation: [-Math.PI / 2, 0, 0], 
    position: [0, 0, 0],
    type: 'Static'
  }));

  return (
    <>
      {/* Ground plane */}
      <mesh ref={ref} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshLambertMaterial 
          color="#4a5d23" 
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Arena boundaries - walls */}
      <mesh position={[0, 5, -50]} receiveShadow>
        <boxGeometry args={[100, 10, 1]} />
        <meshLambertMaterial color="#6b7280" />
      </mesh>
      
      <mesh position={[0, 5, 50]} receiveShadow>
        <boxGeometry args={[100, 10, 1]} />
        <meshLambertMaterial color="#6b7280" />
      </mesh>
      
      <mesh position={[-50, 5, 0]} receiveShadow>
        <boxGeometry args={[1, 10, 100]} />
        <meshLambertMaterial color="#6b7280" />
      </mesh>
      
      <mesh position={[50, 5, 0]} receiveShadow>
        <boxGeometry args={[1, 10, 100]} />
        <meshLambertMaterial color="#6b7280" />
      </mesh>
      
      {/* Some cover objects */}
      <mesh position={[10, 1.5, 10]} castShadow receiveShadow>
        <boxGeometry args={[3, 3, 3]} />
        <meshLambertMaterial color="#8b5a3c" />
      </mesh>
      
      <mesh position={[-15, 1.5, -8]} castShadow receiveShadow>
        <boxGeometry args={[2, 3, 4]} />
        <meshLambertMaterial color="#8b5a3c" />
      </mesh>
      
      <mesh position={[20, 1, -20]} castShadow receiveShadow>
        <cylinderGeometry args={[2, 2, 2]} />
        <meshLambertMaterial color="#654321" />
      </mesh>
      
      <mesh position={[-25, 1, 15]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 2]} />
        <meshLambertMaterial color="#654321" />
      </mesh>
    </>
  );
}
