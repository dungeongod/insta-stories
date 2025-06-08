// Core data types
export interface Story {
  id: string;
  imageUrl: string;
  timestamp: string; // ISO string format
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  stories: Story[];
}

// API response type
export interface StoriesData {
  users: User[];
}

// Component prop types
export interface StoryThumbnailProps {
  user: User;
  onStoryClick: (user: User) => void;
  hasUnviewedStories?: boolean;
}

export interface StoryListProps {
  onStoryClick: (user: User) => void;
  users?: User[];
  hasUnviewedStories?: (user: User) => boolean;
  loading?: boolean;
  error?: string | null;
}

export interface StoryViewerProps {
  users: User[];
  initialUserIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onStoryViewed?: (storyId: string) => void;
}

export interface StoryHeaderProps {
  user: User;
  currentStory: Story;
  onClose: () => void;
}

// Utility types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface StoryPlayerState {
  currentUserIndex: number;
  currentStoryIndex: number;
  isPlaying: boolean;
  isPaused: boolean;
} 