import React from 'react';
import { Star, BarChart2, Table, RefreshCw, Sparkles, Clock, Flame } from 'lucide-react';
import { MatkaMarket } from '../types';

interface LiveResultCardProps {
  market: MatkaMarket;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenJodiChart: (marketId: string) => void;
  onOpenPanelChart: (marketId: string) => void;
  onOpenUpdateModal: (marketId: string) => void;
  onQuickRoll: (marketId: string) => void;
  isRecentlyUpdated?: boolean;
}

export const LiveResultCard: React.FC<LiveResultCardProps> = ({
  market,
  isFavorite,
  onToggleFavorite,
  onOpenJodiChart,
  onOpenPanelChart,
  onOpenUpdateModal,
  onQuickRoll,
  isRecentlyUpdated,
}) => {
  // Determine badge style
  const getStatusBadge = () => {
    switch (market.status) {
      case 'open_declared':
        return (
          <span className="inline-flex items-center gap-1 bg-red-600/90 text-white font-black text-[11px] px-2 py-0.5 rounded shadow">
            <Flame className="w-3 h-3 animate-pulse" /> ओपन डिक्लेयर्ड (RUNNING)
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-700/80 text-emerald-100 font-bold text-[11px] px-2 py-0.5 rounded">
            पूर्ण रिजल्ट (CLOSED)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-stone-800 text-stone-300 font-bold text-[11px] px-2 py-0.5 rounded border border-stone-700">
            <Clock className="w-3 h-3 text-amber-400" /> आगामी (UPCOMING)
          </span>
        );
    }
  };

  return (
    <div
      className={`relative rounded-xl overflow-hidden border transition-all duration-300 ${
        isRecentlyUpdated
          ? 'bg-gradient-to-b from-amber-950/60 to-stone-900 border-amber-400 shadow-2xl shadow-amber-500/20 ring-2 ring-amber-400/50 scale-[1.01]'
          : 'bg-stone-900/90 hover:bg-stone-850 border-amber-600/25 hover:border-amber-500/60 shadow-lg'
      }`}
    >
      {/* Top Header Row of Card */}
      <div className="bg-stone-950/80 px-3.5 py-2.5 flex items-center justify-between border-b border-stone-800/80">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(market.id)}
            className={`p-1 rounded transition ${
              isFavorite ? 'text-amber-400 hover:text-amber-300' : 'text-stone-600 hover:text-stone-400'
            }`}
            title={isFavorite ? 'पसंदीदा से हटाएं' : 'पसंदीदा में जोड़ें'}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black tracking-wide text-amber-300 font-['Cinzel',serif]">
                {market.name}
              </h3>
              {market.isCustom && (
                <span className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                  CUSTOM GAME
                </span>
              )}
            </div>
            {market.hindiName && (
              <div className="text-[11px] text-stone-400 font-medium">{market.hindiName}</div>
            )}
          </div>
        </div>

        <div>{getStatusBadge()}</div>
      </div>

      {/* Center Result Display */}
      <div className="p-4 text-center">
        {/* Market Timings */}
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-stone-400 mb-3">
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>ओपन: <b className="text-stone-200">{market.openTime}</b></span>
          <span className="text-stone-600">|</span>
          <span>क्लोज: <b className="text-stone-200">{market.closeTime}</b></span>
        </div>

        {/* Big Result Value */}
        <div className="py-2.5 px-3 bg-stone-950 rounded-lg border border-amber-600/30 inline-block w-full shadow-inner">
          <div className="flex items-center justify-center gap-2 sm:gap-4 font-mono font-black text-2xl sm:text-3xl tracking-wider text-yellow-400">
            {/* Open Pana */}
            <span className="bg-stone-900 px-2 sm:px-3 py-1 rounded text-stone-300 border border-stone-800 text-lg sm:text-2xl">
              {market.openPana || '***'}
            </span>

            <span className="text-amber-500 text-xl font-bold">-</span>

            {/* Jodi */}
            <span className="bg-amber-500 text-stone-950 px-3 sm:px-4 py-1 rounded text-2xl sm:text-3xl font-extrabold shadow-md">
              {market.jodi || '**'}
            </span>

            <span className="text-amber-500 text-xl font-bold">-</span>

            {/* Close Pana */}
            <span className="bg-stone-900 px-2 sm:px-3 py-1 rounded text-stone-300 border border-stone-800 text-lg sm:text-2xl">
              {market.closePana || '***'}
            </span>
          </div>

          <div className="mt-1.5 flex items-center justify-between text-[11px] text-stone-400 px-2">
            <span>ओपन पाना</span>
            <span className="font-bold text-amber-300">जोड़ी</span>
            <span>क्लोज पाना</span>
          </div>
        </div>

        {/* Last updated notice */}
        <div className="mt-2 text-[11px] text-stone-400">
          {market.lastUpdated ? `अपडेट: ${market.lastUpdated}` : 'लाइव सिंक'}
        </div>
      </div>

      {/* Action Footer: Charts and Admin tools */}
      <div className="bg-stone-950/60 px-3 py-2 border-t border-stone-800/80 flex items-center justify-between gap-1 sm:gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onOpenJodiChart(market.id)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-200 rounded text-xs font-bold transition border border-stone-700 hover:border-amber-500/50"
            title="जोड़ी चार्ट देखें"
          >
            <BarChart2 className="w-3.5 h-3.5 text-amber-400" />
            <span>जोड़ी चार्ट</span>
          </button>

          <button
            onClick={() => onOpenPanelChart(market.id)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-200 rounded text-xs font-bold transition border border-stone-700 hover:border-amber-500/50"
            title="पैनल / पाना चार्ट देखें"
          >
            <Table className="w-3.5 h-3.5 text-amber-400" />
            <span>पैनल चार्ट</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onQuickRoll(market.id)}
            className="p-1.5 bg-stone-800 hover:bg-amber-950 text-amber-400 rounded text-xs font-bold transition border border-stone-700 hover:border-amber-500/50"
            title="क्विक ऑटो-रोल (नया रिजल्ट जनरेट करें)"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onOpenUpdateModal(market.id)}
            className="flex items-center gap-1 px-2 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 rounded text-xs font-black transition shadow"
            title="एडमिन द्वारा रिजल्ट बदलें"
          >
            <RefreshCw className="w-3 h-3 text-stone-950" />
            <span>अपडेट</span>
          </button>
        </div>
      </div>
    </div>
  );
};
