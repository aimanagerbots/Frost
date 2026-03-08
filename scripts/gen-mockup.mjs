import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const BRAND_DIR = resolve(ROOT, "assets", "brand");

// Load .env
const envText = readFileSync(resolve(ROOT, ".env"), "utf8");
for (const line of envText.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eq = trimmed.indexOf("=");
  if (eq > 0) process.env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
}

const PROMPT = `Create a professional mobile website mockup for a premium cannabis brand called "FROST".

REFERENCE LAYOUT (inspired by smokekind.com mobile):
The layout follows a vertical mobile scroll with distinct full-width sections.

BRANDING:
- Logo: A geometric blue snowflake icon (the Frost snowflake — a six-pointed crystalline snowflake in #5BB8E6 frost blue)
- Brand name: "FROST" in clean, bold sans-serif typography
- Tagline: "Premium Cannabis, Elevated"

COLOR PALETTE (strict — no other colors):
- Background: #F5F5F5 light gray
- Cards: #FFFFFF white with subtle shadow
- Accent: #5BB8E6 frost blue (buttons, links, highlights)
- Dark sections: #111111 near-black
- Text: #000000 on light, #FFFFFF on dark
- Secondary text: #666666 gray
- NO orange, NO purple, NO pink, NO rainbow colors

TYPOGRAPHY:
- Headings: Bold geometric sans-serif (like Space Grotesk or Nunito)
- Body: Clean sans-serif (like Inter or Plus Jakarta Sans)
- All caps for section labels, mixed case for descriptions

SECTIONS (top to bottom):

1. STICKY HEADER
- White bar with frost blue snowflake logo on left, "FROST" wordmark, hamburger menu icon on right
- Clean, minimal, no clutter

2. HERO SECTION
- Full-width lifestyle photo of premium cannabis (close-up of frosty trichomes on a bud, cinematic lighting)
- Large overlay text: "Premium Cannabis, Elevated" in white bold sans-serif
- Frost blue "Shop Now" button with white text, rounded corners
- Subtle dark gradient overlay on the photo for text readability

3. CATEGORY CARDS ROW
- Horizontal scroll of 4 rounded cards
- Each card: lifestyle photo background with white text overlay
- Categories: "Flower", "Edibles", "Vapes", "Pre-Rolls"
- Cards have subtle frost blue border on hover/active state
- White background behind the row

4. FEATURED PRODUCTS SECTION
- Section header: "Staff Picks" in bold, with frost blue underline accent
- 2x2 grid of product cards on white background
- Each card: product photo, product name in black, price in frost blue, "Add to Cart" ghost button
- Clean, minimal cards with rounded corners and light shadow

5. ABOUT/STORY SECTION
- Dark background (#111111)
- Left-aligned text: "Our Story" header in white
- Body text in #999 gray describing the brand
- A single round-cropped lifestyle photo on the right (cannabis greenhouse, natural light)
- Frost blue "Learn More" text link

6. BLOG SECTION
- Light gray background
- "From the Journal" section header
- 2 blog post cards: photo on top, title below, date in gray
- Clean white cards with subtle shadow

7. NEWSLETTER CTA
- Frost blue background (#5BB8E6)
- White text: "Stay Frosty" as headline
- White subtitle: "Get exclusive deals and new arrivals"
- White-bordered email input field with "Subscribe" button (white bg, frost blue text)

8. FOOTER
- Dark (#111111) footer
- Frost snowflake logo centered, small
- Nav links in gray: Shop, About, Blog, Contact, FAQ
- Social media icons in a row
- "© 2026 Frost Cannabis" in small gray text

OVERALL REQUIREMENTS:
- This must look like a real, polished mobile website screenshot — not a wireframe
- Premium, clean, modern aesthetic — think Aesop, Apple, or Glossier level of polish
- The ONLY color accent is frost blue #5BB8E6 — everything else is black, white, gray
- Generous whitespace between sections
- Rounded corners on all cards and buttons (16px radius)
- The frost snowflake logo should be clearly visible in the header
- Mobile viewport: 375px wide, long vertical scroll
- Photorealistic lifestyle photos, not illustrations`;

async function run() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    console.log("ERROR: OPENAI_API_KEY not set in .env");
    process.exit(1);
  }

  console.log("Generating Frost website mockup with OpenAI gpt-image-1...");
  console.log("This may take 30-60 seconds.\n");

  const resp = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt: PROMPT,
      n: 1,
      size: "1024x1536",
      quality: "high",
    }),
  });

  const data = await resp.json();
  if (data.error) {
    console.log("OpenAI error:", data.error.message);
    process.exit(1);
  }

  if (data.data[0].b64_json) {
    const buf = Buffer.from(data.data[0].b64_json, "base64");
    const out = resolve(BRAND_DIR, "frost-website-mockup-v2.png");
    writeFileSync(out, buf);
    console.log(`Saved: ${out}`);
    console.log(`Size: ${(buf.length / 1024 / 1024).toFixed(2)} MB`);
  } else if (data.data[0].url) {
    const imgResp = await fetch(data.data[0].url);
    const buf = Buffer.from(await imgResp.arrayBuffer());
    const out = resolve(BRAND_DIR, "frost-website-mockup-v2.png");
    writeFileSync(out, buf);
    console.log(`Saved: ${out}`);
    console.log(`Size: ${(buf.length / 1024 / 1024).toFixed(2)} MB`);
  }
}

run().catch((e) => {
  console.log("Error:", e.message);
  process.exit(1);
});
