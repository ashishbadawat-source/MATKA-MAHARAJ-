/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Flame, 
  Crown, 
  Search, 
  Filter, 
  PlusCircle, 
  RefreshCw, 
  BarChart3, 
  User, 
  Sparkles, 
  Star, 
  AlertCircle,
  HelpCircle,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { MatkaMarket, UserProfile, UserGuess, ChartRecord } from './types';
import { INITIAL_MARKETS } from './data/initialMarkets';
import { Header } from './components/Header';
import { LiveTicker } from './components/LiveTicker';
import { AutoUpdaterEngine } from './components/AutoUpdaterEngine';
import { LiveResultCard } from './components/LiveResultCard';
import { AddGameModal } from './components/AddGameModal';
import { ResultUpdateModal } from './components/ResultUpdateModal';
import { ChartViewer } from './components/ChartViewer';
import { UserProfileModal } from './components/UserProfileModal';
import { GuessingForum } from './components/GuessingForum';
import { PanaCalculator } from './components/PanaCalculator';
import { playResultChime, generateRealisticPana } from './utils/matkaUtils';

const STORAGE_KEY_MARKETS = 'matka_maharaj_markets_v2';
const STORAGE_KEY_PROFILE = 'matka_maharaj_profile_v2';

const DEFAULT_PROFILE: UserProfile = {
  name: 'राजा भाई (Raja Bhai)',
  phone: '+91 98*** **420',
  avatar: '👑',
  balance: 5000,
  soundEnabled: true,
  favoriteMarketIds: ['kalyan', 'main-bazar', 'milan-night'],
  luckyNumbers: {
    single: ['2', '7'],
    jodi: ['27', '72'],
    patti: ['389', '147'],
  },
  guesses: [
    {
      id: 'g-init-1',
      gameId: 'kalyan',
      gameName: 'KALYAN',
      type: 'jodi',
      number: '08',
      points: 100,
      date: '04:15 PM',
      status: 'won',
      payout: 9000,
    },
  ],
};

