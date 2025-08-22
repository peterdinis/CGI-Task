import { describe, expect, it } from 'vitest';
import jokesReducer, {
  fetchCategories,
  fetchJokeByCategory,
  fetchRandomJoke,
  searchJokes,
} from '@/store/slices/jokesSlice';

/**
 * Unit tests for the jokesSlice Redux reducer.
 *
 * These tests verify that the reducer handles all joke-related async thunks
 * (`fetchRandomJoke`, `fetchCategories`, `fetchJokeByCategory`, `searchJokes`)
 * correctly in their pending, fulfilled, and rejected states.
 *
 * The reducer manages state properties such as:
 * - `value`: current joke string or null
 * - `category`: current category or null
 * - `categories`: available joke categories
 * - `error`: error message or null
 * - `loading`: loading state for async actions
 * - `hasSearched`: flag indicating if a joke fetch/search has been attempted
 */
describe('jokesSlice reducer', () => {
  /** Initial state used for most tests */
  const initialState = {
    value: null,
    category: null,
    categories: [],
    error: null,
    loading: false,
    hasSearched: false,
  };

  /** Ensures reducer returns the initial state for unknown actions */
  it('should return initial state by default', () => {
    expect(jokesReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  /** Tests the pending state of fetchRandomJoke */
  it('should handle fetchRandomJoke.pending', () => {
    const state = jokesReducer(initialState, {
      type: fetchRandomJoke.pending.type,
    });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  /** Tests the fulfilled state of fetchRandomJoke */
  it('should handle fetchRandomJoke.fulfilled', () => {
    const state = jokesReducer(initialState, {
      type: fetchRandomJoke.fulfilled.type,
      payload: 'Funny joke',
    });
    expect(state.value).toBe('Funny joke');
    expect(state.loading).toBe(false);
    expect(state.hasSearched).toBe(true);
  });

  /** Tests the fulfilled state of fetchCategories */
  it('should handle fetchCategories.fulfilled', () => {
    const state = jokesReducer(initialState, {
      type: fetchCategories.fulfilled.type,
      payload: ['animal', 'career'],
    });
    expect(state.categories).toEqual(['animal', 'career']);
    expect(state.loading).toBe(false);
  });

  /** Tests the pending state of fetchJokeByCategory */
  it('should handle fetchJokeByCategory.pending', () => {
    const state = jokesReducer(initialState, {
      type: fetchJokeByCategory.pending.type,
    });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  /** Tests the fulfilled state of fetchJokeByCategory */
  it('should handle fetchJokeByCategory.fulfilled', () => {
    const state = jokesReducer(initialState, {
      type: fetchJokeByCategory.fulfilled.type,
      payload: { joke: 'Category joke', category: 'animal' },
    });
    expect(state.value).toBe('Category joke');
    expect(state.category).toBe('animal');
    expect(state.loading).toBe(false);
    expect(state.hasSearched).toBe(true);
  });

  /** Tests the rejected state of fetchJokeByCategory */
  it('should handle fetchJokeByCategory.rejected', () => {
    const state = jokesReducer(initialState, {
      type: fetchJokeByCategory.rejected.type,
    });
    expect(state.error).toBe('Failed to fetch joke');
    expect(state.value).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.hasSearched).toBe(true);
  });

  /** Tests the pending state of searchJokes */
  it('should handle searchJokes.pending', () => {
    const state = jokesReducer(initialState, {
      type: searchJokes.pending.type,
    });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  /** Tests the fulfilled state of searchJokes */
  it('should handle searchJokes.fulfilled', () => {
    const state = jokesReducer(initialState, {
      type: searchJokes.fulfilled.type,
      payload: 'Found a matching joke',
    });
    expect(state.value).toBe('Found a matching joke');
    expect(state.category).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.hasSearched).toBe(true);
  });

  /** Tests the rejected state of searchJokes with a custom payload */
  it('should handle searchJokes.rejected with custom payload', () => {
    const state = jokesReducer(initialState, {
      type: searchJokes.rejected.type,
      payload: 'No joke found for this query',
    });
    expect(state.error).toBe('No joke found for this query');
    expect(state.value).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.hasSearched).toBe(true);
  });

  /** Tests the rejected state of searchJokes without a custom payload (fallback error) */
  it('should handle searchJokes.rejected without payload', () => {
    const state = jokesReducer(initialState, {
      type: searchJokes.rejected.type,
      error: { message: 'Network error' },
    });
    expect(state.error).toBe('Failed to fetch joke'); // fallback from slice
    expect(state.value).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.hasSearched).toBe(true);
  });
});
