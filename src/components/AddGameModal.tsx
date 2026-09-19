import React, { useState } from 'react';
import { X, Plus, Clock, Calendar, Sparkles, Check } from 'lucide-react';
import { MatkaMarket } from '../types';

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMarket: (newMarket: MatkaMarket) => void;
}

const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const AddGameModal: React.FC<AddGameModalProps> = ({
  isOpen,
  onClose,
  onAddMarket,
}) => {
  const [name, setName] = useState('');
  const [hindiName, setHindiName] = useState('');
  const [openTime, setOpenTime] = useState('11:00 AM');
  const [closeTime, setCloseTime] = useState('12:00 PM');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [initialOpenPana, setInitialOpenPana] = useState('');
  const [initialClosePana, setInitialClosePana] = useState('');

  if (!isOpen) return null;

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter((d) => d !== day));
      }
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleQuickPreset = (presetName: string, presetHindi: string, open: string, close: string) => {
    setName(presetName);
    setHindiName(presetHindi);
    setOpenTime(open);
    setCloseTime(close);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4);
    
    // Generate initial historical chart for this new market so charts work immediately!
    const chartHistory = [];
    const today = new Date();
    for (let i = 1; i <= 20; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      if (d.getDay() === 0) continue; // skip Sunday
      const daysAbbr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayName = daysAbbr[d.getDay()];

      // create realistic Pana
      const p1 = `${(i * 3 + 1) % 8 + 1}${(i * 4 + 2) % 6 + 2}${((i * 5 + 3) % 9 + 1)}`;
      const p2 = `${(i * 2 + 1) % 7 + 1}${(i * 3 + 4) % 5 + 3}${((i * 4 + 7) % 9 + 1)}`;
      const j1 = p1.split('').reduce((a, b) => a + parseInt(b, 10), 0) % 10;
      const j2 = p2.split('').reduce((a, b) => a + parseInt(b, 10), 0) % 10;

      chartHistory.push({
        date: d.toISOString().split('T')[0],
        day: dayName,
        openPana: p1,
        jodi: `${j1}${j2}`,
        closePana: p2,
      });
    }

    const newMarket: MatkaMarket = {
      id,
      name: name.toUpperCase().trim(),
      hindiName: hindiName.trim() || undefined,
      openTime,
      closeTime,
      days: selectedDays,
      openPana: initialOpenPana || '***',
      jodi: initialOpenPana ? '**' : '**',
      closePana: initialClosePana || '***',
      status: 'upcoming',
      isCustom: true,
      lastUpdated: 'अभी जोड़ा गया (Just Added)',
      autoUpdateEnabled: autoUpdate,
      chartHistory,
    };

    onAddMarket(newMarket);
    onClose();
    // Reset form
    setName('');
    setHindiName('');
    setInitialOpenPana('');
    setInitialClosePana('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-stone-900 border border-amber-500/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 px-5 py-4 text-stone-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 font-black" />
            <h2 className="text-lg font-black tracking-wide font-['Cinzel',serif]">
              नया मटका गेम जोड़ें (Add New Game)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-stone-950/20 text-stone-950 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Quick Presets */}
          <div>
            <label className="text-xs font-bold text-stone-400 block mb-1.5">
              ⚡ लोकप्रिय प्रीसेट चुन सकते हैं:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { name: 'KALYAN MORNING', hindi: 'कल्याण मॉर्निंग', o: '11:00 AM', c: '12:02 PM' },
                { name: 'GALI DISAWAR', hindi: 'गली दिसावर', o: '05:00 AM', c: '06:00 AM' },
                { name: 'STARLINE 2PM', hindi: 'स्टारलाइन 2PM', o: '02:00 PM', c: '02:15 PM' },
                { name: 'DELHI KING', hindi: 'दिल्ली किंग', o: '04:30 PM', c: '05:30 PM' },
              ].map((preset) => (
                <button
                  type="button"
                  key={preset.name}
                  onClick={() => handleQuickPreset(preset.name, preset.hindi, preset.o, preset.c)}
                  className="px-2.5 py-1 rounded bg-stone-800 hover:bg-amber-900/60 text-amber-300 border border-amber-600/30 text-xs font-semibold transition"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Game Name English */}
          <div>
            <label className="text-xs font-bold text-amber-200 block mb-1">
              मार्केट / गेम का नाम (English) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. KALYAN MORNING, DISAWAR"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 font-bold uppercase"
            />
          </div>

          {/* Hindi Name */}
          <div>
            <label className="text-xs font-bold text-stone-300 block mb-1">
              हिंदी नाम (वैकल्पिक)
            </label>
            <input
              type="text"
              placeholder="e.g. कल्याण मॉर्निंग"
              value={hindiName}
              onChange={(e) => setHindiName(e.target.value)}
              className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Open and Close Timings */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-stone-300 block mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                ओपन समय (Open Time) *
              </label>
              <input
                type="text"
                required
                placeholder="11:30 AM"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500 font-mono text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-300 block mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                क्लोज समय (Close Time) *
              </label>
              <input
                type="text"
                required
                placeholder="12:30 PM"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500 font-mono text-sm"
              />
            </div>
          </div>

          {/* Operating Days */}
          <div>
            <label className="text-xs font-bold text-stone-300 block mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              गेम चलने के दिन (Operating Days)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_DAYS.map((day) => {
                const active = selectedDays.includes(day);
                return (
                  <button
                    type="button"
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      active
                        ? 'bg-amber-500 text-stone-950 shadow'
                        : 'bg-stone-800 text-stone-400 border border-stone-700 hover:text-stone-200'
                    }`}
                  >
                    {active && <Check className="w-3 h-3" />}
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Auto-Update Toggle */}
          <div className="bg-stone-950 p-3 rounded-lg border border-amber-600/30 flex items-center justify-between">
            <div>
              <div className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                ऑटो-अपडेट में शामिल करें
              </div>
              <div className="text-[11px] text-stone-400">
                बाकी गेम्स की तरह यह नया गेम भी अपने आप अपडेट होता रहेगा
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoUpdate}
                onChange={(e) => setAutoUpdate(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-950/50 transition transform active:scale-98"
            >
              + नया गेम सफलतापूर्वक जोड़ें
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
