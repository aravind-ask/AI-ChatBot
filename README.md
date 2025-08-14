# React Chat App with Nhost Authentication

A modern React application with Nhost authentication and real-time chat functionality.

## Features

- 🔐 **Authentication**: Email sign-up/sign-in with Nhost
- 💬 **Real-time Chat**: Live messaging with GraphQL subscriptions
- 🤖 **AI Bot Integration**: Automated bot responses
- 📱 **Responsive Design**: Beautiful UI that works on all devices
- 🔒 **Protected Routes**: Secure navigation with authentication guards

## Setup

1. **Create a Nhost Project**
   - Go to [nhost.io](https://nhost.io) and create a new project
   - Note your subdomain and region

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Update with your Nhost project details:
   ```env
   VITE_APP_NHOST_SUBDOMAIN=your-project-subdomain
   VITE_APP_NHOST_REGION=your-region
   ```

3. **Database Schema**
   Create these tables in your Nhost database:

   ```sql
   -- Chats table
   CREATE TABLE chats (
     id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
     title text NOT NULL,
     created_at timestamptz DEFAULT now(),
     updated_at timestamptz DEFAULT now()
   );

   -- Messages table
   CREATE TABLE messages (
     id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
     chat_id uuid REFERENCES chats(id) ON DELETE CASCADE,
     user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
     content text NOT NULL,
     is_bot boolean DEFAULT false,
     created_at timestamptz DEFAULT now()
   );
   ```

4. **Install Dependencies**
   ```bash
   npm install
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## GraphQL Operations

The app uses Apollo Client with Nhost backend for:
- User authentication
- Chat management
- Real-time messaging
- Bot interactions

## Architecture

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Nhost (PostgreSQL + GraphQL + Authentication)
- **Real-time**: GraphQL Subscriptions
- **State Management**: Apollo Client Cache
- **Routing**: React Router v6

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_APP_NHOST_SUBDOMAIN` | Your Nhost project subdomain | `my-project` |
| `VITE_APP_NHOST_REGION` | Your Nhost project region | `us-east-1` |