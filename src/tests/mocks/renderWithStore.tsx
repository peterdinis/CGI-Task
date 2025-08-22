import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import jokesReducer from '../../store/slices/jokesSlice';
import { render } from '@testing-library/react';

export const renderWithStore = (ui: React.ReactNode) => {
  const store = configureStore({ reducer: { jokes: jokesReducer } });
  return render(<Provider store={store}>{ui}</Provider>);
};
