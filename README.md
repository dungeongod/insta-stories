# Instagram Stories Clone

A React + TypeScript Instagram Stories implementation with mobile-optimized UI and tap navigation.

## 🚀 Deployment

**Live Demo:** [https://insta-stories-zeta.vercel.app/](https://insta-stories-zeta.vercel.app/)

## Features

- 📱 Mobile-first design
- 👆 Tap navigation (left/right)
- ⏱️ 5-second auto-advance
- 📊 Progress bars
- 🎯 Story list with gradient borders
- 🖼️ Loading states

## Setup & Running

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/dungeongod/insta-stories.git
cd insta-stories

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173

### Production Build
```bash
npm run build
npm run preview
```

## Testing

```bash
# Run component tests
npm run test:run

# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Design Choices & Optimization

### Performance
- **Image Preloading**: Stories load before display to ensure smooth transitions
- **Timer Management**: Efficient auto-advance with proper cleanup to prevent memory leaks
- **CSS Transitions**: Hardware-accelerated animations using transform/opacity
- **React Optimization**: useCallback/useMemo to prevent unnecessary re-renders

### Scalability
- **Component Architecture**: Modular design with clear separation of concerns
- **TypeScript**: Full type safety for maintainable codebase
- **Data Structure**: JSON-based with extensible interfaces for future features
- **State Management**: Local state with optimized updates for view tracking

### Mobile-First Approach
- **Touch Interactions**: Tap zones optimized for mobile screens
- **Responsive Design**: Viewport-based sizing with proper overflow handling
- **Performance**: Minimized DOM manipulation and efficient scrolling

## Tech Stack

- React 19 + TypeScript
- Vite
- Plain CSS
- Vitest + React Testing Library

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── StoryList/
│   │   ├── StoryThumbnail/
│   │   └── StoryViewer/
│   ├── types/           # TypeScript interfaces
│   ├── hooks/           # Custom React hooks  
│   ├── data/            # Data utilities
│   ├── styles/          # Shared CSS styles
│   ├── assets/          # Static assets
│   ├── tests/
│   │   └── components/  # Component tests
│   ├── App.tsx          # Main App component
│   ├── main.tsx         # React entry point
│   └── index.css        # Global styles
├── public/
│   ├── stories.json     # Story data
│   └── vite.svg         # Vite logo
├── vitest.config.ts     # Test configuration
├── package.json         # Dependencies & scripts
├── vite.config.ts       # Build configuration
└── tsconfig.json        # TypeScript config
```

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:ui      # Run tests with Vitest UI
npm run test:coverage # Run tests with coverage
```
