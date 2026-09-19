import React, { useState } from 'react';
import { Sparkles, ThumbsUp, Send, ShieldAlert, Award, Star, Flame } from 'lucide-react';
import { GuessPost, MatkaMarket } from '../types';

interface GuessingForumProps {
  markets: MatkaMarket[];
}

const INITIAL_POSTS: GuessPost[] = [
  {
    id: 'post-1',
    author: 'कल्याण किंग प्रोफेसर',
    badge: 'TOP GUESSER ★★★',
    marketName: 'KALYAN',
    otc: ['2', '4', '7', '9'],
    jodi: ['24', '42', '79', '97', '27', '72'],
    patti: ['138', '248', '360', '478'],
    date: 'आज 02:30 PM',
    likes: 142,
  },
  {
    id: 'post-2',
    author: 'मेन बाजार बादशाह',
    badge: 'VIP GUESSER',
    marketName: 'MAIN BAZAR',
    otc: ['1', '3', '6', '8'],
    jodi: ['13', '31', '68', '86', '16', '61'],
    patti: ['146', '350', '260', '378'],
    date: 'आज 05:15 PM',
    likes: 98,
  },
  {
    id: 'post-3',
    author: 'मिलन मास्टर जी',
    badge: 'GOLD MEMBER',
    marketName: 'MILAN NIGHT',
    otc: ['0', '5', '3', '8'],
    jodi: ['05', '50', '38', '83', '03', '58'],
    patti: ['145', '230', '468', '279'],
    date: 'आज 07:00 PM',
    likes: 76,
  },
];

