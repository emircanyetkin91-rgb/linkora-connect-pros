import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProfileCard } from '@/components/ProfileCard';
import { ActionBar } from '@/components/ActionBar';
import { EmptyState } from '@/components/EmptyState';
import { MatchModal } from '@/components/MatchModal';
import { useAppStore } from '@/hooks/useAppStore';
import { getCurrentCard, createMatch, pickConnectionType, getMatchedUser } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Home() {
  const navigate = useNavigate();
  const { state, updateState } = useAppStore();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedUser, setMatchedUser] = useState<any>(null);
  const [connectionType, setConnectionType] = useState<string>('');
  
  const currentCard = getCurrentCard(state);
  const cities = ['All', ...Array.from(new Set(state.mockProfiles.map(p => p.city)))];
  const sectors = ['All', ...Array.from(new Set(state.mockProfiles.map(p => p.sector)))];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!currentCard) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          handlePass();
          break;
        case 'ArrowRight':
          handleLike();
          break;
        case 'ArrowUp':
          handleSuper();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentCard]);

  const handlePass = () => {
    if (!currentCard) return;
    
    updateState(prev => ({
      ...prev,
      dislikedIds: [...prev.dislikedIds, currentCard.id]
    }));
    
    toast({
      title: "Passed",
      description: `Passed on ${currentCard.name}`,
    });
  };

  const handleLike = () => {
    if (!currentCard) return;
    
    updateState(prev => {
      const newState = {
        ...prev,
        likedIds: [...prev.likedIds, currentCard.id]
      };
      
      // Simulate mutual like in demo mode
      if (prev.demoMode && Math.random() < 0.4) {
        const connType = pickConnectionType();
        const finalState = createMatch(newState, prev.me.id, currentCard.id, connType);
        
        // Show match modal
        setMatchedUser(currentCard);
        setConnectionType(connType);
        setShowMatchModal(true);
        
        return finalState;
      }
      
      return newState;
    });
    
    toast({
      title: "Liked! 💖",
      description: `Liked ${currentCard.name}`,
    });
  };

  const handleSuper = () => {
    if (!currentCard) return;
    
    updateState(prev => {
      const newState = {
        ...prev,
        likedIds: [...prev.likedIds, currentCard.id]
      };
      
      // Higher chance for super likes in demo mode
      if (prev.demoMode && Math.random() < 0.6) {
        const connType = pickConnectionType();
        const finalState = createMatch(newState, prev.me.id, currentCard.id, connType);
        
        // Show match modal
        setMatchedUser(currentCard);
        setConnectionType(connType);
        setShowMatchModal(true);
        
        return finalState;
      }
      
      return newState;
    });
    
    toast({
      title: "Super Liked! ⭐",
      description: `Super liked ${currentCard.name}`,
    });
  };

  const handleResetDeck = () => {
    updateState(prev => ({
      ...prev,
      likedIds: [],
      dislikedIds: [],
      filters: { city: 'All', sector: 'All' }
    }));
    
    toast({
      title: "Deck Reset",
      description: "All profiles are available again",
    });
  };

  const handleStartChat = () => {
    setShowMatchModal(false);
    navigate('/chat');
  };

  const handlePlanCoffee = () => {
    setShowMatchModal(false);
    toast({
      title: "Coffee Scheduled! ☕",
      description: "Feature coming soon - scheduling integration",
    });
  };

  if (!state.auth.isSignedIn) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-md px-4 py-12">
          <div className="rounded-lg border border-warning bg-warning/10 p-4 mb-6">
            <h2 className="text-heading-small text-warning mb-2">Sign In Required</h2>
            <p className="text-body-small text-muted-foreground">
              Please sign in to start swiping and matching.
            </p>
          </div>
          
          <Button onClick={() => navigate('/')} className="w-full">
            Go to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isMobile ? 'h-full flex flex-col' : 'min-h-screen'} bg-background ${isMobile ? '' : 'overflow-hidden'}`}>
      {isMobile ? (
        <ScrollArea className="flex-1">
          <div className="flex flex-col px-4 py-4 pb-safe-area-inset-bottom min-h-full">
            {/* Mobile Filters */}
            <div className="mb-6 flex gap-4">
              <div className="flex-1">
                <Select
                  value={state.filters.city}
                  onValueChange={(value) => updateState(prev => ({
                    ...prev,
                    filters: { ...prev.filters, city: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="City" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map(city => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <Select
                  value={state.filters.sector}
                  onValueChange={(value) => updateState(prev => ({
                    ...prev,
                    filters: { ...prev.filters, sector: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map(sector => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Profile Card or Empty State */}
            {currentCard ? (
              <div className="space-y-6 flex-1 flex flex-col">
                <div className="flex-1">
                  <ProfileCard
                    user={currentCard}
                    onSwipeLeft={handlePass}
                    onSwipeRight={handleLike}
                  />
                </div>
                
                <ActionBar
                  onPass={handlePass}
                  onSuper={handleSuper}
                  onLike={handleLike}
                />
                
                {/* Keyboard shortcuts hint */}
                <div className="text-center text-body-small text-muted-foreground">
                  Use ← to pass, → to like, ↑ to super like
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <EmptyState
                  icon="🎉"
                  title="You're all caught up!"
                  description="No more profiles to show. Reset your deck to see them again."
                  actionLabel="Reset Deck"
                  onAction={handleResetDeck}
                />
              </div>
            )}
          </div>
        </ScrollArea>
      ) : (
        <div className="h-full flex flex-col mx-auto max-w-md px-4 py-4">
          {/* Desktop Filters */}
          <div className="mb-6 flex gap-4">
            <div className="flex-1">
              <Select
                value={state.filters.city}
                onValueChange={(value) => updateState(prev => ({
                  ...prev,
                  filters: { ...prev.filters, city: value }
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map(city => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <Select
                  value={state.filters.sector}
                  onValueChange={(value) => updateState(prev => ({
                    ...prev,
                    filters: { ...prev.filters, sector: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map(sector => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Profile Card or Empty State */}
            {currentCard ? (
              <div className="space-y-6">
                <ProfileCard
                  user={currentCard}
                  onSwipeLeft={handlePass}
                  onSwipeRight={handleLike}
                />
                
                <ActionBar
                  onPass={handlePass}
                  onSuper={handleSuper}
                  onLike={handleLike}
                />
                
                {/* Keyboard shortcuts hint */}
                <div className="text-center text-body-small text-muted-foreground">
                  Use ← to pass, → to like, ↑ to super like
                </div>
              </div>
            ) : (
              <EmptyState
                icon="🎉"
                title="You're all caught up!"
                description="No more profiles to show. Reset your deck to see them again."
                actionLabel="Reset Deck"
                onAction={handleResetDeck}
              />
            )}
          </div>
      )}

      {/* Match Modal */}
      {matchedUser && (
        <MatchModal
          isOpen={showMatchModal}
          onClose={() => setShowMatchModal(false)}
          user={matchedUser}
          connectionType={connectionType}
          onStartChat={handleStartChat}
          onPlanCoffee={handlePlanCoffee}
        />
      )}
    </div>
  );
}