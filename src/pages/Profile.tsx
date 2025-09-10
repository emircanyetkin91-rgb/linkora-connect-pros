import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useAppStore } from '@/hooks/useAppStore';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

export default function Profile() {
  const { state, updateState } = useAppStore();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: state.me.name,
    headline: state.me.headline,
    city: state.me.city,
    sector: state.me.sector,
    bio: state.me.bio,
    photos: [...state.me.photos],
    privacy: state.me.privacy || {
      public: true,
      visibleByCity: true,
      visibleBySector: true
    }
  });
  
  const [tags, setTags] = useState([...state.me.tags]);
  const [newTag, setNewTag] = useState('');
  const [newPhoto, setNewPhoto] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateState(prev => ({
      ...prev,
      me: {
        ...prev.me,
        ...formData,
        tags
      }
    }));
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addPhoto = () => {
    if (newPhoto.trim() && !formData.photos.includes(newPhoto.trim())) {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, newPhoto.trim()]
      }));
      setNewPhoto('');
    }
  };

  const removePhoto = (photoToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter(photo => photo !== photoToRemove)
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-heading-large mb-2">Edit Profile</h1>
          <p className="text-body text-muted-foreground">
            Update your information to improve your matches
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h2 className="text-heading-medium">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sector">Sector</Label>
                <Input
                  id="sector"
                  value={formData.sector}
                  onChange={(e) => setFormData(prev => ({ ...prev, sector: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="headline">Headline</Label>
                <Input
                  id="headline"
                  value={formData.headline}
                  onChange={(e) => setFormData(prev => ({ ...prev, headline: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                maxLength={200}
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              />
              <p className="text-body-small text-muted-foreground mt-1">
                {formData.bio.length}/200 characters
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h2 className="text-heading-medium">Interests</h2>
            
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
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
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Photos */}
          <div className="space-y-4">
            <h2 className="text-heading-medium">Photos</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {formData.photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(photo)}
                    className="absolute -top-2 -right-2 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Add photo URL"
                value={newPhoto}
                onChange={(e) => setNewPhoto(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPhoto())}
              />
              <Button type="button" onClick={addPhoto} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
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
                  checked={formData.privacy.public}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, public: checked }
                    }))
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
                  checked={formData.privacy.visibleByCity}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, visibleByCity: checked }
                    }))
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
                  checked={formData.privacy.visibleBySector}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, visibleBySector: checked }
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Save Profile
          </Button>
        </form>
      </div>
    </div>
  );
}