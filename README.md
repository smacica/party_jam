# PartyJam 🎵
An open-source, collaborative jukebox app built with Express and SQLite. It allows a host to share their Spotify playback with party guests. Guests can request and vote on songs without needing a Spotify account, while the host retains full control over who can add music.
🛑 The Problem This Solves
Standard Spotify group sessions require every single participant to have a Spotify Premium account. PartyJam breaks this barrier: only the host needs a Spotify Premium account to power the speaker. Guests simply scan a QR code, join the room anonymously, and start collaborating on the playlist.
✨ Features
• Zero-Account Guest Access: Guests can search the Spotify catalog and queue songs instantly without logging in.
• Host Moderation & Regulation: 
• Toggle queue permissions on/off instantly. 
• Set rate limits (e.g., max 2 songs per guest). 
• Blacklist disruptive users or explicit tracks.
• Real-Time Sync: A shared, live-updating queue powered by a lightweight Express backend and local SQLite database.

🛠️ Tech Stack
• Backend: Node.js, Express
• Database: SQLite
• Frontend: HTML5, Tailwind CSS, Vanilla JavaScript
🚀 Quick Start
Prerequisites
• Node.js (v18+)
• Spotify Developer Account (for API credentials)
Installation
1. Clone the repository: git clone https://github.com/yourusername/partyjam.git cd partyjam
2. Install dependencies: npm install
3. Set up environment variables: Create a .env file in the root directory: SPOTIFY_CLIENT_ID=your_client_id SPOTIFY_CLIENT_SECRET=your_client_secret SPOTIFY_REDIRECT_URI=http://localhost:3000/callback PORT=3000
4. Run the server: npm start  The app will automatically initialize the SQLite database on first boot. Open http://localhost:3000 to start your party room.

📄 License
MIT License
