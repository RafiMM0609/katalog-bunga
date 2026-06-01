"use client";

import { motion, Variants } from "framer-motion";
import WireFlowerAnimation from "@/components/home/WIreFlowerAnimation";

export default function HeroSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.21, 0.47, 0.32, 0.98],
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-gradient-to-br from-pink-200 to-rose-100 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-sm flex flex-col md:flex-row items-center md:justify-between gap-6"
    >
      <div className="relative z-10 max-w-lg text-center md:text-left">
        <motion.span
          variants={itemVariants}
          className="inline-block bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full text-pink-600 text-xs font-bold tracking-widest uppercase mb-4 shadow-sm"
        >
          New Collection 2026
        </motion.span>

        <motion.h2
          variants={itemVariants}
          className="playfair font-serif text-3xl md:text-5xl text-gray-800 leading-tight mb-4"
        >
          Bunga Abadi <br />
          <span className="italic font-light text-pink-600">Penuh Makna.</span>
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="text-gray-600 mb-6 text-sm md:text-base max-w-sm mx-auto md:mx-0"
        >
          Temukan hadiah spesial yang tak akan pernah layu untuk momen terbaikmu.
        </motion.p>

        <motion.div variants={itemVariants}>
          <a
            href="#catalog-section"
            className="inline-block bg-gray-800 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-pink-600 hover:shadow-lg hover:shadow-pink-200 transition-all transform hover:-translate-y-1"
          >
            Lihat Katalog
          </a>
        </motion.div>
      </div>

      {/* Decorative Element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/30 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: [0, -12, 0]
        }}
        transition={{
          opacity: { duration: 1 },
          scale: { duration: 1 },
          y: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        className="relative md:w-1/3 flex justify-center"
      >
        <WireFlowerAnimation />
      </motion.div>
    </motion.div>
  );
}
