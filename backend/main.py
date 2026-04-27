"""
Outfit Color Studio — FastAPI Backend
Compatible with Python 3.9 – 3.14 and numpy 1.x / 2.x
"""
from __future__ import annotations

import colorsys
import io
from typing import Optional

import numpy as np
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
from sklearn.cluster import KMeans

app = FastAPI(title="Outfit Color Studio API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────────
# Color Math Helpers
# ─────────────────────────────────────────────

def hex_to_rgb(hex_color: str) -> tuple:
    h = hex_color.lstrip("#")
    return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)


def rgb_to_hex(r, g, b) -> str:
    r_, g_, b_ = (max(0, min(255, int(round(float(v))))) for v in (r, g, b))
    return f"#{r_:02X}{g_:02X}{b_:02X}"


def rgb_to_hsl(r: int, g: int, b: int) -> tuple:
    # colorsys returns HLS order
    h, l, s = colorsys.rgb_to_hls(r / 255.0, g / 255.0, b / 255.0)
    return h * 360.0, s * 100.0, l * 100.0   # H, S, L


def hsl_to_rgb(h: float, s: float, l: float) -> tuple:
    r, g, b = colorsys.hls_to_rgb(h / 360.0, l / 100.0, s / 100.0)
    return int(r * 255), int(g * 255), int(b * 255)


def cs(v: float) -> float:   # clamp saturation
    return max(0.0, min(100.0, v))


def cl(v: float) -> float:   # clamp lightness
    return max(5.0, min(95.0, v))


def get_color_name(hex_color: str) -> str:
    r, g, b = hex_to_rgb(hex_color)
    h, s, l = rgb_to_hsl(r, g, b)

    if s < 12:
        if l > 80: return "Soft White"
        if l > 50: return "Warm Gray"
        if l > 25: return "Slate"
        return "Charcoal"

    if l > 85:   prefix = "Pastel "
    elif l < 20: prefix = "Deep "
    elif s < 30: prefix = "Muted "
    else:        prefix = ""

    for threshold, name in [
        (15,"Crimson Red"),(35,"Burnt Orange"),(55,"Golden Amber"),
        (75,"Chartreuse"),(105,"Olive Green"),(150,"Emerald Green"),
        (185,"Teal"),(210,"Sky Blue"),(250,"Cobalt Blue"),
        (280,"Violet"),(315,"Orchid"),(345,"Rose Pink"),(361,"Crimson Red"),
    ]:
        if h < threshold:
            return prefix + name
    return prefix + "Crimson Red"


# ── Palette generators ──────────────────────────────────────

def generate_complementary(h, s, l):
    ch = (h + 180) % 360
    return [
        rgb_to_hex(*hsl_to_rgb(ch,             cs(s+10), l)),
        rgb_to_hex(*hsl_to_rgb(ch,             s,        cl(l+15))),
        rgb_to_hex(*hsl_to_rgb(ch,             cs(s-10), cl(l-15))),
        rgb_to_hex(*hsl_to_rgb((ch+30)%360,   s,        l)),
    ]

def generate_analogous(h, s, l):
    return [
        rgb_to_hex(*hsl_to_rgb((h-30)%360, s,       l)),
        rgb_to_hex(*hsl_to_rgb((h-15)%360, cs(s+5), cl(l+5))),
        rgb_to_hex(*hsl_to_rgb((h+15)%360, cs(s+5), cl(l+5))),
        rgb_to_hex(*hsl_to_rgb((h+30)%360, s,       l)),
    ]

def generate_monochromatic(h, s, l):
    return [
        rgb_to_hex(*hsl_to_rgb(h, s,        cl(l+30))),
        rgb_to_hex(*hsl_to_rgb(h, cs(s-15), cl(l+15))),
        rgb_to_hex(*hsl_to_rgb(h, cs(s+10), cl(l-15))),
        rgb_to_hex(*hsl_to_rgb(h, cs(s+20), cl(l-30))),
    ]

def generate_accent(h, s, l):
    return [
        rgb_to_hex(*hsl_to_rgb((h+120)%360, cs(s+20), l)),
        rgb_to_hex(*hsl_to_rgb((h+240)%360, cs(s+20), l)),
        rgb_to_hex(*hsl_to_rgb((h+60)%360,  cs(s+30), cl(l+10))),
    ]


