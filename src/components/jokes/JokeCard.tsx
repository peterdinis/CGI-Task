import type { FC, JSX } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

type JokeCardProps = {
  /** The joke text to display. If null, shows a fallback message. */
  joke: string | null;
  /** The category of the joke, displayed as a subtitle if provided. */
  category: string | null;
};

/**
 * JokeCard component
 *
 * Displays a joke inside a styled card with a smooth animation.
 * Uses `framer-motion` for fade/scale transition effects when the joke changes.
 *
 * @component
 * @example
 * ```tsx
 * <JokeCard joke="Chuck Norris counted to infinity. Twice." category="funny" />
 * ```
 *
 * @param {JokeCardProps} props - The props for the component.
 * @param {string | null} props.joke - The joke text to display.
 * @param {string | null} props.category - The category of the joke.
 * @returns {JSX.Element} A motion-animated card containing the joke and category.
 */
const JokeCard: FC<JokeCardProps> = ({
  joke,
  category,
}: JokeCardProps): JSX.Element => {
  return (
    <motion.div
      key={joke} // ensures re-animation when the joke text changes
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Card className="p-4 shadow-lg bg-card text-card-foreground transition-colors rounded-xl">
        <CardContent>
          {/* Joke text */}
          <p className="text-lg font-medium">{joke || 'No joke yet'}</p>

          {/* Joke category, if available */}
          {category && (
            <p className="text-sm text-muted-foreground mt-2">
              Category: {category}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default JokeCard;
