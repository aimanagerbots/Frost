const fs = require('fs');
const path = require('path');
const https = require('https');

// Load API key from .env
const envPath = path.join(__dirname, '..', '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const apiKey = envContent.match(/GEMINI_API_KEY=(.+)/)?.[1]?.trim();
if (!apiKey) { console.error('No GEMINI_API_KEY found in .env'); process.exit(1); }

const IMGDIR = path.join(__dirname, 'images');
const MODEL = 'gemini-3-pro-image-preview';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const prompts = [
  {
    name: 'color-palette.png',
    prompt: 'A professional brand color palette card showing 5 color swatches in a horizontal row: sky blue #56C1E6, deep purple #764BA2, soft pink #F093FB, indigo #667EEA, and dark charcoal #1A1A2E. Clean minimal design, white background, hex codes beneath each swatch. Style: brand guidelines document, print quality.'
  },
  {
    name: 'ui-mockup.png',
    prompt: 'A sleek dark-themed dashboard UI mockup for an AI assistant app called Frost. Dark charcoal background (#1A1A2E), sky blue (#56C1E6) accent color, clean sidebar navigation with icons, card-based layout with rounded corners and subtle borders. Modern glassmorphism style with backdrop blur. Professional product screenshot, high fidelity.'
  },
  {
    name: 'logo-dark-bg.png',
    prompt: 'A geometric six-pointed snowflake logo mark in sky blue (#56C1E6) centered on a deep dark navy background (#0F0F1A). Clean, minimal, professional brand presentation. Subtle ambient glow around the snowflake. The snowflake has angular geometric shapes with hexagonal symmetry.'
  },
  {
    name: 'logo-light-bg.png',
    prompt: 'A geometric six-pointed snowflake logo mark in sky blue (#56C1E6) centered on a clean white background. Minimal, professional brand presentation with generous whitespace. The snowflake has angular geometric shapes with hexagonal symmetry.'
  },
  {
    name: 'brand-pattern.png',
    prompt: 'An abstract geometric pattern made of repeating snowflake-inspired shapes in a gradient from indigo #667EEA through purple #764BA2 to pink #F093FB. Dark background. Suitable as a brand texture or hero background. Subtle, elegant, not overwhelming.'
  },
  {
    name: 'typography.png',
    prompt: 'A professional typography specimen page showing the word FROST in a bold geometric sans-serif font at large size, with alphabet samples Aa Bb Cc and paragraph text below in a clean sans-serif. Sky blue heading on dark background. Brand guidelines style layout.'
  }
];

function generateImage(promptObj) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      contents: [{ parts: [{ text: promptObj.prompt }] }],
      generationConfig: { responseModalities: ['TEXT', 'IMAGE'] }
    });

    const url = new URL(`${ENDPOINT}?key=${apiKey}`);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error) { reject(new Error(`API Error: ${json.error.message}`)); return; }
          const parts = json.candidates?.[0]?.content?.parts || [];
          const img = parts.find(p => p.inlineData);
          if (img) {
            const outPath = path.join(IMGDIR, promptObj.name);
            fs.writeFileSync(outPath, Buffer.from(img.inlineData.data, 'base64'));
            console.log(`Saved: ${promptObj.name}`);
            resolve(outPath);
          } else {
            reject(new Error(`No image in response for ${promptObj.name}`));
          }
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log(`Generating ${prompts.length} images...`);
  // Run 2 at a time to avoid rate limits
  for (let i = 0; i < prompts.length; i += 2) {
    const batch = prompts.slice(i, i + 2);
    console.log(`\nBatch ${Math.floor(i/2) + 1}: ${batch.map(p => p.name).join(', ')}`);
    await Promise.all(batch.map(p => generateImage(p)));
  }
  console.log('\nAll images generated!');
}

main().catch(err => { console.error(err); process.exit(1); });