# ── Lookup tables ───────────────────────────────────────────

_AVOID = {
    "Fair":   {"Casual":["#FFFFE0","#F5F5DC"],"Office":["#FF00FF","#FF69B4"],
               "Party":["#808080","#A9A9A9"],"Wedding":["#FF0000","#000000"],
               "Date":["#808080","#8B4513"],"Festival":["#000000","#808080"]},
    "Medium": {"Casual":["#FFFFE0","#FFFFF0"],"Office":["#FF00FF","#00FF00"],
               "Party":["#808080","#A9A9A9"],"Wedding":["#FF0000","#FF69B4"],
               "Date":["#808080","#D2B48C"],"Festival":["#808080","#D2B48C"]},
    "Olive":  {"Casual":["#FFD700","#FFFF00"],"Office":["#FF00FF","#00FFFF"],
               "Party":["#808080","#C0C0C0"],"Wedding":["#FF0000","#FFFF00"],
               "Date":["#808080","#FFFF00"],"Festival":["#C0C0C0","#808080"]},
    "Dark":   {"Casual":["#000080","#00008B"],"Office":["#8B0000","#800000"],
               "Party":["#808080","#696969"],"Wedding":["#808080","#A9A9A9"],
               "Date":["#808080","#696969"],"Festival":["#000000","#1C1C1C"]},
}

_NAMES = {
    "complementary":{"Casual":"Weekend Contrast","Office":"Power Pairing",
                     "Party":"Electric Duo","Wedding":"Timeless Contrast",
                     "Date":"Romantic Contrast","Festival":"Bold Fusion"},
    "analogous":    {"Casual":"Easy Harmony","Office":"Refined Blend",
                     "Party":"Sunset Flow","Wedding":"Graceful Gradient",
                     "Date":"Warm Embrace","Festival":"Boho Flow"},
    "monochromatic":{"Casual":"Tonal Ease","Office":"Polished Suite",
                     "Party":"Sleek Monotone","Wedding":"Ethereal Layers",
                     "Date":"Subtle Allure","Festival":"Earthy Layers"},
    "accent":       {"Casual":"Pop & Play","Office":"Statement Touch",
                     "Party":"Shimmer Accents","Wedding":"Luxe Highlights",
                     "Date":"Flirty Pops","Festival":"Jewel Sparks"},
}

_SKIN_DESC = {
    "Fair":   "Fair skin glows with cool-toned and jewel-toned colors. Soft pastels and dusty roses add delicacy.",
    "Medium": "Medium skin is versatile — warm earthy tones, terracotta, and rich jewel tones are especially flattering.",
    "Olive":  "Olive skin pairs beautifully with warm ambers, rich greens, burgundy, and deep teal.",
    "Dark":   "Deep skin tones radiate in vibrant jewel tones, rich earth hues, and bold bright colors.",
}

_TIPS = {
    "Casual":   "Keep it relaxed — mix textures rather than clashing prints. One statement color is enough.",
    "Office":   "Stick to 2–3 colors max. A well-fitted neutral base with one accent color signals confidence.",
    "Party":    "Evening light loves metallic accents. One bold pop of color against a neutral base is showstopping.",
    "Wedding":  "Opt for elegant, non-competing colors. Avoid white or ivory if attending as a guest.",
    "Date":     "Warm, flattering tones feel intimate. A subtle statement piece beats head-to-toe bold.",
    "Festival": "Layering complementary tones with earthy textures creates an effortlessly chic boho look.",
}


# ─────────────────────────────────────────────
# Image Processing  (numpy 1.x + 2.x compatible)
# ─────────────────────────────────────────────

