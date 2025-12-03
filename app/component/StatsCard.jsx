export default function StatsCard({ totalMovies, moviesWatched, moviesToWatch, onStatClick, activeFilter }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button 
              onClick={() => onStatClick('all')}
              className={`text-left transition-all duration-300 rounded-xl p-5 border backdrop-blur-sm hover:shadow-lg ${activeFilter === 'all' ? 'bg-linear-to-br from-blue-900/60 to-blue-950/60 border-blue-600/80 shadow-lg shadow-blue-500/20' : 'bg-linear-to-br from-blue-900/40 to-blue-950/40 border-blue-700/40 hover:border-blue-600/60'}`}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest">Total Movies</p>
                        <p className="text-4xl font-bold text-neutral-50 mt-3">{totalMovies}</p>
                    </div>
                    <div className={`text-5xl transition-transform ${activeFilter === 'all' ? 'scale-125' : 'opacity-20'}`}>🎬</div>
                </div>
            </button>

            <button 
              onClick={() => onStatClick('watched')}
              className={`text-left transition-all duration-300 rounded-xl p-5 border backdrop-blur-sm hover:shadow-lg ${activeFilter === 'watched' ? 'bg-linear-to-br from-green-900/60 to-green-950/60 border-green-600/80 shadow-lg shadow-green-500/20' : 'bg-linear-to-br from-green-900/40 to-green-950/40 border-green-700/40 hover:border-green-600/60'}`}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-green-400 uppercase tracking-widest">Watched</p>
                        <p className="text-4xl font-bold text-neutral-50 mt-3">{moviesWatched}</p>
                    </div>
                    <div className={`text-5xl transition-transform ${activeFilter === 'watched' ? 'scale-125' : 'opacity-20'}`}>✓</div>
                </div>
            </button>

            <button 
              onClick={() => onStatClick('towatch')}
              className={`text-left transition-all duration-300 rounded-xl p-5 border backdrop-blur-sm hover:shadow-lg ${activeFilter === 'towatch' ? 'bg-linear-to-br from-purple-900/60 to-purple-950/60 border-purple-600/80 shadow-lg shadow-purple-500/20' : 'bg-linear-to-br from-purple-900/40 to-purple-950/40 border-purple-700/40 hover:border-purple-600/60'}`}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest">To Watch</p>
                        <p className="text-4xl font-bold text-neutral-50 mt-3">{moviesToWatch}</p>
                    </div>
                    <div className={`text-5xl transition-transform ${activeFilter === 'towatch' ? 'scale-125' : 'opacity-20'}`}>📋</div>
                </div>
            </button>
        </div>
    );
}
