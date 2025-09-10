import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User } from '@/lib/store';

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  connectionType: string;
  onStartChat: () => void;
  onPlanCoffee: () => void;
}

export function MatchModal({ 
  isOpen, 
  onClose, 
  user, 
  connectionType, 
  onStartChat, 
  onPlanCoffee 
}: MatchModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="animate-bounce-in max-w-sm p-6 text-center">
        <div className="mb-6">
          <h2 className="text-heading-large mb-2 text-primary">It's a Match! ✨</h2>
          <p className="text-body text-muted-foreground">
            You and {user.name} both liked each other
          </p>
        </div>

        <div className="mb-6 flex items-center justify-center space-x-4">
          <div className="relative">
            <img
              src="https://picsum.photos/seed/me1/100/100"
              alt="Your avatar"
              className="h-20 w-20 rounded-full border-4 border-primary object-cover"
            />
          </div>
          <div className="text-2xl">💫</div>
          <div className="relative">
            <img
              src={user.photos[0]}
              alt={`${user.name}'s avatar`}
              className="h-20 w-20 rounded-full border-4 border-secondary object-cover"
            />
          </div>
        </div>

        <div className="mb-6">
          <span className="inline-block rounded-full bg-grey-100 px-3 py-1 text-sm font-medium text-grey-700">
            {connectionType} Connection
          </span>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={onStartChat}
            className="w-full"
          >
            Start Chat 💬
          </Button>
          <Button 
            variant="outline" 
            onClick={onPlanCoffee}
            className="w-full"
          >
            Plan Coffee (15 min) ☕
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}