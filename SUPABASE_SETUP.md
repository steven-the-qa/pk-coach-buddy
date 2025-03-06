# Supabase Setup for PK Coach Buddy

This guide will help you set up Supabase authentication and database tables for your PK Coach Buddy app.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- A new Supabase project created
- Access to the Supabase dashboard for your project

## Setting Up Authentication

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Make sure **Email** provider is enabled
4. Optionally, set up additional providers (Google, Apple, etc.) as needed

## Setting Up Database Tables

1. Navigate to **SQL Editor** in your Supabase dashboard
2. Create a new query
3. Copy and paste the contents of the `supabase-schema.sql` file from this repository
4. Run the query to create all tables and policies

This will create the following tables:
- `coach_profiles` - Extends auth.users with coaching-specific information
- `coaching_sessions` - Stores information about training sessions
- `coach_reflections` - Stores coach reflections and insights
- `session_plans` - Stores structured training session plans
- `knowledge_base` - Stores coaching resources and knowledge articles

It will also set up Row Level Security (RLS) policies to ensure users can only access their own data.

## Environment Variables

Make sure your `.env` file contains the following variables:

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-key
```

You can find these values in your Supabase project settings under **API**.

## Testing Authentication

After setting up, you should be able to:
1. Register new accounts
2. Log in with existing accounts
3. Access protected routes only when authenticated

## Using the Supabase Client

Import the Supabase client in your components:

```typescript
import { supabase } from '../lib/supabase';
```

Examples of common operations:

### Fetching Data

```typescript
const { data, error } = await supabase
  .from('coaching_sessions')
  .select('*')
  .eq('coach_id', user.id);
```

### Inserting Data

```typescript
const { data, error } = await supabase
  .from('coach_reflections')
  .insert({
    coach_id: user.id,
    reflection_text: 'Today's session went well...',
    challenges: 'Some students struggled with...',
    successes: 'The new drill was effective...'
  });
```

### Updating Data

```typescript
const { data, error } = await supabase
  .from('coach_profiles')
  .update({ name: 'New Name', bio: 'Updated bio' })
  .eq('id', user.id);
```

### Deleting Data

```typescript
const { error } = await supabase
  .from('session_plans')
  .delete()
  .eq('id', planId);
```

## Further Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security) 