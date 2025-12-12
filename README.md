# Sketch'n'Solve

Sketch'n'Solve is a React-based application that allows users to draw mathematical expressions or notes on a canvas, calculate results from their sketches, and download their notes, including the rendered LaTeX equations. This project integrates **MathJax** for rendering LaTeX, **Gemini Flash 1.5** for backend result generation, and other tools for an interactive user experience.

---


## Try your own

Access the live hosted website using below url:

[https://sketchnsolvefrontend.vercel.app] (https://sketchnsolvefrontend.vercel.app)

Demo video for website guide: 
[Watch Demo Video](https://drive.google.com/file/d/1EPh3Yhqr6Uv0Zco8K_Ed50RjgeJOX4hr/view?usp=sharing)


## Features

### 🎨 Sketching Tools
- Draw on a canvas with multiple colors.
- Reset the canvas or erase parts of your sketch.

### 🧮 Math Solver
- Sketch mathematical expressions.
- Automatically process and calculate results using **Gemini Flash 1.5**.
- Render results as LaTeX expressions.

### 📄 Notes Download
- Export the canvas as a `.png` file.
- Accessible through a download icon on the canvas.

---

## Technologies Used

### Frontend:
- **React.js**: For the UI and component management.
- **TypeScript**: For type safety and better code maintainability.
- **Tailwind CSS**: For styling the application.
- **MathJax**: To render LaTeX equations.

### Backend:
- **Node.js** (API expected to be running on `http://localhost:3000`).
- **Gemini Flash 1.5**: For mathematical expression recognition and result generation.
- **Axios**: For making API requests.

### Additional Libraries:
- **Draggable**: To make the LaTeX expressions movable.

---

## Setup Instructions

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- Backend server running at `http://localhost:3000/calc`, integrated with **Gemini Flash 1.5**.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AdityaVankani/sketch-n-solve.git
   cd sketch-n-solve

2. Run locally
   ```bash
   npm run dev
   cd backend
   python3 main.py
   
