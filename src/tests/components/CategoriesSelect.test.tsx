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
import CategoriesSelect from '@/components/categories/CategoriesSelect';
import * as jokesSlice from '@/store/slices/jokesSlice';
import { useAppDispatch, useAppSelector } from '../../store';

// Mock the Redux hooks
vi.mock('../../store', () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

// Mock the thunks directly
vi.mock('@/store/slices/jokesSlice', async () => {
  const actual = await vi.importActual<
    typeof import('@/store/slices/jokesSlice')
  >('@/store/slices/jokesSlice');
  return {
    ...actual,
    default: actual.default, // ✅ keep the reducer as default export
    fetchCategories: vi.fn(() => ({ type: 'jokes/fetchCategories' })),
    fetchJokeByCategory: vi.fn((category: string) => ({
      type: 'jokes/fetchJokeByCategory',
      payload: category,
    })),
  };
});

/**
 * Test suite for the <CategoriesSelect /> component.
 *
 * Covers:
 * - Lifecycle behavior (dispatching `fetchCategories` on mount).
 * - Rendering of the default option and category options.
 * - Interaction behavior when selecting categories.
 * - Validation of Tailwind classes applied to the `<select>`.
 */
describe('CategoriesSelect', () => {
  let store: ReturnType<typeof configureStore>;
  let mockDispatch: ReturnType<typeof vi.fn>;
  let mockFetchCategories: ReturnType<typeof vi.fn>;
  let mockFetchJokeByCategory: ReturnType<typeof vi.fn>;

  /**
   * Set up fresh Redux store and mocked dispatch before each test.
   * Also configure mocked implementations of hooks and thunks.
   */
  beforeEach(() => {
    store = configureStore({ reducer: { jokes: jokesSlice.default } });
    mockDispatch = vi.fn();

    // Reference mocked exports
    mockFetchCategories = vi.mocked(jokesSlice.fetchCategories);
    mockFetchJokeByCategory = vi.mocked(jokesSlice.fetchJokeByCategory);

    vi.mocked(useAppDispatch).mockReturnValue(mockDispatch);
    vi.mocked(useAppSelector).mockImplementation((selector) =>
      selector({
        jokes: {
          categories: ['animal', 'career', 'celebrity'],
          value: null,
          category: null,
          error: null,
          loading: false,
          hasSearched: false,
        },
      })
    );

    vi.clearAllMocks();
  });

  /** Cleanup DOM after each test */
  afterEach(() => {
    cleanup();
  });

  /**
   * Ensures that `fetchCategories` thunk is dispatched
   * immediately when the component mounts.
   */
  it('should dispatch fetchCategories on mount', async () => {
    render(
      <Provider store={store}>
        <CategoriesSelect />
      </Provider>
    );

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(mockFetchCategories());
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });
  });

  /**
   * Verifies that the `<select>` element renders
   * with the default "Select a category" option.
   */
  it('should render select element with default option', () => {
    render(
      <Provider store={store}>
        <CategoriesSelect />
      </Provider>
    );

    const select = screen.getByRole('combobox');
    expect(select).toBeTruthy();
    const defaultOption = within(select).getByRole('option', {
      name: 'Select a category',
    });
    expect(defaultOption.getAttribute('value')).toBe('');
    expect(defaultOption).toBeTruthy();
  });

  /**
   * Ensures that categories from the Redux store are rendered
   * as selectable `<option>` elements.
   */
  it('should render categories from Redux store as options', () => {
    render(
      <Provider store={store}>
        <CategoriesSelect />
      </Provider>
    );

    const select = screen.getByRole('combobox');
    const options = within(select).getAllByRole('option');
    expect(options.length).toBe(4); // Default option + 3 categories
    expect(
      within(select)
        .getByRole('option', { name: 'animal' })
        .getAttribute('value')
    ).toBe('animal');
    expect(
      within(select)
        .getByRole('option', { name: 'career' })
        .getAttribute('value')
    ).toBe('career');
    expect(
      within(select)
        .getByRole('option', { name: 'celebrity' })
        .getAttribute('value')
    ).toBe('celebrity');
  });

  /**
   * Verifies that selecting a category dispatches
   * the `fetchJokeByCategory` thunk with the chosen value.
   */
  it('should dispatch fetchJokeByCategory when a category is selected', async () => {
    render(
      <Provider store={store}>
        <CategoriesSelect />
      </Provider>
    );

    const select = screen.getByRole('combobox');
    await userEvent.selectOptions(select, 'animal');

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        mockFetchJokeByCategory('animal')
      );
      expect(mockDispatch).toHaveBeenCalledTimes(2); // fetchCategories + fetchJokeByCategory
      expect((select as HTMLSelectElement).value).toBe('animal');
    });
  });

  /**
   * Ensures that selecting the default empty option
   * does not dispatch `fetchJokeByCategory`.
   */
  it('should not dispatch fetchJokeByCategory when default option is selected', async () => {
    render(
      <Provider store={store}>
        <CategoriesSelect />
      </Provider>
    );

    const select = screen.getByRole('combobox');
    await userEvent.selectOptions(select, '');

    await waitFor(() => {
      expect(mockDispatch).not.toHaveBeenCalledWith(
        mockFetchJokeByCategory('')
      );
      expect(mockDispatch).toHaveBeenCalledTimes(1); // Only fetchCategories
      expect((select as HTMLSelectElement).value).toBe('');
    });
  });

  /**
   * Checks that the `<select>` element has
   * the expected Tailwind classes applied.
   */
  it('should apply correct classes to select element', () => {
    render(
      <Provider store={store}>
        <CategoriesSelect />
      </Provider>
    );

    const select = screen.getByRole('combobox');
    const classList = select.className.split(' ').filter((cls) => cls);
    expect(classList).toContain('w-full');
    expect(classList).toContain('rounded-xl');
    expect(classList).toContain('border');
    expect(classList).toContain('border-gray-300');
    expect(classList).toContain('bg-white');
    expect(classList).toContain('px-4');
    expect(classList).toContain('py-2');
    expect(classList).toContain('text-gray-700');
    expect(classList).toContain('shadow-sm');
    expect(classList).toContain('focus:border-blue-500');
    expect(classList).toContain('focus:ring');
    expect(classList).toContain('focus:ring-blue-300');
    expect(classList).toContain('dark:bg-gray-800');
    expect(classList).toContain('dark:text-gray-200');
    expect(classList).toContain('dark:border-gray-700');
    expect(classList).toContain('transition');
  });
});
