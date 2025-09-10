import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppStore } from '@/hooks/useAppStore';
import { ProfileCard } from '@/components/ProfileCard';
import { User } from '@/lib/store';

export default function Explore() {
  const { state, updateState } = useAppStore();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const cities = ['All', ...new Set(state.mockProfiles.map(p => p.city))];
  const sectors = ['All', ...new Set(state.mockProfiles.map(p => p.sector))];

  const filteredProfiles = state.mockProfiles.filter(profile => {
    if (state.filters.city !== 'All' && profile.city !== state.filters.city) {
      return false;
    }
    if (state.filters.sector !== 'All' && profile.sector !== state.filters.sector) {
      return false;
    }
    return true;
  });

  const updateFilters = (key: 'city' | 'sector', value: string) => {
    updateState(state => ({
      ...state,
      filters: { ...state.filters, [key]: value }
    }));
  };

  if (state.userStatus !== 'approved') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="text-center">
          <h2 className="text-heading-medium mb-4">Complete Your Application</h2>
          <p className="text-body text-muted-foreground mb-6">
            You need to be approved to explore profiles.
          </p>
          <Button onClick={() => window.location.href = '/application'}>
            Go to Application
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-heading-large mb-4">Explore</h1>
        
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <Select
            value={state.filters.city}
            onValueChange={(value) => updateFilters('city', value)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by city" />
            </SelectTrigger>
            <SelectContent>
              {cities.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={state.filters.sector}
            onValueChange={(value) => updateFilters('sector', value)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by sector" />
            </SelectTrigger>
            <SelectContent>
              {sectors.map(sector => (
                <SelectItem key={sector} value={sector}>{sector}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Profile Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProfiles.map((profile) => (
          <Card key={profile.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={profile.photos[0]} alt={profile.name} />
                  <AvatarFallback>{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{profile.name}</h3>
                  <p className="text-body-small text-muted-foreground truncate">{profile.headline}</p>
                  <p className="text-body-small text-muted-foreground">{profile.city}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {profile.tags.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {profile.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{profile.tags.length - 2}
                  </Badge>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setSelectedUser(profile)}
              >
                View Profile
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProfiles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-body text-muted-foreground mb-4">
            No profiles match your current filters.
          </p>
          <Button
            variant="outline"
            onClick={() => updateState(state => ({
              ...state,
              filters: { city: 'All', sector: 'All' }
            }))}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Profile Detail Modal */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-md p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>Profile</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="p-6 pt-0">
              <ProfileCard user={selectedUser} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}