"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function BackgroundFX() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 40, damping: 20, mass: 0.8 });
  const springY = useSpring(y, { stiffness: 40, damping: 20, mass: 0.8 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [x, y]);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 -z-5 overflow-hidden">
      <motion.div
        aria-hidden
        style={{
          left: springX,
          top: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="w-[55vmin] h-[55vmin] rounded-full opacity-40 bg-[radial-gradient(circle_at_center,rgba(120,60,255,0.55),rgba(20,10,40,0)_70%)] blur-3xl mix-blend-screen"
      />
      <motion.div
        aria-hidden
        style={{
          left: springX,
          top: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="w-[85vmin] h-[85vmin] rounded-full opacity-20 bg-[radial-gradient(circle_at_center,rgba(40,160,255,0.4),rgba(10,20,40,0)_70%)] blur-[120px] mix-blend-plus-lighter"
      />
    </div>
  );
}
