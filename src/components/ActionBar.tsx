import { X, Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionBarProps {
  onPass: () => void;
  onSuper: () => void;
  onLike: () => void;
  disabled?: boolean;
}

export function ActionBar({ onPass, onSuper, onLike, disabled = false }: ActionBarProps) {
  return (
    <div className="flex items-center justify-center space-x-4 p-4">
      <Button
        variant="outline"
        size="lg"
        onClick={onPass}
        disabled={disabled}
        className="h-14 w-14 rounded-full border-2 border-grey-300 p-0 text-grey-600 hover:border-danger hover:text-danger"
        aria-label="Pass"
      >
        <X className="h-6 w-6" />
      </Button>
      
      <Button
        onClick={onSuper}
        disabled={disabled}
        className="h-16 w-16 rounded-full bg-secondary p-0 text-secondary-foreground hover:bg-secondary/90"
        aria-label="Super Like"
      >
        <Star className="h-7 w-7" />
      </Button>
      
      <Button
        onClick={onLike}
        disabled={disabled}
        className="h-14 w-14 rounded-full bg-success p-0 text-success-foreground hover:bg-success/90"
        aria-label="Like"
      >
        <Heart className="h-6 w-6" />
      </Button>
    </div>
  );
}