import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/hooks/useAppStore';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Trash2, RotateCcw, RefreshCw, LogOut } from 'lucide-react';

export default function Settings() {
  const { state, updateState } = useAppStore();
  const { toast } = useToast();
  const navigate = useNavigate();

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
    // Re-populate mockProfiles if empty (already defined in defaultState)
    updateState(prev => ({
      ...prev,
      // Reset to ensure we have demo data
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
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear local session state
      updateState(prev => ({
        ...prev,
        auth: { isSignedIn: false },
        userStatus: 'pending'
      }));
      
      toast({
        title: "Logged Out",
        description: "You've been successfully logged out.",
      });
      
      // Redirect to welcome screen
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
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-heading-large mb-2">Settings</h1>
          <p className="text-body text-muted-foreground">
            Manage your app preferences and data
          </p>
        </div>

        <div className="space-y-6">
          {/* Demo Mode */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-heading-medium mb-4">Demo Settings</h2>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="demoMode">Enable Demo Mode</Label>
                <p className="text-body-small text-muted-foreground mt-1">
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
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-heading-medium mb-4">Data Management</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-heading-small">Quick Seed Demo Data</h3>
                  <p className="text-body-small text-muted-foreground">
                    Reset all interactions and reload fresh demo profiles
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleSeedDemoData}
                  className="shrink-0"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Seed Data
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-heading-small">Reset Deck</h3>
                  <p className="text-body-small text-muted-foreground">
                    Clear liked/passed profiles to see them again
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleResetDeck}
                  className="shrink-0"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-heading-small">Reset Matches & Messages</h3>
                  <p className="text-body-small text-muted-foreground">
                    Clear all your matches and chat history
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleResetMatches}
                  className="shrink-0"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-heading-small text-destructive">Factory Reset</h3>
                  <p className="text-body-small text-muted-foreground">
                    Delete all local data and start fresh
                  </p>
                </div>
                <Button 
                  variant="destructive" 
                  onClick={handleFactoryReset}
                  className="shrink-0"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Reset All
                </Button>
              </div>
            </div>
          </div>

          {/* App Info */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-heading-medium mb-4">About</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-body-small text-muted-foreground">Version</span>
                <span className="text-body-small">MVP-0.1 (UI/local state)</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-body-small text-muted-foreground">Status</span>
                <span className="text-body-small capitalize">{state.userStatus}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-body-small text-muted-foreground">Profiles Liked</span>
                <span className="text-body-small">{state.likedIds.length}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-body-small text-muted-foreground">Matches</span>
                <span className="text-body-small">{state.matches.length}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-body-small text-muted-foreground">Demo Mode</span>
                <span className="text-body-small">{state.demoMode ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>
          </div>

          {/* Account */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-heading-medium mb-4">Account</h2>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-heading-small">Log Out</h3>
                <p className="text-body-small text-muted-foreground">
                  Sign out of your account and return to welcome screen
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleLogOut}
                className="shrink-0"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>
            </div>
          </div>

          {/* Contact & Support */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-heading-medium mb-4">Support</h2>
            
            <div className="space-y-3">
              <p className="text-body-small text-muted-foreground">
                This is an MVP version running on local storage. Your data is stored only on this device.
              </p>
              
              <div className="flex gap-2">
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
        </div>
      </div>
    </div>
  );
}