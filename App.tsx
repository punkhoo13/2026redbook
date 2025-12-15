import React, { useState, useEffect } from 'react';
import { fetchTrendAnalysis } from './services/geminiService';
import { TrendAnalysisData, LoadingState } from './types';
import { HotWordsChart, ConsumerRadarChart, PreferencePieChart } from './components/AnalysisCharts';
import { PersonaCard } from './components/PersonaCard';
import { Search, Loader2, ArrowRight, Circle } from 'lucide-react';

const DEFAULT_QUERY = "小红书2026春夏流行趋势+热门风格解析+社媒人群画像数据分析+流行单品色彩和面料趋势";

export default function App() {
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [data, setData] = useState<TrendAnalysisData | null>(null);
  const [loading, setLoading] = useState<LoadingState>(LoadingState.IDLE);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(LoadingState.LOADING);
    setError(null);
    try {
      const result = await fetchTrendAnalysis(query);
      setData(result);
      setLoading(LoadingState.SUCCESS);
    } catch (err) {
      setError("Analysis failed. Please try again.");
      setLoading(LoadingState.ERROR);
    }
  };

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-mono-900 text-white font-sans selection:bg-white selection:text-black">
      
      {/* SEARCH OVERLAY (Minimal) */}
      <div className="fixed top-0 left-0 w-full z-50 pointer-events-none">
        <div className="max-w-7xl mx-auto p-6 flex justify-end">
             <form onSubmit={handleSearch} className="pointer-events-auto flex gap-2 items-center bg-black/50 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 transition-all hover:border-white/40">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-xs font-mono w-64 text-white placeholder-gray-500"
                    placeholder="ENTER QUERY_ "
                />
                <button type="submit" className="text-white hover:text-accent-red">
                    <ArrowRight className="w-4 h-4" />
                </button>
             </form>
        </div>
      </div>

      <main className="max-w-[1600px] mx-auto p-4 md:p-8">
        
        {loading === LoadingState.LOADING && (
          <div className="h-screen flex flex-col items-center justify-center">
            <div className="relative">
                <div className="absolute inset-0 border border-white/20 rounded-full animate-ping"></div>
                <div className="w-32 h-32 border border-white rounded-full flex items-center justify-center bg-black">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            </div>
            <div className="mt-8 font-mono text-sm tracking-widest animate-pulse">PROCESSING DATA STREAM...</div>
          </div>
        )}

        {loading === LoadingState.ERROR && (
           <div className="h-screen flex flex-col items-center justify-center text-center">
             <h3 className="font-mono text-2xl text-red-500 mb-4">[SYSTEM ERROR]</h3>
             <p className="mb-8 text-gray-400 max-w-md">{error}</p>
             <button onClick={() => handleSearch()} className="border border-white px-8 py-3 hover:bg-white hover:text-black transition-colors font-mono text-sm uppercase">Retry Sequence</button>
           </div>
        )}

        {loading === LoadingState.SUCCESS && data && (
          <div className="animate-fade-in grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 auto-rows-[minmax(180px,auto)]">
            
            {/* BRAND BLOCK (Top Left) */}
            <div className="col-span-1 md:col-span-2 row-span-2 bg-accent-blue p-8 flex flex-col justify-between rounded-none">
                <div className="flex gap-1">
                    <div className="w-4 h-4 rounded-full bg-white"></div>
                    <div className="w-4 h-4 rounded-full bg-white/50"></div>
                </div>
                <div>
                    <h1 className="font-mono text-6xl font-bold tracking-tighter mb-2">(r [i])</h1>
                    <div className="font-mono text-xs uppercase tracking-widest opacity-80">RED Insight Engine</div>
                </div>
            </div>

            {/* HEADER/TITLE BLOCK */}
            <div className="col-span-1 md:col-span-2 lg:col-span-4 row-span-1 bg-mono-800 border border-mono-700 p-8 flex flex-col justify-center">
                 <div className="font-mono text-xs text-gray-400 mb-2">/ SEARCH_QUERY</div>
                 <h2 className="text-xl md:text-2xl font-light leading-tight text-gray-200">
                    "{query.substring(0, 50)}..."
                 </h2>
            </div>

            {/* KEY METRIC 1 */}
            <div className="col-span-1 md:col-span-2 row-span-1 bg-white text-black p-6 flex flex-col justify-between group cursor-pointer hover:bg-gray-200 transition-colors">
                 <div className="font-mono text-xs uppercase border-b border-black/10 pb-2">Analysis Depth</div>
                 <div className="text-6xl font-bold font-mono tracking-tighter">100%</div>
            </div>

            {/* EXECUTIVE SUMMARY (Large Block) */}
            <div className="col-span-1 md:col-span-4 lg:col-span-4 row-span-2 bg-mono-900 border border-mono-700 p-8 flex flex-col relative overflow-hidden">
                <div className="absolute top-4 right-4 text-mono-800 text-9xl font-bold opacity-20 pointer-events-none select-none">
                    01
                </div>
                <h3 className="font-mono text-xs text-accent-blue mb-6 uppercase tracking-widest">Executive Summary</h3>
                <div className="prose prose-invert max-w-none prose-lg font-light leading-relaxed">
                    <p className="text-gray-300">
                        {data.executiveSummary}
                    </p>
                </div>
            </div>

            {/* CONSUMER HABITS (Square) */}
            <div className="col-span-1 md:col-span-2 row-span-2 bg-mono-800 border border-mono-700 p-4 flex flex-col">
                <div className="font-mono text-xs text-gray-500 mb-4 uppercase px-2">Consumer Habits / Radar</div>
                <div className="flex-1">
                    <ConsumerRadarChart data={data.consumerHabits} />
                </div>
                <div className="px-2 mt-2">
                    <div className="text-4xl font-mono font-bold">6/ <span className="text-sm font-sans font-normal text-gray-400">Dimensions</span></div>
                </div>
            </div>

            {/* HOT WORDS LIST (Vertical) */}
            <div className="col-span-1 md:col-span-2 row-span-3 bg-mono-800 border border-mono-700 p-0 flex flex-col overflow-hidden">
                 <div className="p-6 border-b border-mono-700 bg-mono-850">
                    <h3 className="font-mono text-xs text-white uppercase">Trending Keywords</h3>
                 </div>
                 <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {data.hotKeywords.map((kw, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border-b border-mono-700 hover:bg-white/5 transition-colors group">
                            <div className="flex items-baseline gap-3">
                                <span className="font-mono text-xs text-gray-500">0{i+1}/</span>
                                <span className="font-bold text-lg">{kw.word}</span>
                            </div>
                            <span className="font-mono text-xs bg-white/10 px-2 py-1 rounded text-gray-300 group-hover:bg-accent-blue group-hover:text-white transition-colors">{kw.volume}</span>
                        </div>
                    ))}
                 </div>
                 <div className="h-32 p-4 bg-mono-900 border-t border-mono-700">
                    <HotWordsChart data={data.hotKeywords} />
                 </div>
            </div>

            {/* PREFERENCES (Square) */}
            <div className="col-span-1 md:col-span-2 row-span-2 bg-mono-800 border border-mono-700 p-6 flex flex-col items-center justify-center text-center">
                 <div className="w-full text-left font-mono text-xs text-gray-500 mb-2">Purchase Drivers</div>
                 <PreferencePieChart data={data.preferences} />
                 <div className="mt-4 text-xs font-mono text-gray-400 max-w-[200px]">
                    Distribution of known decision factors.
                 </div>
            </div>

            {/* PERSONAS HEADER */}
            <div className="col-span-1 md:col-span-4 lg:col-span-8 row-span-1 flex items-end pb-4 border-b border-mono-800 mt-8 mb-4">
                 <h3 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
                    FUTURE PERSONAS
                 </h3>
                 <div className="ml-4 mb-2 font-mono text-xs text-accent-red animate-pulse">/// PREDICTED DATA</div>
            </div>

            {/* PERSONAS GRID */}
            {data.futurePersonas.map((persona, idx) => (
                <div key={idx} className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2 row-span-3">
                    <PersonaCard persona={persona} index={idx} />
                </div>
            ))}

            {/* FOOTER BLOCK */}
            <div className="col-span-1 md:col-span-4 lg:col-span-8 row-span-1 bg-mono-950 border-t border-mono-800 p-8 flex justify-between items-center text-xs font-mono text-gray-600 mt-8">
                 <div>
                    Generated by Gemini 2.5 Flash
                 </div>
                 <div>
                    RED INSIGHT © 2026
                 </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}