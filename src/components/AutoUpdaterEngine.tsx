import React, { useState, useEffect } from 'react';
import { Play, Pause, Zap, Clock, ShieldCheck, Activity, RotateCw } from 'lucide-react';
import { MatkaMarket } from '../types';

interface AutoUpdaterEngineProps {
  markets: MatkaMarket[];
  isAutoUpdating: boolean;
  onToggleAutoUpdating: () => void;
  onTriggerInstantAutoUpdate: (marketId?: string) => void;
  lastUpdatedMarketName?: string;
  updateLog: { time: string; text: string }[];
}

export const AutoUpdaterEngine: React.FC<AutoUpdaterEngineProps> = ({
  markets,
  isAutoUpdating,
  onToggleAutoUpdating,
  onTriggerInstantAutoUpdate,
  lastUpdatedMarketName,
  updateLog,
}) => {
  const [countdown, setCountdown] = useState(25);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!isAutoUpdating) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Trigger automated result update cycle
          onTriggerInstantAutoUpdate();
          return 30; // reset to 30 seconds
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAutoUpdating, onTriggerInstantAutoUpdate]);

  return (
    <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border border-amber-500/30 rounded-xl p-3 sm:p-4 shadow-lg mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Status indicator */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className={`w-3.5 h-3.5 rounded-full ${
                isAutoUpdating ? 'bg-emerald-500' : 'bg-red-500'
              }`}
            />
            {isAutoUpdating && (
              <div className="absolute -inset-1 rounded-full bg-emerald-500/40 animate-ping" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-amber-200 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-amber-400" />
                ऑटो-अपडेट लाइव इंजन (Auto Results Engine)
              </h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                  isAutoUpdating
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-600/40'
                    : 'bg-stone-800 text-stone-400'
                }`}
              >
                {isAutoUpdating ? 'सक्रिय (ACTIVE)' : 'पॉज़ (PAUSED)'}
              </span>
            </div>
            <p className="text-xs text-stone-400">
              सभी गेम्स निर्धारित समय और ऑटो-इंजन द्वारा अपने आप रिजल्ट अपडेट करते रहते हैं।
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Next update countdown */}
          {isAutoUpdating && (
            <div className="flex items-center gap-1 bg-stone-950 px-2.5 py-1.5 rounded-lg border border-stone-800 text-xs font-mono font-bold text-amber-300">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>अगला ऑटो-चेक: {countdown}s</span>
            </div>
          )}

          {/* Toggle Button */}
          <button
            onClick={onToggleAutoUpdating}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              isAutoUpdating
                ? 'bg-amber-950/80 text-amber-300 border border-amber-600/50 hover:bg-amber-900'
                : 'bg-emerald-700 text-white hover:bg-emerald-600'
            }`}
          >
            {isAutoUpdating ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>पॉज़ करें</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>ऑटो-अपडेट शुरू करें</span>
              </>
            )}
          </button>

          {/* Manual Flash Test Button */}
          <button
            onClick={() => {
              onTriggerInstantAutoUpdate();
              setCountdown(30);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white rounded-lg text-xs font-black shadow transition active:scale-95"
            title="अभी किसी एक गेम का नया लाइव रिजल्ट तैयार और अपडेट करें"
          >
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
            <span>अभी ऑटो-फ्लैश करें</span>
          </button>

          {/* Expand / View Log */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-stone-400 hover:text-amber-300 text-xs underline px-1 py-1"
          >
            {isExpanded ? 'लॉग छिपाएं' : 'अपडेट लॉग'}
          </button>
        </div>
      </div>

      {/* Expanded Logs */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-stone-800">
          <div className="text-xs font-bold text-stone-300 mb-1.5 flex items-center justify-between">
            <span>हाल ही में ऑटो-अपडेट हुए रिजल्ट्स:</span>
            <span className="text-[11px] text-stone-500">कुल मार्केट्स: {markets.length}</span>
          </div>
          <div className="max-h-32 overflow-y-auto space-y-1 text-xs font-mono bg-stone-950/70 p-2 rounded-lg border border-stone-800">
            {updateLog.length === 0 ? (
              <div className="text-stone-500 italic py-1">कोई नया ऑटो-अपडेट अभी तक नहीं हुआ।</div>
            ) : (
              updateLog.map((log, i) => (
                <div key={i} className="flex items-center justify-between text-stone-300">
                  <span className="text-amber-400">{log.text}</span>
                  <span className="text-stone-500 text-[10px]">{log.time}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
