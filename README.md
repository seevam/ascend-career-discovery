# Ascend Now Career Discovery Platform

Two interactive activities to help high school students discover their career interests and express their identity.

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📱 Activities

### Activity 1: Interest Discovery Quest

Explore career interests through 35 scenario-based questions across 7 categories:
- 🎨 Arts & Creativity
- 🔬 STEM & Technology
- 🤝 Social Impact & Helping
- 💼 Business & Entrepreneurship
- 🌿 Nature & Environment
- ❤️ Health & Wellness
- 📢 Communication & Media

**Features:**
- Complete 3+ categories to unlock results
- Visual radar chart showing your interest profile
- Top 3 ranked interests with career suggestions and skills to develop
- PDF export and shareable URLs
- Auto-save (progress saved every 5 seconds)

**How to Use:**
1. Start from the landing page
2. Select a category to explore
3. Answer 5 scenario questions per category
4. Complete at least 3 categories
5. View your results with personalized career recommendations
6. Download PDF or share with mentors

---

### Activity 2: Identity Canvas Builder

Create a visual representation of who you are with customizable icons and text.

**Features:**
- 100+ emoji icons across 4 zones:
  - 💪 My Strengths (15 icons)
  - ❤️ My Passions (18 icons)
  - 💎 My Values (custom text)
  - 🎯 My Goals (15 icons)
- Personal quote input
- 10 gradient + 5 solid color backgrounds
- PNG export and shareable URLs
- Auto-save (progress saved every 3 seconds)

**How to Use:**

**On Desktop:**
1. Click icons from the left sidebar to add them to canvas zones
2. Sections are organized by category (Strengths, Passions, Values, Goals)
3. Icons appear in their corresponding zone on the canvas
4. Hover over icons to see the delete button (X)
5. Click "Preview" to see your canvas without editing controls
6. Download as PNG or generate a shareable link

**On Mobile/Tablet:**
1. Tap the menu icon (☰) to open the asset library sidebar
2. Tap any icon to add it to the canvas
3. **The sidebar will automatically close** so you can see the canvas
4. Tap the menu icon again to add more icons
5. To remove an icon, tap it and then tap the X button
6. Use "Preview" to see the final result

**Important Mobile Notes:**
- The sidebar covers the canvas when open (by design)
- After adding an icon, it auto-closes so you can see your work
- Re-open the sidebar whenever you want to add more elements

---

## 🎨 Canvas Builder - Troubleshooting

### "I clicked an icon but don't see it on the canvas"

**On Mobile:**
- The sidebar automatically closes after adding an icon
- Your icon has been added! Look at the canvas area
- Icons appear in their designated zones (Strengths, Passions, Values, Goals)

**On Desktop:**
- Check that you're looking at the correct zone
- Icons are added to the zone matching their category
- Check the browser console (F12) for debug messages

### Check the Console

Open browser developer tools (F12) and look for these messages:
```
🎯 Adding icon: { zone: 'strengths', emoji: '🧠', name: 'Smart' }
📦 Element to add: {...}
✅ Icon added successfully. Current elements: 1
```

If you see these messages, the icon was added successfully!

---

## 💾 Data Storage

- All data stored in browser **localStorage**
- No backend or server required
- Data persists for **30 days**
- Clearing browser data will erase progress
- Use export features to save permanently

---

## 📤 Export & Sharing

### Interest Quest (Activity 1)
- **PDF Export**: Download a formatted PDF with your results
- **Shareable URL**: Generate a compressed URL to share with mentors
  - URL contains encoded results data
  - Works indefinitely (no expiration)
  - Recipients see read-only results

### Canvas Builder (Activity 2)
- **PNG Export**: Download your canvas as a high-quality image (1920x1080)
- **Shareable URL**: Generate a compressed URL to share your canvas
  - URL contains encoded canvas data
  - Works indefinitely (no expiration)
  - Recipients see read-only canvas

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **Charts**: Recharts (radar charts)
- **Export**: jsPDF (PDF), html2canvas (PNG)
- **Compression**: lz-string (for shareable URLs)
- **Storage**: Browser localStorage

---

## 📁 Project Structure

```
ascend-career-discovery/
├── app/                          # Next.js app directory
│   ├── activities/
│   │   ├── interest-quest/       # Activity 1 routes
│   │   └── canvas-builder/       # Activity 2 routes
│   ├── layout.tsx
│   └── page.tsx                  # Landing page
├── components/
│   ├── interest-quest/           # Activity 1 components
│   ├── canvas-builder/           # Activity 2 components
│   ├── shared/                   # Shared UI components
│   └── ui/                       # shadcn/ui base components
├── contexts/                     # React contexts for state
├── data/                         # JSON data files
│   ├── scenarios.json            # Interest quest scenarios
│   ├── categories.json           # Category metadata
│   └── canvas-assets.json        # Canvas icons and presets
├── hooks/                        # Custom React hooks
├── lib/                          # Utility functions
└── types/                        # TypeScript type definitions
```

---

## 🔧 Development

### Adding New Scenarios (Activity 1)

Edit `data/scenarios.json`:
```json
{
  "id": "category_001",
  "category": "arts_creativity",
  "question": "Your question here...",
  "choices": [
    {
      "id": "category_001_a",
      "text": "Choice text...",
      "mapping": [
        { "category": "arts_creativity", "weight": 3 }
      ]
    }
  ]
}
```

### Adding New Canvas Icons

Edit `data/canvas-assets.json`:
```json
{
  "id": "unique-id",
  "name": "Display Name",
  "emoji": "🎯"
}
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Environment Variables

Create `.env.local`:
```bash
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME="Ascend Now Career Discovery"
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

---

## 📊 Analytics (Optional)

To enable analytics, set up PostHog or Plausible:

1. Uncomment analytics code in `lib/analytics.ts`
2. Add your API key to `.env.local`:
```bash
NEXT_PUBLIC_POSTHOG_KEY=your_key_here
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

---

## 🐛 Known Issues & Fixes

### Mobile Sidebar Behavior
**Issue**: On mobile, clicking an icon doesn't show it on the canvas
**Fix**: The sidebar now auto-closes after adding an icon (as of latest update)

### localStorage Limits
**Issue**: Browser localStorage has size limits (~5-10MB)
**Solution**: Export important data regularly

---

## 📝 License

This project is built for Ascend Now's career discovery program.

---

## 🤝 Support

For questions or issues:
1. Check the browser console for debug messages
2. Verify localStorage isn't full
3. Try clearing browser cache
4. Contact your Ascend Now program coordinator

---

## ✨ Credits

Built for **Ascend Now** - Helping high school students discover their career paths.
