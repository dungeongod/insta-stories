import { useState, useEffect, useCallback, useRef } from 'react';
import type { User } from '../../types';
import './StoryViewer.css';

interface StoryViewerProps {
  users: User[];
  initialUserIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onStoryViewed?: (storyId: string) => void;
}

const StoryViewer = ({ users, initialUserIndex, isOpen, onClose, onStoryViewed }: StoryViewerProps) => {
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  
  const timerRef = useRef<number | null>(null);
  const currentUserIndexRef = useRef(currentUserIndex);
  const currentStoryIndexRef = useRef(currentStoryIndex);

  const currentUser = users[currentUserIndex];
  const currentStory = currentUser?.stories[currentStoryIndex];

  // Mark story as viewed when it loads successfully
  useEffect(() => {
    if (currentStory && !imageLoading && !imageError && onStoryViewed) {
      onStoryViewed(currentStory.id);
    }
  }, [currentStory, imageLoading, imageError, onStoryViewed]);

  // Format timestamp to show actual time
  const formatTimestamp = (timestamp: string): string => {
    const storyTime = new Date(timestamp);
    return storyTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Clear timer
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const goToNextStory = useCallback(() => {
    if (!currentUser) return;

    if (currentStoryIndex < currentUser.stories.length - 1) {
      // Next story in same user
      setCurrentStoryIndex(prev => prev + 1);
    } else if (currentUserIndex < users.length - 1) {
      // Next user
      setCurrentUserIndex(prev => prev + 1);
      setCurrentStoryIndex(0);
    } else {
      // End of all stories
      onClose();
    }
  }, [currentUserIndex, currentStoryIndex, currentUser, users.length, onClose]);

  const goToPreviousStory = useCallback(() => {
    if (currentStoryIndex > 0) {
      // Previous story in same user
      setCurrentStoryIndex(prev => prev - 1);
    } else if (currentUserIndex > 0) {
      // Previous user (go to their last story)
      const prevUserIndex = currentUserIndex - 1;
      const prevUser = users[prevUserIndex];
      setCurrentUserIndex(prevUserIndex);
      setCurrentStoryIndex(prevUser.stories.length - 1);
    }
    // If we're at the first story of the first user, do nothing
  }, [currentUserIndex, currentStoryIndex, users]);

  // Start 5-second auto-advance timer
  const startTimer = useCallback(() => {
    clearTimer();
    
    if (!isOpen || imageLoading) return;

    timerRef.current = window.setTimeout(() => {
      const userIndex = currentUserIndexRef.current;
      const storyIndex = currentStoryIndexRef.current;
      const user = users[userIndex];
      
      if (!user) {
        onClose();
        return;
      }

      if (storyIndex < user.stories.length - 1) {
        // Next story in same user
        setCurrentStoryIndex(storyIndex + 1);
      } else if (userIndex < users.length - 1) {
        // Next user
        setCurrentUserIndex(userIndex + 1);
        setCurrentStoryIndex(0);
      } else {
        // End of all stories
        onClose();
      }
    }, 5000);
  }, [isOpen, imageLoading, users, onClose, clearTimer]);

  // TAP/CLICK NAVIGATION ONLY (as per requirements)
  const handleLeftTap = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    goToPreviousStory();
    startTimer(); // Restart timer after manual navigation
  }, [goToPreviousStory, startTimer]);

  const handleRightTap = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    goToNextStory();
    startTimer(); // Restart timer after manual navigation
  }, [goToNextStory, startTimer]);

  // Handle close
  const handleClose = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  }, [onClose]);

  // Handle Escape key for closing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Reset story index when user changes
  useEffect(() => {
    setCurrentStoryIndex(0);
  }, [currentUserIndex]);

  // Reset progress animation when story content changes
  useEffect(() => {
    setProgressKey(prev => prev + 1);
  }, [currentStory?.id]);

  // Handle image loading
  useEffect(() => {
    if (currentStory) {
      setImageLoading(true);
      setImageError(false);
      
      const img = new Image();
      img.onload = () => {
        setImageLoading(false);
      };
      img.onerror = () => {
        setImageLoading(false);
        setImageError(true);
      };
      img.src = currentStory.imageUrl;
    }
  }, [currentStory]);

  // Start timer when image loads or story changes
  useEffect(() => {
    if (!imageLoading && !imageError && isOpen) {
      startTimer();
    }
    
    return () => clearTimer();
  }, [imageLoading, imageError, isOpen, startTimer, clearTimer]);

  // Prevent body scroll when viewer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      clearTimer();
    };
  }, [isOpen, clearTimer]);

  // Keep refs in sync with state
  useEffect(() => {
    currentUserIndexRef.current = currentUserIndex;
  }, [currentUserIndex]);

  useEffect(() => {
    currentStoryIndexRef.current = currentStoryIndex;
  }, [currentStoryIndex]);

  if (!isOpen || !currentUser || !currentStory) {
    return null;
  }

  return (
    <div className="story-viewer" role="dialog" aria-modal="true" aria-label="Story viewer">
      {/* Progress Bars */}
      <div className="story-progress-container" key={progressKey}>
        {currentUser.stories.map((_, index) => (
          <div
            key={index}
            className={`progress-bar ${
              index < currentStoryIndex ? 'completed' : 
              index === currentStoryIndex && !imageLoading && !imageError ? 'active' : 
              'inactive'
            }`}
            role="progressbar"
            aria-valuenow={index === currentStoryIndex ? 100 : (index < currentStoryIndex ? 100 : 0)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Story ${index + 1} of ${currentUser.stories.length}`}
          />
        ))}
      </div>

      {/* Story Header */}
      <div className="story-header">
        <div className="story-header-content">
          <div className="story-header-left">
            <img 
              src={currentUser.avatarUrl} 
              alt={`${currentUser.name} avatar`}
              className="story-header-avatar" 
            />
            <div className="story-header-info">
              <div className="story-header-username">{currentUser.name}</div>
              <div className="story-header-meta">
                <span className="story-timestamp">{formatTimestamp(currentStory.timestamp)}</span>
              </div>
            </div>
          </div>
          <div className="story-header-right">
            <button 
              className="story-close-button" 
              onClick={handleClose} 
              aria-label="Close story viewer"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      {/* Story Image/Content */}
      <div className="story-background">
        {imageLoading && (
          <div className="story-loading" data-testid="story-loading">
            <div className="loading-spinner"></div>
          </div>
        )}
        
        {imageError && !imageLoading ? (
          <div className="story-error">
            <p>Failed to load story</p>
          </div>
        ) : (
          <img
            src={currentStory.imageUrl}
            alt={`${currentUser.name}'s story`}
            className={`story-image ${imageLoading ? 'loading' : ''}`}
            style={{ display: imageLoading ? 'none' : 'block' }}
          />
        )}
      </div>

      {/* TAP/CLICK Navigation Zones (Primary interaction as per requirements) */}
      <div 
        className="navigation-zone-left" 
        onClick={handleLeftTap}
        role="button"
        aria-label="Previous story"
        data-testid="navigation-zone-left"
      />
      <div 
        className="navigation-zone-right" 
        onClick={handleRightTap}
        role="button"
        aria-label="Next story"
        data-testid="navigation-zone-right"
      />
    </div>
  );
};

export default StoryViewer; 