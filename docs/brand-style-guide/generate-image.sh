#!/bin/bash
# Usage: ./generate-image.sh "prompt text" "output-filename.png"
# Requires GEMINI_API_KEY env var

PROMPT="$1"
OUTPUT="$2"
IMGDIR="$(dirname "$0")/images"

RESPONSE=$(curl -s -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"contents\": [{\"parts\": [{\"text\": \"$PROMPT\"}]}],
    \"generationConfig\": {\"responseModalities\": [\"TEXT\", \"IMAGE\"]}
  }")

# Write response to temp file, then parse with node
TMPFILE=$(mktemp)
echo "$RESPONSE" > "$TMPFILE"

node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('$TMPFILE','utf8'));
if (data.error) { console.error('API Error:', data.error.message); process.exit(1); }
const parts = data.candidates?.[0]?.content?.parts || [];
const img = parts.find(p => p.inlineData);
if (img) {
  fs.writeFileSync('$IMGDIR/$OUTPUT', Buffer.from(img.inlineData.data, 'base64'));
  console.log('Saved: $IMGDIR/$OUTPUT');
} else {
  console.error('No image in response');
  const text = parts.find(p => p.text);
  if (text) console.error('Text response:', text.text.substring(0, 200));
  process.exit(1);
}
"

rm -f "$TMPFILE"