def process_image(image_bytes: bytes, n_colors: int = 6) -> list:
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img.thumbnail((200, 200), Image.Resampling.LANCZOS)

    # Use np.asarray — works in numpy 1.x and 2.x
    arr    = np.asarray(img, dtype=np.float64)
    pixels = arr.reshape(-1, 3)

    # Filter near-white / near-black
    r, g, b = pixels[:, 0], pixels[:, 1], pixels[:, 2]
    mask    = ~(
        ((r > 230) & (g > 230) & (b > 230)) |
        ((r < 20)  & (g < 20)  & (b < 20))
    )
    filtered = pixels[mask]
    if len(filtered) < n_colors:
        filtered = pixels

    km      = KMeans(n_clusters=n_colors, random_state=42, n_init=10, max_iter=200)
    km.fit(filtered)

    centers = km.cluster_centers_
    # np.bincount accepts any integer array in both numpy versions
    counts      = np.bincount(km.labels_.astype(int), minlength=n_colors)
    sorted_idx  = np.argsort(-counts)
    centers     = centers[sorted_idx]

    return [rgb_to_hex(c[0], c[1], c[2]) for c in centers]


def detect_skin_tone(image_bytes: bytes) -> str:
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img.thumbnail((100, 100), Image.Resampling.LANCZOS)

    arr    = np.asarray(img, dtype=np.float64)
    pixels = arr.reshape(-1, 3)

    r, g, b    = pixels[:, 0], pixels[:, 1], pixels[:, 2]
    skin_mask  = (r > 60) & (g > 40) & (b > 20) & (r > g) & (r > b) & ((r - g) > 10)
    sp         = pixels[skin_mask]

    if len(sp) < 10:
        return "Medium"

    brightness = float(sp.mean())
    if brightness > 180: return "Fair"
    if brightness > 130: return "Medium"
    if brightness > 90:  return "Olive"
    return "Dark"


# ─────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "Outfit Color Studio API is running 🎨", "version": "2.0.0"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/analyze")
async def analyze_outfit(
    outfit:     UploadFile           = File(...),
    skin_tone:  str                  = Form("Medium"),
    occasion:   str                  = Form("Casual"),
    skin_image: Optional[UploadFile] = File(None),
):
    try:
        outfit_bytes = await outfit.read()
        if len(outfit_bytes) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Image too large (max 10 MB)")

        detected_skin = skin_tone
        if skin_image and skin_image.filename:
            detected_skin = detect_skin_tone(await skin_image.read())

        base_colors = process_image(outfit_bytes, n_colors=6)
        r, g, b     = hex_to_rgb(base_colors[0])
        h, s, l     = rgb_to_hsl(r, g, b)

        def wn(hexes):
            return [{"hex": c, "name": get_color_name(c)} for c in hexes]

        avoid_hexes = _AVOID.get(detected_skin, {}).get(occasion, ["#808080","#FFFFFF"])

        result = {
            "skin_tone_detected": detected_skin,
            "base_colors":        wn(base_colors),
            "skin_description":   _SKIN_DESC.get(detected_skin, ""),
            "styling_tip":        _TIPS.get(occasion, ""),
            "palettes": {
                "complementary": {
                    "name":        _NAMES["complementary"].get(occasion, "Complementary"),
                    "description": f"High-contrast pairing that flatters {detected_skin} skin in a {occasion} setting.",
                    "colors":      wn(generate_complementary(h, s, l)),
                },
                "analogous": {
                    "name":        _NAMES["analogous"].get(occasion, "Analogous"),
                    "description": f"Harmonious adjacent hues that flow naturally — perfect for a {occasion.lower()} look.",
                    "colors":      wn(generate_analogous(h, s, l)),
                },
                "monochromatic": {
                    "name":        _NAMES["monochromatic"].get(occasion, "Monochromatic"),
                    "description": f"Tonal variations of the same hue for a cohesive {occasion.lower()} outfit.",
                    "colors":      wn(generate_monochromatic(h, s, l)),
                },
                "accent": {
                    "name":        _NAMES["accent"].get(occasion, "Accent"),
                    "description": f"Bold triadic pops to elevate your {occasion.lower()} ensemble.",
                    "colors":      wn(generate_accent(h, s, l)),
                },
            },
            "avoid": {
                "colors": wn(avoid_hexes),
                "reason": (
                    f"These tones can clash with {detected_skin} skin "
                    f"or feel out of place for a {occasion} occasion."
                ),
            },
        }
        return JSONResponse(content=result)

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Processing error: {exc}") from exc


@app.post("/api/detect-skin")
async def detect_skin(skin_image: UploadFile = File(...)):
    try:
        tone = detect_skin_tone(await skin_image.read())
        return {"skin_tone": tone, "description": _SKIN_DESC.get(tone, "")}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