export const GuessingForum: React.FC<GuessingForumProps> = ({ markets }) => {
  const [posts, setPosts] = useState<GuessPost[]>(INITIAL_POSTS);
  const [authorName, setAuthorName] = useState('');
  const [selectedMarket, setSelectedMarket] = useState(markets[0]?.name || 'KALYAN');
  const [otcInput, setOtcInput] = useState('');
  const [jodiInput, setJodiInput] = useState('');
  const [pattiInput, setPattiInput] = useState('');
  const [showPostForm, setShowPostForm] = useState(false);

  const handleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, likes: p.liked ? p.likes - 1 : p.likes + 1, liked: !p.liked }
          : p
      )
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !otcInput.trim()) return;

    const newPost: GuessPost = {
      id: 'post-' + Date.now(),
      author: authorName.trim(),
      badge: 'VERIFIED GUESSER',
      marketName: selectedMarket,
      otc: otcInput.split(/[\s,]+/).filter(Boolean),
      jodi: jodiInput.split(/[\s,]+/).filter(Boolean),
      patti: pattiInput.split(/[\s,]+/).filter(Boolean),
      date: 'अभी-अभी (Just Now)',
      likes: 1,
    };

    setPosts([newPost, ...posts]);
    setAuthorName('');
    setOtcInput('');
    setJodiInput('');
    setPattiInput('');
    setShowPostForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Astrological Lucky Numbers Board (आज का लकी अंक) */}
      <div className="bg-gradient-to-r from-amber-950/70 via-stone-900 to-amber-950/70 border-2 border-amber-500/50 rounded-2xl p-5 shadow-2xl text-center relative overflow-hidden">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
          <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 font-['Cinzel',serif]">
            आज का गोल्डन अंक (GOLDEN ANK & OTC)
          </h2>
          <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
        </div>
        <p className="text-xs text-amber-300/80 mb-4 font-semibold">
          ज्योतिष और मटका ट्रिक गणना द्वारा आज के सबसे मजबूत ओपन टू क्लोज (OTC) अंक
        </p>

        {/* 4 Golden Ank Balls */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 my-4">
          {[
            { ank: '2', title: 'शुभ 1' },
            { ank: '4', title: 'शुभ 2' },
            { ank: '7', title: 'शुभ 3' },
            { ank: '9', title: 'शुभ 4' },
          ].map((item, idx) => (
            <div key={idx} className="text-center group">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-b from-yellow-300 via-amber-500 to-yellow-600 text-stone-950 font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg shadow-amber-900/60 font-mono ring-4 ring-amber-500/20 group-hover:scale-110 transition transform">
                {item.ank}
              </div>
              <div className="text-[11px] text-amber-300 font-bold mt-1.5">{item.title}</div>
            </div>
          ))}
        </div>

        <div className="bg-stone-950/80 border border-amber-600/30 rounded-xl p-3 inline-block max-w-xl text-xs text-stone-300">
          <span className="text-amber-400 font-black">★ फ्री कल्याण फिक्स ओपन:</span> 2, 4 • <span className="text-amber-400 font-black">सपोर्ट क्लोज:</span> 7, 9 • <span className="text-amber-400 font-black">स्पेशल जोड़ी:</span> 24, 47, 79, 92
        </div>
      </div>

      {/* Guesser Community Forum Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-stone-900 p-4 rounded-xl border border-stone-800">
        <div>
          <h3 className="text-lg font-black text-amber-300 flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-500" />
            मटका गेसिंग मंच (Top Guesser Tricks & Forum)
          </h3>
          <p className="text-xs text-stone-400">
            भारत के टॉप मटका गेसर्स द्वारा पोस्ट किए गए ताजा अंक और जोड़ियां
          </p>
        </div>

        <button
          onClick={() => setShowPostForm(!showPostForm)}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-black text-xs rounded-xl shadow transition hover:scale-105 active:scale-95"
        >
          {showPostForm ? '✕ फॉर्म बंद करें' : '+ अपनी गेसिंग पोस्ट करें'}
        </button>
      </div>

      {/* Create Guess Post Form */}
      {showPostForm && (
        <form onSubmit={handleCreatePost} className="bg-stone-900 border border-amber-500/40 p-5 rounded-2xl space-y-4 shadow-xl animate-in fade-in">
          <h4 className="text-sm font-bold text-amber-200">अपनी मटका गेसिंग पोस्ट करें:</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-stone-300 block mb-1">आपका नाम (Guesser Name):</label>
              <input
                type="text"
                required
                placeholder="e.g. सोहेल भाई / कल्याण गुरु"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-300 block mb-1">मार्केट चुनें:</label>
              <select
                value={selectedMarket}
                onChange={(e) => setSelectedMarket(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-amber-300 text-xs font-bold focus:outline-none focus:border-amber-500"
              >
                {markets.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-amber-200 block mb-1">OTC अंक (कम से कम 2-4 अंक):</label>
              <input
                type="text"
                required
                placeholder="2, 4, 7, 9"
                value={otcInput}
                onChange={(e) => setOtcInput(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-amber-300 font-mono text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-300 block mb-1">जोड़ी (वैकल्पिक):</label>
              <input
                type="text"
                placeholder="24, 47, 79"
                value={jodiInput}
                onChange={(e) => setJodiInput(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-200 font-mono text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-300 block mb-1">पाना / पत्ती (वैकल्पिक):</label>
              <input
                type="text"
                placeholder="138, 248, 360"
                value={pattiInput}
                onChange={(e) => setPattiInput(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-200 font-mono text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition"
          >
            पोस्ट प्रकाशित करें
          </button>
        </form>
      )}

      {/* Guesser Posts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-stone-900 border border-amber-600/25 rounded-xl p-4 shadow-lg flex flex-col justify-between hover:border-amber-500/50 transition"
          >
            <div>
              {/* Author & Market */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div>
                  <div className="font-black text-amber-200 text-sm flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    {post.author}
                  </div>
                  {post.badge && (
                    <span className="text-[10px] text-stone-400 font-semibold">{post.badge}</span>
                  )}
                </div>
                <div className="bg-amber-950/80 border border-amber-600/40 text-amber-300 text-xs font-black px-2.5 py-1 rounded">
                  {post.marketName}
                </div>
              </div>

              {/* Guesses */}
              <div className="py-3 space-y-2">
                <div>
                  <div className="text-[11px] font-bold text-stone-400 mb-1">🔥 ओपन टू क्लोज (OTC):</div>
                  <div className="flex gap-2">
                    {post.otc.map((n, idx) => (
                      <span
                        key={idx}
                        className="w-8 h-8 rounded-lg bg-stone-950 border border-amber-500/30 text-yellow-400 font-mono font-black text-sm flex items-center justify-center shadow-inner"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>

                {post.jodi.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold text-stone-400 mb-1">🎯 लकी जोड़ियां:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {post.jodi.map((j, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-amber-500 text-stone-950 font-mono font-bold text-xs"
                        >
                          {j}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {post.patti.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold text-stone-400 mb-1">🎲 पाना / पत्ती:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {post.patti.map((p, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-stone-950 text-stone-300 border border-stone-800 font-mono text-xs"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Post Footer */}
            <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
              <span className="text-[10px]">{post.date}</span>
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition ${
                  post.liked
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'hover:bg-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{post.likes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
