"""Generate Frost brand swatch using DALL-E and Gemini APIs."""
import os, json, base64, urllib.request, sys

# Load env
from pathlib import Path
env_path = Path(__file__).resolve().parent.parent / ".env"
for line in env_path.read_text().splitlines():
    line = line.strip()
    if line and not line.startswith("#") and "=" in line:
        k, v = line.split("=", 1)
        os.environ[k.strip()] = v.strip()

PROMPT = (
    "Brand identity swatch board for 'Frost', a dark-themed AI-powered cannabis operations platform. "
    "Clean modern brand board on near-black background (#08090F). Organized in a grid with clear sections. "
    "TOP LEFT: Bold geometric six-pointed snowflake icon in sky-blue (#56B8DE) next to the word FROST in "
    "wide-tracked uppercase sans-serif, also sky-blue. Show both the full wordmark and the standalone snowflake icon. "
    "TOP RIGHT: Color palette as large rounded-rectangle swatches with hex codes beneath each: "
    "#08090F (Base Black), #0F1219 (Card Dark), #1A1F2E (Elevated), #667EEA (Accent Indigo), "
    "#764BA2 (Accent Purple), #F093FB (Accent Pink), #56B8DE (Logo Cyan), #C8D0E0 (Body Silver), "
    "#00E5A0 (Success Green), #FBBF24 (Warning Amber), #FB7185 (Danger Rose). "
    "Also show the brand gradient as a wide horizontal bar: from #667EEA through #764BA2 to #F093FB. "
    "BOTTOM LEFT: Typography specimens. Heading: 'Frost Operations' in bold white, large sans-serif. "
    "Body: 'AI-powered cannabis platform with long-term RAG memory' in silver (#C8D0E0), medium sans-serif. "
    "Code: 'queryFn: fetchInventory()' in muted blue-gray (#6B7A99), small monospace. "
    "BOTTOM RIGHT: A small UI card mockup on #0F1219 background with rounded corners, thin #1A1F2E border, "
    "indigo (#667EEA) accent bar at top, white title text, silver body text, small green (#00E5A0) status badge. "
    "Style: ultra-clean, minimal, professional brand board. Flat design, no 3D. Dark mode throughout. "
    "Generous whitespace. Cold, precise, premium aesthetic."
)

BRAND_DIR = Path(__file__).resolve().parent.parent / "assets" / "brand"

def gen_dalle():
    print("Generating with DALL-E 3...")
    key = os.environ.get("OPENAI_API_KEY")
    if not key:
        print("ERROR: OPENAI_API_KEY not set"); return
    body = json.dumps({
        "model": "dall-e-3",
        "prompt": PROMPT,
        "n": 1,
        "size": "1792x1024",
        "quality": "hd"
    }).encode()
    req = urllib.request.Request(
        "https://api.openai.com/v1/images/generations",
        data=body,
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {key}"}
    )
    try:
        resp = urllib.request.urlopen(req, timeout=120)
        data = json.loads(resp.read())
        url = data["data"][0]["url"]
        img = urllib.request.urlopen(url, timeout=60).read()
        out = BRAND_DIR / "frost-brand-swatch-dalle.png"
        out.write_bytes(img)
        print(f"Saved DALL-E image: {out} ({len(img)} bytes)")
    except Exception as e:
        print(f"DALL-E error: {e}")
        if hasattr(e, 'read'):
            print(e.read().decode())

def gen_gemini():
    print("Generating with Gemini Imagen...")
    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        print("ERROR: GEMINI_API_KEY not set"); return
    body = json.dumps({
        "contents": [{"parts": [{"text": "Generate an image: " + PROMPT}]}],
        "generationConfig": {"responseModalities": ["TEXT", "IMAGE"]}
    }).encode()
    req = urllib.request.Request(
        f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key={key}",
        data=body,
        headers={"Content-Type": "application/json"}
    )
    try:
        resp = urllib.request.urlopen(req, timeout=120)
        data = json.loads(resp.read())
        parts = data.get("candidates", [{}])[0].get("content", {}).get("parts", [])
        saved = False
        for part in parts:
            if "inlineData" in part:
                img = base64.b64decode(part["inlineData"]["data"])
                out = BRAND_DIR / "frost-brand-swatch-gemini.png"
                out.write_bytes(img)
                print(f"Saved Gemini image: {out} ({len(img)} bytes)")
                saved = True
            elif "text" in part:
                print(f"Gemini text: {part['text'][:200]}")
        if not saved:
            print("No image in Gemini response")
            print(json.dumps(data, indent=2)[:500])
    except Exception as e:
        print(f"Gemini error: {e}")
        if hasattr(e, 'read'):
            print(e.read().decode())

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "both"
    if target in ("dalle", "both"):
        gen_dalle()
    if target in ("gemini", "both"):
        gen_gemini()
