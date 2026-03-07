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

// Focused color swatch prompt with text-accuracy techniques
const COLOR_SWATCH_PROMPT = [
  'Intended use: professional brand color palette swatch for a design system document.',
  '',
  'Layout: A clean grid of color swatches on a dark background, color #08090F.',
  'Each swatch is a large rounded rectangle filled with the exact color.',
  'Below each swatch, the hex code is printed in a small sans-serif font.',
  '',
  'Row 1 — Backgrounds (3 swatches):',
  '  Swatch 1: fill #08090F, label "#08090F" and "Base"',
  '  Swatch 2: fill #0F1219, label "#0F1219" and "Card"',
  '  Swatch 3: fill #1A1F2E, label "#1A1F2E" and "Elevated"',
  '',
  'Row 2 — Accents (4 swatches):',
  '  Swatch 4: fill #667EEA, label "#667EEA" and "Indigo"',
  '  Swatch 5: fill #764BA2, label "#764BA2" and "Purple"',
  '  Swatch 6: fill #F093FB, label "#F093FB" and "Pink"',
  '  Swatch 7: fill #56B8DE, label "#56B8DE" and "Frost Cyan"',
  '',
  'Row 3 — Text colors (3 swatches):',
  '  Swatch 8: fill #FFFFFF, label "#FFFFFF" and "Bright"',
  '  Swatch 9: fill #C8D0E0, label "#C8D0E0" and "Default"',
  '  Swatch 10: fill #6B7A99, label "#6B7A99" and "Muted"',
  '',
  'Row 4 — Status colors (4 swatches):',
  '  Swatch 11: fill #00E5A0, label "#00E5A0" and "Success"',
  '  Swatch 12: fill #FBBF24, label "#FBBF24" and "Warning"',
  '  Swatch 13: fill #FB7185, label "#FB7185" and "Danger"',
  '  Swatch 14: fill #38BDF8, label "#38BDF8" and "Info"',
  '',
  'Below all swatches, show one wide horizontal gradient bar from #667EEA through #764BA2 to #F093FB, labeled "Brand Gradient".',
  '',
  'Constraints:',
  '- Each color swatch must be exactly the hex color specified — no approximation.',
  '- All text must be crisp, legible, and correctly spelled.',
  '- Flat design only. No shadows, no 3D, no reflections.',
  '- Dark swatches (#08090F, #0F1219, #1A1F2E) should have a thin white/gray border so they are visible against the dark background.',
  '- Generous spacing between swatches. Clean, minimal, professional.',
].join('\n');

async function genOpenAI() {
  console.log("Generating with GPT Image 1.5...");
  const key = process.env.OPENAI_API_KEY;
  if (!key) { console.log("ERROR: OPENAI_API_KEY not set"); return; }

  const resp = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt: COLOR_SWATCH_PROMPT,
      n: 1,
      size: "1536x1024",
      quality: "high",
    }),
  });
  const data = await resp.json();
  if (data.error) { console.log("OpenAI error:", data.error.message); return; }

  // gpt-image-1 returns b64_json by default
  if (data.data[0].b64_json) {
    const buf = Buffer.from(data.data[0].b64_json, "base64");
    const out = resolve(BRAND_DIR, "frost-color-swatch-openai.png");
    writeFileSync(out, buf);
    console.log(`Saved OpenAI image: ${out} (${buf.length} bytes)`);
  } else if (data.data[0].url) {
    const imgResp = await fetch(data.data[0].url);
    const buf = Buffer.from(await imgResp.arrayBuffer());
    const out = resolve(BRAND_DIR, "frost-color-swatch-openai.png");
    writeFileSync(out, buf);
    console.log(`Saved OpenAI image: ${out} (${buf.length} bytes)`);
  }
}

async function genGemini() {
  console.log("Generating with Gemini...");
  const key = process.env.GEMINI_API_KEY;
  if (!key) { console.log("ERROR: GEMINI_API_KEY not set"); return; }

  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Generate an image:\n\n" + COLOR_SWATCH_PROMPT }] }],
        generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
      }),
    }
  );
  const data = await resp.json();
  if (data.error) { console.log("Gemini error:", data.error.message); return; }

  const parts = data.candidates?.[0]?.content?.parts || [];
  let saved = false;
  for (const part of parts) {
    if (part.inlineData) {
      const buf = Buffer.from(part.inlineData.data, "base64");
      const out = resolve(BRAND_DIR, "frost-color-swatch-gemini.png");
      writeFileSync(out, buf);
      console.log(`Saved Gemini image: ${out} (${buf.length} bytes)`);
      saved = true;
    } else if (part.text) {
      console.log("Gemini text:", part.text.slice(0, 200));
    }
  }
  if (!saved) {
    console.log("No image in Gemini response");
    console.log(JSON.stringify(data).slice(0, 500));
  }
}

async function genIdeogram() {
  console.log("Generating with Ideogram 3...");
  const key = process.env.IDEOGRAM_API_KEY;
  if (!key) { console.log("ERROR: IDEOGRAM_API_KEY not set"); return; }

  const resp = await fetch("https://api.ideogram.ai/generate", {
    method: "POST",
    headers: {
      "Api-Key": key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image_request: {
        prompt: COLOR_SWATCH_PROMPT,
        model: "V_2",
        magic_prompt_option: "OFF",
        aspect_ratio: "ASPECT_3_2",
        style_type: "DESIGN",
      },
    }),
  });
  const data = await resp.json();
  if (data.error || !data.data) {
    console.log("Ideogram error:", JSON.stringify(data).slice(0, 500));
    return;
  }

  const url = data.data[0]?.url;
  if (url) {
    const imgResp = await fetch(url);
    const buf = Buffer.from(await imgResp.arrayBuffer());
    const out = resolve(BRAND_DIR, "frost-color-swatch-ideogram.png");
    writeFileSync(out, buf);
    console.log(`Saved Ideogram image: ${out} (${buf.length} bytes)`);
  }
}

const GENERATORS = { openai: genOpenAI, gemini: genGemini, ideogram: genIdeogram };
const target = process.argv[2] || "all";
const tasks = [];

if (target === "all") {
  tasks.push(...Object.values(GENERATORS).map(fn => fn()));
} else {
  for (const name of target.split(",")) {
    const fn = GENERATORS[name.trim()];
    if (fn) tasks.push(fn());
    else console.log(`Unknown generator: ${name}. Options: ${Object.keys(GENERATORS).join(", ")}`);
  }
}

await Promise.all(tasks);
