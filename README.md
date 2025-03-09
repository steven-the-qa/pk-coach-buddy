# PK Coach Buddy

An AI-powered parkour coaching app to help coaches reflect, organize training sessions, and grow as educators.

## Overview

PK Coach Buddy serves as a comprehensive assistant for ADAPT-aligned parkour coaches, providing tools for reflection, curriculum planning, and professional development. The app reduces administrative overhead while helping coaches implement structured, reflective practices.

## Features

### Core Features

- **AI-Powered Coaching**
  - AI-generated session plans with one-tap access
  - AI insights from coaching reflections
  - Smart filtering for AI-generated content

- **Session Management**
  - Create and organize parkour training sessions
  - Track upcoming and past sessions
  - Session search functionality
  - Customizable session parameters (duration, participants, etc.)

- **Coaching Journal**
  - Document coaching reflections and experiences
  - Track progress and identify patterns
  - Transform reflections into actionable insights

- **Knowledge Base**
  - Access coaching resources and references
  - ADAPT coaching principles and methodologies
  - Structured learning materials for parkour instruction

- **User Management**
  - Secure authentication via Supabase
  - Profile customization
  - Settings and preferences

### Technical Features

- **Modern Mobile Development**
  - Built with React Native and Expo
  - Supports both iOS and Android platforms
  - Responsive design for various device sizes

- **Offline Capabilities**
  - Access critical features without internet connection
  - Sync when connection is restored

- **Cloud Integration**
  - Secure data storage with Supabase
  - Real-time updates across devices

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Supabase account (free tier works fine)
- Expo Go app (for testing on mobile devices)

### Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Ensure your `.env` file has the required variables:
   ```
   # Supabase Configuration
   SUPABASE_URL=your-supabase-url
   SUPABASE_KEY=your-supabase-anon-key

   # Google/Gemini API Keys
   GEMINI_API_KEY=your-gemini-api-key
   GOOGLE_CLIENT_ID_IOS=your-google-client-id
   ```
4. Start the development server:
   ```
   npm run dev
   ```
5. Open the Expo Go app on your device and scan the QR code

### Supabase Auth Configuration

For proper authentication including password reset functionality:

1. In your Supabase dashboard, go to Authentication → URL Configuration
2. Set the Site URL to `pkcoachbuddy://` to enable deep linking for password reset
3. Ensure the app's scheme in `app.config.js` matches this URL (`pkcoachbuddy`)
4. The app is configured to handle password reset links through deep linking

The mobile app will automatically handle password reset links sent to users' emails, opening the app and allowing users to create a new password securely.

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Native Documentation](https://reactnative.dev/docs/getting-started) 