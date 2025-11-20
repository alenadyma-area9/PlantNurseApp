# 🌱 PlantNurse

**A smart plant care companion that teaches you how to care for your plants.**

PlantNurse helps inexperienced plant owners learn proper plant care through observation and guidance, not just scheduled reminders. The app focuses on teaching you to "read" your plants and understand their needs.

## ✨ Features

- 🪴 **Plant Database**: 15 common houseplants with detailed care information
- 🔍 **Plant Identification**: Don't know your plant? We'll help you identify it
- ✅ **Smart Check-ins**: Learn what to observe and when to check your plants
- 📚 **Educational Guidance**: Understand WHY plants need certain care
- 🎯 **Personalized Care**: Tailored to your specific plants and environment
- 📱 **Client-Side Only**: All data stored locally, no server required

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173/`

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

1. **Add Your Plants**: Input plant type and give it a friendly name
2. **Learn to Observe**: Get guidance on what to check (soil moisture, leaf condition)
3. **Check-In Regularly**: Record observations and actions taken
4. **Build Knowledge**: Learn patterns and understand your plants' needs
5. **Grow Together**: Watch your plants thrive as you become a better plant parent

## 🎯 Development Philosophy

This isn't just a reminder app. PlantNurse focuses on:
- Teaching observation skills over rigid schedules
- Building understanding of plant needs
- Adapting to real-world conditions (seasons, environment)
- Empowering users to make informed decisions

## 📝 Type Checking

Always run type checking before committing:

```bash
npm run check
```

This ensures type safety across the codebase.

## 🤝 Contributing

Currently a personal project. Feel free to fork and adapt for your needs.

## 📄 License

Private project - all rights reserved.

---

**Happy Growing! 🌱**
