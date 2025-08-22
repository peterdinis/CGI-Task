import { useEffect, type JSX } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/index';
import JokeCard from '@/components/jokes/JokeCard';
import SearchBar from '@/components/search/SearchBar';
import CategoriesSelect from '@/components/categories/CategoriesSelect';
import { ModeToggle } from '@/components/theme/ModeToggle';
import { fetchRandomJoke } from '@/store//slices/jokesSlice';

/**
 * Home component
 *
 * Main landing page for the Chuck Norris jokes app.
 *
 * Features:
 * - Automatically fetches a random joke on mount.
 * - Provides a theme toggle (`ModeToggle`) for light/dark mode.
 * - Includes a `SearchBar` for keyword-based joke search.
 * - Includes a `CategoriesSelect` for browsing jokes by category.
 * - Conditionally displays:
 *   - A loading indicator
 *   - An error message
 *   - A joke card (`JokeCard`) when results are available
 *
 * @component
 * @returns {JSX.Element} The rendered home page layout.
 */
export default function HomeWrapper(): JSX.Element {
  const dispatch = useAppDispatch();

  /**
   * State values from Redux store (`jokesSlice`):
   *
   * @property {string} value - The currently fetched joke text.
   * @property {string} category - The category of the current joke.
   * @property {string | null} error - Error message, if the fetch fails.
   * @property {boolean} loading - Indicates if a fetch request is in progress.
   * @property {boolean} hasSearched - True if user initiated a search or category selection.
   */
  const { value, category, error, loading, hasSearched } = useAppSelector(
    (s) => s.jokes
  );

  /**
   * Runs once on mount to fetch a random joke.
   * Uses the `fetchRandomJoke` thunk from `jokesSlice`.
   */
  useEffect(() => {
    dispatch(fetchRandomJoke());
  }, [dispatch]);

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 bg-background text-foreground transition-colors">
      {/* Top-right theme toggle button */}
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      <div className="w-full max-w-xl flex flex-col gap-6">
        {/* Page heading */}
        <h1 className="text-4xl font-bold tracking-tight text-center">
          Chuck Norris Jokes
        </h1>

        {/* Search bar for text queries */}
        <SearchBar />

        {/* Dropdown for selecting joke categories */}
        <CategoriesSelect />

        {/* Loading indicator */}
        {loading && (
          <p className="text-center text-blue-500 dark:text-blue-400 font-medium">
            Loading...
          </p>
        )}

        {/* Error message display */}
        {error && !loading && (
          <p className="text-center text-red-500 dark:text-red-400 font-medium">
            {error}
          </p>
        )}

        {/* Joke card output after successful fetch/search */}
        {!loading && hasSearched && value && (
          <JokeCard joke={value} category={category} />
        )}
      </div>
    </div>
  );
}
