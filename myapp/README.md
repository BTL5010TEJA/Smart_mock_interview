# Smart Mock Interview v2.0.0 🚀

An advanced AI-powered mock interview platform with comprehensive analytics, multi-modal analysis, gamification, and futuristic features to help you ace your next job interview.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-19.2.0-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178c6.svg)

## ✨ What's New in v2.0.0

### 🎯 Core Features

- **📊 Analytics Dashboard** - Comprehensive performance tracking with visual charts, trend analysis, and skill radar
- **🤖 AI Interview Coach** - Personalized feedback, learning paths, and real-time tips
- **📹 Video Analysis** - Body language, facial expression, and confidence level tracking with webcam integration
- **🎤 Voice Analyzer** - Speech rate, clarity, tone, and filler word detection
- **👤 3D Avatar Interviewer** - Interactive AI interviewers with distinct personalities (Professional, Friendly, Technical)
- **🎮 Gamification System** - XP, levels, achievements, badges, and daily streaks
- **📝 Resume Parser** - Upload and analyze your resume with skill extraction and question generation
- **💻 Code Interview Module** - Integrated code editor with multiple language support
- **🎯 Multiple Interview Modes** - Technical, Behavioral, HR, System Design, Speed Challenge, Anxiety-Friendly
- **⚙️ Advanced Settings** - Customizable themes, avatars, accessibility options

### 🛠️ Technology Stack

