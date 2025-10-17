# Modern Chat Interface

A clean, minimalist chat interface built with Next.js and React, inspired by ChatGPT's design.

## Features

- 🎨 Clean, minimalist UI design
- 🌓 Dark/Light mode support
- 📱 Fully responsive (mobile & desktop)
- 💬 Message bubbles with user/assistant distinction
- 📋 Left sidebar with chat history
- ⚡ Real-time message sending
- 🎯 TypeScript support

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:9002](http://localhost:9002) in your browser.

## Project Structure

```
├── pages/
│   ├── _app.tsx          # App wrapper
│   └── index.tsx         # Main chat interface
├── styles/
│   └── globals.css       # Global styles with CSS variables
├── package.json
├── tsconfig.json
└── next.config.js
```

## Key Components

- **Sidebar**: Chat history with new chat creation
- **Main Chat**: Message display area with scrolling
- **Input Area**: Message composition with send button
- **Theme Toggle**: Dark/light mode switching
- **Mobile Support**: Collapsible sidebar with overlay

## Styling

The interface uses CSS variables for theming, making it easy to customize colors and spacing. The design follows modern chat interface patterns with:

- Rounded message bubbles
- Proper spacing and typography
- Smooth transitions
- Accessible color contrast
- Mobile-first responsive design

## Customization

You can easily customize the appearance by modifying the CSS variables in `styles/globals.css`:

```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #343541;
  --accent-color: #10a37f;
  /* ... more variables */
}
```

## Next Steps

This is a frontend-only implementation. To make it functional, you would need to:

1. Add backend API integration
2. Implement real chat functionality
3. Add user authentication
4. Connect to a chat service or AI model
5. Add message persistence
6. Implement file uploads and rich media support