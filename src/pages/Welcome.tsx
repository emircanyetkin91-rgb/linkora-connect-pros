import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mail, Linkedin } from 'lucide-react';
import { useAppStore } from '@/hooks/useAppStore';
import { useToast } from '@/hooks/use-toast';

export default function Welcome() {
  const navigate = useNavigate();
  const { updateState } = useAppStore();
  const { toast } = useToast();

  const handleSignIn = (provider: string) => {
    updateState(state => ({
      ...state,
      auth: { 
        isSignedIn: true,
        provider,
        email: provider === 'email' ? 'user@example.com' : undefined
      },
      userStatus: 'approved'
    }));
    
    toast({
      title: "Welcome to Nexa! 🎉",
      description: "You're in. Start exploring.",
    });
    
    navigate('/explore');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">Nexa</h1>
            <div className="text-6xl mb-4">✨🤝</div>
            <p className="text-body text-muted-foreground">
              Connect with like-minded professionals and expand your network through meaningful connections.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <Button
              className="w-full"
              onClick={() => handleSignIn('linkedin')}
            >
              <Linkedin className="mr-2 h-4 w-4" />
              Continue with LinkedIn
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleSignIn('email')}
            >
              <Mail className="mr-2 h-4 w-4" />
              Continue with Email
            </Button>
          </div>

        </div>
      </div>
      
      <div className="text-center p-4 text-body-small text-muted-foreground">
        Welcome to Nexa. Connect meaningfully.
      </div>
    </div>
  );
}