import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const NODE_COUNT = 60;
const CONNECTION_DISTANCE = 2.5;

function NeuralNetwork({ intensity = 0.5 }: { intensity?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(NODE_COUNT * 3);
    const vel = new Float32Array(NODE_COUNT * 3);
    for (let i = 0; i < NODE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
      vel[i * 3] = (Math.random() - 0.5) * 0.003;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.003;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.001;
    }
    return { positions: pos, velocities: vel };
  }, []);

  const linePositions = useMemo(() => new Float32Array(NODE_COUNT * NODE_COUNT * 6), []);
  const lineColors = useMemo(() => new Float32Array(NODE_COUNT * NODE_COUNT * 6), []);

  useFrame(() => {
    if (!pointsRef.current || !linesRef.current) return;

    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < NODE_COUNT; i++) {
      pos[i * 3] += velocities[i * 3];
      pos[i * 3 + 1] += velocities[i * 3 + 1];
      pos[i * 3 + 2] += velocities[i * 3 + 2];

      for (let axis = 0; axis < 3; axis++) {
        const limit = axis === 2 ? 2 : axis === 1 ? 4 : 5;
        if (Math.abs(pos[i * 3 + axis]) > limit) {
          velocities[i * 3 + axis] *= -1;
        }
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    let lineIdx = 0;
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < CONNECTION_DISTANCE) {
          const alpha = (1 - dist / CONNECTION_DISTANCE) * intensity * 0.4;
          linePositions[lineIdx * 6] = pos[i * 3];
          linePositions[lineIdx * 6 + 1] = pos[i * 3 + 1];
          linePositions[lineIdx * 6 + 2] = pos[i * 3 + 2];
          linePositions[lineIdx * 6 + 3] = pos[j * 3];
          linePositions[lineIdx * 6 + 4] = pos[j * 3 + 1];
          linePositions[lineIdx * 6 + 5] = pos[j * 3 + 2];

          // cyan tint
          lineColors[lineIdx * 6] = 0;
          lineColors[lineIdx * 6 + 1] = 0.83 * alpha;
          lineColors[lineIdx * 6 + 2] = 1.0 * alpha;
          lineColors[lineIdx * 6 + 3] = 0;
          lineColors[lineIdx * 6 + 4] = 0.83 * alpha;
          lineColors[lineIdx * 6 + 5] = 1.0 * alpha;
          lineIdx++;
        }
      }
    }

    const lineGeo = linesRef.current.geometry;
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions.slice(0, lineIdx * 6), 3));
    lineGeo.setAttribute("color", new THREE.BufferAttribute(lineColors.slice(0, lineIdx * 6), 3));
    lineGeo.attributes.position.needsUpdate = true;
    lineGeo.attributes.color.needsUpdate = true;
    lineGeo.setDrawRange(0, lineIdx * 2);
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={NODE_COUNT}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color={new THREE.Color(0, 0.83, 1)}
          transparent
          opacity={intensity * 0.6}
          sizeAttenuation
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial vertexColors transparent opacity={1} />
      </lineSegments>
    </>
  );
}

export default function NeuralBackground({ intensity = 0.5 }: { intensity?: number }) {
  return (
    <div className="fixed inset-0 z-0" style={{ background: "hsl(0 0% 4%)" }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: false }}
        style={{ background: "transparent" }}
      >
        <NeuralNetwork intensity={intensity} />
      </Canvas>
    </div>
  );
}
