import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAppStore } from '@/hooks/useAppStore';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { ProfileCard } from '@/components/ProfileCard';
import { X, Plus, Eye, ChevronDown, Copy, ExternalLink } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Profile() {
  const { state, updateState } = useAppStore();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Local state for UI and form inputs
  const [localUser, setLocalUser] = useState(state.me);
  const [newTag, setNewTag] = useState('');
  const [viewMode, setViewMode] = useState<'public' | 'networking' | 'social'>('public');
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);

  // Update local state when global state changes
  useEffect(() => {
    setLocalUser(state.me);
  }, [state.me]);

  // Create a live preview user object
  const previewUser = {
    ...localUser,
    bio: localUser.bio.length > 160 ? localUser.bio.substring(0, 160) + "..." : localUser.bio
  };

  // Debounced update to global state to prevent focus loss
  const debouncedUpdate = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (field: string, value: any) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          updateState(prev => ({
            ...prev,
            me: {
              ...prev.me,
              [field]: value
            }
          }));
        }, 500); // 500ms debounce
      };
    })(),
    [updateState]
  );

  // Update field with immediate local state update and debounced global update
  const updateField = (field: string, value: any) => {
    // Update local state immediately for responsive UI
    setLocalUser(prev => ({ ...prev, [field]: value }));
    // Debounce global state update to prevent focus loss
    debouncedUpdate(field, value);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
  };

  const getViewModeSubtitle = () => {
    switch (viewMode) {
      case 'public':
        return "Visible to approved members";
      case 'networking':
        return `${state.me.sector} • ${state.me.headline}`;
      case 'social':
        return state.me.tags.length > 0 ? state.me.tags.slice(0, 2).join(" • ") : "No interests added";
      default:
        return "Visible to approved members";
    }
  };

  const addTag = () => {
    if (newTag.trim() && !localUser.tags.includes(newTag.trim())) {
      updateField('tags', [...localUser.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateField('tags', localUser.tags.filter(tag => tag !== tagToRemove));
  };

  const removePhoto = (indexToRemove: number) => {
    const newPhotos = [...localUser.photos];
    newPhotos.splice(indexToRemove, 1);
    updateField('photos', newPhotos);
  };

  const handleCopyLink = () => {
    toast({
      title: "Coming Soon",
      description: "Public profile links are coming soon.",
    });
  };

  const PreviewCard = () => (
    <div className="space-y-4">
      <div className="relative">
        <ProfileCard user={previewUser} className="max-w-none" />
        <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
          Preview
        </div>
      </div>
      
      {/* View Mode Toggles */}
        <div className="space-y-2">
        <p className="text-body-small font-medium">View Mode:</p>
        <div className="flex gap-2">
          {(['public', 'networking', 'social'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                viewMode === mode
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
        <p className="text-body-small text-muted-foreground">
          {getViewModeSubtitle()}
        </p>
      </div>

      {/* Helper Text */}
      <p className="text-body-small text-muted-foreground">
        This is how your profile card appears to others. Update fields on the left to see changes live.
      </p>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFullPreview(true)}
          className="flex-1"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Open Full Preview
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="flex-1"
        >
          <Copy className="mr-2 h-4 w-4" />
          Copy Link
        </Button>
      </div>
    </div>
  );

  const FormContent = () => (
    <>
      {/* Basic Info */}
      <div className="space-y-4">
        <h2 className="text-heading-medium">Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={localUser.name}
              onChange={(e) => updateField('name', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={localUser.city}
              onChange={(e) => updateField('city', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sector">Sector</Label>
            <Input
              id="sector"
              value={localUser.sector}
              onChange={(e) => updateField('sector', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="headline">Headline</Label>
            <Input
              id="headline"
              value={localUser.headline}
              onChange={(e) => updateField('headline', e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            maxLength={200}
            value={localUser.bio}
            onChange={(e) => updateField('bio', e.target.value)}
          />
          <p className="text-body-small text-muted-foreground mt-1">
            {localUser.bio.length}/200 characters
          </p>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-4">
        <h2 className="text-heading-medium">Interests</h2>
        
        <div className="flex flex-wrap gap-2">
          {localUser.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Input
            placeholder="Add a tag (e.g., Open to collaborations)"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
          />
          <Button type="button" onClick={addTag} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Photos */}
      <div className="space-y-4">
        <h2 className="text-heading-medium">Photos</h2>
        
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 6 }, (_, index) => {
            const photo = localUser.photos[index];
            return (
              <div key={index} className="relative aspect-square">
                {photo ? (
                  <>
                    <img
                      src={photo}
                      alt={`Profile photo ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg border-2 border-border"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-destructive/80"
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <label className="w-full h-full border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-primary hover:bg-accent/50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const dataUrl = event.target?.result as string;
                            if (dataUrl) {
                              const newPhotos = [...localUser.photos];
                              newPhotos[index] = dataUrl;
                              updateField('photos', newPhotos);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <Plus className="h-6 w-6 text-muted-foreground" />
                  </label>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="space-y-4">
        <h2 className="text-heading-medium">Privacy Settings</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="public">Public Profile</Label>
              <p className="text-body-small text-muted-foreground">
                Make your profile visible to all users
              </p>
            </div>
            <Switch
              id="public"
              checked={localUser.privacy?.public ?? true}
              onCheckedChange={(checked) => 
                updateField('privacy', { 
                  ...localUser.privacy, 
                  public: checked 
                })
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="visibleByCity">Visible by City</Label>
              <p className="text-body-small text-muted-foreground">
                Show your profile to people in your city
              </p>
            </div>
            <Switch
              id="visibleByCity"
              checked={localUser.privacy?.visibleByCity ?? true}
              onCheckedChange={(checked) => 
                updateField('privacy', { 
                  ...localUser.privacy, 
                  visibleByCity: checked 
                })
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="visibleBySector">Visible by Sector</Label>
              <p className="text-body-small text-muted-foreground">
                Show your profile to people in your sector
              </p>
            </div>
            <Switch
              id="visibleBySector"
              checked={localUser.privacy?.visibleBySector ?? true}
              onCheckedChange={(checked) => 
                updateField('privacy', { 
                  ...localUser.privacy, 
                  visibleBySector: checked 
                })
              }
            />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Save Profile
      </Button>
    </>
  );

  return (
    <div className={`${isMobile ? 'h-full overflow-y-auto' : 'min-h-screen'} bg-background`}>
      <div className={`mx-auto px-4 ${isMobile ? 'py-4 pb-20' : 'py-6'} ${isMobile ? 'max-w-2xl' : 'max-w-7xl'}`}>
        <div className={`${isMobile ? 'mb-4' : 'mb-6'}`}>
          <h1 className={`${isMobile ? 'text-lg font-semibold' : 'text-heading-large'} mb-2`}>Edit Profile</h1>
          <p className="text-body text-muted-foreground">
            Update your information to improve your matches
          </p>
        </div>

        {isMobile ? (
          /* Mobile Layout */
          <div className="space-y-4">
            {/* Mobile Preview - Collapsible */}
            <Collapsible open={showPreviewMobile} onOpenChange={setShowPreviewMobile}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Profile Preview
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${showPreviewMobile ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <PreviewCard />
              </CollapsibleContent>
            </Collapsible>

            {/* Mobile Form */}
            <form onSubmit={handleSave} className="space-y-4">
              <FormContent />
            </form>
          </div>
        ) : (
          /* Desktop Layout */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Column */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSave} className="space-y-6">
                <FormContent />
              </form>
            </div>

            {/* Desktop Preview Column */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <PreviewCard />
              </div>
            </div>
          </div>
        )}

        {/* Full Preview Modal */}
        <Dialog open={showFullPreview} onOpenChange={setShowFullPreview}>
          <DialogContent className="max-w-md p-0">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle>Full Profile Preview</DialogTitle>
            </DialogHeader>
            <div className="p-6 pt-0">
              <ProfileCard user={state.me} />
              <p className="text-body-small text-muted-foreground mt-4 text-center">
                This is your complete profile as others see it.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}