export default function App() {
  // Load markets from localStorage or fallback
  const [markets, setMarkets] = useState<MatkaMarket[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MARKETS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_MARKETS;
  });

  // Load user profile from localStorage or fallback
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return DEFAULT_PROFILE;
  });

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'results' | 'charts' | 'guessing' | 'calculator'>('results');
  const [chartSelectedMarketId, setChartSelectedMarketId] = useState<string>('kalyan');
  const [chartMode, setChartMode] = useState<'jodi' | 'panel'>('jodi');

  // Modals state
  const [isAddGameOpen, setIsAddGameOpen] = useState(false);
  const [isResultUpdateOpen, setIsResultUpdateOpen] = useState(false);
  const [updateTargetMarketId, setUpdateTargetMarketId] = useState<string>('kalyan');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Filters & Search for Live Board
  const [searchFilter, setSearchFilter] = useState('');
  const [marketFilter, setMarketFilter] = useState<'all' | 'popular' | 'live' | 'favorite' | 'custom'>('all');

  // Auto-updater engine states
  const [isAutoUpdating, setIsAutoUpdating] = useState(true);
  const [recentlyUpdatedId, setRecentlyUpdatedId] = useState<string | null>(null);
  const [updateLog, setUpdateLog] = useState<{ time: string; text: string }[]>([
    { time: 'अभी', text: 'कल्याण (KALYAN) रिजल्ट 389-08-369 डिक्लेयर्ड' },
    { time: '10 मिनट पहले', text: 'मेन बाजार (MAIN BAZAR) ओपन 147-2* जारी' },
  ]);

  // Persist markets to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MARKETS, JSON.stringify(markets));
    } catch {
      // ignore
    }
  }, [markets]);

  // Persist user profile to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }, [profile]);

  // Sound toggle
  const toggleSound = () => {
    setProfile((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  // Ref to always access current markets without recreating callbacks
  const marketsRef = React.useRef(markets);
  useEffect(() => {
    marketsRef.current = markets;
  }, [markets]);

  // Evaluate user guesses when a game result updates
  const evaluateUserGuesses = useCallback((marketId: string, openPana: string, jodi: string, closePana: string) => {
    setProfile((prevProfile) => {
      let balanceChange = 0;
      const updatedGuesses = prevProfile.guesses.map((guess) => {
        if (guess.gameId !== marketId || guess.status !== 'pending') {
          return guess;
        }

        let won = false;
        let payout = 0;

        if (guess.type === 'single') {
          // Open or close single ank matches
          const openAnk = jodi[0];
          const closeAnk = jodi[1];
          if (guess.number === openAnk || guess.number === closeAnk) {
            won = true;
            payout = guess.points * 9;
          }
        } else if (guess.type === 'jodi') {
          if (guess.number === jodi && !jodi.includes('*')) {
            won = true;
            payout = guess.points * 90;
          }
        } else if (guess.type === 'patti') {
          if (guess.number === openPana || guess.number === closePana) {
            won = true;
            payout = guess.points * 140;
          }
        }

        if (won) {
          balanceChange += payout;
          return { ...guess, status: 'won' as const, payout };
        } else {
          return { ...guess, status: 'lost' as const };
        }
      });

      return {
        ...prevProfile,
        balance: prevProfile.balance + balanceChange,
        guesses: updatedGuesses,
      };
    });
  }, []);

  // Handler for Result Update (Manual or from modal)
  const handleSaveResult = useCallback((
    marketId: string,
    openPana: string,
    jodi: string,
    closePana: string,
    status: 'upcoming' | 'open_declared' | 'closed'
  ) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let marketName = marketId;
    const currentMarket = marketsRef.current.find((m) => m.id === marketId);
    if (currentMarket) {
      marketName = currentMarket.name;
    }
    
    setMarkets((prevMarkets) => {
      return prevMarkets.map((m) => {
        if (m.id !== marketId) return m;

        // Push new record to chart history if closed or has full numbers
        const todayStr = new Date().toISOString().split('T')[0];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayName = days[new Date().getDay()];

        const updatedHistory = [...(m.chartHistory || [])];
        // replace today's record if already exists or prepend
        const existingIdx = updatedHistory.findIndex((r) => r.date === todayStr);
        const newRecord: ChartRecord = {
          date: todayStr,
          day: dayName,
          openPana: openPana !== '***' ? openPana : m.openPana,
          jodi: jodi !== '**' ? jodi : m.jodi,
          closePana: closePana !== '***' ? closePana : m.closePana,
        };

        if (existingIdx >= 0) {
          updatedHistory[existingIdx] = newRecord;
        } else {
          updatedHistory.unshift(newRecord);
        }

        return {
          ...m,
          openPana,
          jodi,
          closePana,
          status,
          lastUpdated: `आज ${timeNow} पर`,
          chartHistory: updatedHistory,
        };
      });
    });

    // Visual flash and chime
    setRecentlyUpdatedId(marketId);
    setTimeout(() => setRecentlyUpdatedId(null), 4000);

    if (profile.soundEnabled) {
      try {
        playResultChime();
      } catch {
        // Safe sound fallback
      }
    }

    // Evaluate demo bets
    evaluateUserGuesses(marketId, openPana, jodi, closePana);

    // Add to update log
    setUpdateLog((prev) => [
      { time: timeNow, text: `${marketName} रिजल्ट [${openPana}-${jodi}-${closePana}] अपडेट हुआ` },
      ...prev.slice(0, 9),
    ]);
  }, [profile.soundEnabled, evaluateUserGuesses]);

  // Automated result update trigger (used by background auto engine and quick flash)
  const handleTriggerInstantAutoUpdate = useCallback((targetMarketId?: string) => {
    const currentMarkets = marketsRef.current;
    // Pick eligible markets that have autoUpdateEnabled
    const eligibleMarkets = currentMarkets.filter((m) => m.autoUpdateEnabled !== false);
    if (eligibleMarkets.length === 0) return;

    let target: MatkaMarket;
    if (targetMarketId) {
      target = currentMarkets.find((m) => m.id === targetMarketId) || eligibleMarkets[0];
    } else {
      // Pick a random eligible game
      const randIdx = Math.floor(Math.random() * eligibleMarkets.length);
      target = eligibleMarkets[randIdx];
    }

    // Generate realistic result using authentic Matka math
    const open = generateRealisticPana();
    const close = generateRealisticPana();
    const jodi = `${open.ank}${close.ank}`;

    handleSaveResult(target.id, open.pana, jodi, close.pana, 'closed');
  }, [handleSaveResult]);

  // Add new game
  const handleAddMarket = (newMarket: MatkaMarket) => {
    setMarkets((prev) => [newMarket, ...prev]);
    // Also add to update log
    setUpdateLog((prev) => [
      { time: 'अभी', text: `नया गेम जोड़ा गया: ${newMarket.name} (${newMarket.openTime} - ${newMarket.closeTime})` },
      ...prev.slice(0, 9),
    ]);
    // Auto highlight in chart
    setChartSelectedMarketId(newMarket.id);
  };

  // Toggle favorite
  const handleToggleFavorite = (id: string) => {
    setProfile((prev) => {
      const isFav = prev.favoriteMarketIds.includes(id);
      return {
        ...prev,
        favoriteMarketIds: isFav
          ? prev.favoriteMarketIds.filter((mId) => mId !== id)
          : [...prev.favoriteMarketIds, id],
      };
    });
  };

  // Filtered markets for display
  const filteredMarkets = markets.filter((m) => {
    // Search query match
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      const matchName = m.name.toLowerCase().includes(q);
      const matchHindi = m.hindiName && m.hindiName.includes(q);
      const matchJodi = m.jodi.includes(q);
      if (!matchName && !matchHindi && !matchJodi) return false;
    }

    // Category filter
    if (marketFilter === 'popular') return m.isPopular;
    if (marketFilter === 'live') return m.status === 'open_declared';
    if (marketFilter === 'favorite') return profile.favoriteMarketIds.includes(m.id);
    if (marketFilter === 'custom') return m.isCustom;
    return true;
  });

  const liveCount = markets.filter((m) => m.status === 'open_declared').length;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      {/* 1. Header Navigation */}
      <Header
        userProfile={profile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddGame={() => setIsAddGameOpen(true)}
        onOpenResultUpdate={() => {
          setUpdateTargetMarketId(markets[0]?.id || 'kalyan');
          setIsResultUpdateOpen(true);
        }}
        onOpenProfile={() => setIsProfileOpen(true)}
        soundEnabled={profile.soundEnabled}
        onToggleSound={toggleSound}
        totalMarketsCount={markets.length}
        liveCount={liveCount}
      />

      {/* 2. Top Marquee Breaking Result Ticker */}
      <LiveTicker
        markets={markets}
        onSelectMarketForChart={(id) => {
          setChartSelectedMarketId(id);
          setActiveTab('charts');
        }}
      />

      {/* 3. Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full space-y-6">
        
        {/* VIEW 1: LIVE RESULTS BOARD */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            
            {/* Auto-Updating Engine Controller Banner ("बाकी गेम अपने आप अपडेट होते रहे") */}
            <AutoUpdaterEngine
              markets={markets}
              isAutoUpdating={isAutoUpdating}
              onToggleAutoUpdating={() => setIsAutoUpdating(!isAutoUpdating)}
              onTriggerInstantAutoUpdate={handleTriggerInstantAutoUpdate}
              updateLog={updateLog}
            />

            {/* Filter & Search Bar */}
            <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-md">
              
              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
                {[
                  { id: 'all', label: `सभी मार्केट्स (${markets.length})` },
                  { id: 'popular', label: '🔥 लोकप्रिय' },
                  { id: 'live', label: `🔴 लाइव चालू (${liveCount})` },
                  { id: 'favorite', label: `⭐ पसंदीदा (${profile.favoriteMarketIds.length})` },
                  { id: 'custom', label: `★ नए जोड़े गए (${markets.filter(m => m.isCustom).length})` },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setMarketFilter(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      marketFilter === tab.id
                        ? 'bg-amber-500 text-stone-950 font-black shadow'
                        : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="गेम का नाम या जोड़ी खोजें..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500 placeholder-stone-600"
                />
              </div>
            </div>

            {/* Grid of Matka Market Live Result Cards */}
            {filteredMarkets.length === 0 ? (
              <div className="text-center py-12 bg-stone-900/50 rounded-2xl border border-stone-800 p-8 space-y-3">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                <h3 className="text-base font-bold text-stone-200">कोई गेम नहीं मिला</h3>
                <p className="text-xs text-stone-400">
                  आपके खोजे गए फ़िल्टर के अनुसार कोई मार्केट उपलब्ध नहीं है।
                </p>
                <button
                  onClick={() => setIsAddGameOpen(true)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-500 transition"
                >
                  + नया गेम अभी जोड़ें
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {filteredMarkets.map((market) => (
                  <LiveResultCard
                    key={market.id}
                    market={market}
                    isFavorite={profile.favoriteMarketIds.includes(market.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onOpenJodiChart={(id) => {
                      setChartSelectedMarketId(id);
                      setChartMode('jodi');
                      setActiveTab('charts');
                    }}
                    onOpenPanelChart={(id) => {
                      setChartSelectedMarketId(id);
                      setChartMode('panel');
                      setActiveTab('charts');
                    }}
                    onOpenUpdateModal={(id) => {
                      setUpdateTargetMarketId(id);
                      setIsResultUpdateOpen(true);
                    }}
                    onQuickRoll={(id) => handleTriggerInstantAutoUpdate(id)}
                    isRecentlyUpdated={recentlyUpdatedId === market.id}
                  />
                ))}
              </div>
            )}

            {/* Quick Action Floating Bar for Fast Operations */}
            <div className="bg-gradient-to-r from-amber-950/40 via-stone-900 to-amber-950/40 border border-amber-600/30 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span className="text-stone-300">
                  क्या आप कोई नया मटका गेम जोड़ना चाहते हैं या रिजल्ट बदलना चाहते हैं?
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddGameOpen(true)}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-bold transition"
                >
                  + नया गेम जोड़ें
                </button>
                <button
                  onClick={() => {
                    setUpdateTargetMarketId(markets[0]?.id || 'kalyan');
                    setIsResultUpdateOpen(true);
                  }}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg font-bold transition"
                >
                  ⚡ रिजल्ट अपडेट करें
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: JODI & PANEL CHARTS */}
        {activeTab === 'charts' && (
          <ChartViewer
            markets={markets}
            initialMarketId={chartSelectedMarketId}
            initialMode={chartMode}
          />
        )}

        {/* VIEW 3: LUCKY GUESSING FORUM & OTC */}
        {activeTab === 'guessing' && (
          <GuessingForum markets={markets} />
        )}

        {/* VIEW 4: PATTI / PANA CALCULATOR */}
        {activeTab === 'calculator' && (
          <PanaCalculator />
        )}

      </main>

      {/* 4. Authentic Disclaimer & Footer */}
      <footer className="bg-stone-950 border-t border-stone-800/80 mt-12 py-8 text-stone-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-4 border-b border-stone-900">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-400" />
              <span className="font-black text-stone-200 text-sm font-['Cinzel',serif]">
                MATKA MAHARAJ (मटका महाराज)
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-stone-400 text-xs">
              <button onClick={() => setActiveTab('results')} className="hover:text-amber-400">
                लाइव रिजल्ट
              </button>
              <button onClick={() => setActiveTab('charts')} className="hover:text-amber-400">
                कल्याण चार्ट
              </button>
              <button onClick={() => setActiveTab('guessing')} className="hover:text-amber-400">
                लकी गेसिंग
              </button>
              <button onClick={() => setIsProfileOpen(true)} className="hover:text-amber-400">
                यूजर प्रोफाइल
              </button>
            </div>
          </div>

          <div className="bg-stone-900/60 p-3 rounded-lg border border-stone-800/80 flex items-start gap-2.5 text-[11px] text-stone-400">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p>
              <b>महत्वपूर्ण अस्वीकरण (Disclaimer):</b> यह वेबसाइट केवल सूचना, अंक गणितीय गणना और मनोरंजन के उद्देश्य के लिए बनाई गई है। हम किसी भी अवैध सट्टा या जुए को बढ़ावा नहीं देते। कृपया अपने स्थानीय कानूनों का सम्मान करें।
            </p>
          </div>

          <div className="text-center text-[11px] text-stone-400">
            © {new Date().getFullYear()} Matka Maharaj. All Rights Reserved. Real-time Live Result Engine v2.5
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Add Game Modal ("नए गेम ऐड कर सके") */}
      <AddGameModal
        isOpen={isAddGameOpen}
        onClose={() => setIsAddGameOpen(false)}
        onAddMarket={handleAddMarket}
      />

      {/* 2. Result Update Modal ("result update") */}
      <ResultUpdateModal
        isOpen={isResultUpdateOpen}
        onClose={() => setIsResultUpdateOpen(false)}
        markets={markets}
        selectedMarketId={updateTargetMarketId}
        onSaveResult={handleSaveResult}
      />

      {/* 3. User Profile & Demo Slip Modal ("user profile ka feature") */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        markets={markets}
        onUpdateProfile={(updated) => setProfile((p) => ({ ...p, ...updated }))}
        onAddGuess={(newGuess) =>
          setProfile((p) => ({
            ...p,
            balance: p.balance - newGuess.points,
            guesses: [newGuess, ...p.guesses],
          }))
        }
        onRefillBalance={(amt) =>
          setProfile((p) => ({ ...p, balance: p.balance + amt }))
        }
      />
    </div>
  );
}
