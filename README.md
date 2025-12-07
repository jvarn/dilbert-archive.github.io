# Dilbert Text Archive
<strong>Unofficial, non-commercial, fan-made text transcripts to support accessibility and research.</strong>

This repository contains text-only transcripts of Dilbert comics published between 1989 and 2023.
The project is intended as a research and accessibility resource, especially for:
- Screen reader users
- Text search / indexing
- Natural language processing (NLP) experiments
- Sentiment analysis
- Fans and scholars interested in studying the dialogue and themes across the comic’s run

The Dilbert website was discontinued in 2023, and many legacy archives are incomplete or difficult to navigate.
This project aims to preserve the text content of the comics — not the artwork — so that it remains available for educational and analytical purposes.

## Purpose of This Project

This is a personal learning and accessibility project, created while learning:
- web scraping and archival methods,
- OCR pipelines for extracting speech bubble text,
- dataset creation and cleaning,
- building accessible reader interfaces,
- and applying AI techniques such as sentiment analysis.

The public repository exists so that others who are learning similar techniques may benefit from the dataset structure, tooling, and viewer interface.

No images are hosted in this repository or on the deployed site.
Where comic artwork appears, it is referenced only by direct links to existing public copies on archive.org.
These transcripts may contain minor OCR or manual-entry inaccuracies; they are not intended to replace the original artwork or official publications.

## Copyright and Fair Use Notice

Dilbert, its characters, artwork, and original dialogue are copyrighted by their respective rights-holders.

This project is:
- Unofficial
- Non-commercial
- Fan-made
- Intended solely for accessibility, research, and educational use
- Limited to text-only transcripts drawn from publicly available archival copies of the comics.
- Not a substitute for any official publication, collection, or licensed product

No claim of ownership is made over the original creative work.
All rights belong to their respective holders.

## Takedown Requests

If you are a copyright holder or authorised agent and would like any content in this repository or its deployed demo removed, please open an issue or contact me, and I will promptly comply with any legitimate takedown request.

This project is maintained in good faith, with respect for the creators and rights-holders.

## Project Structure

- **data/dilbert_comics_transcripts.json**: The source JSON file containing all comic metadata and transcripts (used by the split script).
- **public/comics-index.json**: Lightweight index file with dates, titles, and year references for fast initial loading.
- **public/comics-data/**: Year-based JSON files (1989.json through 2023.json) for lazy loading.
- **src/**: React application source code built with Vite, React, and Tailwind CSS.
- **public/**: Public assets including the split JSON data and images.
- **images/**: Optional local reference images for development only (not used in the public deployment).

## How the Transcripts Were Created

The transcripts were produced using a multi-step process:
1. Collecting comic image URLs from archive.org
2. OCR extraction using <a href="https://github.com/jvarn/macos-comic-ocr">custom macOS Vision-based scripts</a>
3. Manual correction of OCR errors
4. Structuring the output into a uniform JSON dataset
5. Building an accessible React-based viewer
6. Optimising for performance

This pipeline is published here for transparency and reproducibility.

## Using the Dataset for Research

The dataset is especially suitable for:
- Sentiment analysis
- Topic modeling
- Dialogue evolution over time
- Sociolinguistic studies
- Accessibility research
- Text mining

If you use the dataset for academic purposes, please acknowledge the original Dilbert creators and this open-source archive.

## License

This project’s code is open-source.
The transcripts are derivative of copyrighted works and are provided strictly for non-commercial, educational, and accessibility purposes.

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
