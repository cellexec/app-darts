# 🎯 Darts Game Scorer  
A modern, responsive web app for scoring darts games with customizable features and detailed history tracking.  

![Darts Game Screenshot](/placeholder.svg?height=400&width=800&query=darts%20game%20scoring%20app%20with%20dark%20mode%20interface)  

<br />

## 🚀 Features  
- 🎮 **Game Modes**: Play 301, 501, or 701  
- 🎯 **Double-Out Support**: Follows standard finishing rules  
- 👥 **Multi-Player**: Add and manage unlimited players  
- 🎨 **Customizable UI**: Set multiplier colors to your preference  
- 📊 **Game History**: View detailed throw logs for each player  
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile  
- 🌗 **Dark & Light Mode**: Auto theme switching based on system  
- 💾 **Persistent Storage**: Game state saved in local storage  

<br />

## 🛠️ Tech Stack  
- **Next.js** – React framework for frontend rendering  
- **TypeScript** – Type-safe JavaScript  
- **Tailwind CSS** – Utility-first CSS styling  
- **Radix UI** – Accessible, headless UI components  
- **Lucide Icons** – Consistent and customizable icons  
- **shadcn/ui** – Beautiful prebuilt UI components  

<br />

## 🧑‍💻 Getting Started  

### ✅ Prerequisites  
- Node.js `v18+`  
- npm  

### 🔧 Local Development  
1. Clone the repo:
   ```bash
   git clone https://github.com/yourusername/darts-game.git
   cd darts-game
   ```
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```
4. Visit `http://localhost:3000` in your browser.  

<br />

### 🐳 Docker Setup  
1. Build the image:
   ```bash
   docker build -t app-darts .
   ```
2. Run the container:
   ```bash
   docker run -p 3000:3000 app-darts
   ```
3. Visit `http://localhost:3000`  

<br />

## 🎮 How to Use  

### 🧾 Setup  
1. Click the **⚙️ Settings** icon  
2. Add players and select game mode  
3. (Optional) Set custom multiplier colors  
4. Click **Start Game**  

### 🎯 Scoring  
1. Choose a multiplier: ×1, ×2, or ×3  
2. Tap the number you hit  
3. Complete your throws or click **Finish Round**  

### 🕹️ Game Controls  
- **Reset Round** – Clear current throws  
- **Next Player** – Advance to the next player  
- **History Icon** – View throw history  

### ✍️ Edit Scores  
- Click the ✏️ edit icon next to a player's score to adjust manually  

<br />

## 🧱 Project Structure  
```
app-darts/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   ├── darts-game.tsx
│   ├── score-input.tsx
│   ├── game-stats.tsx
│   ├── player-management.tsx
│   ├── game-history-sheet.tsx
│   ├── throw-history.tsx
│   ├── color-settings.tsx
│   ├── edit-score-dialog.tsx
│   └── theme-toggle.tsx
├── lib/
│   └── utils.ts
├── public/
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── Dockerfile
└── README.md
```

<br />

## 🧠 Technical Details  

### 🗂️ State Management  
- Uses `useState` & `useEffect`  
- Tracks:
  - Player list & scores
  - Current player & throws
  - Game mode & color prefs
  - UI modals/sheets  

### 💾 Local Storage  
- Player data  
- Selected game mode  
- Color preferences  

<br />

## 📦 Production  

### 🔨 Build  
```bash
npm run build
```

<br />

### 🚀 Deployment  

#### ✅ Kubernetes via Flux GitOps (Recommended)  
1. Push your changes to GitHub  
2. Update the deployment in your [Flux GitOps repo](https://github.com/cellexec/flux-gitops):  
   - Create or edit a `Kustomization` and `Deployment` or `HelmRelease`  
   - Ensure your image is built and pushed via CI  
   - Optionally configure image automation  
3. Flux will reconcile and deploy to your cluster  

📘 See [cellexec/flux-gitops](https://github.com/cellexec/flux-gitops) for full setup.

<br />

## 🛠️ Troubleshooting  

| Issue                  | Solution |
|------------------------|----------|
| ❌ Dependency errors   | Use `--legacy-peer-deps` with `npm install` |
| 🔧 Build errors        | Use Node.js `v18+` |
| 🧹 Storage bugs        | Clear browser local storage |
| 🎨 Style glitches      | Check Tailwind setup/config |

### ✅ Browser Support  
- Chrome, Firefox, Safari, Edge (latest)  
- iOS Safari & Android Chrome  

<br />

## 📝 Game Rules  

### 🎯 Double Out (Standard)  
1. Start with 301, 501, or 701  
2. Subtract each round’s score from your total  
3. To win, a player must:
   - Hit exactly 0
   - Finish with a **double** (e.g., outer bull or double ring)  
4. Busts (overshoot or 1 point left) = No score for the round  

<br />

## 🤝 Contributing  
1. Fork the repo  
2. Create a branch: `git checkout -b feature/amazing-feature`  
3. Commit: `git commit -m "Add amazing feature"`  
4. Push: `git push origin feature/amazing-feature`  
5. Open a Pull Request  

<br />

## 📄 License  
MIT License — free to use, modify, and share.  
