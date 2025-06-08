import type { StoryThumbnailProps } from '../../types';
import './StoryThumbnail.css';

const StoryThumbnail = ({ user, onStoryClick, hasUnviewedStories = true }: StoryThumbnailProps) => {
  const handleClick = () => {
    onStoryClick(user);
  };

  return (
    <div className="story-thumbnail" onClick={handleClick}>
      <div className={`story-avatar-container ${hasUnviewedStories ? 'unviewed' : 'viewed'}`}>
        <img 
          src={user.avatarUrl} 
          alt={user.name}
          className="story-avatar"
        />
      </div>
      <span className="story-username">{user.name}</span>
    </div>
  );
};

export default StoryThumbnail; 