- **Frontend Framework:** React 19 with TypeScript
- **AI/ML:** TensorFlow.js for emotion & sentiment analysis
- **3D Graphics:** Three.js & @react-three/fiber
- **Charts:** Recharts, Chart.js, React-Chartjs-2
- **Animations:** Framer Motion
- **Real-time:** Socket.io Client
- **Media:** React Webcam, Wavesurfer.js
- **State Management:** Zustand
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (via utility classes)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tejaslakshmangith/Smart_mock_interview.git
   cd Smart_mock_interview/myapp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```env
   API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📖 Usage Guide

### Starting Your First Interview

1. **Select Interview Mode** - Choose from Technical, Behavioral, HR, etc.
2. **Configure Settings** - Set difficulty, duration, and preferences
3. **Enable Features** - Turn on video/voice analysis if desired
4. **Begin Interview** - Answer AI-generated questions
5. **Review Results** - Get comprehensive feedback and analytics

### Gamification System

- **Earn XP** - Complete interviews to gain experience points
- **Level Up** - Progress through 10 levels
- **Unlock Achievements** - Earn badges for milestones
- **Maintain Streaks** - Practice daily for bonus XP
- **Track Progress** - View your stats on the gamification panel

### Analytics & Insights

- **Performance Metrics** - Track technical, communication, and behavioral scores
- **Trend Analysis** - See your improvement over time
- **Skill Radar** - Visualize your strengths and weaknesses
- **Industry Benchmarks** - Compare against role-specific standards
- **Success Prediction** - AI-powered interview success forecasting

## 🏗️ Architecture

```
myapp/
├── components/              # React components
│   ├── AnalyticsDashboard.tsx
│   ├── AICoach.tsx
│   ├── VideoAnalysis.tsx
│   ├── VoiceAnalyzer.tsx
│   ├── AvatarInterviewer.tsx
│   ├── GamificationPanel.tsx
│   ├── ResumeParser.tsx
│   ├── InterviewModes.tsx
│   ├── AdvancedSettings.tsx
│   ├── CodeInterview.tsx
│   ├── Home.tsx
│   ├── Interview.tsx
│   └── Report.tsx
├── utils/                   # Utility modules
│   ├── mlModels.ts         # TensorFlow.js integration
│   ├── videoProcessor.ts   # Video stream handling
│   ├── voiceProcessor.ts   # Audio analysis
│   ├── analyticsEngine.ts  # Performance calculations
│   ├── gamification.ts     # XP & achievements
│   ├── audio.ts
│   ├── geminiApi.ts
│   └── sessionManager.ts
├── types.ts                 # TypeScript type definitions
├── constants.ts             # App constants & configs
├── App.tsx                  # Main app component
├── index.tsx               # App entry point
└── vite.config.ts          # Vite configuration
```

## 🎨 Features in Detail

### Analytics Dashboard
- **Visual Charts:** Line charts, radar charts, bar graphs
- **Performance History:** Track scores across sessions
- **Skill Breakdown:** Technical, communication, behavioral scores
- **Weakness Identification:** AI-identified improvement areas
- **Benchmark Comparison:** Industry standard comparisons

### Video Analysis
- **Real-time Webcam:** Live video capture during interviews
- **Body Language:** Posture and gesture analysis
- **Facial Expression:** Emotion detection and confidence levels
- **Eye Contact:** Percentage tracking and quality assessment
- **Feedback:** Actionable tips for improvement

### Voice Analysis
- **Speech Rate:** Words per minute calculation
- **Clarity Score:** Articulation quality (0-100)
- **Filler Words:** Detection of "um", "uh", "like", etc.
- **Volume & Tone:** Audio metrics analysis
- **Waveform:** Visual audio representation

### Gamification
- **10 Levels:** Progress through experience-based levels
- **5+ Achievements:** Unlock badges for milestones
- **Daily Streaks:** Bonus XP for consecutive days
- **XP System:** Earn points based on performance
- **Leaderboard:** (Coming soon) Compete with others

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Project Structure Details

### Components
- **Home.tsx** - Landing page with interview configuration
- **Interview.tsx** - Main interview interface
- **Report.tsx** - Results and feedback display
- **AnalyticsDashboard.tsx** - Performance analytics
- **AICoach.tsx** - Personalized coaching
- **VideoAnalysis.tsx** - Webcam-based analysis
- **VoiceAnalyzer.tsx** - Audio analysis
- **GamificationPanel.tsx** - XP and achievements
- **AvatarInterviewer.tsx** - 3D AI interviewer
- **InterviewModes.tsx** - Mode selection
- **AdvancedSettings.tsx** - Configuration panel
- **CodeInterview.tsx** - Technical coding interface
- **ResumeParser.tsx** - Resume upload and analysis

### Utilities
- **mlModels.ts** - Machine learning model integration
- **videoProcessor.ts** - Video stream management
- **voiceProcessor.ts** - Audio processing
- **analyticsEngine.ts** - Performance calculations
- **gamification.ts** - Gamification logic
- **geminiApi.ts** - Google Gemini AI integration
- **sessionManager.ts** - Interview session persistence
- **audio.ts** - Audio recording utilities

## 🔐 Environment Variables

See `.env.example` for all available environment variables:

- **API_KEY** (Required) - Google Gemini API key
- **TFJS_MODEL_URLs** (Optional) - TensorFlow.js model endpoints
- **Feature Flags** (Optional) - Enable/disable features
- **Performance Settings** (Optional) - Quality configurations

## 📊 Browser Compatibility

- Chrome/Edge (recommended) - Full feature support
- Firefox - Full feature support
- Safari - Limited webcam features
- Mobile browsers - Responsive design, limited ML features

## 🐛 Troubleshooting

### Camera/Microphone Access Issues
- Ensure browser permissions are granted
- Use HTTPS (required for webcam access)
- Check browser compatibility

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`
- Ensure Node.js version ≥ 18

### API Key Issues
- Verify API key is valid and active
- Check .env.local file exists and is properly formatted
- Restart dev server after adding API key

## 📚 Documentation

- [Changelog](CHANGELOG.md) - Version history and release notes
- [Contributing](CONTRIBUTING.md) - Contribution guidelines
- [Roadmap](ROADMAP.md) - Future features and plans

## 🗺️ Roadmap

See our [Roadmap](ROADMAP.md) for planned features:

- v2.1.0 - Enhanced AI capabilities & multi-language support
- v2.2.0 - Collaboration features & peer practice
- v2.3.0 - Advanced analytics & ML improvements
- v3.0.0 - Enterprise edition with team features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google Gemini AI for powerful interview evaluation
- TensorFlow.js for ML capabilities
- The open-source community for amazing libraries
- All contributors and users for feedback and support

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/tejaslakshmangith/Smart_mock_interview/issues)
- **Discussions:** [GitHub Discussions](https://github.com/tejaslakshmangith/Smart_mock_interview/discussions)

## 🌟 Star History

If you find this project helpful, please consider giving it a star ⭐

---

**Made with ❤️ for interview preparation**

Last updated: November 2025