# Dilbert Comic Transcripts (1989-2023)

This repository contains accessible text transcripts of *Dilbert* comics spanning from 1989 to 2023. The comics were discontinued in 2023, and the official website was taken down. This project aims to preserve the text from each comic's "speech bubbles", making it accessible for fans, researchers, and anyone who relies on screen readers for text content.

## Project Structure

- **data/dilbert_comics_transcripts.json**: The source JSON file containing all comic metadata and transcripts (used by the split script).
- **public/comics-index.json**: Lightweight index file with dates, titles, and year references for fast initial loading.
- **public/comics-data/**: Year-based JSON files (1989.json through 2023.json) for lazy loading.
- **src/**: React application source code built with Vite, React, and Tailwind CSS.
- **public/**: Public assets including the split JSON data and images.
- **images/**: Local comic images organized by year (1989-2023).

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Build for production:
```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

Preview the production build:
```bash
npm run preview
```

## Deployment

This project is deployed to GitHub Pages at [https://varnham.net/dilbert-archive](https://varnham.net/dilbert-archive).

The deployment is automated via GitHub Actions. When you push to the `main` branch, the workflow will:
1. Build the production bundle
2. Deploy it to GitHub Pages

To deploy manually:
1. Build the project: `npm run build`
2. The `dist/` folder contains the production-ready files

### Regenerating Split JSON Files

If you make edits to the source JSON file (`data/dilbert_comics_transcripts.json`), regenerate the split files:

```bash
npm run split-json
```

This will:
- Read the source file from `data/dilbert_comics_transcripts.json`
- Generate year-based files in `public/comics-data/`
- Create/update `public/comics-index.json`

## Features

- **Full-text search**: Search through comic titles and transcripts with debounced input
- **Date picker**: Navigate to specific comics by date
- **Keyboard navigation**: Use arrow keys (← →) to navigate between comics
- **Image source toggle**: Switch between local images and original web archive URLs
- **Collapsible transcripts**: Transcripts are hidden by default and can be toggled
- **Responsive design**: Works on desktop and mobile devices
- **Accessibility**: ARIA labels, semantic HTML, and keyboard navigation support

## Accessibility

This project is optimized for accessibility:
- **ARIA Roles**: ARIA roles and landmarks are added to provide context to each comic transcript, ensuring smooth navigation for screen readers.
- **Time Tags**: Each comic's date is marked using the `<time>` tag, making it clear when each comic was originally published.
- **Keyboard Navigation**: Full keyboard support for navigation and interaction.
- **Original Image Links**: Links to the original images are included for reference through Archive.org, as the website hosting the comics is no longer available.

## Sample JSON Structure

The JSON structure used in this project is as follows:
```json
{
    "YYYY-MM-DD": {
        "image": "comic_image.gif",
        "originalimageurl": "https://archive.org/...",
        "title": "",
        "transcript": "Comic transcript text"
    }
}
