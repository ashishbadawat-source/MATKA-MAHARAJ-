import React, { useState } from 'react';
import { Calculator, Sparkles, Check, Info } from 'lucide-react';
import { calculateAnkFromPana } from '../utils/matkaUtils';

export const PanaCalculator: React.FC = () => {
  const [panaInput, setPanaInput] = useState('389');
  const [selectedDigit, setSelectedDigit] = useState('0');

  const clean = panaInput.replace(/\D/g, '').slice(0, 3);
  const d1 = clean[0] ? parseInt(clean[0], 10) : 0;
  const d2 = clean[1] ? parseInt(clean[1], 10) : 0;
  const d3 = clean[2] ? parseInt(clean[2], 10) : 0;
  const totalSum = clean.length > 0 ? d1 + d2 + d3 : 0;
  const singleAnk = clean.length === 3 ? (totalSum % 10).toString() : '*';

  // Sample Panas for the selected single Ank (0-9)
  const samplePanasByAnk: { [key: string]: { sp: string[]; dp: string[]; tp: string } } = {
    '0': { sp: ['127', '136', '145', '235', '389', '479'], dp: ['118', '226', '334', '442', '550'], tp: '000' },
    '1': { sp: ['128', '137', '146', '236', '245', '380'], dp: ['119', '227', '335', '551', '669'], tp: '777' },
    '2': { sp: ['129', '138', '147', '156', '237', '345'], dp: ['110', '228', '336', '444', '660'], tp: '444' },
    '3': { sp: ['120', '139', '148', '157', '238', '247'], dp: ['166', '229', '337', '553', '779'], tp: '111' },
    '4': { sp: ['130', '149', '158', '167', '239', '248'], dp: ['112', '220', '338', '446', '770'], tp: '888' },
    '5': { sp: ['140', '159', '168', '230', '249', '258'], dp: ['113', '221', '339', '447', '555'], tp: '555' },
    '6': { sp: ['150', '169', '178', '240', '259', '268'], dp: ['114', '222', '330', '448', '880'], tp: '222' },
    '7': { sp: ['160', '179', '250', '269', '278', '340'], dp: ['115', '223', '331', '449', '999'], tp: '999' },
    '8': { sp: ['170', '189', '260', '279', '350', '369'], dp: ['116', '224', '332', '440', '666'], tp: '666' },
    '9': { sp: ['180', '270', '289', '360', '379', '450'], dp: ['117', '225', '333', '441', '775'], tp: '333' },
  };

  const currentAnkData = samplePanasByAnk[selectedDigit] || samplePanasByAnk['0'];

  return (
    <div className="bg-stone-900 border border-amber-600/30 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-stone-800">
        <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-black text-amber-300 font-['Cinzel',serif]">
            पाना (पत्ती) से सिंगल अंक कैलकुलेटर
          </h2>
          <p className="text-xs text-stone-400">
            मटका गणित का नियम: 3 अंकों के पाना का योग % 10 = सिंगल ओपन/क्लोज अंक
          </p>
        </div>
      </div>

      {/* Live Calculator input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="bg-stone-950 p-5 rounded-xl border border-stone-800 space-y-3">
          <label className="text-xs font-bold text-amber-200 block">
            3-अंकीय पाना / पत्ती दर्ज करें:
          </label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              maxLength={3}
              placeholder="389"
              value={panaInput}
              onChange={(e) => setPanaInput(e.target.value.replace(/\D/g, ''))}
              className="bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-center text-3xl font-mono font-black text-amber-300 focus:outline-none focus:border-amber-500 w-full"
            />
          </div>

          <div className="text-xs text-stone-400 space-y-1">
            <div className="flex justify-between">
              <span>अंकों का जोड़:</span>
              <span className="font-mono text-stone-200 font-bold">
                {clean.split('').join(' + ') || '0'} = {totalSum}
              </span>
            </div>
            <div className="flex justify-between">
              <span>अंतिम अंक (Single Ank):</span>
              <span className="font-mono text-yellow-400 font-bold">
                {totalSum} % 10 = {singleAnk}
              </span>
            </div>
          </div>
        </div>

        {/* Result Showcase */}
        <div className="bg-gradient-to-br from-amber-950/40 via-stone-950 to-stone-900 border border-amber-500/40 p-5 rounded-xl text-center">
          <div className="text-xs text-stone-400 font-semibold mb-1">परिणामी सिंगल अंक</div>
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-b from-yellow-300 to-amber-600 text-stone-950 font-black text-4xl flex items-center justify-center shadow-xl shadow-amber-900/50 font-mono ring-4 ring-amber-400/30 my-2">
            {singleAnk}
          </div>
          <div className="text-xs font-bold text-amber-300 mt-2">
            पाना [{clean || '***'}] का ओपन/क्लोज अंक = {singleAnk}
          </div>
        </div>
      </div>

      {/* Pana Family Lookup by Single Ank */}
      <div className="pt-4 border-t border-stone-800">
        <h3 className="text-sm font-bold text-amber-300 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          सिंगल अंक के सभी मुख्य पाना (Single Pana / Double Pana / Triple Pana):
        </h3>

        {/* Ank Selector Buttons 0 to 9 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => setSelectedDigit(digit)}
              className={`w-9 h-9 rounded-xl font-mono font-black text-sm transition ${
                selectedDigit === digit
                  ? 'bg-amber-500 text-stone-950 shadow-lg scale-105 ring-2 ring-amber-400'
                  : 'bg-stone-950 text-stone-300 border border-stone-800 hover:border-amber-500/40'
              }`}
            >
              {digit}
            </button>
          ))}
        </div>

        {/* Pana list for selected digit */}
        <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
          <div className="text-xs font-bold text-amber-400">
            अंक [{selectedDigit}] के लिए प्रमुख पत्तियां:
          </div>

          <div>
            <div className="text-[11px] text-stone-400 mb-1 font-semibold">
              ★ सिंगल पाना (SP):
            </div>
            <div className="flex flex-wrap gap-2">
              {currentAnkData.sp.map((p) => (
                <span
                  key={p}
                  onClick={() => setPanaInput(p)}
                  className="px-2.5 py-1 rounded bg-stone-900 text-stone-200 border border-stone-800 font-mono text-xs cursor-pointer hover:border-amber-500 hover:text-amber-300"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[11px] text-stone-400 mb-1 font-semibold">
              ★ डबल पाना (DP):
            </div>
            <div className="flex flex-wrap gap-2">
              {currentAnkData.dp.map((p) => (
                <span
                  key={p}
                  onClick={() => setPanaInput(p)}
                  className="px-2.5 py-1 rounded bg-amber-950/40 text-amber-300 border border-amber-600/30 font-mono text-xs cursor-pointer hover:bg-amber-900/60"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[11px] text-stone-400 mb-1 font-semibold">
              ★ ट्रिपल पाना (TP):
            </div>
            <span
              onClick={() => setPanaInput(currentAnkData.tp)}
              className="px-3 py-1 rounded bg-red-950/80 text-red-300 border border-red-600/40 font-mono text-xs cursor-pointer font-black"
            >
              {currentAnkData.tp}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
