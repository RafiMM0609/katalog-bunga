"use client";

import { motion } from "framer-motion";
import HeroSection from "@/components/home/HeroSection";
import HomeClientWrapper from "@/components/home/HomeClientWrapper";

export default function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-10"
    >
      <HeroSection />
      <HomeClientWrapper />
    </motion.div>
  );
}
