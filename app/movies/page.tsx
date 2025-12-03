"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../component/Header';
import MovieInputs from '../component/MovieInputs';
import Buttons from '../component/Buttons';
import MovieList from '../component/MovieList';
import StatsCard from '../component/StatsCard';

const API_URL = "http://localhost:3001/movies";

type Movie = {
  id: number;
  title: string;
  genre: string;
  rating: number;
  feedback: string;
  watched: boolean;
};

export default function MoviesPage() {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [rating, setRating] = useState('');
  const [feedback, setFeedback] = useState('');
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      setMovieList(response.data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error fetching data";
      setError(message);
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

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
      await axios.post(API_URL, newMovie);
      await fetchMovies(); 
      setTitle('');
      setGenre('');
      setRating('');
      setFeedback('');
      setError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save.";
      setError(message);
      console.error(error);
    }
  };

  const handleDelete = async (index: number) => {
    const idToDelete = movieList[index].id;
    try {
      await axios.delete(`${API_URL}/${idToDelete}`);
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
      await axios.put(`${API_URL}/${idToEdit}`, updatedMovie);
      fetchMovies();
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
      await axios.put(`${API_URL}/${idToUpdate}`, updatedMovie);
      fetchMovies();
    } catch (error) {
      alert("Failed to update watched status.");
    }
  };

  const totalMovies = movieList.length;
  const moviesWatched = movieList.filter(m => m.watched).length;
  const moviesToWatch = totalMovies - moviesWatched;

  return (
    <main className="min-h-screen flex items-start justify-center p-8 bg-slate-50">
      <div className="w-full max-w-4xl">
        <Header title="🎬 Movie Watchlist Manager" />

        <StatsCard 
          totalMovies={totalMovies} 
          moviesWatched={moviesWatched} 
          moviesToWatch={moviesToWatch}
          onStatClick={() => {}}
          activeFilter="all"
        />

        <div className="bg-white rounded-lg shadow p-6 border border-gray-100 mb-6">
          <h3 className="text-2xl font-semibold text-slate-900 mb-3">Your Movies</h3>
          {loading ? (
            <p className="text-slate-600 text-center">Loading...</p>
          ) : movieList.length === 0 ? (
            <p className="text-slate-600 text-center">No movies yet. Add one to get started.</p>
          ) : (
            <MovieList 
              movies={movieList} 
              onDelete={handleDelete} 
              onEdit={handleEdit}
              onToggleWatched={handleToggleWatched}
            />
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Add New Movie</h2>
          <MovieInputs 
            title={title} 
            genre={genre} 
            rating={rating} 
            feedback={feedback}
            setTitle={setTitle} 
            setGenre={setGenre} 
            setRating={setRating}
            setFeedback={setFeedback}
          />
          <div className="mt-4">
            <Buttons name="Add Movie" onClick={handleSubmit} />
          </div>
          {error && <p className="text-rose-600 mt-3 text-center font-semibold">{error}</p>}
        </div>
      </div>
    </main>
  );
}
