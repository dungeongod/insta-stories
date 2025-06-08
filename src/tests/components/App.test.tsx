import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import App from '../../App'

// Mock data for testing
const mockStoriesData = {
  users: [
    {
      id: "your_story",
      name: "Your story",
      avatarUrl: "/api/placeholder/50/50",
      stories: [
        {
          id: "your_story_1",
          imageUrl: "/api/placeholder/400/800",
          timestamp: "2024-06-07T22:55:00Z"
        }
      ]
    },
    {
      id: "aman",
      name: "aman",
      avatarUrl: "/api/placeholder/50/51",
      stories: [
        {
          id: "aman_1",
          imageUrl: "/api/placeholder/400/801",
          timestamp: "2024-06-07T22:30:00Z"
        }
      ]
    }
  ]
}

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch as any

describe('Instagram Stories App', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    
    // Reset fetch mock
    vi.resetAllMocks()
    
    // Mock successful fetch response
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockStoriesData,
    })
  })

  it('renders the app with Instagram header', () => {
    render(<App />)
    
    expect(screen.getByText('Instagram')).toBeInTheDocument()
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('displays main feed placeholder', () => {
    render(<App />)
    
    expect(screen.getByText('Main feed content would go here')).toBeInTheDocument()
  })

  it('displays story list container', () => {
    render(<App />)
    
    expect(screen.getByRole('banner')).toBeInTheDocument()
    
    // Check if story list container exists
    const storyListContainer = document.querySelector('.story-list-container')
    expect(storyListContainer).toBeInTheDocument()
  })

  it('renders without crashing', () => {
    render(<App />)
    
    // Check if app renders basic structure
    expect(screen.getByText('Instagram')).toBeInTheDocument()
    expect(document.querySelector('.app')).toBeInTheDocument()
    expect(document.querySelector('.main-screen')).toBeInTheDocument()
  })

  it('has proper document structure', () => {
    render(<App />)
    
    // Check document structure
    expect(document.querySelector('.app')).toBeInTheDocument()
    expect(document.querySelector('.main-screen')).toBeInTheDocument()
    expect(document.querySelector('.app-header')).toBeInTheDocument()
    expect(document.querySelector('.story-list-container')).toBeInTheDocument()
    expect(document.querySelector('.main-feed')).toBeInTheDocument()
  })
}) 