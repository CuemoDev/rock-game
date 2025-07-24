import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Sky, Plane } from '@react-three/drei';
import { Suspense } from 'react';
import { Vector3 } from 'three';
import { Physics } from '@react-three/cannon';
import { Player } from './game/Player';
import { Terrain } from './game/Terrain';
import { GameUI } from './game/GameUI';
import { RockSystem } from './game/RockSystem';

export function GameWorld() {
  return (
    <div className="w-full h-screen relative">
      <Canvas
        camera={{ 
          position: [0, 5, 10], 
          fov: 75,
          near: 0.1,
          far: 1000 
        }}
        shadows
      >
        <Suspense fallback={null}>
          <Physics gravity={[0, -30, 0]}>
            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight
              position={[10, 20, 5]}
              intensity={1}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-far={50}
              shadow-camera-left={-20}
              shadow-camera-right={20}
              shadow-camera-top={20}
              shadow-camera-bottom={-20}
            />
            
            {/* Environment */}
            <Sky 
              distance={450000}
              sunPosition={[0, 1, 0]}
              inclination={0}
              azimuth={0.25}
            />
            
            {/* Game Elements */}
            <Terrain />
            <Player />
            <RockSystem />
            
            {/* Controls - will be replaced by custom player controls */}
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              enableRotate={false}
              maxPolarAngle={Math.PI / 2}
            />
          </Physics>
        </Suspense>
      </Canvas>
      
      {/* UI Overlay */}
      <GameUI />
    </div>
  );
}
