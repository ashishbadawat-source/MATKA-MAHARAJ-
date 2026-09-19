import React from 'react';
import { Sparkles, Megaphone, Zap } from 'lucide-react';
import { MatkaMarket } from '../types';

interface LiveTickerProps {
  markets: MatkaMarket[];
  onSelectMarketForChart: (marketId: string) => void;
}

export const LiveTicker: React.FC<LiveTickerProps> = ({ markets, onSelectMarketForChart }) => {
  // Take the 5 most recently active or popular markets
  const activeMarkets = markets.slice(0, 8);

  return (
    <div className="bg-stone-900/90 border-y border-amber-600/30 overflow-hidden relative shadow-md">
      <div className="max-w-7xl mx-auto flex items-center">
        {/* Static Title Tag */}
        <div className="bg-red-700 text-white font-black px-3 py-2 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5 shrink-0 z-10 shadow-lg">
          <Zap className="w-3.5 h-3.5 text-yellow-300 animate-bounce" />
          <span className="hidden sm:inline">सुपर फास्ट रिजल्ट</span>
          <span className="sm:hidden">लाइव</span>
        </div>

        {/* Marquee ticker */}
        <div className="overflow-x-hidden flex-1 py-1.5">
          <div className="flex animate-[marquee_25s_linear_infinite] whitespace-nowrap gap-6 text-xs sm:text-sm font-bold">
            {activeMarkets.map((m) => (
              <button
                key={m.id}
                onClick={() => onSelectMarketForChart(m.id)}
                className="inline-flex items-center gap-2 text-stone-300 hover:text-amber-400 transition cursor-pointer"
              >
                <span className="text-amber-400 font-extrabold">{m.name}:</span>
                <span className="font-mono bg-stone-950 px-2 py-0.5 rounded border border-amber-500/20 text-yellow-300 font-black">
                  {m.openPana}-{m.jodi}-{m.closePana}
                </span>
                <span className="text-[11px] text-stone-400">({m.openTime} - {m.closeTime})</span>
                <span className="text-amber-600/60">•</span>
              </button>
            ))}
            {/* Repeat items for seamless loop */}
            {activeMarkets.map((m) => (
              <button
                key={`repeat-${m.id}`}
                onClick={() => onSelectMarketForChart(m.id)}
                className="inline-flex items-center gap-2 text-stone-300 hover:text-amber-400 transition cursor-pointer"
              >
                <span className="text-amber-400 font-extrabold">{m.name}:</span>
                <span className="font-mono bg-stone-950 px-2 py-0.5 rounded border border-amber-500/20 text-yellow-300 font-black">
                  {m.openPana}-{m.jodi}-{m.closePana}
                </span>
                <span className="text-[11px] text-stone-400">({m.openTime} - {m.closeTime})</span>
                <span className="text-amber-600/60">•</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
