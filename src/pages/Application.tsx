import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/hooks/useAppStore';
import { useToast } from '@/hooks/use-toast';

export default function Application() {
  const navigate = useNavigate();
  const { state, updateState } = useAppStore();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    fullName: state.me.name,
    sector: state.me.sector,
    headline: state.me.headline,
    city: state.me.city,
    bio: state.me.bio,
    linkedin: '',
    instagram: '',
    inviteCode: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(state.userStatus === 'pending');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.inviteCode.trim()) {
      // Has invite code - approve immediately
      updateState(prev => ({
        ...prev,
        userStatus: 'approved',
        me: {
          ...prev.me,
          name: formData.fullName,
          sector: formData.sector,
          headline: formData.headline,
          city: formData.city,
          bio: formData.bio
        }
      }));
      
      toast({
        title: "Welcome to Linkora! 🎉",
        description: "Your application has been approved.",
      });
      
      navigate('/home');
    } else {
      // No invite code - pending status
      updateState(prev => ({
        ...prev,
        userStatus: 'pending',
        me: {
          ...prev.me,
          name: formData.fullName,
          sector: formData.sector,
          headline: formData.headline,
          city: formData.city,
          bio: formData.bio
        }
      }));
      
      setIsSubmitted(true);
      
      toast({
        title: "Application Submitted",
        description: "We'll review your application and get back to you soon!",
      });
    }
  };

  const handleInviteCodeSubmit = () => {
    if (formData.inviteCode.trim()) {
      updateState(prev => ({ ...prev, userStatus: 'approved' }));
      toast({
        title: "Welcome to Linkora! 🎉",
        description: "Your invite code has been verified.",
      });
      navigate('/home');
    }
  };

  if (isSubmitted && state.userStatus === 'pending') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-6">⏰</div>
          <h1 className="text-heading-large mb-4">You're on the waitlist!</h1>
          <p className="text-body text-muted-foreground mb-8">
            We'll review your application and send you an invite code when a spot opens up.
          </p>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="inviteCode">Have an invite code?</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="inviteCode"
                  placeholder="Enter invite code"
                  value={formData.inviteCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, inviteCode: e.target.value }))}
                />
                <Button onClick={handleInviteCodeSubmit}>
                  Verify
                </Button>
              </div>
            </div>
            
            <Button variant="outline" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-heading-large mb-2">Apply to Linkora</h1>
          <p className="text-body text-muted-foreground">
            Tell us about yourself to join our community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                required
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="sector">Sector *</Label>
              <Input
                id="sector"
                required
                placeholder="e.g., Tech, Finance, Media"
                value={formData.sector}
                onChange={(e) => setFormData(prev => ({ ...prev, sector: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="headline">Role/Headline *</Label>
            <Input
              id="headline"
              required
              placeholder="e.g., Product Designer @ Company"
              value={formData.headline}
              onChange={(e) => setFormData(prev => ({ ...prev, headline: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              required
              placeholder="e.g., Istanbul, London, NYC"
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio *</Label>
            <Textarea
              id="bio"
              required
              maxLength={200}
              placeholder="Tell us about yourself in 200 characters"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            />
            <p className="text-body-small text-muted-foreground mt-1">
              {formData.bio.length}/200 characters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input
                id="linkedin"
                type="url"
                placeholder="https://linkedin.com/in/..."
                value={formData.linkedin}
                onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="instagram">Instagram Handle</Label>
              <Input
                id="instagram"
                placeholder="@username"
                value={formData.instagram}
                onChange={(e) => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="inviteCode">Invite Code (Optional)</Label>
            <Input
              id="inviteCode"
              placeholder="Have an invite code? Enter it here"
              value={formData.inviteCode}
              onChange={(e) => setFormData(prev => ({ ...prev, inviteCode: e.target.value }))}
            />
            <p className="text-body-small text-muted-foreground mt-1">
              Skip the waitlist with an invite code
            </p>
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              Submit Application
            </Button>
            {state.userStatus === 'approved' && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/home')}
              >
                Go to Home
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}