# in-Q - Social Media for Gamers

inQ is a social media platform tailored for gamers to connect, share experiences, and see who's online to play. With features like status updates, friend/follower lists, and game preferences, inQ makes it easy for gamers to find friends to play with.

## Features
- Real-time online status for friends
- Follow/unfollow functionality
- Posts with image support, likes, and comments
- Integrated chatbox for live conversations
- Easy search to find gaming friends
- Display of top games using the Twitch API (no login required)

## Features to be added
- Pages for the games list to allow for sharing content for that specific game
- Gaming preferences (available, unavailable, looking to play, etc.)
- Video uploads

## Getting Started

### Prerequisites
- Node.js

### Installation

1. Clone this repository:
     ```bash
     git clone https://github.com/james-lixu/in-Q.git
     cd in-Q
2. Install dependencies for both frontend and backend
     ```bash
     cd backend
     npm install
     cd ../frontend
     npm install
4. Start backend server
     ```bash
     cd backend
     npm run dev
6. Start frontend server
      ```bash
     cd frontend
     npm start

## Usage

Once both servers are running, open http://localhost:3000 in your browser to view the app.
  - backend/ - Contains server code (Node.js, Express)
  - frontend/ - Contains client code (React)
