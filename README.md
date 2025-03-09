# PK Coach Buddy

An AI-powered parkour coaching app to help coaches reflect, organize training sessions, and grow as educators.

## Features

- **Authentication**: Secure user authentication via Supabase
- **Coaching Reflections**: Journal and reflect on your coaching experiences
- **Session Planning**: Create and manage parkour training sessions
- **Knowledge Base**: Access coaching resources and ADAPT principles
- **AI Assistance**: Get AI-powered insights into your coaching practice

## Environment Variables

This project uses environment variables to keep sensitive information like API keys secure.

### Local Development

1. Create a `.env` file at the root of the project (it's already in .gitignore)
2. Add the following variables:

```
# Supabase Configuration
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-anon-key

# Google/Gemini API Keys
GEMINI_API_KEY=your-gemini-api-key
GOOGLE_CLIENT_ID_IOS=your-google-client-id
```

### Production Deployment

For production builds with EAS, you need to set up secrets:

```bash
# Set up secrets in EAS (run these commands once)
eas secret:create --scope project --name SUPABASE_URL --value "your-supabase-url"
eas secret:create --scope project --name SUPABASE_KEY --value "your-supabase-key" 
eas secret:create --scope project --name GEMINI_API_KEY --value "your-gemini-api-key"
eas secret:create --scope project --name GOOGLE_CLIENT_ID_IOS --value "your-google-client-id"
```

## Supabase Setup

To set up the Supabase database:

1. Create a new project in Supabase
2. Run the SQL scripts found in `sql/init.sql` to create the necessary tables
3. Set up Row Level Security policies as defined in the scripts

### Tables

- **profiles**: Store user profile information
- **sessions**: Coaching sessions data
- **moves**: Parkour moves and techniques
- **feedback**: Coach feedback on sessions
- **goals**: User training goals
- **workouts**: Predefined workout plans

### Authentication

This project uses Supabase Auth with multiple providers:
- Email/Password
- Google OAuth
- Apple OAuth (iOS only)

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
3. Set up your Supabase project following the instructions in `SUPABASE_SETUP.md`
4. Ensure your `.env` file has the correct Supabase credentials:
   ```
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_KEY=your-anon-key
   ```
5. Start the development server:
   ```
   npm run dev
   ```
6. Open the Expo Go app on your device and scan the QR code

## Project Structure

- `/app`: Contains all the app screens and navigation
- `/components`: Reusable UI components
- `/lib`: Utility functions and libraries including Supabase integration
- `/assets`: Images, fonts, and other static assets

## Authentication Flow

The app uses Supabase Authentication with the following flow:

1. Unauthenticated users are redirected to the `/auth` screen
2. Users can sign up or log in with email/password
3. Upon successful authentication, users are redirected to the main app
4. Protected routes check for authentication status
5. Users can log out from the settings screen

## Database Schema

The app uses the following Supabase tables:

- `coach_profiles`: Extends user data with coaching information
- `coaching_sessions`: Stores training session data
- `coach_reflections`: Stores coaching reflections
- `session_plans`: Stores structured training plans
- `knowledge_base`: Stores coaching resources and articles

## Development

To contribute to this project:

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Create a pull request

## Troubleshooting

If you encounter issues with the Supabase integration:

1. Verify your environment variables are correct
2. Check that your Supabase policies are properly configured
3. Ensure you're using the latest version of the Supabase client
4. Clear your app's storage and try again

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Native Documentation](https://reactnative.dev/docs/getting-started) 