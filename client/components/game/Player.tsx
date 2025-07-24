import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useSphere } from "@react-three/cannon";
import { Vector3 } from "three";
import { useGame } from "@/hooks/use-game";

export function Player() {
  const { state, actions } = useGame();
  const { camera } = useThree();

  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: [0, 2, 0],
    fixedRotation: true,
    material: { friction: 0.1, restitution: 0.1 },
  }));

  const velocity = useRef([0, 0, 0]);
  const position = useRef([0, 2, 0]);

  // Input state
  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    throw: false,
  });

  useEffect(() => {
    if (api.velocity && typeof api.velocity.subscribe === 'function') {
      api.velocity.subscribe((v) => (velocity.current = v));
    }
    if (api.position && typeof api.position.subscribe === 'function') {
      api.position.subscribe((p) => (position.current = p));
    }
  }, [api]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyW":
          keys.current.forward = true;
          break;
        case "KeyS":
          keys.current.backward = true;
          break;
        case "KeyA":
          keys.current.left = true;
          break;
        case "KeyD":
          keys.current.right = true;
          break;
        case "Space":
          keys.current.jump = true;
          event.preventDefault();
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyW":
          keys.current.forward = false;
          break;
        case "KeyS":
          keys.current.backward = false;
          break;
        case "KeyA":
          keys.current.left = false;
          break;
        case "KeyD":
          keys.current.right = false;
          break;
        case "Space":
          keys.current.jump = false;
          break;
      }
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (event.button === 0) {
        // Left click
        keys.current.throw = true;
      }
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (event.button === 0) {
        keys.current.throw = false;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Mouse look controls
  useEffect(() => {
    let isLocked = false;

    const handlePointerLockChange = () => {
      isLocked = document.pointerLockElement !== null;
    };

    const handleClick = () => {
      if (!isLocked) {
        document.body.requestPointerLock();
      }
    };

    document.addEventListener("pointerlockchange", handlePointerLockChange);
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener(
        "pointerlockchange",
        handlePointerLockChange,
      );
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const mouseX = useRef(0);
  const mouseY = useRef(0);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (document.pointerLockElement) {
        mouseX.current -= event.movementX * 0.002;
        mouseY.current -= event.movementY * 0.002;
        mouseY.current = Math.max(
          -Math.PI / 2,
          Math.min(Math.PI / 2, mouseY.current),
        );
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    if (!state.localPlayer?.isAlive) return;

    const direction = new Vector3();
    const frontVector = new Vector3(
      0,
      0,
      Number(keys.current.backward) - Number(keys.current.forward),
    );
    const sideVector = new Vector3(
      Number(keys.current.left) - Number(keys.current.right),
      0,
      0,
    );

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(state.gameSettings.movementSpeed);

    // Apply rotation to movement direction
    direction.applyAxisAngle(new Vector3(0, 1, 0), mouseX.current);

    api.velocity.set(direction.x, velocity.current[1], direction.z);

    // Jump
    if (keys.current.jump && Math.abs(velocity.current[1]) < 0.1) {
      api.velocity.set(velocity.current[0], 8, velocity.current[2]);
    }

    // Throw rock
    if (keys.current.throw) {
      const throwDirection = new Vector3(0, 0, -1);
      throwDirection.applyAxisAngle(new Vector3(0, 1, 0), mouseX.current);
      throwDirection.applyAxisAngle(new Vector3(1, 0, 0), mouseY.current);
      throwDirection.normalize().multiplyScalar(state.gameSettings.throwForce);

      const throwPosition: [number, number, number] = [
        position.current[0] + throwDirection.x * 2,
        position.current[1] + 1,
        position.current[2] + throwDirection.z * 2,
      ];

      actions.throwRock(throwPosition, [
        throwDirection.x,
        throwDirection.y,
        throwDirection.z,
      ]);
      keys.current.throw = false; // Prevent continuous throwing
    }

    // Update camera position (third person)
    const cameraOffset = new Vector3(0, 5, 8);
    cameraOffset.applyAxisAngle(new Vector3(0, 1, 0), mouseX.current);

    camera.position.set(
      position.current[0] + cameraOffset.x,
      position.current[1] + cameraOffset.y,
      position.current[2] + cameraOffset.z,
    );

    // Camera look at
    const lookAt = new Vector3(
      position.current[0],
      position.current[1] + 2,
      position.current[2],
    );
    camera.lookAt(lookAt);

    // Update game state
    actions.updatePlayerPosition(
      [position.current[0], position.current[1], position.current[2]],
      [0, mouseX.current, 0],
    );
  });

  if (!state.localPlayer?.isAlive) {
    return null;
  }

  return (
    <group>
      {/* Player body */}
      <mesh ref={ref} castShadow>
        <capsuleGeometry args={[0.5, 1.5]} />
        <meshStandardMaterial
          color="#4f46e5"
          roughness={0.3}
          metalness={0.1}
          emissive="#1e1b4b"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Player name tag */}
      {state.localPlayer && (
        <mesh position={[0, 3, 0]}>
          <planeGeometry args={[2, 0.5]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}
