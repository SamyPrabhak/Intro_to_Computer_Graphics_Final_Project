# Intro_to_Computer_Graphics_Final_Project
# 🔮 Tarot Card Motion Poster

The goal of this project is to design and implement a motion-based tarot card
reveal rendering system that recreates a stylized “tarot card motion poster”
animation using Three.js.
Traditional tarot aesthetics are enhanced with digital effects such as glow sweep,
animated textures, and cinematic 3D card flip.

## Features

- Interactive 3D Card Flip - Smooth Y-axis rotation with texture swapping
- Floating Idle Animation - Gentle hover effect when at rest
- Glow Sweep Effect - Moving gradient that sweeps across the portrait
- Gold Aura - Soft radial gradient background
- Wink Animation - Character briefly closes eyes
- Auto-Return Sequence - Card flips back after animation completes
- Fully Responsive - Adapts to any screen size with high DPI support

## Project Goals

### Artistic Objectives
- Create visually appealing hand-illustrated tarot card set
- Maintain cohesive India-inspired color palette
- Design decorative card back and character portraits (eyes open/closed)
- Prepare assets in Procreate with proper rendering formats

### Technical Objectives
- Build WebGL rendering pipeline using Three.js
- Implement texture loading and 2D transformations
- Create interactive event-driven animations
- Develop 3D card object with smooth flip mechanics
- Add special effects exclusive to portrait side
- Ensure controlled animation sequencing
- Deliver full-screen responsive experience

### Prerequisites

- Modern web browser with WebGL support
- Local development server (recommended: [VS Code Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer))

### Architecture Overview

#### Rendering Engine
Built on Three.js for:
- High-performance WebGL rendering
- Simple texture and material management
- Seamless 3D transformations

Uses `PerspectiveCamera` and `WebGLRenderer` for depth simulation and visual quality.

#### Texture Pipeline
Three hand-drawn PNG assets
const textures = {
  back: 'tarot_back.png',        // Decorative design
  front: 'tarot_front.png',      // Portrait (eyes open)
  wink: 'tarot_front_WINK.png'   // Portrait (eyes closed)
};

// Forced sRGB color space for accuracy
texture.encoding = THREE.sRGBEncoding;

### Key Features Explained
####  Card Flip Mechanism
- Y-axis rotation with Tween.js easing
- Texture swap at 50% rotation point
- Single-interaction locking prevents concurrent flips

####  Glow Sweep Effect
- Rendered on 2D canvas overlay
- Linear gradient mask technique
- `requestAnimationFrame` for smooth 60fps motion
- Horizontal sweep across portrait

####  Gold Aura
- Static radial gradient behind card
- Provides soft ambient illumination

####  Color Accuracy
- sRGB texture encoding
- Minimal lighting to prevent wash-out
- Careful material configuration

## Asset Creation

All artwork hand-illustrated using:
- Software: Procreate on iPad
- Color Palette: India-inspired swatches
- Export Format: PNG with transparency
- Variations: 3 unique textures (back, front, wink)

## Acknowledgments

- Illustrations: Hand-drawn original artwork
- 3D Engine: [Three.js](https://threejs.org/)
- Animation Library: [Tween.js](https://github.com/tweenjs/tween.js/)
- Inspiration: Traditional tarot aesthetics with digital enhancement

## Video Demo 
- https://drive.google.com/file/d/1zfAeWZ1tI4iQY7ESBawIUJ_LMFCBkxbO/view?usp=sharing
