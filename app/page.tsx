"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from './store/useAppStore';
import GadgetGrid from './components/ui/GadgetGrid';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen pt-24 pb-32 flex flex-col items-center">

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center mb-16 px-4 max-w-4xl"
      >
        <h1 className="mb-4">
          <span className="text-white">Hi, I'm </span>
          <span className="text-gradient-doraemon">Arcos</span>
        </h1>
        <h2 className="text-2xl md:text-3xl text-gray-300 font-light mb-6">
          Artist • Coder • Creator
        </h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed glass-panel p-6 rounded-2xl mb-8">
          Welcome to my 4D Pocket. I blend chemistry, code, and art into interactive experiences.
          Select a timeline in the Chrono-Terminal to explore my gadgets.
        </p>

        {/* Timeline CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {/* Past */}
          <Link
            href="/past"
            className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm
                       bg-white/5 border border-amber-400/30 text-amber-300
                       hover:bg-amber-400 hover:border-amber-400 hover:text-black
                       transition-all duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.3)]
                       hover:shadow-[0_0_20px_rgba(251,191,36,0.5)]"
          >
            <span>🕰️</span>
            <span>The Archive</span>
          </Link>

          {/* Art */}
          <button
            onClick={() => {
              const { setTransitioning } = useAppStore.getState();
              setTransitioning(true);
              setTimeout(() => {
                router.push('/art');
                setTimeout(() => setTransitioning(false), 1000);
              }, 4500);
            }}
            className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm
                       bg-white/5 border border-rose-400/30 text-rose-300
                       hover:bg-rose-400 hover:border-rose-400 hover:text-white
                       transition-all duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.3)]
                       hover:shadow-[0_0_20px_rgba(251,113,133,0.5)] cursor-pointer"
          >
            <span>🎨</span>
            <span>The Gallery</span>
          </button>

          {/* Contact */}
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm
                       bg-white/5 border border-purple-400/30 text-purple-300
                       hover:bg-purple-500 hover:border-purple-500 hover:text-white
                       transition-all duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.3)]
                       hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]"
          >
            <span>🛸</span>
            <span>The Hub</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Gadget Grid */}
      <div className="w-full relative z-10">
        <GadgetGrid />
      </div>

    </div>
  );
}

