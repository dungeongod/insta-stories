import { useState, useEffect, useCallback } from 'react';
import type { User, StoriesData } from './types';
import StoryList from './components/StoryList/StoryList';
import StoryViewer from './components/StoryViewer/StoryViewer';
import './App.css';

function App() {
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);
  const [viewedStories, setViewedStories] = useState<Set<string>>(new Set());

  // Load viewed stories from localStorage on app start
  useEffect(() => {
    const saved = localStorage.getItem('instagram-viewed-stories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setViewedStories(new Set(parsed));
      } catch (error) {
        console.error('Error loading viewed stories:', error);
      }
    }
  }, []);

  // Save viewed stories to localStorage when updated
  useEffect(() => {
    localStorage.setItem('instagram-viewed-stories', JSON.stringify([...viewedStories]));
  }, [viewedStories]);

  // Fetch users data for story viewer
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/stories.json');
        if (response.ok) {
          const data: StoriesData = await response.json();
          setUsers(data.users);
        }
      } catch (error) {
        console.error('Error fetching users for story viewer:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleStoryClick = (user: User) => {
    const userIndex = users.findIndex(u => u.id === user.id);
    setSelectedUserIndex(userIndex >= 0 ? userIndex : 0);
    setIsStoryViewerOpen(true);
  };

  const handleCloseStoryViewer = () => {
    setIsStoryViewerOpen(false);
  };

  // Mark story as viewed
  const markStoryAsViewed = useCallback((storyId: string) => {
    setViewedStories(prev => new Set([...prev, storyId]));
  }, []);

  // Check if user has unviewed stories
  const hasUnviewedStories = (user: User): boolean => {
    return user.stories.some(story => !viewedStories.has(story.id));
  };

  return (
    <div className="app">
      {/* Main Instagram Screen */}
      <div className="main-screen">
        {/* Header */}
        <header className="app-header" role="banner">
          <div className="header-content">
            <h1 className="instagram-logo">Instagram</h1>
          </div>
        </header>

        {/* Stories Section */}
        <StoryList 
          onStoryClick={handleStoryClick} 
          users={users}
          hasUnviewedStories={hasUnviewedStories}
        />

        {/* Main Feed Area - Placeholder for now */}
        <div className="main-feed">
          <div className="feed-placeholder">
            <p>Main feed content would go here</p>
          </div>
        </div>
      </div>

      {/* Story Viewer */}
      {isStoryViewerOpen && users.length > 0 && (
        <StoryViewer
          users={users}
          initialUserIndex={selectedUserIndex}
          isOpen={isStoryViewerOpen}
          onClose={handleCloseStoryViewer}
          onStoryViewed={markStoryAsViewed}
        />
      )}
    </div>
  );
}

export default App;
