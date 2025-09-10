import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { User } from '@/lib/store';
import { cn } from '@/lib/utils';

interface ProfileCardProps {
  user: User;
  className?: string;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export function ProfileCard({ user, className, onSwipeLeft, onSwipeRight }: ProfileCardProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % user.photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + user.photos.length) % user.photos.length);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target !== cardRef.current) return;
    setIsDragging(true);
    startX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const offset = e.clientX - startX.current;
    setDragOffset(offset);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const threshold = 100;
    if (dragOffset > threshold) {
      onSwipeRight?.();
    } else if (dragOffset < -threshold) {
      onSwipeLeft?.();
    }
    
    setDragOffset(0);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        setDragOffset(0);
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isDragging]);

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative mx-auto w-full max-w-sm overflow-hidden rounded-xl bg-card shadow-lg transition-transform duration-200",
        isDragging && "cursor-grabbing",
        !isDragging && "cursor-grab",
        className
      )}
      style={{
        transform: `translateX(${dragOffset}px) rotate(${dragOffset * 0.1}deg)`,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Photo Carousel */}
      <div className="relative aspect-[3/4] bg-grey-100">
        <img
          src={user.photos[currentPhotoIndex]}
          alt={`${user.name} photo ${currentPhotoIndex + 1}`}
          className="h-full w-full object-cover"
          draggable={false}
        />
        
        {/* Photo navigation dots */}
        {user.photos.length > 1 && (
          <div className="absolute top-4 flex w-full justify-center space-x-2">
            {user.photos.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-1 w-8 rounded-full transition-colors",
                  index === currentPhotoIndex ? "bg-white" : "bg-white/50"
                )}
              />
            ))}
          </div>
        )}
        
        {/* Photo navigation buttons */}
        {user.photos.length > 1 && (
          <>
            <button
              onClick={prevPhoto}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white backdrop-blur-sm transition-opacity hover:bg-black/30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white backdrop-blur-sm transition-opacity hover:bg-black/30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Profile Info */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-heading-medium text-foreground">{user.name}</h3>
          <p className="text-body-small text-muted-foreground">{user.headline}</p>
          <p className="text-body-small text-muted-foreground">{user.city} • {user.sector}</p>
        </div>
        
        <p className="mb-3 text-body-small text-foreground">{user.bio}</p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {user.tags.map((tag, index) => (
            <span
              key={index}
              className="rounded-full bg-grey-100 px-3 py-1 text-xs font-medium text-grey-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}