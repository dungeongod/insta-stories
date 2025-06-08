import { useState, useEffect } from 'react';
import type { User, StoriesData, StoryListProps } from '../../types';
import StoryThumbnail from '../StoryThumbnail/StoryThumbnail';
import './StoryList.css';

const StoryList = ({ onStoryClick, users: externalUsers, hasUnviewedStories }: StoryListProps) => {
  const [internalUsers, setInternalUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use external users if provided, otherwise fetch internally
  const users = externalUsers || internalUsers;

  useEffect(() => {
    // Only fetch if no external users provided
    if (!externalUsers) {
      const fetchStories = async () => {
        try {
          setLoading(true);
          const response = await fetch('/stories.json');
          
          if (!response.ok) {
            throw new Error('Failed to fetch stories');
          }
          
          const data: StoriesData = await response.json();
          setInternalUsers(data.users);
          setError(null);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Unknown error occurred');
          console.error('Error fetching stories:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchStories();
    } else {
      setLoading(false);
    }
  }, [externalUsers]);

  if (loading && !externalUsers) {
    return (
      <div className="story-list-container">
        <div className="story-list-loading">
          {/* Loading skeleton */}
          {[...Array(5)].map((_, index) => (
            <div key={index} className="story-thumbnail-skeleton">
              <div className="story-avatar-skeleton"></div>
              <div className="story-username-skeleton"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && !externalUsers) {
    return (
      <div className="story-list-container">
        <div className="story-list-error">
          <p>Failed to load stories: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="story-list-container">
      <div className="story-list">
        {users.map((user) => (
          <StoryThumbnail
            key={user.id}
            user={user}
            onStoryClick={onStoryClick}
            hasUnviewedStories={hasUnviewedStories ? hasUnviewedStories(user) : true}
          />
        ))}
      </div>
    </div>
  );
};

export default StoryList; 