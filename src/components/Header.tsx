import React, { useState, useEffect } from 'react';
import { Crown, Bell, Volume2, VolumeX, PlusCircle, RefreshCw, BarChart3, User, Sparkles, Flame } from 'lucide-react';
import { formatCurrentISTTime, formatCurrentDate } from '../utils/matkaUtils';
import { UserProfile } from '../types';

interface HeaderProps {
  userProfile: UserProfile;
  activeTab: 'results' | 'charts' | 'guessing' | 'calculator';
  setActiveTab: (tab: 'results' | 'charts' | 'guessing' | 'calculator') => void;
  onOpenAddGame: () => void;
  onOpenResultUpdate: () => void;
  onOpenProfile: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  totalMarketsCount: number;
  liveCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  userProfile,
  activeTab,
  setActiveTab,
  onOpenAddGame,
  onOpenResultUpdate,
  onOpenProfile,
  soundEnabled,
  onToggleSound,
  totalMarketsCount,
  liveCount,
}) => {
  const [time, setTime] = useState(formatCurrentISTTime());
  const [date, setDate] = useState(formatCurrentDate());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(formatCurrentISTTime());
      setDate(formatCurrentDate());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-stone-900 border-b border-amber-600/30 sticky top-0 z-40 shadow-xl backdrop-blur-md bg-stone-900/95">
      {/* Top Gold Banner & Real-time IST Clock */}
      <div className="bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 text-stone-950 font-semibold px-4 py-1.5 text-xs sm:text-sm flex flex-wrap items-center justify-between shadow-inner">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-stone-950/85 text-amber-300 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3 h-3 text-red-500 animate-pulse" /> LIVE IST
          </span>
          <span className="font-mono font-bold tracking-tight text-stone-950">{time}</span>
          <span className="hidden md:inline text-stone-900 font-medium">| {date}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-xs font-bold text-stone-950">
            👑 विश्व की नंबर 1 सट्टा मटका रिजल्ट वेबसाइट
          </span>
          <div className="flex items-center gap-2 bg-stone-950/15 px-2 py-0.5 rounded text-xs font-bold">
            <span>मार्केट्स: {totalMarketsCount}</span>
            {liveCount > 0 && (
              <span className="flex items-center gap-1 text-red-950">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                {liveCount} लाइव
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Brand & Action Nav */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div 
              onClick={() => setActiveTab('results')}
              className="cursor-pointer flex items-center gap-3 group"
            >
              <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-yellow-700 p-0.5 shadow-lg shadow-amber-900/40 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center">
                  <Crown className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400 fill-amber-400/20" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 font-['Cinzel',serif]">
                    MATKA MAHARAJ
                  </h1>
                  <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                    ORIGINAL
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-amber-200/80 font-medium">
                  सट्टा कल्याण मटका • सबसे तेज लाइव रिजल्ट्स & चार्ट्स
                </p>
              </div>
            </div>

            {/* Mobile Profile & Sound Controls */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                onClick={onToggleSound}
                className={`p-2 rounded-lg border text-xs ${soundEnabled ? 'border-amber-500/50 text-amber-400 bg-amber-950/40' : 'border-stone-800 text-stone-500'}`}
                title="साउंड चालू / बंद करें"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-amber-600 to-yellow-600 text-stone-950 rounded-lg font-bold text-xs shadow"
              >
                <User className="w-3.5 h-3.5" />
                <span>₹{userProfile.balance}</span>
              </button>
            </div>
          </div>

          {/* Action Buttons: Add Game, Update Result, Charts, Profile */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 w-full md:w-auto">
            
            {/* Add New Game (नया गेम ऐड करें) */}
            <button
              onClick={onOpenAddGame}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs sm:text-sm font-bold shadow-md shadow-emerald-950/40 transition hover:scale-[1.02] active:scale-95"
              id="btn-add-game"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ नया गेम जोड़ें</span>
            </button>

            {/* Result Update (रिजल्ट अपडेट करें) */}
            <button
              onClick={onOpenResultUpdate}
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 rounded-lg text-xs sm:text-sm font-black shadow-md shadow-amber-900/40 transition hover:scale-[1.02] active:scale-95"
              id="btn-update-result"
            >
              <RefreshCw className="w-4 h-4 text-stone-950 animate-spin-slow" />
              <span>रिजल्ट अपडेट</span>
            </button>

            {/* Desktop Profile & Wallet */}
            <button
              onClick={onOpenProfile}
              className="hidden md:flex items-center gap-2 px-3 py-2 bg-stone-800 hover:bg-stone-700/80 border border-amber-500/30 text-amber-200 rounded-lg text-xs sm:text-sm font-semibold transition hover:scale-[1.02]"
              id="btn-desktop-profile"
            >
              <div className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-xs font-black">
                {userProfile.avatar}
              </div>
              <div className="text-left">
                <div className="text-[10px] text-stone-400 leading-none">यूजर वॉलेट</div>
                <div className="text-xs font-bold text-amber-300">₹{userProfile.balance.toLocaleString()}</div>
              </div>
            </button>

            {/* Sound Toggle on desktop */}
            <button
              onClick={onToggleSound}
              className={`hidden md:flex items-center justify-center p-2 rounded-lg border transition ${soundEnabled ? 'border-amber-500/50 text-amber-400 bg-amber-950/30' : 'border-stone-800 text-stone-500 hover:text-stone-300'}`}
              title={soundEnabled ? 'साउंड ऑन है' : 'साउंड म्यूट है'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <nav className="mt-3 pt-2.5 border-t border-stone-800 flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-1.5 sm:gap-3 text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab('results')}
            className={`px-3 sm:px-4 py-1.5 rounded-md whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'results'
                ? 'bg-amber-500 text-stone-950 shadow-md font-black'
                : 'text-stone-300 hover:text-amber-300 hover:bg-stone-800/60'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-red-500" />
            लाइव रिजल्ट बोर्ड
          </button>

          <button
            onClick={() => setActiveTab('charts')}
            className={`px-3 sm:px-4 py-1.5 rounded-md whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'charts'
                ? 'bg-amber-500 text-stone-950 shadow-md font-black'
                : 'text-stone-300 hover:text-amber-300 hover:bg-stone-800/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            जोड़ी & पैनल चार्ट्स
          </button>

          <button
            onClick={() => setActiveTab('guessing')}
            className={`px-3 sm:px-4 py-1.5 rounded-md whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'guessing'
                ? 'bg-amber-500 text-stone-950 shadow-md font-black'
                : 'text-stone-300 hover:text-amber-300 hover:bg-stone-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            लकी गेसिंग फोरम & OTC
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-3 sm:px-4 py-1.5 rounded-md whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'calculator'
                ? 'bg-amber-500 text-stone-950 shadow-md font-black'
                : 'text-stone-300 hover:text-amber-300 hover:bg-stone-800/60'
            }`}
          >
            🔢 पाना कैलकुलेटर (Patti Tool)
          </button>
        </nav>
      </div>
    </header>
  );
};
