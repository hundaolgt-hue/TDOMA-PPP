"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

const BP = process.env.NEXT_PUBLIC_BASE_PATH || "";
const MODEL_URL = `${BP}/models/tdoma-logo.glb`;
const DRACO_PATH = `${BP}/draco/`; // local decoder — GLB is Draco-compressed
useGLTF.preload(MODEL_URL, DRACO_PATH);

// Per-section motion vocabulary (s1…s14). vy/vx = spin velocity (rad/s) around
// Y / X; tiltZ = lean target; bob/pulse = float / breathe; scale = size. Each
// section gets a distinctly different action; transitions are lerped.
type Action = { vy: number; vx: number; tiltZ: number; bob: number; pulse: number; scale: number };
const ACTIONS: Action[] = [
  { vy: 0.55, vx: 0, tiltZ: 0, bob: 0.04, pulse: 0, scale: 1 }, // s1 hero — gentle drift
  { vy: 0.9, vx: 0, tiltZ: 0.18, bob: 0, pulse: 0, scale: 1 }, // s2 company — lean + spin
  { vy: 0.35, vx: 0, tiltZ: -0.16, bob: 0.09, pulse: 0, scale: 1.04 }, // s3 rationale — float
  { vy: 0.6, vx: 0.6, tiltZ: 0.12, bob: 0, pulse: 0, scale: 1 }, // s3b suitability I — analytical scan
  { vy: 0.45, vx: 0, tiltZ: -0.2, bob: 0.06, pulse: 0.04, scale: 1.02 }, // s3c suitability II — surveying sweep
  { vy: 0.8, vx: 0.3, tiltZ: 0.1, bob: 0, pulse: 0, scale: 1 }, // s3d suitability III — site lock
  { vy: 1.9, vx: 0, tiltZ: 0, bob: 0, pulse: 0, scale: 1 }, // s4 ppp — fast spin
  { vy: 0.25, vx: 1.7, tiltZ: 0, bob: 0, pulse: 0, scale: 1 }, // s5 massing — barrel roll
  { vy: 1.0, vx: 0, tiltZ: 0, bob: 0, pulse: 0.09, scale: 1.03 }, // s6 program — pulse
  { vy: 0.55, vx: 0, tiltZ: 0.24, bob: 0.05, pulse: 0, scale: 1 }, // s7 construction — wobble lean
  { vy: 0.35, vx: 0.35, tiltZ: 0, bob: 0, pulse: 0, scale: 1 }, // s8 assumptions — dual axis
  { vy: 2.4, vx: 0, tiltZ: 0, bob: 0, pulse: 0, scale: 1 }, // s9 capex — spin up
  { vy: 1.5, vx: 0.7, tiltZ: 0, bob: 0, pulse: 0, scale: 1 }, // s10 revenue — tumble
  { vy: 0.5, vx: 0, tiltZ: 0.28, bob: 0, pulse: 0.05, scale: 1 }, // s11 sensitivity — swing
  { vy: 2.9, vx: 0, tiltZ: 0, bob: 0, pulse: 0.1, scale: 1.06 }, // s12 returns — celebratory
  { vy: 0.7, vx: 0, tiltZ: 0.1, bob: 0.05, pulse: 0, scale: 1 }, // s13 gallery — showcase
  { vy: 0.25, vx: 0, tiltZ: 0, bob: 0.03, pulse: 0, scale: 1 }, // s14 final — settle
];

function useActiveSection() {
  const idx = useRef(0);
  useEffect(() => {
    let tops: number[] = [];
    const measure = () => {
      tops = Array.from(document.querySelectorAll("main section[id]")).map((el) => (el as HTMLElement).offsetTop);
    };
    const update = () => {
      const mid = window.scrollY + window.innerHeight * 0.5;
      let i = 0;
      for (let k = 0; k < tops.length; k++) if (mid >= tops[k]) i = k;
      idx.current = i;
    };
    measure();
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", () => { measure(); update(); });
    const t = setTimeout(measure, 800); // after fonts/layout settle
    return () => { window.removeEventListener("scroll", update); clearTimeout(t); };
  }, []);
  return idx;
}

function LogoMesh() {
  const { scene } = useGLTF(MODEL_URL, DRACO_PATH);
  const group = useRef<THREE.Group>(null);
  const active = useActiveSection();
  const cur = useRef<Action>({ ...ACTIONS[0] });
  const clock = useRef(0);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    clock.current += dt;
    const target = ACTIONS[Math.min(ACTIONS.length - 1, active.current)];
    // smooth toward the active section's action
    const k = 1 - Math.pow(0.001, dt); // frame-rate independent lerp
    const c = cur.current;
    c.vy += (target.vy - c.vy) * k;
    c.vx += (target.vx - c.vx) * k;
    c.tiltZ += (target.tiltZ - c.tiltZ) * k;
    c.bob += (target.bob - c.bob) * k;
    c.pulse += (target.pulse - c.pulse) * k;
    c.scale += (target.scale - c.scale) * k;
    // integrate spin, apply tilt / bob / breathe
    g.rotation.y += c.vy * dt;
    g.rotation.x += c.vx * dt;
    g.rotation.z = c.tiltZ;
    g.position.y = Math.sin(clock.current * 1.6) * c.bob;
    const s = c.scale * (1 + Math.sin(clock.current * 3) * c.pulse);
    g.scale.setScalar(s * 1.15);
  });

  return (
    <group ref={group}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

export default function Logo3D() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="pointer-events-none fixed right-3 top-3 z-50 h-[92px] w-[92px] md:right-5 md:top-5 md:h-[120px] md:w-[120px] 2xl:h-[136px] 2xl:w-[136px]">
      {/* Soft glass circle backing so the logo reads over any section */}
      <div className="glass-strong absolute inset-0 rounded-full" />
      {/* Wordmark shown only until the WebGL canvas mounts (pre-load / no-WebGL fallback) */}
      {!mounted && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-sm font-bold tracking-[0.18em] text-[var(--green-deep)] md:text-base">
            TDOMA<span className="text-[var(--orange)]">.</span>
          </span>
        </div>
      )}
      {mounted && (
        <Canvas
          className="!absolute inset-0"
          camera={{ position: [0, 0, 3.1], fov: 32 }}
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
          frameloop="always"
        >
          <ambientLight intensity={0.9} />
          <directionalLight position={[3, 4, 5]} intensity={1.6} />
          <directionalLight position={[-4, -2, -3]} intensity={0.5} color="#bfe6cf" />
          <Suspense fallback={null}>
            <LogoMesh />
            {/* Self-contained studio env (no external HDR) for the glossy metal */}
            <Environment resolution={128}>
              <Lightformer intensity={2} position={[2, 3, 4]} scale={4} color="#ffffff" />
              <Lightformer intensity={1.2} position={[-3, 1, 2]} scale={3} color="#dff3e6" />
              <Lightformer intensity={1.4} position={[0, -3, 2]} scale={3} color="#fce8d2" />
            </Environment>
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
