export default function MovieInputs({ title, genre, rating, feedback, setTitle, setGenre, setRating, setFeedback }) {
    return (
        <>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-neutral-400">Movie Title *</label>
            <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="e.g. Inception, Interstellar" 
                className="w-full rounded-md border border-neutral-700 px-3 py-2 bg-neutral-800 text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm text-neutral-400">Genre *</label>
            <input 
                type="text" 
                value={genre} 
                onChange={(e) => setGenre(e.target.value)}
                placeholder="e.g. Sci-Fi, Drama, Action" 
                className="w-full rounded-md border border-neutral-700 px-3 py-2 bg-neutral-800 text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm text-neutral-400">Rating (1-10)</label>
            <input 
                type="number" 
                min="1" 
                max="10" 
                value={rating} 
                onChange={(e) => setRating(e.target.value)}
                placeholder="e.g. 8, 9" 
                className="w-full rounded-md border border-neutral-700 px-3 py-2 bg-neutral-800 text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm text-neutral-400">Feedback</label>
            <textarea 
                value={feedback} 
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Write your thoughts about the movie..." 
                rows="3"
                className="w-full rounded-md border border-neutral-700 px-3 py-2 bg-neutral-800 text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>
        </>
    );
}
