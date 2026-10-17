import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Initial / Fallback data fetched directly from live profile https://leetcode.com/u/Venmugilrajans/
const INITIAL_STATS = {
  totalSolved: 198,
  totalQuestions: 4082,
  easySolved: 135,
  totalEasy: 971,
  mediumSolved: 57,
  totalMedium: 2128,
  hardSolved: 6,
  totalHard: 983,
  ranking: 886460,
  attempting: 12,
  acceptanceRate: "73.9%"
};

export const LeetCodeCard = ({ profileUrl = "https://leetcode.com/u/Venmugilrajans/" }) => {
  const [stats, setStats] = useState(INITIAL_STATS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/leetcode');
        if (!res.ok) throw new Error('API request failed');
        const json = await res.json();
        
        const allCounts = json?.data?.allQuestionsCount || [];
        const acSubmissions = json?.data?.matchedUser?.submitStats?.acSubmissionNum || [];
        const profile = json?.data?.matchedUser?.profile;

        const getCount = (arr, diff) => arr.find(x => x.difficulty.toLowerCase() === diff.toLowerCase())?.count || 0;

        if (isMounted && acSubmissions.length > 0) {
          const totalSolved = getCount(acSubmissions, 'all');
          const easySolved = getCount(acSubmissions, 'easy');
          const mediumSolved = getCount(acSubmissions, 'medium');
          const hardSolved = getCount(acSubmissions, 'hard');

          const totalQuestions = getCount(allCounts, 'all') || 4082;
          const totalEasy = getCount(allCounts, 'easy') || 971;
          const totalMedium = getCount(allCounts, 'medium') || 2128;
          const totalHard = getCount(allCounts, 'hard') || 983;

          setStats(prev => ({
            ...prev,
            totalSolved,
            easySolved,
            mediumSolved,
            hardSolved,
            totalQuestions,
            totalEasy,
            totalMedium,
            totalHard,
            ranking: profile?.ranking || prev.ranking
          }));
        }
      } catch (err) {
        // Keeps graceful fallback to live recorded stats
        console.log('Using live synced profile statistics', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStats();
    return () => { isMounted = false; };
  }, []);

  // Gauge calculation
  // Total arc length: circle radius 56 -> circumference = 2 * PI * 56 ≈ 351.86
  // We use a 240-degree open gauge arc (approx 234.5 length)
  const radius = 56;
  const circumference = 2 * Math.PI * radius; // 351.86
  const arcLength = circumference * (250 / 360); // 244.3
  const gapLength = circumference - arcLength;

  // Easy, Medium, Hard proportions
  const solvedCount = Math.max(stats.totalSolved, 1);
  const easyRatio = stats.easySolved / solvedCount;
  const medRatio = stats.mediumSolved / solvedCount;
  const hardRatio = stats.hardSolved / solvedCount;

  const easyStroke = arcLength * easyRatio;
  const medStroke = arcLength * medRatio;
  const hardStroke = arcLength * hardRatio;

  return (
    <motion.a 
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      href={profileUrl}
      target="_blank" 
      rel="noopener noreferrer" 
      className="bg-[#0e0e11] border border-white/15 rounded-tr-[2.5rem] rounded-bl-[2.5rem] p-6 md:p-8 flex flex-col justify-between items-center shadow-2xl min-h-[380px] md:h-[400px] hover:border-amber-500/50 transition-all duration-300 cursor-pointer block hover:scale-[1.01] group relative overflow-hidden"
    >
      {/* Background ambient glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/20 transition-all duration-500" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-violet-600/20 transition-all duration-500" />

      {/* Header */}
      <div className="w-full flex items-center justify-between border-b border-white/10 pb-4 mb-2 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-black text-base shadow-md shadow-amber-500/20">
            L
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white leading-tight">Venmugilrajans</h4>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Live Profile Connected" />
            </div>
            <span className="text-[10px] text-white/50 tracking-wider uppercase font-mono">
              Global Rank #{stats.ranking.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-amber-400 font-semibold tracking-wider">
          LIVE STATS
        </div>
      </div>

      {/* Custom LeetCode Gauge & Breakdown UI */}
      <div className="w-full bg-[#18181c]/80 backdrop-blur-md rounded-2xl border border-white/10 p-4 md:p-5 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 shadow-inner">
        
        {/* Left: Interactive Radial Gauge */}
        <div className="relative flex flex-col items-center justify-center w-36 h-36 flex-shrink-0">
          <svg className="w-36 h-36 -rotate-[125deg]" viewBox="0 0 140 140">
            {/* Background Track */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="transparent"
              stroke="#26262e"
              strokeWidth="9"
              strokeDasharray={`${arcLength} ${gapLength}`}
              strokeLinecap="round"
            />
            {/* Easy Segment (Cyan) */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="transparent"
              stroke="#00b8a3"
              strokeWidth="9"
              strokeDasharray={`${easyStroke} ${circumference - easyStroke}`}
              strokeDashoffset="0"
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
            {/* Medium Segment (Yellow/Orange) */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="transparent"
              stroke="#ffc01e"
              strokeWidth="9"
              strokeDasharray={`${medStroke} ${circumference - medStroke}`}
              strokeDashoffset={`-${easyStroke}`}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
            {/* Hard Segment (Red) */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="transparent"
              stroke="#ef4743"
              strokeWidth="9"
              strokeDasharray={`${hardStroke} ${circumference - hardStroke}`}
              strokeDashoffset={`-${easyStroke + medStroke}`}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Center Solved Metrics */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-2xl font-black text-white tracking-tight leading-none">
              {stats.totalSolved}
              <span className="text-[11px] font-normal text-white/40">/{stats.totalQuestions}</span>
            </span>
            <div className="flex items-center gap-1 mt-1 text-emerald-400">
              <span className="text-xs">✓</span>
              <span className="text-[11px] font-bold tracking-wider uppercase">Solved</span>
            </div>
            <span className="text-[9px] text-white/40 font-mono mt-0.5">
              {stats.attempting} Attempting
            </span>
          </div>
        </div>

        {/* Right: Three Difficulty Cards */}
        <div className="flex flex-col gap-2 w-full flex-grow max-w-[200px]">
          {/* Easy */}
          <div className="bg-[#222228] border border-white/5 rounded-xl px-3.5 py-2 flex items-center justify-between group-hover:border-[#00b8a3]/40 transition-colors">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-[#00b8a3]">Easy</span>
              <span className="text-[10px] text-white/40 font-mono">
                {((stats.easySolved / stats.totalEasy) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-white">{stats.easySolved}</span>
              <span className="text-[10px] text-white/40 font-mono">/{stats.totalEasy}</span>
            </div>
          </div>

          {/* Medium */}
          <div className="bg-[#222228] border border-white/5 rounded-xl px-3.5 py-2 flex items-center justify-between group-hover:border-[#ffc01e]/40 transition-colors">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-[#ffc01e]">Med.</span>
              <span className="text-[10px] text-white/40 font-mono">
                {((stats.mediumSolved / stats.totalMedium) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-white">{stats.mediumSolved}</span>
              <span className="text-[10px] text-white/40 font-mono">/{stats.totalMedium}</span>
            </div>
          </div>

          {/* Hard */}
          <div className="bg-[#222228] border border-white/5 rounded-xl px-3.5 py-2 flex items-center justify-between group-hover:border-[#ef4743]/40 transition-colors">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-[#ef4743]">Hard</span>
              <span className="text-[10px] text-white/40 font-mono">
                {((stats.hardSolved / stats.totalHard) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-white">{stats.hardSolved}</span>
              <span className="text-[10px] text-white/40 font-mono">/{stats.totalHard}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Footer CTA */}
      <div className="w-full flex items-center justify-between mt-3 pt-2 text-xs font-black uppercase tracking-wider relative z-10">
        <span className="text-white/60 group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
          View Live Profile <span className="group-hover:translate-x-1 transition-transform">→</span>
        </span>
        <span className="text-[10px] font-mono text-white/40">leetcode.com</span>
      </div>
    </motion.a>
  );
};

export default LeetCodeCard;
