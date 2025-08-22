type JokeStatus = 'idle' | 'loading' | 'failed';

export interface JokeState {
  value: string | null;
  category: string | null;
  status: JokeStatus;
  error: string | null;
  categories: string[];
}
