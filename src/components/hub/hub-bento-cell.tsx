import type { ReactNode } from "react";
import { motion } from "motion/react";

const cellSpring = { type: "spring" as const, stiffness: 100, damping: 20 };

export function HubBentoCell({
  children,
  className = "",
  staggerIndex = 0,
}: {
  children: ReactNode;
  className?: string;
  staggerIndex?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...cellSpring, delay: staggerIndex * 0.08 }}
      className={`min-h-0 h-full [&>div]:h-full ${className}`}
    >
      {children}
    </motion.div>
  );
}
