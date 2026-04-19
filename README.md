# HomeoClinic – Cash Book & Medicine Stock

A fully offline-capable Progressive Web App (PWA) for managing a homeopathy clinic's cash book and medicine stock.

## Features

- 💰 **Cash Book** – Track income and expenses with daily summaries
- 💊 **Medicine Stock** – Manage medicine inventory, low-stock alerts
- 📋 **Billing** – Generate patient bills and receipts
- 📊 **Reports** – Financial and stock reports
- 🎨 **Themes** – 8 color themes (Purple, Green, Blue, Rose, Amber, Teal, Slate, Indigo)
- 🔐 **Admin Password** – Secure Firebase settings behind a password gate
- 📱 **PWA / Mobile-ready** – Installable on Android & iOS, works offline

## Getting Started

### Option 1 – Open directly in browser
Just open `index.html` in any modern browser. No server or build step required.

### Option 2 – Serve locally
```bash
# Python
python3 -m http.server 8080

# Node.js (npx)
npx serve .
```
Then visit `http://localhost:8080`.

### Option 3 – Deploy to GitHub Pages
1. Push this repo to GitHub.
2. Go to **Settings → Pages → Source → main / (root)**.
3. Your app will be live at `https://<username>.github.io/<repo>/`.

## File Structure

```
HomeoClinic/
├── index.html      # Single-file app (HTML + CSS + JS)
└── README.md
```

## Tech Stack

- Vanilla HTML / CSS / JavaScript (no frameworks, no build step)
- Firebase Firestore (optional – configure in Admin Settings)
- Service Worker for offline / PWA support

## Configuration

Open the app → **Admin Settings** tab → enter Firebase credentials to enable cloud sync.  
Without Firebase, all data is stored in the browser's `localStorage`.

## License

MIT
