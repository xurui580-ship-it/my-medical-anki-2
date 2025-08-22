# **App Name**: MediFlash

## Core Features:

- User Authentication: User authentication (login/register) with persistent storage of user credentials. Includes default 'test' and 'manager' accounts. Provides user space to allow users to see their personalized contents.
- Flashcard Display: Display flashcards with Q/A format. Implements the interaction design detailed in the user request.
- Spaced Repetition Algorithm: Implements a spaced repetition algorithm (SM-2 variant) to schedule flashcard reviews. Scheduling affects priority of what cards the user sees when.
- Easy Navigation: Provides navigation to study the included flashcards and to manage the added card decks
- AI-Powered Q/A Extraction: AI-powered tool that analyzes uploaded PDF/Word/TXT documents to automatically extract questions and answers for flashcard generation.
- New Card Limit: Logic to keep track of new cards presented, and enable 复习mode when a certain new-card threshold is exceeded.
- Add Deck For Everyone: When using 'manager' account, added card decks sync with every user's collection.

## Style Guidelines:

- Primary color: Professional Blue (#2A6EBB), reflecting expertise and trust.
- Secondary color: Life Green (#4CAF50), symbolizing health and growth in learning.
- Background color: Light Blue-White (#F9FBFD), providing a clean and calming learning environment.
- Accent color: Warm Orange (#FF9800) highlights important buttons and tips.
- Font: 'Inter', a sans-serif typeface that offers a modern and readable feel, used for both headings and body text. 
- Use line-style icons, incorporating subtle medical symbols like a stethoscope or brain, especially in non-study areas.
- Employs a modern, minimalist layout with 'Glassmorphism' effects and a soft blue-white gradient background for a professional, yet approachable aesthetic.
- Incorporate fluid animations for transitions and interactions to enhance user engagement without distraction.