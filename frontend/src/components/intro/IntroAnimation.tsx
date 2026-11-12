import React, { useState, useEffect } from 'react';

interface IntroAnimationProps {
  onComplete: () => void;
  forcePlay?: boolean;
}

export const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete, forcePlay = false }) => {
  const [phase, setPhase] = useState<'grid' | 'logo' | 'title' | 'tagline' | 'exit'>('grid');
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Check if user already saw the intro in this session (unless forced)
    const seen = sessionStorage.getItem('trustchain_intro_seen');
    if (seen && !forcePlay) {
      onComplete();
      setVisible(false);
      return;
    }

    // Sequence timing (total ~4.8 - 5.0 seconds)
    const tLogo = setTimeout(() => setPhase('logo'), 1000);
    const tTitle = setTimeout(() => setPhase('title'), 2400);
    const tTagline = setTimeout(() => setPhase('tagline'), 3400);
    const tExit = setTimeout(() => setPhase('exit'), 4400);
    const tEnd = setTimeout(() => {
      sessionStorage.setItem('trustchain_intro_seen', 'true');
      setVisible(false);
      onComplete();
    }, 4900);

    return () => {
      clearTimeout(tLogo);
      clearTimeout(tTitle);
      clearTimeout(tTagline);
      clearTimeout(tExit);
      clearTimeout(tEnd);
    };
  }, [onComplete, forcePlay]);

  const handleSkip = () => {
    sessionStorage.setItem('trustchain_intro_seen', 'true');
    setPhase('exit');
    setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 200);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#071322] text-white overflow-hidden transition-all duration-500 ${
        phase === 'exit' ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Ambient Blue Radial Glow */}
      <div className="absolute w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Skip Button */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 z-50 text-xs font-semibold text-slate-400 hover:text-white px-3.5 py-1.5 rounded-full border border-slate-700/60 bg-slate-900/60 backdrop-blur-md transition-colors"
      >
        Skip Intro ✕
      </button>

      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-xl">
        {/* Animated Shield Logo Container */}
        <div className="relative mb-6">
          {/* Pulsing Outer Circuit Ring */}
          <div
            className={`absolute -inset-4 rounded-full border border-blue-500/30 transition-all duration-1000 ${
              phase !== 'grid' ? 'scale-100 opacity-100 animate-pulse' : 'scale-50 opacity-0'
            }`}
          />

          {/* Core Shield SVG */}
          <div
            className={`relative w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.4)] transition-all duration-700 ${
              phase !== 'grid' ? 'scale-100 rotate-0 opacity-100' : 'scale-50 rotate-[-15deg] opacity-0'
            }`}
          >
            <svg
              className="w-12 h-12 md:w-14 md:h-14 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Shield Outline */}
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              {/* Checkmark drawing */}
              <path
                d="m9 12 2 2 4-4"
                className={`transition-all duration-700 ${
                  phase === 'logo' || phase === 'title' || phase === 'tagline' || phase === 'exit'
                    ? 'stroke-dasharray-none opacity-100'
                    : 'opacity-0'
                }`}
              />
            </svg>
          </div>
        </div>

        {/* Application Title */}
        <div
          className={`transition-all duration-700 transform ${
            phase === 'title' || phase === 'tagline' || phase === 'exit'
              ? 'translate-y-0 opacity-100'
              : 'translate-y-4 opacity-0'
          }`}
        >
          <h1 className="text-3xl md:text-5xl font-black tracking-wider bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
            TRUSTCHAIN AI
          </h1>
          <p className="text-xs md:text-sm font-medium text-blue-400 mt-1.5 tracking-wide">
            Intelligent Document Authentication & Blockchain Verification
          </p>
        </div>

        {/* Tagline Reveal */}
        <div
          className={`mt-6 pt-4 border-t border-slate-800/80 transition-all duration-700 transform ${
            phase === 'tagline' || phase === 'exit'
              ? 'translate-y-0 opacity-100'
              : 'translate-y-2 opacity-0'
          }`}
        >
          <p className="text-sm md:text-base text-slate-300 font-light italic tracking-wider">
            "Verify with Intelligence. Trust with Confidence."
          </p>
        </div>

        {/* Dynamic Progress Indicator */}
        <div className="w-32 h-1 bg-slate-800 rounded-full mt-8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 ease-out"
            style={{
              width:
                phase === 'grid'
                  ? '20%'
                  : phase === 'logo'
                  ? '50%'
                  : phase === 'title'
                  ? '75%'
                  : '100%',
            }}
          />
        </div>
      </div>
    </div>
  );
};

