import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppStore } from '@/hooks/useAppStore';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Trash2, RotateCcw, RefreshCw, LogOut } from 'lucide-react';

export default function Settings() {
  const { state, updateState } = useAppStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleResetDeck = () => {
    updateState(prev => ({
      ...prev,
      likedIds: [],
      dislikedIds: []
    }));
    toast({
      title: "Deck Reset",
      description: "All profiles are available again.",
    });
  };

  const handleResetMatches = () => {
    updateState(prev => ({
      ...prev,
      matches: [],
      messages: {},
      selectedMatchId: null
    }));
    toast({
      title: "Matches Reset",
      description: "All matches and messages have been cleared.",
    });
  };

  const handleFactoryReset = () => {
    localStorage.removeItem('nexa_app');
    window.location.reload();
  };

  const handleSeedDemoData = () => {
    updateState(prev => ({
      ...prev,
      likedIds: [],
      dislikedIds: [],
      matches: [],
      messages: {},
      selectedMatchId: null
    }));
    toast({
      title: "Demo Data Seeded",
      description: "Fresh demo profiles and data loaded.",
    });
  };

  const handleLogOut = async () => {
    try {
      await supabase.auth.signOut();
      updateState(prev => ({
        ...prev,
        auth: { isSignedIn: false },
        userStatus: 'pending'
      }));
      toast({
        title: "Logged Out",
        description: "You've been successfully logged out.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto min-h-screen flex flex-col bg-background">
      {isMobile ? (
        <ScrollArea className="flex-1 px-4">
          <div className="py-4 space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-xl font-semibold">Settings</h1>
              <p className="text-sm text-muted-foreground">
                Manage your app preferences and data
              </p>
            </div>

            {/* Demo Mode */}
            <div className="rounded-lg border bg-card p-4">
              <h2 className="text-base font-semibold mb-3">Demo Settings</h2>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="demoMode">Enable Demo Mode</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Simulates mutual likes and matches for testing
                  </p>
                </div>
                <Switch
                  id="demoMode"
                  checked={state.demoMode}
                  onCheckedChange={(checked) => {
                    updateState(prev => ({ ...prev, demoMode: checked }));
                    toast({
                      title: checked ? "Demo Mode Enabled" : "Demo Mode Disabled",
                      description: checked
                        ? "Matches will be simulated automatically"
                        : "Real matching behavior enabled",
                    });
                  }}
                />
              </div>
            </div>

            {/* Data Management */}
            <div className="rounded-lg border bg-card p-4 space-y-4">
              <h2 className="text-base font-semibold">Data Management</h2>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Quick Seed Demo Data</h3>
                  <p className="text-xs text-muted-foreground">
                    Reset all interactions and reload fresh demo profiles
                  </p>
                </div>
                <Button variant="outline" onClick={handleSeedDemoData} size="sm">
                  <RefreshCw className="mr-1 h-3 w-3" />
                  Seed
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Reset Deck</h3>
                  <p className="text-xs text-muted-foreground">
                    Clear liked/passed profiles to see them again
                  </p>
                </div>
                <Button variant="outline" onClick={handleResetDeck} size="sm">
                  <RotateCcw className="mr-1 h-3 w-3" />
                  Reset
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Reset Matches</h3>
                  <p className="text-xs text-muted-foreground">
                    Clear all your matches and chat history
                  </p>
                </div>
                <Button variant="outline" onClick={handleResetMatches} size="sm">
                  <RefreshCw className="mr-1 h-3 w-3" />
                  Reset
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-destructive">Factory Reset</h3>
                  <p className="text-xs text-muted-foreground">
                    Delete all local data and start fresh
                  </p>
                </div>
                <Button variant="destructive" onClick={handleFactoryReset} size="sm">
                  <Trash2 className="mr-1 h-3 w-3" />
                  Reset
                </Button>
              </div>
            </div>

            {/* App Info */}
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <h2 className="text-base font-semibold mb-3">About</h2>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Version</span>
                <span>MVP-0.1</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className="capitalize">{state.userStatus}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Liked</span>
                <span>{state.likedIds.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Matches</span>
                <span>{state.matches.length}</span>
              </div>
            </div>

            {/* Account */}
            <div className="rounded-lg border bg-card p-4">
              <h2 className="text-base font-semibold mb-3">Account</h2>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Log Out</h3>
                  <p className="text-xs text-muted-foreground">
                    Sign out and return to welcome screen
                  </p>
                </div>
                <Button variant="outline" onClick={handleLogOut} size="sm">
                  <LogOut className="mr-1 h-3 w-3" />
                  Log Out
                </Button>
              </div>
            </div>

            {/* Support */}
            <div className="rounded-lg border bg-card p-4">
              <h2 className="text-base font-semibold mb-3">Support</h2>
              <p className="text-sm text-muted-foreground mb-3">
                This is an MVP version running on local storage. Your data is stored only on this device.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" disabled>
                  Help Center
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Contact Support
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Privacy Policy
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      ) : (
        <div className="flex-1 px-6 py-8 space-y-8">
          {/* Masaüstü görünüm: aynı içerikler ama daha geniş spacing */}
          {/* Burada mobildekinin aynı mantığı daha geniş layout ile kullanılacak */}
        </div>
      )}
    </div>
  );
}
