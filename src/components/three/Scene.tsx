import { Canvas } from "@react-three/fiber";
import Cube from "./SpinningCube";

const Scene = () => {
  return (
    <div className="fixed left-0 top-0 -z-10 h-full w-full opacity-5">
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Cube />
      </Canvas>
    </div>
  );
};

export default Scene;
