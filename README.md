# 🎨 Outfit Color Studio

> AI-powered outfit color analysis and palette recommendation web app.

Upload an outfit photo, select your skin tone and occasion — get intelligent, personalized color palettes in seconds.

---

## ✨ Features

- **Image Upload** — Drag-and-drop or click to upload outfit images (JPG, PNG, WEBP)
- **AI Color Extraction** — K-Means clustering extracts 6 dominant colors from your outfit
- **4 Palette Types** — Complementary, Analogous, Monochromatic, and Accent palettes
- **Skin Tone Aware** — Recommendations tailored to Fair, Medium, Olive, or Dark skin
- **Auto Skin Detection** — Upload a skin photo for automatic tone detection
- **Occasion Adaptive** — Palettes adjust for Casual, Office, Party, Wedding, Date, Festival
- **Colors to Avoid** — Flags clashing or unsuitable colors for your skin/occasion
- **Save Palettes** — Heart any palette to save it locally
- **Copy HEX/RGB** — Click any swatch to copy color codes to clipboard
- **Dark Mode** — Full dark/light mode toggle
- **Responsive** — Works beautifully on mobile and desktop

---

## 🗂 Project Structure

```
outfit-color-studio/
├── backend/
│   ├── main.py              # FastAPI app — color extraction, palette generation
│   ├── requirements.txt     # Python dependencies
│   └── start.sh             # Backend startup script
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Root component, layout, state management
│   │   ├── main.jsx         # React entry point
│   │   ├── components/
│   │   │   ├── Header.jsx         # Top bar with dark mode toggle
│   │   │   ├── ImageUpload.jsx    # Drag-and-drop image uploader
│   │   │   ├── Results.jsx        # Full results display
│   │   │   ├── ColorCard.jsx      # Individual color swatch card
│   │   │   ├── PaletteSection.jsx # Collapsible palette group
│   │   │   ├── SwatchDot.jsx      # Mini circular swatch
│   │   │   ├── LoadingSpinner.jsx # Animated loading state
│   │   │   └── SavedPalettes.jsx  # Saved palettes slide-over panel
│   │   ├── utils/
│   │   │   ├── api.js        # Axios API calls to backend
│   │   │   └── colors.js     # Color utilities (hex↔rgb, copy, save)
│   │   └── styles/
│   │       └── index.css     # Tailwind + custom styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── start.sh
│
├── start.sh                 # 🚀 Launch both servers together
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.9+**
- **Node.js 18+**
- **npm 9+**

### 1. Clone / unzip the project

```bash
cd outfit-color-studio
```

### 2. Start everything at once

```bash
chmod +x start.sh backend/start.sh frontend/start.sh
./start.sh
```

This will:
- Create a Python virtual environment
- Install Python dependencies
- Install Node.js dependencies
- Start the FastAPI backend on **port 8000**
- Start the Vite dev server on **port 3000**

### 3. Open the app

```
http://localhost:3000
```

API documentation (Swagger UI):
```
http://localhost:8000/docs
```

---

## 🔧 Manual Setup (Step by Step)

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 API Endpoints

| Method | Endpoint          | Description                          |
|--------|-------------------|--------------------------------------|
| GET    | `/`               | Health check                         |
| GET    | `/health`         | Health check JSON                    |
| POST   | `/api/analyze`    | Analyze outfit image, return palettes|
| POST   | `/api/detect-skin`| Detect skin tone from image          |

### `POST /api/analyze`

**Form fields:**

| Field        | Type   | Required | Description                             |
|--------------|--------|----------|-----------------------------------------|
| `outfit`     | File   | ✅       | Outfit image (JPG/PNG/WEBP, max 10MB)  |
| `skin_tone`  | String | ✅       | `Fair` / `Medium` / `Olive` / `Dark`   |
| `occasion`   | String | ✅       | `Casual` / `Office` / `Party` / `Wedding` / `Date` / `Festival` |
| `skin_image` | File   | ❌       | Optional skin photo for auto-detection  |

**Response:**

```json
{
  "skin_tone_detected": "Medium",
  "base_colors": [
    { "hex": "#4A6FA5", "name": "Cobalt Blue" },
    ...
  ],
  "skin_description": "Medium skin is versatile...",
  "styling_tip": "Stick to 2-3 colors max...",
  "palettes": {
    "complementary": {
      "name": "Power Pairing",
      "description": "...",
      "colors": [{ "hex": "#A5624A", "name": "Burnt Orange" }, ...]
    },
    "analogous": { ... },
    "monochromatic": { ... },
    "accent": { ... }
  },
  "avoid": {
    "colors": [{ "hex": "#FF00FF", "name": "Orchid" }],
    "reason": "These tones can clash with Medium skin..."
  }
}
```

---

## 🛠 Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | React 18 + Vite         |
| Styling   | Tailwind CSS v3         |
| Animation | Framer Motion           |
| HTTP      | Axios                   |
| Backend   | FastAPI (Python)        |
| Image ML  | Pillow + scikit-learn (K-Means) |
| Arrays    | NumPy                   |

---

## 🎨 Color Science

The backend uses:

- **K-Means Clustering** (scikit-learn) to find the 6 most dominant colors in an outfit image
- **HSL Color Space** for accurate harmony calculation
- **Complementary**: 180° hue rotation
- **Analogous**: ±15° and ±30° adjacent hues
- **Monochromatic**: Same hue, varied lightness and saturation
- **Accent**: Triadic 120° / 240° rotations for bold pops

---

## 📱 Screenshots

- Upload your outfit → see extracted base colors
- View 4 harmony palettes with names and style advice
- Click any swatch → copy HEX to clipboard
- Heart a palette → save it to local storage
- Toggle dark mode in the header

---

## 🪪 License

MIT — free to use, modify, and distribute.
