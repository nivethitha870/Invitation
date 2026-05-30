# The Grand Digital Wedding Experience

A world-class ultra-premium royal wedding invitation website built with HTML, CSS, JavaScript, GSAP, and Three.js.

## Features

- Cinematic dark intro with golden tagline fade-in
- Royal envelope opening animation with wax seal break
- Luxury invitation card with parallax and line-by-line reveals
- Interactive storybook with page-turn effects
- Masonry photo gallery with fullscreen lightbox
- Glassmorphism countdown timer
- Scroll-animated wedding events timeline
- Google Maps venue section with Save the Date (.ics download)
- Guest wishes wall with confetti and floating cards
- Starry finale with fireworks and couple silhouette
- Three.js golden particle background
- GSAP scroll animations throughout
- Custom cursor glow and mouse trail particles
- Floating roses and gold sparkles
- Background music controls (theme + temple bells)
- Fully responsive and mobile-optimized

## Quick Start

No build step or `npm install` required. This is pure HTML/CSS/JS.

1. Open the `wedding-invitation` folder in Cursor or your file explorer.
2. Double-click `index.html`, or use a local server:

```bash
# Python
cd wedding-invitation
python -m http.server 8080

# Node (if you have npx)
npx serve .
```

3. Visit `http://localhost:8080` in your browser.

> **Tip:** Use a local server instead of `file://` for best audio and map behavior.

## Customize

### Names, date, and venue

Edit the `CONFIG` object at the top of `script.js`:

```javascript
const CONFIG = {
  bride: 'Dharanya',
  groom: 'Gijendra Prasath',
  monogram: 'G&D',
  weddingDate: '2026-09-16T18:00:00',
  weddingDateDisplay: '16 September 2026',
  venue: 'Adithyan Kalyana Mandapam',
  address: 'Kannampalayam Road, Ranganathapuram, Sulur, Coimbatore 641402',
};
```

Also update names in `index.html` (invitation card, finale section) if needed.

### Photos

Replace SVG placeholders in `assets/images/` with your photos (same filenames, `.jpg` or `.webp`):

| File | Purpose |
|------|---------|
| `bride.jpg` | Bride portrait |
| `groom.jpg` | Groom portrait |
| `gallery1.jpg` | Gallery image 1 |
| `gallery2.jpg` | Gallery image 2 |
| `gallery3.jpg` | Gallery image 3 |

Update `src` attributes in `index.html` from `.svg` to `.jpg` after adding photos.

### Music

Add MP3 files to `assets/music/` (see `assets/music/README.txt`):

- `wedding-theme.mp3` — Background music
- `bells.mp3` — Temple bells ambient
- `chime.mp3` — Envelope open sound (optional)
- `page-flip.mp3` — Storybook page turn (optional)

### Google Map

Replace the `iframe` `src` in the Venue section with your venue's Google Maps embed URL.

### Storybook content

Edit the text inside each `.book-page` in `index.html`.

### Timeline events

Edit `.timeline-item` blocks in `index.html`.

## Color Palette

| Name | Hex |
|------|-----|
| Royal Gold | `#D4AF37` |
| Deep Maroon | `#5B0E2D` |
| Ivory White | `#FFF8E7` |
| Black | `#0A0A0A` |

## Typography

- **Playfair Display** — Body and elegant text
- **Cinzel** — Royal headings and labels
- **Great Vibes** — Script names

Loaded via Google Fonts CDN.

## Dependencies (CDN)

- [GSAP 3.12](https://greensock.com/gsap/) + ScrollTrigger + ScrollToPlugin
- [Three.js r128](https://threejs.org/)

## Folder Structure

```
wedding-invitation/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    ├── images/     ← Photos (SVG placeholders included)
    ├── music/      ← MP3 audio files
    └── videos/     ← Optional background.mp4
```

## Browser Support

Chrome, Firefox, Safari, Edge (latest). WebGL required for Three.js particles (gracefully skipped on reduced-motion / mobile).

## License

Free to use and customize for personal wedding invitations.

---

*Crafted with love for your forever moment.* ❤️
