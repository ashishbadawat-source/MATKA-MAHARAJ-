import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Sparkles, Check, ArrowRight, Dices, Flame } from 'lucide-react';
import { MatkaMarket } from '../types';
import { calculateAnkFromPana, generateRealisticPana } from '../utils/matkaUtils';

interface ResultUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  markets: MatkaMarket[];
  selectedMarketId?: string;
  onSaveResult: (
    marketId: string,
    openPana: string,
    jodi: string,
    closePana: string,
    status: 'upcoming' | 'open_declared' | 'closed'
  ) => void;
}

export const ResultUpdateModal: React.FC<ResultUpdateModalProps> = ({
  isOpen,
  onClose,
  markets,
  selectedMarketId,
  onSaveResult,
}) => {
  const [marketId, setMarketId] = useState(selectedMarketId || (markets[0]?.id ?? ''));
  const [openPana, setOpenPana] = useState('');
  const [closePana, setClosePana] = useState('');
  const [jodiOverride, setJodiOverride] = useState('');
  const [updateMode, setUpdateMode] = useState<'full' | 'open_only' | 'close_only'>('full');

  useEffect(() => {
    if (selectedMarketId) {
      setMarketId(selectedMarketId);
    }
  }, [selectedMarketId]);

  // When marketId changes, preload its current results
  useEffect(() => {
    const market = markets.find((m) => m.id === marketId);
    if (market) {
      setOpenPana(market.openPana !== '***' ? market.openPana : '');
      setClosePana(market.closePana !== '***' ? market.closePana : '');
      setJodiOverride(market.jodi !== '**' ? market.jodi : '');
    }
  }, [marketId, markets]);

  if (!isOpen) return null;

  const currentMarket = markets.find((m) => m.id === marketId) || markets[0];

  // Calculated Ank
  const calculatedOpenAnk = calculateAnkFromPana(openPana);
  const calculatedCloseAnk = calculateAnkFromPana(closePana);

  // Auto composite Jodi
  const autoJodi =
    calculatedOpenAnk !== '*' && calculatedCloseAnk !== '*'
      ? `${calculatedOpenAnk}${calculatedCloseAnk}`
      : calculatedOpenAnk !== '*'
      ? `${calculatedOpenAnk}*`
      : '**';

  const effectiveJodi = jodiOverride.trim() ? jodiOverride.trim() : autoJodi;

  // Handler to roll realistic Pana using standard Matka formulas
  const handleRandomRoll = () => {
    const open = generateRealisticPana();
    const close = generateRealisticPana();
    setOpenPana(open.pana);
    setClosePana(close.pana);
    setJodiOverride(`${open.ank}${close.ank}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!marketId) return;

    let finalOpen = openPana.trim() || '***';
    let finalClose = closePana.trim() || '***';
    let finalJodi = effectiveJodi;
    let status: 'upcoming' | 'open_declared' | 'closed' = 'closed';

    if (updateMode === 'open_only') {
      finalClose = '***';
      finalJodi = calculatedOpenAnk !== '*' ? `${calculatedOpenAnk}*` : '**';
      status = 'open_declared';
    } else if (updateMode === 'close_only') {
      status = 'closed';
    } else {
      status = finalClose !== '***' ? 'closed' : 'open_declared';
    }

    onSaveResult(marketId, finalOpen, finalJodi, finalClose, status);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-stone-900 border border-amber-500/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 px-5 py-4 text-stone-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 font-black" />
            <h2 className="text-lg font-black tracking-wide font-['Cinzel',serif]">
              रिजल्ट अपडेट पैनल (Result Update)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-stone-950/20 text-stone-950 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Select Market */}
          <div>
            <label className="text-xs font-bold text-amber-200 block mb-1">
              मार्केट चुनें (Select Game) *
            </label>
            <select
              value={marketId}
              onChange={(e) => setMarketId(e.target.value)}
              className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2.5 text-amber-300 font-bold text-sm focus:outline-none focus:border-amber-500"
            >
              {markets.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} {m.hindiName ? `(${m.hindiName})` : ''} - [{m.openPana}-{m.jodi}-{m.closePana}]
                </option>
              ))}
            </select>
          </div>

          {/* Quick Roll Tool */}
          <div className="flex items-center justify-between bg-stone-950 p-2.5 rounded-lg border border-amber-600/30">
            <span className="text-xs text-stone-300 font-medium">
              मटका फॉर्मूला से ऑटो नंबर तैयार करें:
            </span>
            <button
              type="button"
              onClick={handleRandomRoll}
              className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded transition shadow"
            >
              <Dices className="w-3.5 h-3.5" />
              <span>🎲 रैंडम ऑटो-रोल</span>
            </button>
          </div>

          {/* Mode Selector */}
          <div>
            <label className="text-xs font-bold text-stone-400 block mb-1.5">
              अपडेट का प्रकार (Update Type):
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setUpdateMode('full')}
                className={`py-2 rounded-lg border transition ${
                  updateMode === 'full'
                    ? 'bg-amber-500 text-stone-950 border-amber-400 font-black'
                    : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                }`}
              >
                पूर्ण रिजल्ट (Full)
              </button>
              <button
                type="button"
                onClick={() => setUpdateMode('open_only')}
                className={`py-2 rounded-lg border transition ${
                  updateMode === 'open_only'
                    ? 'bg-amber-500 text-stone-950 border-amber-400 font-black'
                    : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                }`}
              >
                सिर्फ ओपन (Open)
              </button>
              <button
                type="button"
                onClick={() => setUpdateMode('close_only')}
                className={`py-2 rounded-lg border transition ${
                  updateMode === 'close_only'
                    ? 'bg-amber-500 text-stone-950 border-amber-400 font-black'
                    : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                }`}
              >
                सिर्फ क्लोज (Close)
              </button>
            </div>
          </div>

          {/* Pana Inputs */}
          <div className="grid grid-cols-2 gap-3">
            {/* Open Pana */}
            <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
              <label className="text-xs font-bold text-amber-200 block mb-1">
                ओपन पाना (3 Digit Pana)
              </label>
              <input
                type="text"
                maxLength={3}
                placeholder="e.g. 389"
                value={openPana}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setOpenPana(val);
                }}
                className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-center text-xl font-mono font-black text-amber-300 focus:outline-none focus:border-amber-500"
              />
              <div className="mt-1 text-[11px] text-stone-400 text-center">
                ओपन अंक: <b className="text-yellow-400 text-sm font-mono">{calculatedOpenAnk}</b>
                {openPana.length === 3 && (
                  <span className="block text-[10px] text-stone-500">
                    ({openPana[0]}+{openPana[1]}+{openPana[2]}%10)
                  </span>
                )}
              </div>
            </div>

            {/* Close Pana */}
            <div className={`bg-stone-950 p-3 rounded-xl border border-stone-800 ${updateMode === 'open_only' ? 'opacity-40' : ''}`}>
              <label className="text-xs font-bold text-amber-200 block mb-1">
                क्लोज पाना (3 Digit Pana)
              </label>
              <input
                type="text"
                maxLength={3}
                disabled={updateMode === 'open_only'}
                placeholder="e.g. 369"
                value={closePana}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setClosePana(val);
                }}
                className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-center text-xl font-mono font-black text-amber-300 focus:outline-none focus:border-amber-500 disabled:bg-stone-950"
              />
              <div className="mt-1 text-[11px] text-stone-400 text-center">
                क्लोज अंक: <b className="text-yellow-400 text-sm font-mono">{calculatedCloseAnk}</b>
                {closePana.length === 3 && (
                  <span className="block text-[10px] text-stone-500">
                    ({closePana[0]}+{closePana[1]}+{closePana[2]}%10)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Jodi Display & Manual Override */}
          <div className="bg-stone-950 p-3 rounded-xl border border-amber-600/30 text-center">
            <label className="text-xs font-bold text-stone-300 block mb-1">
              जोड़ी (Jodi - Auto Calculated / Override)
            </label>
            <div className="flex items-center justify-center gap-3">
              <span className="font-mono text-3xl font-black text-yellow-400 bg-stone-900 px-4 py-1 rounded border border-amber-500/40">
                {effectiveJodi}
              </span>
              <input
                type="text"
                maxLength={2}
                placeholder="मैनुअल"
                value={jodiOverride}
                onChange={(e) => setJodiOverride(e.target.value.replace(/[^0-9*]/g, ''))}
                className="w-20 bg-stone-900 border border-stone-700 rounded px-2 py-1 text-center font-mono font-bold text-sm text-stone-200 focus:outline-none focus:border-amber-500"
                title="यदि चाहें तो यहाँ सीधे जोड़ी बदलें"
              />
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              लाइव रिजल्ट प्रीव्यू: <span className="font-mono text-amber-300 font-bold">{openPana || '***'}-{effectiveJodi}-{updateMode === 'open_only' ? '***' : (closePana || '***')}</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-black text-sm rounded-xl shadow-lg shadow-amber-950/60 transition transform active:scale-98 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>तुरंत रिजल्ट डिक्लेयर & सेव करें</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
