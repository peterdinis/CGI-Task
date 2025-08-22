import { useAppDispatch, useAppSelector } from '@/store/index';
import {
  fetchJokeByCategory,
  fetchCategories,
} from '@/store/slices/jokesSlice';
import { useEffect, useState, type JSX, type ChangeEvent } from 'react';

/**
 * CategoriesSelect component
 *
 * Renders a `<select>` dropdown that allows users to choose a joke category.
 * On selection, it fetches a random joke from that category.
 *
 * - Fetches categories on mount via Redux `fetchCategories` thunk.
 * - Dispatches `fetchJokeByCategory` when a category is selected.
 * - Controlled component using local state (`selected`).
 *
 * @component
 * @returns {JSX.Element} A styled `<select>` dropdown for joke categories.
 */
export default function CategoriesSelect(): JSX.Element {
  const dispatch = useAppDispatch();

  /** Categories fetched from the Redux store */
  const categories = useAppSelector((s) => s.jokes.categories);

  /** Currently selected category */
  const [selected, setSelected] = useState('');

  /**
   * Fetch categories when the component mounts.
   */
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  /**
   * Handles change of the category dropdown.
   *
   * @param {ChangeEvent<HTMLSelectElement>} e - The change event from the `<select>`.
   */
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelected(value);
    if (value) {
      dispatch(fetchJokeByCategory(value));
    }
  };

  return (
    <select
      value={selected}
      onChange={handleChange}
      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm 
                 focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-40
                 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 transition"
    >
      <option value="">Select a category</option>
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  );
}
