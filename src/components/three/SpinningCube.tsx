import { useRef } from "react";
import type { Mesh } from "three";
import { useFrame } from "@react-three/fiber";

const Cube = () => {
  const meshRef = useRef<Mesh | null>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[3, 3, 3]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
};

export default Cube;
