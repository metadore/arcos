"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type MilestoneToast = {
  id: number;
  text: string;
};

const MILESTONES: Record<number, string> = {
  5: "5 Dorayakis! Doraemon is powered up!",
  10: "10 Dorayakis! 4D Pocket capacity +100%!",
  20: "20 Dorayakis! Honorary Time Patrol unlocked!",
};

function playChime(type: 'bell' | 'dorayaki' | 'gadget' | 'copter') {
  if (typeof window === 'undefined') return;
  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return;

  try {
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'bell') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1046.5, now);
      osc.frequency.exponentialRampToValueAtTime(1318.5, now + 0.12);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.36);
    } else if (type === 'dorayaki') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.06);
      osc.frequency.setValueAtTime(783.99, now + 0.12);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
      osc.start(now);
      osc.stop(now + 0.27);
    } else if (type === 'copter') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(330, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.25);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.start(now);
      osc.stop(now + 0.29);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(698.46, now);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.16);
    }
  } catch {
    // Ignore audio errors if blocked by browser policy
  }
}

export default function PocketGadgets() {
  const [isOpen, setIsOpen] = useState(false);
  const [dorayakiCount, setDorayakiCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [spotlightOn, setSpotlightOn] = useState(false);
  const [retroOn, setRetroOn] = useState(false);
  const [zeroGOn, setZeroGOn] = useState(false);
  const [copterSpinning, setCopterSpinning] = useState(false);
  const [toast, setToast] = useState<MilestoneToast | null>(null);

  const spotlightRef = useRef<HTMLDivElement>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('arcos_dorayaki_count');
      if (saved) setDorayakiCount(Number(saved) || 0);
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Small Light: cursor spotlight
  useEffect(() => {
    if (!spotlightOn) return;
    const handleMove = (e: PointerEvent) => {
      if (spotlightRef.current) {
        spotlightRef.current.style.background = `radial-gradient(280px circle at ${e.clientX}px ${e.clientY}px, rgba(253, 224, 71, 0.22), rgba(0, 0, 0, 0.55) 75%)`;
      }
    };
    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => window.removeEventListener('pointermove', handleMove);
  }, [spotlightOn]);

  // Time Furoshiki: retro CRT filter on html
  useEffect(() => {
    const root = document.documentElement;
    if (retroOn) {
      root.style.filter = 'sepia(0.32) contrast(1.08) saturate(1.15)';
    } else {
      root.style.filter = '';
    }
    return () => {
      root.style.filter = '';
    };
  }, [retroOn]);

  // What-If Machine: zero-gravity gentle float on glass panels
  useEffect(() => {
    const panels = Array.from(document.querySelectorAll<HTMLElement>('.glass-panel'));
    if (!zeroGOn) {
      panels.forEach((el) => {
        el.style.animation = '';
      });
      return;
    }

    const styleTag = document.createElement('style');
    styleTag.id = 'zero-g-keyframes';
    styleTag.textContent = `
      @keyframes arcosZeroG {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-7px) rotate(0.4deg); }
      }
    `;
    document.head.appendChild(styleTag);

    panels.forEach((el, idx) => {
      el.style.animation = `arcosZeroG ${3.2 + (idx % 3) * 0.6}s ease-in-out ${(idx % 4) * 0.25}s infinite`;
    });

    return () => {
      panels.forEach((el) => {
        el.style.animation = '';
      });
      styleTag.remove();
    };
  }, [zeroGOn]);

  const showToast = (text: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ id: Date.now(), text });
    toastTimerRef.current = setTimeout(() => setToast(null), 2600);
  };

  const handleFeedDorayaki = () => {
    const next = dorayakiCount + 1;
    setDorayakiCount(next);
    try {
      localStorage.setItem('arcos_dorayaki_count', String(next));
    } catch {
      // Ignore storage errors
    }
    if (soundEnabled) playChime('dorayaki');
    showToast(MILESTONES[next] ?? `Yum! Dorayaki #${next} fed to Doraemon`);
  };

  const handleTakeCopter = () => {
    if (soundEnabled) playChime('copter');
    setCopterSpinning(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setCopterSpinning(false), 900);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) playChime('bell');
    showToast(next ? 'Bell SFX On' : 'Bell SFX Muted');
  };

  return (
    <>
      {/* Small Light Overlay */}
      {spotlightOn && (
        <div
          ref={spotlightRef}
          className="fixed inset-0 z-30 pointer-events-none transition-opacity duration-300"
          style={{
            background: 'radial-gradient(280px circle at 50% 50%, rgba(253, 224, 71, 0.22), rgba(0, 0, 0, 0.55) 75%)',
          }}
        />
      )}

      {/* Time Furoshiki CRT Scanline Overlay */}
      {retroOn && (
        <div
          className="fixed inset-0 z-30 pointer-events-none opacity-25"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.45) 0px, rgba(0,0,0,0.45) 1px, transparent 1px, transparent 3px)',
          }}
        />
      )}

      {/* Floating 4D Pocket Drawer */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {/* Toast notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              className="px-3.5 py-1.5 rounded-full bg-black/75 border border-amber-400/40 text-amber-200 text-xs font-medium backdrop-blur-md shadow-lg"
            >
              {toast.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expandable Gadget Tray */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 320, damping: 24 }}
              className="p-2.5 rounded-2xl bg-black/75 backdrop-blur-xl border border-sky-400/30 shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex flex-col gap-2 w-60"
            >
              <div className="flex items-center justify-between px-1.5 pb-1 border-b border-white/10">
                <span className="text-[11px] font-mono tracking-wider text-sky-300 uppercase">
                  4D Pocket Gadgets
                </span>
                <span className="text-[11px] font-mono text-amber-300">
                  🥞 {dorayakiCount}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {/* Dorayaki */}
                <button
                  type="button"
                  onClick={handleFeedDorayaki}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/5 hover:bg-amber-400/20 border border-transparent hover:border-amber-400/40 transition-all cursor-pointer"
                  title="Feed Doraemon a Dorayaki"
                >
                  <img src="/gadgets/dorayaki.svg" alt="Dorayaki" className="w-7 h-7 object-contain" />
                  <span className="text-[10px] text-gray-200">Dorayaki</span>
                </button>

                {/* Take-Copter */}
                <button
                  type="button"
                  onClick={handleTakeCopter}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/5 hover:bg-sky-400/20 border border-transparent hover:border-sky-400/40 transition-all cursor-pointer"
                  title="Fly to Top"
                >
                  <img
                    src="/gadgets/take-copter.svg"
                    alt="Take-Copter"
                    className={`w-7 h-7 object-contain transition-transform duration-700 ${copterSpinning ? 'rotate-[720deg] -translate-y-1' : ''}`}
                  />
                  <span className="text-[10px] text-gray-200">Top Fly</span>
                </button>

                {/* Small Light */}
                <button
                  type="button"
                  onClick={() => {
                    const next = !spotlightOn;
                    setSpotlightOn(next);
                    if (soundEnabled) playChime('gadget');
                    showToast(next ? 'Small Light: Spotlight On' : 'Small Light: Off');
                  }}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all cursor-pointer ${
                    spotlightOn
                      ? 'bg-yellow-400/25 border-yellow-400/60 text-yellow-200'
                      : 'bg-white/5 hover:bg-white/10 border-transparent text-gray-200'
                  }`}
                  title="Toggle Cursor Spotlight"
                >
                  <img src="/gadgets/small-light.svg" alt="Small Light" className="w-7 h-7 object-contain" />
                  <span className="text-[10px]">Spotlight</span>
                </button>

                {/* Time Furoshiki */}
                <button
                  type="button"
                  onClick={() => {
                    const next = !retroOn;
                    setRetroOn(next);
                    if (soundEnabled) playChime('gadget');
                    showToast(next ? 'Time Furoshiki: Retro CRT On' : 'Time Furoshiki: Off');
                  }}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all cursor-pointer ${
                    retroOn
                      ? 'bg-rose-400/25 border-rose-400/60 text-rose-200'
                      : 'bg-white/5 hover:bg-white/10 border-transparent text-gray-200'
                  }`}
                  title="Toggle Retro CRT Filter"
                >
                  <img src="/gadgets/time-furoshiki.svg" alt="Time Furoshiki" className="w-7 h-7 object-contain" />
                  <span className="text-[10px]">Retro CRT</span>
                </button>

                {/* What-If Machine */}
                <button
                  type="button"
                  onClick={() => {
                    const next = !zeroGOn;
                    setZeroGOn(next);
                    if (soundEnabled) playChime('gadget');
                    showToast(next ? 'What-If: Zero Gravity On!' : 'What-If: Gravity Restored');
                  }}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all cursor-pointer ${
                    zeroGOn
                      ? 'bg-purple-400/25 border-purple-400/60 text-purple-200'
                      : 'bg-white/5 hover:bg-white/10 border-transparent text-gray-200'
                  }`}
                  title="What if gravity was off?"
                >
                  <img src="/gadgets/what-if-machine.svg" alt="What-If Machine" className="w-7 h-7 object-contain" />
                  <span className="text-[10px]">Zero-G</span>
                </button>

                {/* Doraemon Bell (Sound Toggle) */}
                <button
                  type="button"
                  onClick={toggleSound}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all cursor-pointer ${
                    soundEnabled
                      ? 'bg-amber-400/20 border-amber-400/50 text-amber-200'
                      : 'bg-white/5 hover:bg-white/10 border-transparent text-gray-400 opacity-70'
                  }`}
                  title="Toggle Bell Sound Effects"
                >
                  <img src="/gadgets/doraemon-bell.svg" alt="Doraemon Bell" className="w-7 h-7 object-contain" />
                  <span className="text-[10px]">{soundEnabled ? 'SFX On' : 'Muted'}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main 4D Pocket Toggle Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            const next = !isOpen;
            setIsOpen(next);
            if (soundEnabled) playChime('gadget');
          }}
          aria-label="Toggle 4D Pocket Gadgets"
          title="Open 4D Pocket"
          className="group relative flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-sky-500/20 hover:bg-sky-500/35 border border-sky-400/45 backdrop-blur-md shadow-[0_8px_25px_rgba(0,150,214,0.35)] cursor-pointer transition-colors"
        >
          <img src="/gadgets/4d-pocket.svg" alt="4D Pocket" className="w-6 h-6 object-contain" />
          <span className="text-xs font-semibold text-sky-100 pr-0.5">4D Pocket</span>
        </motion.button>
      </div>
    </>
  );
}
