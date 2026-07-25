# Davide Paolino's Personal Academic Portfolio Website

This repository contains the source code for my personal academic portfolio website. It is built using [Astro](https://astro.build/) and vanilla CSS, featuring a responsive, clean, and modern design.

## 🚀 Key Features

*   **About Me & Research Interests**: An introduction to my research in the physics of active and disordered systems.
*   **Publications**: A dynamic bibliography rendered from a BibTeX source file (`src/data/papers.bib`) with abstract toggle dropdowns.
*   **Interactive CV**: A structured curriculum vitae parsed dynamically from a YAML file (`src/data/cv.yml`).
*   **Command Palette Search**: A modal dialog search engine accessible via `⌘K` or `Ctrl+K` to search pages and blog posts.
*   **Dark Mode**: A system-integrated theme switcher (light/dark mode).
*   **Blog**: A markdown/MDX-powered blog for sharing posts and research updates.

---

## 🛠️ Local Development & Quick Start Guide

Here are the commands you will need to manage the website locally. Always execute these from the root directory:

### 1. Installation
Installs all dependencies required by the project:
```bash
npm install
```

### 2. Run the Development Server
Starts the local development server with hot-reloading:
```bash
npm run dev
```
Once started, open your browser and navigate to `http://localhost:4321/` to view the site live.

### 3. Build for Production
Compiles the static website assets into the `./dist/` directory:
```bash
npm run build
```

### 4. Preview the Production Build Locally
Verify the production build before pushing to GitHub:
```bash
npm run preview
```

### 5. Deployment
The site is configured to deploy automatically to GitHub Pages using GitHub Actions whenever changes are pushed to the `main` branch. The configuration details can be found in `.github/workflows/deploy.yml`.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
