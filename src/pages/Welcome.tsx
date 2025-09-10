import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mail, Linkedin } from 'lucide-react';
import { useAppStore } from '@/hooks/useAppStore';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';

export default function Welcome() {
  const navigate = useNavigate();
  const { updateState } = useAppStore();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Email sign-in - direct demo mode
  const handleEmailSignIn = () => {
    updateState(state => ({
      ...state,
      auth: { 
        isSignedIn: true,
        provider: 'email',
        email: 'user@example.com'
      },
      userStatus: 'approved'
    }));
    
    toast({
      title: "Welcome to Nexa! 🎉",
      description: "You're in. Start exploring.",
    });
    
    navigate('/explore');
  };

  // LinkedIn OAuth sign-in
  const handleLinkedInSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: `${window.location.origin}/explore`
        }
      });

      if (error) {
        toast({
          title: "Sign In Error",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      // OAuth will redirect, so no need to manually navigate
    } catch (error) {
      toast({
        title: "Sign In Error", 
        description: "Failed to sign in with LinkedIn",
        variant: "destructive"
      });
    }
  };

  return (
    <div className={`${isMobile ? 'h-screen flex flex-col' : 'min-h-screen'} bg-gradient-to-br from-primary/5 via-background to-secondary/5`}>
      {isMobile ? (
        <ScrollArea className="flex-1">
          <div className="min-h-full flex flex-col items-center justify-center px-4 py-12 pb-safe-area-inset-bottom">
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
                  onClick={handleLinkedInSignIn}
                >
                  <Linkedin className="mr-2 h-4 w-4" />
                  Continue with LinkedIn
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleEmailSignIn}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Continue with Email
                </Button>
              </div>
            </div>
            
            <div className="text-center mt-auto p-4 text-body-small text-muted-foreground">
              Welcome to Nexa. Connect meaningfully.
            </div>
          </div>
        </ScrollArea>
      ) : (
        <div className="flex flex-col">
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
                  onClick={handleLinkedInSignIn}
                >
                  <Linkedin className="mr-2 h-4 w-4" />
                  Continue with LinkedIn
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleEmailSignIn}
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
      )}
    </div>
  );
}