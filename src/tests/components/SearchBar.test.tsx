import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  render,
  screen,
  within,
  waitFor,
  cleanup,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SearchBar from '@/components/search/SearchBar';
import jokesReducer, { searchJokes } from '@/store/slices/jokesSlice';

/**
 * Mock implementation of the {@link searchJokes} thunk.
 *
 * Instead of executing the actual async logic,
 * it returns a simple action object with type `jokes/searchJokes`.
 */
vi.mock('@/store/slices/jokesSlice', async () => {
  const actual = await vi.importActual('@/store/slices/jokesSlice');
  return {
    ...actual,
    searchJokes: vi.fn().mockReturnValue({ type: 'jokes/searchJokes' }),
  };
});

/**
 * Test suite for the {@link SearchBar} component.
 *
 * This suite ensures:
 * - Correct dispatching of the searchJokes thunk with valid queries.
 * - Prevention of dispatch on empty queries.
 * - Proper integration with Redux store in a testing environment.
 */
describe('SearchBar', () => {
  let store: ReturnType<typeof configureStore>;

  /**
   * Creates a new Redux store and clears mocks before each test.
   */
  beforeEach(() => {
    store = configureStore({ reducer: { jokes: jokesReducer } });
    vi.clearAllMocks();
  });

  /**
   * Cleans up the DOM after each test run.
   */
  afterEach(() => {
    cleanup();
  });

  /**
   * Should dispatch {@link searchJokes} thunk with the correct query (`chuck`)
   * when a valid search term is entered and submitted.
   */
  it('should dispatch searchJokes thunk with correct query when submitting a valid search', async () => {
    render(
      <Provider store={store}>
        <SearchBar />
      </Provider>
    );

    const form = screen.getByTestId('search-form');
    const input = within(form).getByTestId('search-input') as HTMLInputElement;
    const button = within(form).getByRole('button', { name: /search/i });

    await userEvent.type(input, 'chuck');
    await userEvent.click(button);

    await waitFor(() => {
      expect(searchJokes).toHaveBeenCalledWith('chuck');
      expect(searchJokes).toHaveBeenCalledTimes(1);
    });
  });

  /**
   * Should dispatch {@link searchJokes} thunk with a non-existent query (`xyz123notfound`).
   * Even if results don't exist, the thunk must still be dispatched correctly.
   */
  it('should dispatch searchJokes thunk with correct query when searching a non-existent joke', async () => {
    render(
      <Provider store={store}>
        <SearchBar />
      </Provider>
    );

    const form = screen.getByTestId('search-form');
    const input = within(form).getByTestId('search-input') as HTMLInputElement;
    const button = within(form).getByRole('button', { name: /search/i });

    await userEvent.type(input, 'xyz123notfound');
    await userEvent.click(button);

    await waitFor(() => {
      expect(searchJokes).toHaveBeenCalledWith('xyz123notfound');
      expect(searchJokes).toHaveBeenCalledTimes(1);
    });
  });

  /**
   * Should not dispatch {@link searchJokes} thunk
   * when submitting the form with an empty query.
   */
  it('should not dispatch searchJokes thunk when submitting an empty query', async () => {
    render(
      <Provider store={store}>
        <SearchBar />
      </Provider>
    );

    const form = screen.getByTestId('search-form');
    const button = within(form).getByRole('button', { name: /search/i });

    await userEvent.click(button);

    await waitFor(() => {
      expect(searchJokes).not.toHaveBeenCalled();
    });
  });
});
