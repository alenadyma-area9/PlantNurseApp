# 🌱 PlantNurse

**A smart plant care companion that helps you track and care for your houseplants.**

PlantNurse is a simple, intuitive app for plant owners to track their plants, log check-ins, manage care schedules, and learn from their plant care journey. All data is stored locally in your browser - no account or internet connection required.

## ✨ Features

### Plant Management
- 🪴 **Plant Database**: 15 common houseplants with detailed care guides (watering, light, temperature, humidity)
- 🌱 **Custom Plants**: Can't find your plant? Add custom plants with your own care instructions
- 📸 **Photo Timeline**: Track your plant's growth with photos (uploaded or from check-ins)
- 🏠 **Room Organization**: Organize plants by room with light level and temperature info

### Check-ins & Tracking
- ✅ **Smart Check-ins**: Log soil moisture, leaf condition, actions taken, and notes
- 📅 **Care Schedule**: Customizable check-in frequency for each plant
- 🩺 **Issue Detection**: Automatic suggestions for common problems (overwatering, underwatering, pests)
- 📊 **Plant History**: Full timeline of check-ins, edits, and changes

### Views & Organization
- 📋 **Multiple Views**: Sort by all plants, room, health status, next check date, or care level
- 🔄 **Drag & Drop**: Reorder your plants in default view
- 🎨 **Status Indicators**: Clear visual indicators for plant health and check-in needs

### Settings & Customization
- 🌡️ **Unit Preferences**: Switch between Fahrenheit/Celsius and inches/cm
- ⚙️ **Room Management**: Create and manage custom rooms with light and temperature info
- 📱 **Responsive Design**: Works seamlessly on mobile and desktop

### Privacy & Storage
- 🔒 **100% Local**: All data stored in browser LocalStorage - no server, no account needed
- 💾 **Automatic Sync**: Changes save instantly to local storage

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

### Installation & Setup

1. **Clone or download this repository:**
	 ```bash
	 git clone <repository-url>
	 cd plant-nurse-app
	 ```

2. **Install dependencies:**
	 ```bash
	 npm install
	 ```

3. **Start the development server:**
	 ```bash
	 npm run dev
	 ```

4. **Open in browser:**
	 - The app will be available at `http://localhost:5173/`
	 - Your browser should open automatically

### Building for Production

To create a production build:

```bash
npm run build
```

The optimized files will be in the `dist/` folder, ready to deploy to any static hosting service (Netlify, Vercel, GitHub Pages, etc.).

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run check` | Run TypeScript type checking |
| `npm run lint` | Run ESLint to check code quality |
| `npm run preview` | Preview production build locally |

## 🏗️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Zustand** - State management
- **Chakra UI** - Component library (clean/minimal design)
- **LocalStorage** - Data persistence

## 📁 Project Structure

```
plant-nurse-app/
├── src/
│   ├── components/     # Reusable UI components
│   ├── data/          # Plant database
│   ├── store/         # Zustand state management
│   ├── types/         # TypeScript interfaces
│   ├── utils/         # Helper functions
│   └── App.tsx        # Main app component
├── public/            # Static assets
└── dist/              # Production build (generated)
```

## 🌿 How It Works

1. **Add Your Plants**
	 - Choose from 15 common houseplants or add a custom plant
	 - Give it a name, assign to a room, note its size and condition
	 - Optionally add a photo

2. **Check In Regularly**
	 - App reminds you when to check each plant based on its care schedule
	 - Log soil moisture, leaf condition, actions taken (watered, fertilized, etc.)
	 - Add notes and photos to track progress

3. **Get Smart Suggestions**
	 - App analyzes your check-ins and detects potential issues
	 - Provides specific solutions for common problems (yellowing leaves, brown tips, drooping, etc.)
	 - Learn what your plants need based on their symptoms

4. **Track Growth & History**
	 - View complete timeline of all check-ins and changes
	 - Photo gallery shows your plant's journey over time
	 - See patterns in your care routine and plant health

5. **Organize Your Collection**
	 - Sort and filter plants by room, health, care level, or next check date
	 - Manage multiple rooms with different light and temperature conditions
	 - Customize units (°F/°C, inches/cm) to your preference

## 📝 Development

### Type Checking

Run TypeScript type checking:
```bash
npm run check
```

### Linting

Check code quality with ESLint:
```bash
npm run lint
```

### Preview Production Build

Test the production build locally:
```bash
npm run build
npm run preview
```

## 💾 Data Storage

- All data is stored in your browser's LocalStorage
- No data is sent to any server - everything stays on your device
- To backup your data: Export your browser's LocalStorage (use browser DevTools)
- Clearing browser data will delete all your plants and check-ins

## 🤝 Contributing

This is a personal project, but contributions are welcome! Feel free to:
- Fork the repository
- Submit issues for bugs or feature requests
- Create pull requests with improvements

## 📄 License

MIT License - feel free to use and modify for your own needs.

---

**Happy Growing! 🌱**
