export default function AddMovieModal({ isOpen, onClose, onSubmit, title, setTitle, genre, setGenre, rating, setRating, feedback, setFeedback, error }) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn" onClick={handleBackdropClick}>
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all animate-slideUp">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-purple-600 px-6 py-5 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-50">Add New Movie</h2>
            <button
              onClick={onClose}
              className="text-neutral-200 hover:text-neutral-50 text-2xl leading-none transition-colors hover:rotate-90 duration-200"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-neutral-300 block mb-2">Movie Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Inception"
              className="w-full rounded-lg border border-neutral-700 px-4 py-2.5 bg-neutral-800 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-300 block mb-2">Genre *</label>
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="e.g. Sci-Fi"
              className="w-full rounded-lg border border-neutral-700 px-4 py-2.5 bg-neutral-800 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-300 block mb-2">Rating (1-10)</label>
            <input
              type="number"
              min="1"
              max="10"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="8"
              className="w-full rounded-lg border border-neutral-700 px-4 py-2.5 bg-neutral-800 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-300 block mb-2">Your Feedback</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What did you think about this movie?"
              rows="3"
              className="w-full rounded-lg border border-neutral-700 px-4 py-2.5 bg-neutral-800 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700/50 text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-neutral-800/50 px-6 py-4 rounded-b-2xl flex gap-3 border-t border-neutral-700">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-neutral-600 text-neutral-300 hover:bg-neutral-700/50 transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="flex-1 px-4 py-2.5 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 text-neutral-50 hover:from-blue-700 hover:to-purple-700 transition font-medium shadow-lg hover:shadow-xl"
          >
            Add Movie
          </button>
        </div>
      </div>
    </div>
  );
}
