import { useState } from 'react';
import { useAppDispatch } from '@/store/index';
import { searchJokes } from '@/store/slices/jokesSlice';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    dispatch(searchJokes(query));
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      data-testid="search-form"
      className="flex items-center gap-2 w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Input
        type="text"
        placeholder="🔍 Search for a joke..."
        value={query}
        data-testid="search-input"
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 rounded-xl shadow-sm focus:ring-2 focus:ring-primary bg-card text-card-foreground placeholder:text-muted-foreground"
      />
      <Button
        type="submit"
        className="rounded-xl shadow-md px-4"
        disabled={!query.trim()}
      >
        <Search className="w-4 h-4 mr-1" />
        Search
      </Button>
    </motion.form>
  );
}
