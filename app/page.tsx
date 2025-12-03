"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Header from './component/Header';
import Buttons from './component/Buttons';
import MovieList from './component/MovieList';
import StatsCard from './component/StatsCard';
import AddMovieModal from './component/AddMovieModal';

const API_URL = "http://localhost:3001/movies";

type Movie = {
  id: number;
  title: string;
  genre: string;
  rating: number;
  feedback: string;
  watched: boolean;
};

type User = {
  id: number;
  username: string;
  email: string;
};

export default function Home() {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [rating, setRating] = useState('');
  const [feedback, setFeedback] = useState('');
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'watched' | 'towatch'>('all');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setIsAuthenticated(true);
      fetchMovies(token);
    } catch (err) {
      router.push('/auth');
    }
  }, []);

  const fetchMovies = async (token?: string) => {
    setLoading(true);
    setError(null);
    try {
      const authToken = token || localStorage.getItem('token');
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setMovieList(response.data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error fetching data";
      if (message.includes('401')) {
        handleLogout();
      }
      setError(message);
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (title.trim() === '') {
      setError("Please enter a movie title.");
      return;
    }
    if (genre.trim() === '') {
      setError("Please enter a genre.");
      return;
    }

    const newMovie = { 
      title: title.trim(), 
      genre: genre.trim(), 
      rating: rating ? parseInt(rating) : null,
      feedback: feedback.trim(),
      watched: false
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post(API_URL, newMovie, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchMovies(token || undefined); 
      setTitle('');
      setGenre('');
      setRating('');
      setFeedback('');
      setError(null);
      setIsModalOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save.";
      setError(message);
      console.error(error);
    }
  };

  const handleDelete = async (index: number) => {
    const idToDelete = movieList[index].id;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/${idToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMovieList(prevList => prevList.filter((_, i) => i !== index));
    } catch (error) {
      alert("Failed to delete.");
    }
  };

  const handleEdit = async (index: number) => {
    const currentMovie = movieList[index];
    const idToEdit = currentMovie.id; 

    const newTitle = prompt("Edit Movie Title:", currentMovie.title);
    if (newTitle === null) return;

    const newGenre = prompt("Edit Genre:", currentMovie.genre);
    if (newGenre === null) return;

    const newRating = prompt("Edit Rating (1-10):", currentMovie.rating?.toString() || '');
    const newFeedback = prompt("Edit Feedback:", currentMovie.feedback || '');

    const updatedMovie = { 
      title: newTitle, 
      genre: newGenre, 
      rating: newRating ? parseInt(newRating) : null,
      feedback: newFeedback || '',
      watched: currentMovie.watched
    };

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/${idToEdit}`, updatedMovie, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMovies(token || undefined);
    } catch (error) {
      alert("Failed to update.");
    }
  };

  const handleToggleWatched = async (index: number) => {
    const currentMovie = movieList[index];
    const idToUpdate = currentMovie.id;

    const updatedMovie = { 
      ...currentMovie, 
      watched: !currentMovie.watched 
    };

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/${idToUpdate}`, updatedMovie, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMovies(token || undefined);
    } catch (error) {
      alert("Failed to update watched status.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    router.push('/auth');
  };

  const totalMovies = movieList.length;
  const moviesWatched = movieList.filter(m => m.watched).length;
  const moviesToWatch = totalMovies - moviesWatched;

  const getFilteredMovies = () => {
    if (filter === 'watched') return movieList.filter(m => m.watched);
    if (filter === 'towatch') return movieList.filter(m => !m.watched);
    return movieList;
  };

  const filteredMovies = getFilteredMovies();

  const getFilterTitle = () => {
    if (filter === 'watched') return 'Movies Watched';
    if (filter === 'towatch') return 'Movies To Watch';
    return 'All Movies';
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-neutral-50 p-6 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header with Logout */}
        <div className="flex justify-between items-center mb-8">
          <Header title="Movie Watchlist" />
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-neutral-400">
                Welcome, <span className="text-blue-400 font-semibold">{user.username}</span>
              </span>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-700/50 rounded-lg text-sm transition"
            >
              Logout
            </button>
          </div>
        </div>

        <StatsCard 
          totalMovies={totalMovies} 
          moviesWatched={moviesWatched} 
          moviesToWatch={moviesToWatch}
          onStatClick={setFilter}
          activeFilter={filter}
        />

        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-neutral-50 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            + Add Movie
          </button>
        </div>

        <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl p-6 mb-6 border border-neutral-800/50 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-100">{getFilterTitle()}</h3>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="text-xs px-3 py-1 bg-neutral-700/50 hover:bg-neutral-700 text-neutral-300 rounded-lg transition"
              >
                ✕ Clear Filter
              </button>
            )}
          </div>
          {loading ? (
            <p className="text-neutral-400 text-center">Loading...</p>
          ) : filteredMovies.length === 0 ? (
            <div className="text-center py-8">
              {filter === 'all' && movieList.length === 0 ? (
                <>
                  <p className="text-neutral-400 mb-3">No movies yet. Start your collection!</p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-neutral-50 rounded-lg transition"
                  >
                    Add Your First Movie
                  </button>
                </>
              ) : (
                <p className="text-neutral-400">No {filter === 'watched' ? 'watched' : 'unwatched'} movies</p>
              )}
            </div>
          ) : (
            <MovieList 
              movies={filteredMovies} 
              onDelete={handleDelete} 
              onEdit={handleEdit}
              onToggleWatched={handleToggleWatched}
            />
          )}
        </div>

        <AddMovieModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setError(null);
          }}
          onSubmit={handleSubmit}
          title={title}
          setTitle={setTitle}
          genre={genre}
          setGenre={setGenre}
          rating={rating}
          setRating={setRating}
          feedback={feedback}
          setFeedback={setFeedback}
          error={error}
        />
      </div>
    </main>
  );
}