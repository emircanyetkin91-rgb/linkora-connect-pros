import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/hooks/useAppStore';

export default function Application() {
  const navigate = useNavigate();
  const { state } = useAppStore();
  
  // Redirect signed-in users to explore
  useEffect(() => {
    if (state.auth.isSignedIn) {
      navigate('/explore');
    } else {
      navigate('/');
    }
  }, [state.auth.isSignedIn, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <p className="text-body text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}