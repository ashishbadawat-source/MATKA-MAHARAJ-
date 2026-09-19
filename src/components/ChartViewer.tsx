import React, { useState } from 'react';
import { BarChart3, Table, Search, Calendar, Download, Copy, Check, ChevronDown } from 'lucide-react';
import { MatkaMarket, ChartRecord } from '../types';
import { isRedJodi } from '../utils/matkaUtils';

interface ChartViewerProps {
  markets: MatkaMarket[];
  initialMarketId?: string;
  initialMode?: 'jodi' | 'panel';
}

export const ChartViewer: React.FC<ChartViewerProps> = ({
  markets,
  initialMarketId,
  initialMode = 'jodi',
}) => {
  const [selectedMarketId, setSelectedMarketId] = useState<string>(
    initialMarketId || markets[0]?.id || ''
  );
  const [chartMode, setChartMode] = useState<'jodi' | 'panel'>(initialMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const currentMarket = markets.find((m) => m.id === selectedMarketId) || markets[0];
  const history: ChartRecord[] = currentMarket?.chartHistory || [];

  // Group records into weeks for the classic Matka Jodi Chart
  // Days of week columns: Mon, Tue, Wed, Thu, Fri, Sat
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Create weeks grouping
  const weeksGroup: { [weekId: string]: { [day: string]: ChartRecord } } = {};
  history.forEach((rec) => {
    // Determine week key using date
    const d = new Date(rec.date);
    const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
    const pastDaysOfYear = (d.getTime() - firstDayOfYear.getTime()) / 86400000;
    const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    const weekKey = `${d.getFullYear()}-W${weekNum}`;

    if (!weeksGroup[weekKey]) {
      weeksGroup[weekKey] = {};
    }
    weeksGroup[weekKey][rec.day] = rec;
  });

  const weekKeys = Object.keys(weeksGroup);

  // Filter for Panel chart
  const filteredHistory = history.filter((rec) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      rec.jodi.includes(q) ||
      rec.openPana.includes(q) ||
      rec.closePana.includes(q) ||
      rec.date.includes(q) ||
      rec.day.toLowerCase().includes(q)
    );
  });

  const handleCopy = () => {
    const text = `${currentMarket.name} MATKA CHART RECORD\n` +
      history.slice(0, 10).map(r => `${r.date} (${r.day}): ${r.openPana}-${r.jodi}-${r.closePana}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-stone-900 border border-amber-600/30 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5">
      {/* Top Header & Selector */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <BarChart3 className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-amber-300 font-['Cinzel',serif]">
                {currentMarket ? `${currentMarket.name} चार्ट` : 'सट्टा मटका चार्ट रिकॉर्ड'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-400">
                {currentMarket?.hindiName ? `${currentMarket.hindiName} - ` : ''}
                ऐतिहासिक जोड़ी और पैनल (पाना) रिकॉर्ड्स
              </p>
            </div>
          </div>
        </div>

        {/* Market Switcher & Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Select Market */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={selectedMarketId}
              onChange={(e) => setSelectedMarketId(e.target.value)}
              className="w-full sm:w-56 bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-amber-300 font-bold text-sm focus:outline-none focus:border-amber-500 appearance-none pr-8 cursor-pointer"
            >
              {markets.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} {m.isCustom ? '★' : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-stone-400 absolute right-2.5 top-3 pointer-events-none" />
          </div>

          {/* Mode Toggle: Jodi vs Panel */}
          <div className="bg-stone-950 p-1 rounded-xl border border-stone-800 flex items-center">
            <button
              onClick={() => setChartMode('jodi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                chartMode === 'jodi'
                  ? 'bg-amber-500 text-stone-950 shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>जोड़ी चार्ट</span>
            </button>
            <button
              onClick={() => setChartMode('panel')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                chartMode === 'panel'
                  ? 'bg-amber-500 text-stone-950 shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>पैनल (पाना) चार्ट</span>
            </button>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 hover:border-amber-500/40 text-xs transition"
            title="चार्ट डेटा कॉपी करें"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Info Bar & Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-stone-950 px-4 py-2.5 rounded-xl border border-stone-800">
        <div className="flex items-center gap-4 text-stone-300">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block"></span>
            <b className="text-red-400">लाल जोड़ी (Red Jodi):</b> हाफ रेड / फुल रेड अंक
          </span>
          <span className="flex items-center gap-1 hidden sm:inline-flex">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
            <span>सामान्य जोड़ी</span>
          </span>
        </div>

        {/* Search filter for Panel chart */}
        <div className="relative flex-1 sm:flex-initial min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="खोजें जोड़ी / पाना / तारीख..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-900 border border-stone-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500 placeholder-stone-600"
          />
        </div>
      </div>

      {/* 1. JODI CHART VIEW */}
      {chartMode === 'jodi' && (
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse border border-amber-600/30 text-xs sm:text-sm font-mono">
            <thead>
              <tr className="bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 text-stone-950 font-black">
                <th className="border border-amber-600/40 py-2.5 px-3">सप्ताह / दिनांक</th>
                {weekDays.map((d) => (
                  <th key={d} className="border border-amber-600/40 py-2.5 px-3 uppercase">
                    {d === 'Mon' ? 'सोम' : d === 'Tue' ? 'मंगल' : d === 'Wed' ? 'बुध' : d === 'Thu' ? 'गुरु' : d === 'Fri' ? 'शुक्र' : 'शनि'}
                    <span className="block text-[10px] font-medium opacity-80">({d})</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800 bg-stone-950">
              {weekKeys.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-stone-500 italic">
                    इस गेम का अभी कोई चार्ट रिकॉर्ड मौजूद नहीं है।
                  </td>
                </tr>
              ) : (
                weekKeys.map((wKey, idx) => {
                  const weekRow = weeksGroup[wKey];
                  // Find first date of the week for display
                  const anyRec = Object.values(weekRow)[0];
                  return (
                    <tr key={wKey} className={idx % 2 === 0 ? 'bg-stone-900/60' : 'bg-stone-950'}>
                      {/* Week Label */}
                      <td className="border border-stone-800 py-3 px-2 font-bold text-stone-400 text-xs whitespace-nowrap">
                        {anyRec ? anyRec.date.slice(5) : wKey}
                      </td>

                      {/* Day Cells */}
                      {weekDays.map((d) => {
                        const rec = weekRow[d];
                        if (!rec) {
                          return (
                            <td key={d} className="border border-stone-800 py-3 px-2 text-stone-700">
                              **
                            </td>
                          );
                        }
                        const red = isRedJodi(rec.jodi);
                        const isMatch = searchQuery && rec.jodi.includes(searchQuery);

                        return (
                          <td
                            key={d}
                            className={`border border-stone-800 py-3 px-2 font-black text-sm sm:text-base ${
                              red
                                ? 'text-red-500 bg-red-950/20'
                                : 'text-stone-200'
                            } ${isMatch ? 'ring-2 ring-yellow-400 bg-yellow-950/40' : ''}`}
                          >
                            <span className={red ? 'underline decoration-red-500 decoration-2' : ''}>
                              {rec.jodi}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 2. PANEL (PANA) CHART VIEW */}
      {chartMode === 'panel' && (
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse border border-amber-600/30 text-xs sm:text-sm font-mono">
            <thead>
              <tr className="bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 text-stone-950 font-black">
                <th className="border border-amber-600/40 py-2.5 px-3">दिनांक (Date)</th>
                <th className="border border-amber-600/40 py-2.5 px-3">वार (Day)</th>
                <th className="border border-amber-600/40 py-2.5 px-3">ओपन पाना (Open Pana)</th>
                <th className="border border-amber-600/40 py-2.5 px-3">जोड़ी (Jodi)</th>
                <th className="border border-amber-600/40 py-2.5 px-3">क्लोज पाना (Close Pana)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800 bg-stone-950">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-stone-500 italic">
                    कोई रिकॉर्ड नहीं मिला।
                  </td>
                </tr>
              ) : (
                filteredHistory.map((rec, i) => {
                  const red = isRedJodi(rec.jodi);
                  return (
                    <tr key={i} className={i % 2 === 0 ? 'bg-stone-900/60' : 'bg-stone-950'}>
                      <td className="border border-stone-800 py-2.5 px-3 text-stone-400">
                        {rec.date}
                      </td>
                      <td className="border border-stone-800 py-2.5 px-3 font-semibold text-stone-300">
                        {rec.day}
                      </td>
                      <td className="border border-stone-800 py-2.5 px-3 font-bold text-amber-300 bg-stone-900/40">
                        {rec.openPana}
                      </td>
                      <td
                        className={`border border-stone-800 py-2.5 px-3 font-black text-base sm:text-lg ${
                          red ? 'text-red-500 bg-red-950/30' : 'text-yellow-400'
                        }`}
                      >
                        {rec.jodi}
                      </td>
                      <td className="border border-stone-800 py-2.5 px-3 font-bold text-amber-300 bg-stone-900/40">
                        {rec.closePana}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Chart Footer Note */}
      <div className="text-center text-[11px] text-stone-500 pt-2 border-t border-stone-800/80">
        ★ मटका महाराज पर सभी चार्ट्स प्रतिदिन प्रत्येक मार्केट के परिणाम के साथ स्वतः अपडेट होते हैं।
      </div>
    </div>
  );
};
