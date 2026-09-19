import React, { useState } from 'react';
import { X, User, Wallet, Plus, Trophy, Bell, Star, CheckCircle, Clock, Award, Shield, Sparkles } from 'lucide-react';
import { UserProfile, MatkaMarket, UserGuess } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  markets: MatkaMarket[];
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onAddGuess: (guess: UserGuess) => void;
  onRefillBalance: (amount: number) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  markets,
  onUpdateProfile,
  onAddGuess,
  onRefillBalance,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'slip' | 'history'>('slip');
  const [name, setName] = useState(profile.name);
  const [selectedMarketId, setSelectedMarketId] = useState(markets[0]?.id || '');
  const [guessType, setGuessType] = useState<'single' | 'jodi' | 'patti'>('jodi');
  const [guessNumber, setGuessNumber] = useState('');
  const [guessPoints, setGuessPoints] = useState(100);
  const [slipSuccess, setSlipSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name });
  };

  const handlePlaceGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guessNumber.trim()) return;
    if (guessPoints > profile.balance) {
      alert('अपर्याप्त वॉलेट बैलेंस! कृपया फ्री पॉइंट्स रिफिल करें।');
      return;
    }

    const market = markets.find((m) => m.id === selectedMarketId) || markets[0];
    const newGuess: UserGuess = {
      id: 'g-' + Date.now(),
      gameId: market.id,
      gameName: market.name,
      type: guessType,
      number: guessNumber.trim(),
      points: guessPoints,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'pending',
    };

    onAddGuess(newGuess);
    setSlipSuccess(true);
    setGuessNumber('');
    setTimeout(() => setSlipSuccess(false), 2500);
  };

  const avatarOptions = ['👑', '🦁', '🐯', '⚡', '💎', '🔥', '🎯', '🎰'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className="bg-stone-900 border border-amber-500/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 px-5 py-4 text-stone-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 font-black" />
            <h2 className="text-lg font-black tracking-wide font-['Cinzel',serif]">
              यूजर प्रोफाइल & वॉलेट (User Profile)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-stone-950/20 text-stone-950 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Quick Bar */}
        <div className="bg-stone-950 p-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-2xl shadow-md border-2 border-stone-900">
              {profile.avatar}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-amber-200 text-base">{profile.name}</span>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-1.5 py-0.2 rounded flex items-center gap-1">
                  <Shield className="w-2.5 h-2.5" /> VIP
                </span>
              </div>
              <div className="text-xs text-stone-500 font-mono">{profile.phone}</div>
            </div>
          </div>

          {/* Balance Pill */}
          <div className="text-right">
            <div className="text-[10px] text-stone-400 font-bold uppercase">डेमो वॉलेट पॉइंट्स</div>
            <div className="text-lg font-black font-mono text-emerald-400 flex items-center justify-end gap-1">
              <Wallet className="w-4 h-4 text-amber-400" />
              <span>₹{profile.balance.toLocaleString()}</span>
            </div>
            <button
              onClick={() => onRefillBalance(1000)}
              className="text-[10px] text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
            >
              + ₹1,000 फ्री पॉइंट्स लें
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="grid grid-cols-3 bg-stone-950/70 border-b border-stone-800 text-xs font-bold text-center">
          <button
            onClick={() => setActiveTab('slip')}
            className={`py-2.5 border-b-2 transition ${
              activeTab === 'slip'
                ? 'border-amber-500 text-amber-400 bg-amber-950/20'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            🎯 लकी पर्चा (Slip)
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2.5 border-b-2 transition ${
              activeTab === 'history'
                ? 'border-amber-500 text-amber-400 bg-amber-950/20'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            📜 पर्चा हिस्ट्री ({profile.guesses.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2.5 border-b-2 transition ${
              activeTab === 'profile'
                ? 'border-amber-500 text-amber-400 bg-amber-950/20'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            ⚙️ सेटिंग्स
          </button>
        </div>

        {/* Content Tabs */}
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          {/* 1. GUESSING SLIP (लकी पर्चा) */}
          {activeTab === 'slip' && (
            <form onSubmit={handlePlaceGuess} className="space-y-4">
              <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-200 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  यहाँ अपने पसंदीदा गेम में फ्री डेमो गेसिंग लगाएं। रिजल्ट अपडेट होने पर सही आने पर पॉइंट्स वॉलेट में क्रेडिट होंगे!
                </span>
              </div>

              {/* Select Market */}
              <div>
                <label className="text-xs font-bold text-stone-300 block mb-1">
                  मार्केट चुनें:
                </label>
                <select
                  value={selectedMarketId}
                  onChange={(e) => setSelectedMarketId(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-amber-300 font-bold text-sm focus:outline-none focus:border-amber-500"
                >
                  {markets.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.openTime} - {m.closeTime})
                    </option>
                  ))}
                </select>
              </div>

              {/* Guess Type: Single Ank, Jodi, Patti */}
              <div>
                <label className="text-xs font-bold text-stone-300 block mb-1.5">
                  गेसिंग प्रकार (Type & Payout Rate):
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                  {[
                    { id: 'single', name: 'सिंगल अंक', rate: '1 : 9', len: 1 },
                    { id: 'jodi', name: 'जोड़ी', rate: '1 : 90', len: 2 },
                    { id: 'patti', name: 'पाना / पत्ती', rate: '1 : 140', len: 3 },
                  ].map((t) => (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => {
                        setGuessType(t.id as any);
                        setGuessNumber('');
                      }}
                      className={`p-2 rounded-lg border text-center transition ${
                        guessType === t.id
                          ? 'bg-amber-500 text-stone-950 border-amber-400 font-black'
                          : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                      }`}
                    >
                      <div>{t.name}</div>
                      <div className="text-[10px] opacity-80">{t.rate}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Enter Guess Number */}
              <div>
                <label className="text-xs font-bold text-amber-200 block mb-1">
                  {guessType === 'single'
                    ? 'सिंगल अंक दर्ज करें (1 अंक: 0-9)'
                    : guessType === 'jodi'
                    ? 'जोड़ी दर्ज करें (2 अंक: 00-99)'
                    : 'पाना / पत्ती दर्ज करें (3 अंक: 123)'}
                </label>
                <input
                  type="text"
                  required
                  maxLength={guessType === 'single' ? 1 : guessType === 'jodi' ? 2 : 3}
                  placeholder={guessType === 'single' ? '7' : guessType === 'jodi' ? '08' : '389'}
                  value={guessNumber}
                  onChange={(e) => setGuessNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-center text-2xl font-mono font-black text-amber-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Points to wager */}
              <div>
                <label className="text-xs font-bold text-stone-300 block mb-1">
                  पॉइंट्स (Demo Points):
                </label>
                <div className="flex items-center gap-2">
                  {[50, 100, 200, 500].map((pts) => (
                    <button
                      type="button"
                      key={pts}
                      onClick={() => setGuessPoints(pts)}
                      className={`flex-1 py-1.5 rounded text-xs font-bold transition border ${
                        guessPoints === pts
                          ? 'bg-amber-500 text-stone-950 border-amber-400 font-black'
                          : 'bg-stone-950 text-stone-400 border-stone-800'
                      }`}
                    >
                      {pts}
                    </button>
                  ))}
                </div>
              </div>

              {slipSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-900/60 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>पर्चा सफलतापूर्वक लग गया! रिजल्ट का इंतजार करें।</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-black text-sm rounded-xl shadow-lg transition active:scale-98"
              >
                🎯 पर्चा जमा करें ({guessPoints} पॉइंट्स)
              </button>
            </form>
          )}

          {/* 2. GUESS HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-2">
              {profile.guesses.length === 0 ? (
                <div className="text-center py-8 text-stone-500 text-xs">
                  अभी तक कोई पर्चा नहीं लगाया गया। "लकी पर्चा" टैब से गेसिंग जोड़ें!
                </div>
              ) : (
                profile.guesses.map((g) => (
                  <div
                    key={g.id}
                    className="p-3 bg-stone-950 border border-stone-800 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-stone-200 flex items-center gap-1.5">
                        <span className="text-amber-400 font-black">{g.gameName}</span>
                        <span className="text-[10px] bg-stone-800 px-1.5 py-0.5 rounded text-stone-400 uppercase">
                          {g.type}
                        </span>
                      </div>
                      <div className="text-stone-400 text-[11px] mt-0.5">
                        नंबर: <b className="font-mono text-amber-300 text-sm">{g.number}</b> • {g.points} अंक
                      </div>
                    </div>

                    <div className="text-right">
                      {g.status === 'won' ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded font-black text-xs">
                          <Trophy className="w-3 h-3 text-emerald-400" /> जीता +₹{g.payout}
                        </span>
                      ) : g.status === 'lost' ? (
                        <span className="bg-red-950 text-red-400 px-2 py-0.5 rounded font-bold text-xs">
                          लॉस्ट
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-stone-800 text-amber-300 px-2 py-0.5 rounded font-bold text-[11px]">
                          <Clock className="w-3 h-3 text-amber-400" /> रिजल्ट पेंडिंग
                        </span>
                      )}
                      <div className="text-[10px] text-stone-500 mt-1">{g.date}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 3. SETTINGS & PROFILE EDIT */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-300 block mb-1">खिलाड़ी का नाम (Name):</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-stone-300 block mb-1.5">अवतार चुनें (Avatar):</label>
                <div className="flex gap-2">
                  {avatarOptions.map((av) => (
                    <button
                      type="button"
                      key={av}
                      onClick={() => onUpdateProfile({ avatar: av })}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg border transition ${
                        profile.avatar === av ? 'border-amber-400 bg-amber-950/40 scale-110' : 'border-stone-800 bg-stone-950'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 text-stone-950 font-bold rounded-lg hover:bg-amber-400"
                >
                  सेटिंग्स सेव करें
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
