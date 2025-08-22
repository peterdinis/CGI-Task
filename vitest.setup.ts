import { expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

// Vitest: extend expect with jest-dom matchers
expect.extend(matchers);