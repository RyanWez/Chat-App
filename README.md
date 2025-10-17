# Modern Chat Application

A fully functional AI-powered chat application built with Next.js, React, and TypeScript, featuring Ollama Cloud integration, multiple chat sessions, and a modern responsive design.

## Features

- 🤖 **AI-Powered Chat**: Real-time conversations with Ollama Cloud AI models
- 💬 **Multiple Chat Sessions**: Create and manage multiple independent chat conversations
- 🎨 **Clean, Modern UI**: Minimalist design with smooth animations
- 🌓 **Dark/Light Theme**: Toggle between dark and light modes with smooth transitions
- 📱 **Fully Responsive**: Optimized for both desktop and mobile devices
- ⚡ **Real-time Messaging**: Send messages and receive AI responses instantly
- 🎯 **TypeScript Support**: Fully typed codebase for better development experience
- 📋 **Chat History**: Persistent chat sessions with timestamps and message history
- 🔄 **Auto-scroll**: Messages automatically scroll as new content is added
- ✨ **Empty State**: Welcome screen with suggested prompts
- 💫 **Loading Animations**: Smooth message animations and typing indicators
- 📝 **Auto-resize Input**: Smart textarea that grows with content

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file in the root directory:

```bash
OLLAMA_API_KEY=your_ollama_api_key_here
```

Get your free API key from [Ollama Cloud](https://ollama.com/cloud)

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:9002](http://localhost:9002) in your browser.

## Project Structure

```
├── pages/
│   ├── api/
│   │   └── chat.ts          # API endpoint for Ollama integration
│   ├── _app.tsx             # App wrapper with global providers
│   └── index.tsx            # Main chat interface component
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ChatMessage.tsx  # Individual message component
│   │   ├── ChatMessages.tsx # Message list container
│   │   ├── EmptyState.tsx   # Welcome screen with suggestions
│   │   ├── LoadingDots.tsx  # Typing indicator animation
│   │   ├── MessageInput.tsx # Auto-resize message input
│   │   ├── MobileHeader.tsx # Mobile navigation header
│   │   └── Sidebar.tsx      # Chat history sidebar
│   ├── hooks/               # Custom React hooks
│   │   ├── useChat.ts       # Chat state management with API
│   │   └── useTheme.ts      # Theme state management
│   ├── services/            # External service integrations
│   │   └── ollama.ts        # Ollama Cloud API service
│   ├── types/               # TypeScript type definitions
│   │   └── chat.ts          # Chat-related interfaces
│   └── utils/               # Utility functions
│       └── formatters.ts    # Message formatting utilities
├── styles/
│   └── globals.css          # Global styles with CSS variables
├── .env.local               # Environment variables (API keys)
├── package.json
├── tsconfig.json
└── next.config.js
```

## Key Components

- **Sidebar**: Chat history with new chat creation and session management
- **ChatMessages**: Message display area with auto-scrolling and proper formatting
- **MessageInput**: Message composition with send button and keyboard shortcuts
- **MobileHeader**: Mobile-optimized navigation with menu toggle
- **Theme System**: Dark/light mode switching with CSS variable theming

## Functionality

### Chat Sessions

- Create new chat sessions with unique IDs
- Switch between multiple active conversations
- Automatic session titles based on creation order
- Message history preserved within each session

### Messaging System

- Send text messages with real-time delivery
- Simulated assistant responses (1-second delay)
- Message timestamps and user/assistant distinction
- Proper message formatting and display

### Theme System

- Light and dark mode support
- CSS variables for easy customization
- Smooth transitions between themes
- Persistent theme preference

### Mobile Experience

- Collapsible sidebar with overlay
- Touch-optimized interface
- Responsive message bubbles
- Mobile-first design approach

## Styling

The application uses a comprehensive CSS variable system for consistent theming:

```css
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f7f7f8;
  --text-primary: #343541;
  --accent-color: #10a37f;
  /* ... more variables */
}

[data-theme="dark"] {
  --bg-primary: #343541;
  --bg-secondary: #444654;
  /* ... dark theme overrides */
}
```

## Customization

Easily customize the appearance by modifying CSS variables in `styles/globals.css`:

- **Colors**: Update `--bg-primary`, `--text-primary`, `--accent-color`
- **Typography**: Modify font families and sizes
- **Spacing**: Adjust padding and margin variables
- **Animations**: Customize transition durations and easing

## Development

### Available Scripts

- `npm run dev` - Start development server on port 9002
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks

### Technology Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: CSS Modules with CSS Variables
- **State Management**: React Hooks
- **Development**: ESLint for code quality

## AI Integration

This application uses **Ollama Cloud** for AI-powered conversations:

- **Model**: deepseek-v3.1:671b-cloud
- **Library**: Official Ollama JavaScript SDK
- **Features**: Real-time chat completions
- **Streaming**: Support for streaming responses (ready to implement)

### Ollama Service

The `OllamaService` class uses the official Ollama JavaScript library:

```typescript
// Simple chat completion
await ollama.chat(messages)

// Streaming chat (for real-time responses)
await ollama.streamChat(messages, onChunk, onComplete, onError)
```

**Current Model**: `deepseek-v3.1:671b-cloud`

## Current Status

✅ **Fully Functional Features:**

- Multiple chat sessions with smart organization
- Real-time AI-powered conversations (DeepSeek model)
- Ollama Cloud integration
- Dark/light theme toggle
- Fully responsive mobile design
- TypeScript support
- Empty state with suggestions
- Typing animations with markdown support
- Auto-resize textarea
- Error handling
- **Sidebar Features:**
  - Timestamp grouping (Today, Yesterday, Last 7 days, etc.)
  - Delete chat functionality
  - Edit chat titles
  - Auto-generated chat titles from first message
- **Markdown Support:**
  - Bold, italic, code blocks
  - Tables, lists, links
  - Headings, blockquotes
  - Syntax highlighting

🚧 **Ready for Enhancement:**

- Real streaming responses (SSE)
- User authentication system
- Message persistence (database storage)
- Multiple AI model selection
- File upload support
- Rich media messaging (images, links)
- Message search functionality
- Export chat history
- Push notifications
- Voice input/output

## Contributing

This is a demo implementation showcasing modern React patterns and chat interface design. Feel free to use it as a starting point for building more advanced chat applications.
