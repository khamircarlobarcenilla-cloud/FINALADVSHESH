export default function MovieList({ movies, onDelete, onEdit, onToggleWatched }) {
    if (!movies || movies.length === 0) {
        return null;
    }

    return (
        <ul className="space-y-3 w-full">
            {movies.map((movie, index) => (
                <li key={index} className="flex justify-between items-center bg-neutral-800/50 backdrop-blur-sm p-4 rounded-xl border border-neutral-700/50 hover:border-neutral-600 transition-all hover:shadow-lg hover:shadow-neutral-900/50 group">
                    <div className="flex items-start gap-3 flex-1">
                        <div className="text-2xl opacity-0 group-hover:opacity-100 transition-opacity">{movie.watched ? '🎥' : '📽️'}</div>
                        <div className="flex flex-col flex-1">
                            <span className={`font-semibold text-lg ${movie.watched ? 'text-neutral-400 line-through' : 'text-neutral-100'}`}>{movie.title}</span>
                            <div className="flex gap-2 mt-2 flex-wrap">
                                <span className="text-xs inline-block bg-neutral-700/60 text-neutral-300 px-3 py-1 rounded-full font-medium">{movie.genre}</span>
                                {movie.rating && (
                                    <span className="text-xs inline-block bg-yellow-900/40 text-yellow-300 px-3 py-1 rounded-full font-medium">⭐ {movie.rating}/10</span>
                                )}
                                <span className={`text-xs inline-block px-3 py-1 rounded-full font-medium ${movie.watched ? 'bg-green-900/40 text-green-300' : 'bg-orange-900/40 text-orange-300'}`}>
                                    {movie.watched ? '✓ Watched' : '📌 To Watch'}
                                </span>
                            </div>
                            {movie.feedback && (
                                <p className="text-xs text-neutral-400 mt-2.5 italic border-l-2 border-neutral-600 pl-2">{movie.feedback}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2 shrink-0 ml-4">
                        <button 
                            onClick={() => onToggleWatched(index)}
                            title={movie.watched ? "Mark as unwatched" : "Mark as watched"}
                            className={`text-xs px-3 py-2 rounded-lg font-medium transition-all duration-200 ${movie.watched ? 'bg-green-900/40 hover:bg-green-900/60 text-green-300 border border-green-700/40' : 'bg-blue-900/40 hover:bg-blue-900/60 text-blue-300 border border-blue-700/40'}`}>
                            {movie.watched ? '↶ Unwatch' : '✓ Watch'}
                        </button>
                        <button 
                            onClick={() => onEdit(index)}
                            title="Edit movie"
                            className="text-xs bg-amber-900/40 hover:bg-amber-900/60 text-amber-300 px-3 py-2 rounded-lg transition-all duration-200 border border-amber-700/40 font-medium">✎ Edit</button>
                        <button 
                            onClick={() => onDelete(index)}
                            title="Delete movie"
                            className="text-xs bg-red-900/40 hover:bg-red-900/60 text-red-300 px-3 py-2 rounded-lg transition-all duration-200 border border-red-700/40 font-medium">✕ Delete</button>
                    </div>
                </li>
            ))}
        </ul>
    );
}
