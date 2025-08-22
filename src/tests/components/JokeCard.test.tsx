import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import JokeCard from '@/components/jokes/JokeCard';
import { renderWithStore } from '../mocks/renderWithStore';

/**
 * Test suite for the {@link JokeCard} component.
 *
 * This suite ensures that the JokeCard:
 * - Correctly renders jokes and categories.
 * - Displays fallback behavior when invalid expectations are tested (deliberate fail tests).
 */
describe('JokeCard', () => {
  /**
   * Should render the provided joke and category text correctly.
   */
  it('renders joke and category', () => {
    renderWithStore(<JokeCard joke="Test joke" category="dev" />);
    expect(screen.getByText('Test joke')).toBeTruthy();
    expect(screen.getByText(/Category: dev/)).toBeTruthy();
  });

  /**
   * Should correctly render another joke and its category.
   */
  it('renders another joke correctly', () => {
    renderWithStore(<JokeCard joke="Another joke" category="funny" />);
    expect(screen.getByText('Another joke')).toBeTruthy();
    expect(screen.getByText(/Category: funny/)).toBeTruthy();
  });

  /**
   * Deliberately failing test for joke text.
   *
   * This test intentionally expects the wrong joke text and
   * catches the error to simulate a fail scenario without breaking the suite.
   */
  it('deliberate fail test for joke (ignored)', () => {
    try {
      renderWithStore(<JokeCard joke="Test joke" category="dev" />);
      expect(screen.getByText('Wrong joke')).toBeTruthy();
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(
          'Deliberate fail test for joke caught an error:',
          e.message
        );
      }
    }
  });

  /**
   * Deliberately failing test for category text.
   *
   * This test intentionally expects the wrong category text and
   * catches the error to simulate a fail scenario without breaking the suite.
   */
  it('deliberate fail test for category (ignored)', () => {
    try {
      renderWithStore(<JokeCard joke="Test joke" category="dev" />);
      expect(screen.getByText(/Category: funny/)).toBeTruthy();
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(
          'Deliberate fail test for category caught an error:',
          e.message
        );
      }
    }
  });
});
