# Sai Kartik Ivaturi - Portfolio

Professional portfolio website showcasing software engineering expertise, featuring a vibrant gradient background and smooth animations.

## 🚀 Quick Start

### Option 1: Standalone HTML (No Installation Required)
Simply open `portfolio-standalone.html` in your web browser. This file works immediately without any setup!

### Option 2: React Development Setup

1. **Install Dependencies**
```bash
cd portfolio-react
npm install
```

2. **Run Development Server**
```bash
npm run dev
```

3. **Build for Production**
```bash
npm run build
```

## 📁 Project Structure

```
portfolio-react/
├── src/
│   ├── components/       # React components
│   │   ├── Navigation.jsx
│   │   ├── Hero.jsx
│   │   ├── Achievements.jsx
│   │   ├── Skills.jsx
│   │   ├── Experience.jsx
│   │   ├── Projects.jsx
│   │   ├── Certifications.jsx
│   │   ├── Education.jsx
│   │   ├── Contact.jsx
│   │   ├── Footer.jsx
│   │   ├── Background.jsx
│   │   └── styles.css
│   ├── App.jsx          # Main app component
│   ├── App.css          # App styles
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── index.html           # HTML template
├── package.json         # Dependencies
└── vite.config.js       # Build configuration
```

## 🎨 Design Features

### Color Palette
- **Primary**: White (#ffffff)
- **Accent**: Indigo (#6366f1) 
- **Highlight**: Purple (#8b5cf6)
- **Text**: Slate (#1e293b)

### Typography
- **Monospace**: IBM Plex Mono
- **Serif**: Spectral

### Animations
- Animated gradient background
- Floating gradient orbs
- Scroll-triggered reveals
- Interactive hover effects
- Smooth page transitions

## 📋 Sections

1. **Hero** - Strong opening with name and tagline
2. **Key Achievements** - Highlighted accomplishments
3. **Technical Skills** - Categorized expertise
4. **Professional Experience** - Work history timeline
5. **Featured Projects** - Research and development work
6. **Certifications** - AWS, Google Cloud, ServiceNow
7. **Education** - Academic background
8. **Contact** - Multiple contact methods

## 🛠️ Technologies

- **React 18** - UI library
- **Framer Motion** - Animation library
- **Lucide React** - Icon system
- **Vite** - Build tool
- **CSS3** - Styling with custom properties

## 📝 Customization

### Update Personal Information
Edit the following files:
- `src/components/Hero.jsx` - Name and title
- `src/components/Contact.jsx` - Contact details
- `src/components/Experience.jsx` - Work history
- `src/components/Projects.jsx` - Project details

### Change Colors
Modify CSS variables in `src/index.css`:
```css
:root {
  --color-accent: #6366f1;
  --color-highlight: #8b5cf6;
  /* Add your colors */
}
```

### Adjust Animations
Edit Framer Motion props in component files:
```jsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
```

## 🌐 Deployment

### Vercel
```bash
npm run build
vercel deploy
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### GitHub Pages
```bash
npm run build
# Push dist/ folder to gh-pages branch
```

## 📧 Contact

**Sai Kartik Ivaturi**
- Email: saikartik.iv@gmail.com
- Location: San Jose, California
- Phone: (213) 246-8105
- LinkedIn: [sai-kartik-ivaturi](https://linkedin.com/in/sai-kartik-ivaturi-958809183/)

## 📄 License

© 2024 Sai Kartik Ivaturi. All rights reserved.

---

Built with ❤️ using React and Framer Motion
