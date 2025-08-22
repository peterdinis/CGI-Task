import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Z ENV súboru
const API_BASE = import.meta.env.VITE_CHUCK_NORRIS_API;

/**
 * Fetch a random joke from the Chuck Norris API.
 *
 * @async
 * @function fetchRandomJoke
 * @returns {Promise<string>} A random joke string.
 */
export const fetchRandomJoke = createAsyncThunk(
  'jokes/fetchRandomJoke',
  async () => {
    const res = await fetch(`${API_BASE}/random`);
    const data = await res.json();
    return data.value;
  }
);

/**
 * Fetch a random joke from a specific category.
 *
 * @async
 * @function fetchJokeByCategory
 * @param {string} category - The category to fetch a joke from.
 * @returns {Promise<{ joke: string, category: string }>} A random joke and its category.
 */
export const fetchJokeByCategory = createAsyncThunk(
  'jokes/fetchJokeByCategory',
  async (category: string) => {
    const res = await fetch(`${API_BASE}/random?category=${category}`);
    const data = await res.json();
    return { joke: data.value, category };
  }
);

/**
 * Search jokes by a text query.
 * Returns a random joke from the search results.
 *
 * @async
 * @function searchJokes
 * @param {string} query - The search term.
 * @param {object} thunkAPI - Redux thunk API helpers.
 * @param {Function} thunkAPI.rejectWithValue - Used to return a custom error message.
 * @returns {Promise<string>} A random joke from the search results.
 */
export const searchJokes = createAsyncThunk(
  'jokes/searchJokes',
  async (query: string, { rejectWithValue }) => {
    const res = await fetch(`${API_BASE}/search?query=${query}`);
    const data = await res.json();
    if (data.result.length === 0) {
      return rejectWithValue('No joke found for this query');
    }
    const randomIndex = Math.floor(Math.random() * data.result.length);
    return data.result[randomIndex].value;
  }
);

/**
 * Fetch all available joke categories from the Chuck Norris API.
 *
 * @async
 * @function fetchCategories
 * @returns {Promise<string[]>} An array of category names.
 */
export const fetchCategories = createAsyncThunk(
  'jokes/fetchCategories',
  async () => {
    const res = await fetch(`${API_BASE}/categories`);
    const data = await res.json();
    return data as string[];
  }
);

/**
 * Shape of the jokes state stored in Redux.
 *
 * @typedef {Object} JokesState
 * @property {string | null} value - The current joke text.
 * @property {string | null} category - The category of the current joke.
 * @property {string[]} categories - List of available categories.
 * @property {string | null} error - Error message, if any.
 * @property {boolean} loading - Whether a request is currently loading.
 * @property {boolean} hasSearched - Whether the user has initiated a search or fetch.
 */
type JokesState = {
  value: string | null;
  category: string | null;
  categories: string[];
  error: string | null;
  loading: boolean;
  hasSearched: boolean;
};

/** @type {JokesState} */
const initialState: JokesState = {
  value: null,
  category: null,
  categories: [],
  error: null,
  loading: false,
  hasSearched: false,
};

/**
 * Redux slice for managing jokes and categories.
 *
 * Handles async thunks:
 * - `fetchRandomJoke`
 * - `fetchJokeByCategory`
 * - `searchJokes`
 * - `fetchCategories`
 *
 * Updates state based on pending/fulfilled/rejected actions.
 */
export const jokesSlice = createSlice({
  name: 'jokes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Random joke
      .addCase(fetchRandomJoke.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRandomJoke.fulfilled, (state, action) => {
        state.value = action.payload;
        state.category = null;
        state.error = null;
        state.loading = false;
        state.hasSearched = true;
      })
      .addCase(fetchRandomJoke.rejected, (state) => {
        state.error = 'Failed to fetch joke';
        state.value = null;
        state.loading = false;
        state.hasSearched = true;
      })

      // Joke by category
      .addCase(fetchJokeByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJokeByCategory.fulfilled, (state, action) => {
        state.value = action.payload.joke;
        state.category = action.payload.category;
        state.error = null;
        state.loading = false;
        state.hasSearched = true;
      })
      .addCase(fetchJokeByCategory.rejected, (state) => {
        state.error = 'Failed to fetch joke';
        state.value = null;
        state.loading = false;
        state.hasSearched = true;
      })

      // Search jokes
      .addCase(searchJokes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchJokes.fulfilled, (state, action) => {
        state.value = action.payload;
        state.category = null;
        state.error = null;
        state.loading = false;
        state.hasSearched = true;
      })
      .addCase(searchJokes.rejected, (state, action) => {
        state.error = (action.payload as string) || 'Failed to fetch joke';
        state.value = null;
        state.loading = false;
        state.hasSearched = true;
      })

      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.error = 'Failed to fetch categories';
        state.loading = false;
      });
  },
});

export default jokesSlice.reducer;
