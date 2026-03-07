import type {
  ContentPiece,
  ContentTemplate,
  SocialAccount,
  SocialPost,
  EmailCampaign,
  EmailTemplate,
  AIContentMessage,
  MarketingMetrics,
  ContentFilter,
  EmailCampaignFilter,
  EmailStats,
} from '@/modules/marketing/types';

function delay(ms = 350): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── CONTENT PIECES (25) ────────────────────────────────────────────────────

const contentPieces: ContentPiece[] = [
  // === PUBLISHED INSTAGRAM (8) ===
  {
    id: 'cp-001',
    title: 'Wedding Cake Drop Day',
    type: 'social-post',
    platform: 'instagram',
    status: 'published',
    content: 'The wait is over. Wedding Cake just dropped — dense, frosty buds with that sweet vanilla gas we all know and love. Now available at select retailers across WA.\n\n#WeddingCake #FrostFarms #WACannabis #PremiumFlower #CraftCannabis',
    imagePrompt: 'Close-up of dense, frosty cannabis buds with purple hues and orange pistils, vanilla cake and frosting elements subtly in background, dramatic studio lighting, dark moody background, professional product photography',
    tags: ['wedding-cake', 'flower', 'product-launch'],
    createdBy: 'Sarah Chen',
    aiGenerated: false,
    publishedDate: '2026-03-01',
    performance: { impressions: 3200, reach: 2800, engagement: 294, clicks: 142, conversions: 18, engagementRate: 9.2 },
  },
  {
    id: 'cp-002',
    title: 'Behind the Scenes: Trim Room Tuesday',
    type: 'social-post',
    platform: 'instagram',
    status: 'published',
    content: 'Trim Room Tuesday! Our team puts in the hours to make sure every bud is hand-trimmed to perfection. Quality is a process, not a shortcut.\n\n#TrimRoom #BehindTheScenes #CraftCannabis #FrostFarms #HandTrimmed',
    imagePrompt: 'Cannabis trim room with workers in clean white suits hand-trimming buds at stainless steel tables, warm overhead lighting, shallow depth of field, documentary style photography',
    tags: ['behind-the-scenes', 'team', 'process'],
    createdBy: 'Sarah Chen',
    aiGenerated: false,
    publishedDate: '2026-02-25',
    performance: { impressions: 2800, reach: 2400, engagement: 218, clicks: 89, conversions: 7, engagementRate: 7.8 },
  },
  {
    id: 'cp-003',
    title: 'Strain Spotlight: Blue Dream',
    type: 'social-post',
    platform: 'instagram',
    status: 'published',
    content: 'Strain Spotlight: Blue Dream\n\nA sativa-dominant hybrid that needs no introduction. Sweet berry aroma with earthy undertones. Our latest harvest is testing at 24.3% THC with a terpene profile heavy on myrcene and caryophyllene.\n\nAvailable in 3.5g and 7g jars.\n\n#BlueDream #StrainSpotlight #FrostFarms #Sativa #TerpeneProfile',
    imagePrompt: 'Professional cannabis product photography of Blue Dream strain in glass jar, blue and green color palette, berry and earth elements, clean white surface with soft shadows',
    tags: ['blue-dream', 'flower', 'strain-spotlight'],
    createdBy: 'Sarah Chen',
    aiGenerated: true,
    publishedDate: '2026-02-20',
    performance: { impressions: 4100, reach: 3600, engagement: 463, clicks: 198, conversions: 24, engagementRate: 11.3 },
  },
  {
    id: 'cp-004',
    title: 'Meet the Team: Jake from Sales',
    type: 'social-post',
    platform: 'instagram',
    status: 'published',
    content: 'Meet Jake, our Territory Manager for the Greater Seattle area. 3 years in cannabis, passionate about building real relationships with dispensary partners. Ask him about his favorite strain (hint: it involves cake).\n\n#MeetTheTeam #FrostFarms #CannabisIndustry #SeattleCannabis',
    tags: ['team', 'meet-the-team', 'culture'],
    createdBy: 'Sarah Chen',
    aiGenerated: false,
    publishedDate: '2026-02-18',
    performance: { impressions: 1900, reach: 1650, engagement: 118, clicks: 43, conversions: 3, engagementRate: 6.2 },
  },
  {
    id: 'cp-005',
    title: 'New Product Alert: Gelato Live Resin Cart',
    type: 'social-post',
    platform: 'instagram',
    status: 'published',
    content: 'NEW DROP: Gelato Live Resin Cartridge\n\nFull-spectrum live resin from fresh-frozen Gelato. No distillate, no cutting agents — just pure, flavorful vapor. The terps on this one are unreal.\n\n0.5g and 1g available now.\n\n#Gelato #LiveResin #Vaporizer #FrostFarms #FullSpectrum',
    imagePrompt: 'Sleek cannabis vape cartridge with gold hardware on dark marble surface, wisps of vapor, purple and green accent lighting, luxury product photography',
    tags: ['gelato', 'vaporizer', 'product-launch', 'live-resin'],
    createdBy: 'Marcus Johnson',
    aiGenerated: true,
    publishedDate: '2026-02-15',
    performance: { impressions: 3600, reach: 3100, engagement: 306, clicks: 167, conversions: 21, engagementRate: 8.5 },
  },
  {
    id: 'cp-006',
    title: 'Terpene Education: What is Myrcene?',
    type: 'social-post',
    platform: 'instagram',
    status: 'published',
    content: 'Terpene Talk: Myrcene\n\nThe most abundant terpene in cannabis. Found in mangoes, hops, and lemongrass. Known for its earthy, musky aroma with subtle fruity notes.\n\nOur strains highest in myrcene: Blue Dream, OG Kush, Granddaddy Purple.\n\n#TerpeneTuesday #Myrcene #CannabisEducation #FrostFarms',
    tags: ['education', 'terpenes', 'myrcene'],
    createdBy: 'Sarah Chen',
    aiGenerated: true,
    publishedDate: '2026-02-11',
    performance: { impressions: 2400, reach: 2100, engagement: 192, clicks: 78, conversions: 5, engagementRate: 8.0 },
  },
  {
    id: 'cp-007',
    title: 'Weekend Vibes: Frost Farm Tour',
    type: 'social-post',
    platform: 'instagram',
    status: 'published',
    content: 'Kicking off the weekend right with a walk through the garden. Room 3 is looking absolutely incredible — those Gelato plants are stacking up beautifully.\n\nHappy Friday from the Frost team!\n\n#FridayVibes #FrostFarms #GrowRoom #Gelato #CraftCannabis',
    tags: ['lifestyle', 'cultivation', 'friday'],
    createdBy: 'Marcus Johnson',
    aiGenerated: false,
    publishedDate: '2026-02-07',
    performance: { impressions: 2200, reach: 1900, engagement: 165, clicks: 56, conversions: 4, engagementRate: 7.5 },
  },
  {
    id: 'cp-008',
    title: 'Product Lineup: Spring Collection',
    type: 'social-post',
    platform: 'instagram',
    status: 'published',
    content: 'Spring is almost here and so is our freshest lineup yet. New strains, new formats, same Frost quality.\n\nFlower | Pre-Rolls | Live Resin Carts | Concentrates\n\nAsk your local dispensary about Frost.\n\n#SpringCollection #FrostFarms #NewStrains #WACannabis',
    tags: ['product-lineup', 'seasonal', 'spring'],
    createdBy: 'Sarah Chen',
    aiGenerated: false,
    publishedDate: '2026-02-03',
    performance: { impressions: 2900, reach: 2500, engagement: 232, clicks: 121, conversions: 14, engagementRate: 8.0 },
  },

  // === SCHEDULED (5) ===
  {
    id: 'cp-009',
    title: 'Strain Spotlight: OG Kush',
    type: 'social-post',
    platform: 'instagram',
    status: 'scheduled',
    content: 'Strain Spotlight: OG Kush\n\nThe legend. Earthy pine with a sour lemon twist. Our OG Kush is grown from heritage genetics — no shortcuts, no compromises. Testing at 26.1% THC.\n\n#OGKush #StrainSpotlight #FrostFarms #Heritage',
    imagePrompt: 'Dense green cannabis buds with amber trichomes, pine and lemon elements in composition, dark forest green background, professional macro photography',
    tags: ['og-kush', 'flower', 'strain-spotlight'],
    createdBy: 'Sarah Chen',
    aiGenerated: true,
    scheduledDate: '2026-03-10',
  },
  {
    id: 'cp-010',
    title: 'Team Highlight: Cultivation Crew',
    type: 'social-post',
    platform: 'instagram',
    status: 'scheduled',
    content: 'Our cultivation crew is the backbone of everything we do. From seed to harvest, these folks pour their expertise into every plant. Shoutout to the grow team!\n\n#GrowTeam #FrostFarms #CultivationCrew',
    tags: ['team', 'cultivation', 'culture'],
    createdBy: 'Marcus Johnson',
    aiGenerated: false,
    scheduledDate: '2026-03-12',
  },
  {
    id: 'cp-011',
    title: 'March Newsletter: What\'s New at Frost',
    type: 'email',
    platform: 'email',
    status: 'scheduled',
    content: 'Hi {{contact_name}},\n\nMarch is shaping up to be our biggest month yet. New strains dropping, vendor days scheduled, and some exciting news about our expansion.\n\nHere\'s what\'s new...',
    tags: ['newsletter', 'march', 'monthly'],
    createdBy: 'Sarah Chen',
    aiGenerated: true,
    scheduledDate: '2026-03-08',
    campaignId: 'ec-004',
  },
  {
    id: 'cp-012',
    title: 'Product Education: Live Resin vs Distillate',
    type: 'social-post',
    platform: 'multi',
    status: 'scheduled',
    content: 'Live Resin vs Distillate — what\'s the difference?\n\nLive Resin: Made from fresh-frozen flower. Full terpene profile. True-to-strain flavor.\n\nDistillate: Refined and purified. Higher THC. Neutral flavor.\n\nWe use live resin in all our carts because we believe flavor matters.\n\n#LiveResin #CannabisEducation #FrostFarms',
    tags: ['education', 'vaporizer', 'live-resin'],
    createdBy: 'Sarah Chen',
    aiGenerated: true,
    scheduledDate: '2026-03-14',
  },
  {
    id: 'cp-013',
    title: 'Vendor Day Announcement: Seattle',
    type: 'social-post',
    platform: 'facebook',
    status: 'scheduled',
    content: 'We\'re coming to Seattle! Join us for a vendor day at select dispensary partners. Meet the team, learn about our strains, and see what\'s new for Spring 2026.\n\nDates and locations coming soon. Stay tuned!\n\n#VendorDay #Seattle #FrostFarms',
    tags: ['vendor-day', 'events', 'seattle'],
    createdBy: 'Marcus Johnson',
    aiGenerated: false,
    scheduledDate: '2026-03-16',
  },

  // === DRAFTS (4) ===
  {
    id: 'cp-014',
    title: '420 Campaign Concept',
    type: 'social-post',
    platform: 'multi',
    status: 'draft',
    content: 'Working on 420 campaign concepts. Need to finalize messaging around "Frost 420 Collection" — limited edition packaging, special strain drops, and retailer bundles.',
    tags: ['420', 'campaign', 'seasonal'],
    createdBy: 'Sarah Chen',
    aiGenerated: false,
  },
  {
    id: 'cp-015',
    title: 'Sustainability Story',
    type: 'blog-draft',
    platform: 'website',
    status: 'draft',
    content: 'Draft blog post about Frost\'s sustainability practices — energy-efficient LED lighting, water reclamation, recyclable packaging, and our carbon offset program.',
    tags: ['sustainability', 'blog', 'brand-story'],
    createdBy: 'Marcus Johnson',
    aiGenerated: false,
  },
  {
    id: 'cp-016',
    title: 'Customer Testimonial: Greenfield Dispensary',
    type: 'social-post',
    platform: 'instagram',
    status: 'draft',
    content: '"Frost has been our go-to flower brand for over a year. Consistent quality, reliable delivery, and their sales team actually cares about our success." — Manager, Greenfield Dispensary',
    tags: ['testimonial', 'greenfield', 'partner'],
    createdBy: 'Sarah Chen',
    aiGenerated: false,
  },
  {
    id: 'cp-017',
    title: 'Product Description: Granddaddy Purple Pre-Roll',
    type: 'product-description',
    platform: 'website',
    status: 'draft',
    content: 'Granddaddy Purple Pre-Roll (1g)\n\nA classic indica with deep purple hues and a sweet, grape-forward aroma. Hand-rolled with 100% flower — no trim, no shake. Perfect for winding down after a long day.',
    tags: ['gdp', 'preroll', 'product-description'],
    createdBy: 'Sarah Chen',
    aiGenerated: true,
  },

  // === IDEAS (3) ===
  {
    id: 'cp-018',
    title: 'Reel: Day in the Life of a Grower',
    type: 'social-post',
    platform: 'instagram',
    status: 'idea',
    content: 'Video concept: Follow one of our cultivators through a full day — morning plant checks, nutrient mixing, environmental monitoring, harvest prep.',
    tags: ['video', 'reel', 'cultivation', 'behind-the-scenes'],
    createdBy: 'Marcus Johnson',
    aiGenerated: false,
  },
  {
    id: 'cp-019',
    title: 'Infographic: Seed to Sale',
    type: 'social-post',
    platform: 'multi',
    status: 'idea',
    content: 'Design an infographic showing the complete seed-to-sale journey of a Frost product: genetics selection → cultivation → harvest → processing → testing → packaging → distribution.',
    tags: ['infographic', 'education', 'process'],
    createdBy: 'Sarah Chen',
    aiGenerated: false,
  },
  {
    id: 'cp-020',
    title: 'Partner Spotlight Series',
    type: 'social-post',
    platform: 'instagram',
    status: 'idea',
    content: 'Monthly series featuring our dispensary partners — their story, their community, why they carry Frost. Builds B2B relationships and gives retailers visibility.',
    tags: ['partner-spotlight', 'series', 'b2b'],
    createdBy: 'Marcus Johnson',
    aiGenerated: false,
  },

  // === EMAIL CONTENT (5) ===
  {
    id: 'cp-021',
    title: 'Spring Flower Collection Launch Email',
    type: 'email',
    platform: 'email',
    status: 'published',
    content: 'Subject: Spring has sprung — and so have our newest strains\n\nHi {{contact_name}},\n\nOur Spring 2026 flower collection is here. Three new strains, fresh genetics, and the same quality your customers expect from Frost.\n\nNew this season:\n- Lemon Haze (Sativa, 23.8% THC)\n- Purple Punch (Indica, 25.1% THC)\n- Frost Cake (Hybrid, 27.4% THC — our new flagship)\n\nReady to place your order? Reply to this email or reach out to your rep.\n\nBest,\nThe Frost Team',
    tags: ['email', 'spring', 'product-launch'],
    createdBy: 'Sarah Chen',
    aiGenerated: true,
    publishedDate: '2026-02-28',
    campaignId: 'ec-002',
  },
  {
    id: 'cp-022',
    title: 'Reorder Reminder Email',
    type: 'email',
    platform: 'email',
    status: 'published',
    content: 'Subject: Time to restock? Your customers are waiting\n\nHi {{contact_name}},\n\nIt\'s been {{days_since_order}} days since your last Frost order. Based on your sell-through data, you may be running low on:\n\n{{low_stock_products}}\n\nDon\'t let your shelves go empty — your customers notice. Place your next order today.\n\n{{rep_name}}\nFrost Farms',
    tags: ['email', 'reorder', 'automated'],
    createdBy: 'Sarah Chen',
    aiGenerated: true,
    publishedDate: '2026-03-03',
    campaignId: 'ec-001',
  },
  {
    id: 'cp-023',
    title: 'Win-Back Email: We Miss You',
    type: 'email',
    platform: 'email',
    status: 'draft',
    content: 'Subject: It\'s been a while — let\'s reconnect\n\nHi {{contact_name}},\n\nWe noticed it\'s been a while since your last order. A lot has changed at Frost — new strains, improved packaging, and faster delivery times.\n\nWe\'d love to earn your business back. How about a sample pack of our latest drops?\n\nLet\'s chat,\n{{rep_name}}',
    tags: ['email', 'win-back', 'recovery'],
    createdBy: 'Marcus Johnson',
    aiGenerated: true,
    campaignId: 'ec-005',
  },
  {
    id: 'cp-024',
    title: 'Vendor Day Invitation Email',
    type: 'email',
    platform: 'email',
    status: 'published',
    content: 'Subject: You\'re invited — Frost Vendor Day in Seattle\n\nHi {{contact_name}},\n\nWe\'re hosting a vendor day at your location on {{event_date}}. Here\'s what to expect:\n\n- Product demos and samples of our Spring lineup\n- One-on-one time with your Frost rep\n- Exclusive vendor day pricing on select SKUs\n- Merchandising support and display setup\n\nPlease confirm your availability by replying to this email.\n\nSee you there,\n{{rep_name}}',
    tags: ['email', 'vendor-day', 'event-invitation'],
    createdBy: 'Sarah Chen',
    aiGenerated: false,
    publishedDate: '2026-02-22',
    campaignId: 'ec-007',
  },
  {
    id: 'cp-025',
    title: 'Q2 Product Preview Email',
    type: 'email',
    platform: 'email',
    status: 'draft',
    content: 'Subject: Sneak peek — what\'s coming in Q2\n\nHi {{contact_name}},\n\nQ2 is going to be big. Here\'s what we\'re working on:\n\n- 4 new flower strains\n- Expansion of our live resin cart line\n- New 10-pack pre-roll tins\n- Limited edition 420 packaging\n\nWant early access? Let your rep know and we\'ll get you samples before the official launch.\n\nStay frosty,\nThe Frost Team',
    tags: ['email', 'q2', 'preview', 'product-launch'],
    createdBy: 'Marcus Johnson',
    aiGenerated: true,
    campaignId: 'ec-006',
  },
];

// ─── CONTENT TEMPLATES (8) ──────────────────────────────────────────────────

const contentTemplates: ContentTemplate[] = [
  {
    id: 'ct-001',
    name: 'Strain Spotlight',
    type: 'social-post',
    description: 'Feature a specific strain with terpene profile, THC range, and effects.',
    promptTemplate: 'Write an Instagram caption for {{strain_name}}. Highlight: {{terpene_profile}}, {{thc_range}}, {{effects}}. Tone: educational but exciting. Include 3-5 relevant hashtags.',
  },
  {
    id: 'ct-002',
    name: 'Product Launch',
    type: 'social-post',
    description: 'Announce a new product with key details and availability.',
    promptTemplate: 'Write a product launch announcement for {{product_name}} ({{category}}, {{format}}). Key selling points: {{selling_points}}. Include pricing hint and where to find it. Tone: exciting, premium.',
  },
  {
    id: 'ct-003',
    name: 'Behind the Scenes',
    type: 'social-post',
    description: 'Share a look inside operations — trim room, grow rooms, packaging.',
    promptTemplate: 'Write a behind-the-scenes caption about {{area}} at Frost Farms. Highlight: {{interesting_detail}}. Tone: authentic, relatable. Show the human side of cannabis production.',
  },
  {
    id: 'ct-004',
    name: 'Educational Post',
    type: 'social-post',
    description: 'Teach followers about terpenes, cannabinoids, or cannabis science.',
    promptTemplate: 'Write an educational Instagram post about {{topic}}. Make it accessible to someone new to cannabis. Include 1-2 fun facts. Tone: informative, approachable. Reference Frost strains where relevant.',
  },
  {
    id: 'ct-005',
    name: 'Seasonal Promotion',
    type: 'social-post',
    description: 'Holiday or seasonal campaign content.',
    promptTemplate: 'Write a {{season_or_holiday}} themed caption for Frost Farms. Highlight seasonal products: {{products}}. Tone: festive but on-brand. Cannabis compliance: no medical claims, no consumption imagery.',
  },
  {
    id: 'ct-006',
    name: 'Repost / UGC',
    type: 'social-post',
    description: 'Share and credit dispensary partner content.',
    promptTemplate: 'Write a repost caption crediting {{partner_name}} for their post about Frost products. Show appreciation, tag them, and add a brief comment about the partnership. Keep it genuine.',
  },
  {
    id: 'ct-007',
    name: 'Email Newsletter',
    type: 'email',
    description: 'Weekly newsletter template with multiple sections.',
    promptTemplate: 'Write a weekly newsletter for Frost Farms B2B partners. Sections: 1) What\'s New ({{new_products}}), 2) Industry News ({{industry_topic}}), 3) Upcoming Events ({{events}}), 4) Reorder Reminder. Personalize with {{contact_name}}.',
  },
  {
    id: 'ct-008',
    name: 'Email Product Spotlight',
    type: 'email',
    description: 'Single product focus email for dispensary buyers.',
    promptTemplate: 'Write a product spotlight email for {{product_name}}. Include: strain details, test results, recommended retail pricing, current availability, and a clear CTA to order. Professional B2B tone.',
  },
];

// ─── AI CHAT CONVERSATIONS (3) ──────────────────────────────────────────────

const chatConversations: Record<string, AIContentMessage[]> = {
  'conv-001': [
    { id: 'msg-001', role: 'user', content: 'Make me an Instagram post about our Gelato strain', timestamp: '2026-03-05T10:00:00Z' },
    {
      id: 'msg-002',
      role: 'assistant',
      content: 'Here\'s an Instagram caption for Gelato:\n\n**Gelato by Frost Farms**\n\nSmooth, sweet, and absolutely stacked with trichomes. Our Gelato is a balanced hybrid that delivers a creamy, dessert-like flavor with every hit. Testing at 25.8% THC with a terpene profile rich in limonene and linalool.\n\nAvailable in 3.5g jars and 1g pre-rolls at select WA retailers.\n\n#Gelato #FrostFarms #CraftCannabis #WACannabis #HybridStrain #TerpeneRich\n\n---\n\nI can also suggest an image for this post:',
      timestamp: '2026-03-05T10:00:05Z',
      imagePrompt: 'Close-up of frosty purple cannabis buds with orange pistils, dramatic lighting, dark background, ice cream gelato colors in background accents, professional product photography',
      imageProvider: 'DALL-E',
    },
    { id: 'msg-003', role: 'user', content: 'Can you make it more casual and add emojis?', timestamp: '2026-03-05T10:01:00Z' },
    {
      id: 'msg-004',
      role: 'assistant',
      content: 'Here\'s a more casual version:\n\n**Gelato just hit different** 🍨✨\n\nCreamy, sweet, frosty AF. This balanced hybrid is what dessert dreams are made of. 25.8% THC and terps for days.\n\nGrab it in 3.5g jars or 1g pre-rolls before it\'s gone 🔥\n\n#Gelato #FrostFarms #CraftCannabis #WACannabis #Hybrid #Terps',
      timestamp: '2026-03-05T10:01:05Z',
    },
  ],
  'conv-002': [
    { id: 'msg-005', role: 'user', content: 'Write a product launch email for our new Live Rosin Cart', timestamp: '2026-03-04T14:00:00Z' },
    {
      id: 'msg-006',
      role: 'assistant',
      content: '**Subject:** Introducing Frost Live Rosin Carts — Solventless. Pure. Unmatched.\n\n**Preview text:** The cleanest vape experience in WA just arrived.\n\n---\n\nHi {{contact_name}},\n\nWe\'re excited to announce the newest addition to our vaporizer lineup: **Frost Live Rosin Cartridges**.\n\nMade from ice water hash pressed at low temperatures — no solvents, no additives, no compromises. Just pure, full-spectrum flavor that tastes exactly like the plant.\n\n**Available strains:**\n- Gelato (Hybrid, 78.2% THC)\n- Wedding Cake (Indica-leaning, 81.4% THC)\n- Blue Dream (Sativa, 76.8% THC)\n\n**Format:** 0.5g cartridge, 510-thread compatible\n\n**Wholesale pricing:** Contact your rep for volume pricing and introductory deals.\n\nThese are limited production — secure your allocation early.\n\nBest,\n{{rep_name}}\nFrost Farms',
      timestamp: '2026-03-04T14:00:05Z',
    },
  ],
  'conv-003': [
    { id: 'msg-007', role: 'user', content: 'Create 5 caption options for our trim room behind-the-scenes photo', timestamp: '2026-03-03T09:00:00Z' },
    {
      id: 'msg-008',
      role: 'assistant',
      content: 'Here are 5 caption options for your trim room photo:\n\n**Option 1 — Straightforward:**\n"Hand-trimmed, every single bud. No machines, no shortcuts. This is what craft cannabis looks like." #HandTrimmed #FrostFarms\n\n**Option 2 — Team-focused:**\n"Our trim team puts in 8 hours of precision work every day so you get the prettiest buds on the shelf. Respect the craft." #TrimTeam #CraftCannabis\n\n**Option 3 — Educational:**\n"Why hand-trim? Machine trimming is faster, but it strips trichomes and damages bud structure. We choose quality over speed, every time." #QualityFirst #FrostFarms\n\n**Option 4 — Casual/Fun:**\n"POV: You just walked into the Frost trim room and it smells absolutely incredible in here." #TrimRoom #BTS #FrostFarms\n\n**Option 5 — Behind-the-scenes narrative:**\n"This is where the magic happens. From harvest to hand-trim to cure — every step matters. Welcome to the trim room." #BehindTheScenes #SeedToSale',
      timestamp: '2026-03-03T09:00:05Z',
    },
  ],
};

// ─── SOCIAL ACCOUNTS (3) ────────────────────────────────────────────────────

const socialAccounts: SocialAccount[] = [
  {
    id: 'sa-001',
    platform: 'instagram',
    handle: '@frostfarms_wa',
    followers: 4200,
    following: 380,
    postsCount: 142,
    status: 'connected',
    lastPost: '2026-03-01',
    engagementRate: 8.1,
  },
  {
    id: 'sa-002',
    platform: 'facebook',
    handle: 'FrostFarmsWA',
    followers: 1800,
    following: 95,
    postsCount: 78,
    status: 'connected',
    lastPost: '2026-02-28',
    engagementRate: 3.2,
  },
  {
    id: 'sa-003',
    platform: 'twitter',
    handle: '@FrostFarms_WA',
    followers: 890,
    following: 210,
    postsCount: 234,
    status: 'pending',
    lastPost: '2026-02-20',
    engagementRate: 2.1,
  },
];

// ─── EMAIL CAMPAIGNS (8) ────────────────────────────────────────────────────

const emailCampaigns: EmailCampaign[] = [
  {
    id: 'ec-001',
    name: 'Weekly Dispatch #47',
    subject: 'Your weekly Frost update — new strains + reorder reminder',
    previewText: 'This week: Wedding Cake restock, Gelato Cart launch, and vendor day dates.',
    body: 'Newsletter body content...',
    audienceSegment: 'All Active Accounts',
    audienceSize: 2400,
    status: 'sent',
    sentDate: '2026-03-01',
    stats: { sent: 2400, delivered: 2340, bounced: 60, opened: 1008, clicked: 197, unsubscribed: 12, converted: 50, openRate: 42.0, clickRate: 8.2, conversionRate: 2.1, bounceRate: 2.5 },
  },
  {
    id: 'ec-002',
    name: 'Spring Flower Collection Launch',
    subject: 'Spring has sprung — and so have our newest strains',
    previewText: 'Three new strains, fresh genetics, and the same Frost quality.',
    body: 'Spring launch email body...',
    audienceSegment: 'Active + Engaged Inactive',
    audienceSize: 1800,
    status: 'sent',
    sentDate: '2026-02-28',
    stats: { sent: 1800, delivered: 1764, bounced: 36, opened: 918, clicked: 222, unsubscribed: 8, converted: 72, openRate: 51.0, clickRate: 12.4, conversionRate: 4.0, bounceRate: 2.0 },
  },
  {
    id: 'ec-003',
    name: 'New: Gelato Live Resin Cart',
    subject: 'Just dropped: Gelato Live Resin Cartridge',
    previewText: 'Full-spectrum live resin. No distillate. Pure flavor.',
    body: 'Gelato cart launch email body...',
    audienceSegment: 'Vaporizer Buyers',
    audienceSize: 2200,
    status: 'sent',
    sentDate: '2026-02-15',
    stats: { sent: 2200, delivered: 2156, bounced: 44, opened: 836, clicked: 150, unsubscribed: 6, converted: 38, openRate: 38.0, clickRate: 6.8, conversionRate: 1.7, bounceRate: 2.0 },
  },
  {
    id: 'ec-004',
    name: 'March Reorder Reminder',
    subject: 'Time to restock — your customers are waiting',
    previewText: 'Based on your sell-through data, you may be running low.',
    body: 'Reorder reminder body...',
    audienceSegment: 'Active Accounts (A1-A5)',
    audienceSize: 800,
    status: 'scheduled',
    scheduledDate: '2026-03-10',
  },
  {
    id: 'ec-005',
    name: 'Win-Back: We Miss You',
    subject: "It's been a while — let's reconnect",
    previewText: 'A lot has changed at Frost. New strains, faster delivery.',
    body: 'Win-back email body...',
    audienceSegment: 'Inactive Accounts (I3-I5)',
    audienceSize: 6,
    status: 'draft',
  },
  {
    id: 'ec-006',
    name: 'Q2 Product Preview',
    subject: 'Sneak peek — what\'s coming in Q2',
    previewText: 'New strains, new formats, limited edition 420 packaging.',
    body: 'Q2 preview email body...',
    audienceSegment: 'All Accounts',
    audienceSize: 2800,
    status: 'draft',
  },
  {
    id: 'ec-007',
    name: 'Vendor Day Invitation — Seattle',
    subject: "You're invited — Frost Vendor Day in Seattle",
    previewText: 'Product demos, exclusive pricing, and one-on-one time with your rep.',
    body: 'Vendor day invitation body...',
    audienceSegment: 'Seattle Territory',
    audienceSize: 45,
    status: 'sent',
    sentDate: '2026-02-22',
    stats: { sent: 45, delivered: 45, bounced: 0, opened: 28, clicked: 14, unsubscribed: 0, converted: 8, openRate: 62.0, clickRate: 31.1, conversionRate: 17.8, bounceRate: 0 },
  },
  {
    id: 'ec-008',
    name: 'Subject Line A/B Test',
    subject: 'Your March Reorder is Ready',
    previewText: 'Fresh stock available — order before it sells out.',
    body: 'A/B test email body...',
    audienceSegment: 'Active Accounts (A2-A4)',
    audienceSize: 600,
    status: 'sent',
    sentDate: '2026-02-25',
    stats: { sent: 600, delivered: 588, bounced: 12, opened: 252, clicked: 48, unsubscribed: 3, converted: 14, openRate: 42.0, clickRate: 8.0, conversionRate: 2.3, bounceRate: 2.0 },
    abTest: {
      variants: [
        { id: 'ab-a', subject: 'Your March Reorder is Ready', openRate: 44.0, clickRate: 9.2, winner: true },
        { id: 'ab-b', subject: "Don't miss these new strains 🌿", openRate: 38.0, clickRate: 6.8, winner: false },
      ],
    },
  },
];

// ─── EMAIL TEMPLATES (5) ────────────────────────────────────────────────────

const emailTemplates: EmailTemplate[] = [
  {
    id: 'et-001',
    name: 'Product Spotlight',
    category: 'Product',
    previewHtml: '<div style="background:#0F1219;color:#E2E8F0;padding:32px;font-family:system-ui"><h1 style="color:#EC4899">Product Spotlight</h1><p>Hero image area</p><h2>{{product_name}}</h2><p>{{product_description}}</p><p>THC: {{thc}} | Terpenes: {{terpenes}}</p><a style="background:#EC4899;color:white;padding:12px 24px;border-radius:8px;text-decoration:none">Order Now</a></div>',
  },
  {
    id: 'et-002',
    name: 'Weekly Newsletter',
    category: 'Newsletter',
    previewHtml: '<div style="background:#0F1219;color:#E2E8F0;padding:32px;font-family:system-ui"><h1 style="color:#EC4899">Frost Weekly</h1><hr style="border-color:#1A1F2E"/><h2>What\'s New</h2><p>{{section_1}}</p><h2>Industry News</h2><p>{{section_2}}</p><h2>Upcoming Events</h2><p>{{section_3}}</p></div>',
  },
  {
    id: 'et-003',
    name: 'Reorder Reminder',
    category: 'Sales',
    previewHtml: '<div style="background:#0F1219;color:#E2E8F0;padding:32px;font-family:system-ui"><h1 style="color:#F59E0B">Time to Restock</h1><p>Hi {{contact_name}},</p><p>Based on your order history, you may be running low on these products:</p><ul><li>{{product_1}}</li><li>{{product_2}}</li></ul><a style="background:#F59E0B;color:white;padding:12px 24px;border-radius:8px;text-decoration:none">Place Order</a></div>',
  },
  {
    id: 'et-004',
    name: 'Win-Back',
    category: 'Recovery',
    previewHtml: '<div style="background:#0F1219;color:#E2E8F0;padding:32px;font-family:system-ui"><h1 style="color:#EF4444">We Miss You</h1><p>Hi {{contact_name}},</p><p>It\'s been a while since your last Frost order. Here\'s what you\'ve been missing:</p><p>{{new_products}}</p><a style="background:#EF4444;color:white;padding:12px 24px;border-radius:8px;text-decoration:none">Request Samples</a></div>',
  },
  {
    id: 'et-005',
    name: 'Event Invitation',
    category: 'Events',
    previewHtml: '<div style="background:#0F1219;color:#E2E8F0;padding:32px;font-family:system-ui"><h1 style="color:#8B5CF6">You\'re Invited</h1><h2>{{event_name}}</h2><p>Date: {{event_date}}</p><p>Location: {{event_location}}</p><p>{{event_description}}</p><a style="background:#8B5CF6;color:white;padding:12px 24px;border-radius:8px;text-decoration:none">RSVP Now</a></div>',
  },
];

// ─── SOCIAL POSTS (derived from content pieces + extra data) ────────────────

function deriveSocialPosts(): SocialPost[] {
  return contentPieces
    .filter((cp) => cp.type === 'social-post' && cp.status === 'published')
    .map((cp) => ({
      ...cp,
      comments: Math.floor((cp.performance?.engagement ?? 0) * 0.3),
      shares: Math.floor((cp.performance?.engagement ?? 0) * 0.15),
      saves: Math.floor((cp.performance?.engagement ?? 0) * 0.1),
    }));
}

// ─── ENGAGEMENT CHART DATA (30 days) ────────────────────────────────────────

export function getEngagementData(): { date: string; instagram: number; facebook: number; twitter: number }[] {
  const data: { date: string; instagram: number; facebook: number; twitter: number }[] = [];
  const baseDate = new Date('2026-02-05');
  for (let i = 0; i < 30; i++) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + i);
    data.push({
      date: d.toISOString().split('T')[0],
      instagram: +(6 + Math.random() * 5 + Math.sin(i / 3) * 2).toFixed(1),
      facebook: +(2 + Math.random() * 2.5 + Math.sin(i / 4) * 1).toFixed(1),
      twitter: +(1 + Math.random() * 2 + Math.sin(i / 5) * 0.5).toFixed(1),
    });
  }
  return data;
}

// ─── LIST HEALTH TREND (6 months) ───────────────────────────────────────────

export function getListHealthTrend(): { month: string; subscribers: number }[] {
  return [
    { month: 'Oct', subscribers: 1950 },
    { month: 'Nov', subscribers: 2050 },
    { month: 'Dec', subscribers: 2180 },
    { month: 'Jan', subscribers: 2320 },
    { month: 'Feb', subscribers: 2500 },
    { month: 'Mar', subscribers: 2680 },
  ];
}

// ─── METRICS ────────────────────────────────────────────────────────────────

function computeMetrics(): MarketingMetrics {
  const published = contentPieces.filter((c) => c.status === 'published');
  const scheduled = contentPieces.filter((c) => c.status === 'scheduled');
  const drafts = contentPieces.filter((c) => c.status === 'draft' || c.status === 'idea');
  const socialPublished = published.filter((c) => c.type === 'social-post');
  const avgEng = socialPublished.length > 0
    ? socialPublished.reduce((sum, c) => sum + (c.performance?.engagementRate ?? 0), 0) / socialPublished.length
    : 0;
  const sentCampaigns = emailCampaigns.filter((c) => c.status === 'sent');
  const avgOpen = sentCampaigns.length > 0
    ? sentCampaigns.reduce((sum, c) => sum + (c.stats?.openRate ?? 0), 0) / sentCampaigns.length
    : 0;
  const avgClick = sentCampaigns.length > 0
    ? sentCampaigns.reduce((sum, c) => sum + (c.stats?.clickRate ?? 0), 0) / sentCampaigns.length
    : 0;
  const totalSent = sentCampaigns.reduce((sum, c) => sum + (c.stats?.sent ?? 0), 0);
  const totalFollowers = socialAccounts.reduce((sum, a) => sum + a.followers, 0);

  return {
    postsThisMonth: published.filter((c) => c.publishedDate && c.publishedDate >= '2026-03-01').length,
    scheduledCount: scheduled.length,
    draftsInPipeline: drafts.length,
    avgEngagementRate: +avgEng.toFixed(1),
    contentGapDays: 3,
    totalFollowers,
    emailsSentMTD: totalSent,
    avgOpenRate: +avgOpen.toFixed(1),
    avgClickRate: +avgClick.toFixed(1),
    activeCampaigns: emailCampaigns.filter((c) => c.status === 'scheduled' || c.status === 'sending').length,
    listHealth: 94,
    revenueAttributed: 48200,
  };
}

// ─── EXPORT FUNCTIONS ───────────────────────────────────────────────────────

export async function getContentPieces(filters?: ContentFilter): Promise<ContentPiece[]> {
  await delay();
  let result = [...contentPieces];
  if (filters?.status) result = result.filter((c) => c.status === filters.status);
  if (filters?.platform) result = result.filter((c) => c.platform === filters.platform);
  if (filters?.type) result = result.filter((c) => c.type === filters.type);
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    result = result.filter((c) => c.title.toLowerCase().includes(s) || c.content.toLowerCase().includes(s));
  }
  return result;
}

export async function getContentTemplates(): Promise<ContentTemplate[]> {
  await delay(250);
  return [...contentTemplates];
}

export async function getContentChat(conversationId?: string): Promise<AIContentMessage[]> {
  await delay(200);
  if (conversationId && chatConversations[conversationId]) {
    return [...chatConversations[conversationId]];
  }
  return chatConversations['conv-001'] ? [...chatConversations['conv-001']] : [];
}

export async function getSocialAccounts(): Promise<SocialAccount[]> {
  await delay(300);
  return [...socialAccounts];
}

export async function getSocialPosts(): Promise<SocialPost[]> {
  await delay(300);
  return deriveSocialPosts();
}

export async function getEmailCampaigns(filters?: EmailCampaignFilter): Promise<EmailCampaign[]> {
  await delay();
  let result = [...emailCampaigns];
  if (filters?.status) result = result.filter((c) => c.status === filters.status);
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    result = result.filter((c) => c.name.toLowerCase().includes(s) || c.subject.toLowerCase().includes(s));
  }
  return result;
}

export async function getEmailCampaign(id: string): Promise<EmailCampaign | undefined> {
  await delay(200);
  return emailCampaigns.find((c) => c.id === id);
}

export async function getEmailTemplates(): Promise<EmailTemplate[]> {
  await delay(250);
  return [...emailTemplates];
}

export async function getEmailStats(): Promise<EmailStats> {
  await delay(200);
  const sentCampaigns = emailCampaigns.filter((c) => c.stats);
  const totals = sentCampaigns.reduce(
    (acc, c) => ({
      sent: acc.sent + (c.stats?.sent ?? 0),
      delivered: acc.delivered + (c.stats?.delivered ?? 0),
      bounced: acc.bounced + (c.stats?.bounced ?? 0),
      opened: acc.opened + (c.stats?.opened ?? 0),
      clicked: acc.clicked + (c.stats?.clicked ?? 0),
      unsubscribed: acc.unsubscribed + (c.stats?.unsubscribed ?? 0),
      converted: acc.converted + (c.stats?.converted ?? 0),
    }),
    { sent: 0, delivered: 0, bounced: 0, opened: 0, clicked: 0, unsubscribed: 0, converted: 0 },
  );
  return {
    ...totals,
    openRate: totals.delivered > 0 ? +((totals.opened / totals.delivered) * 100).toFixed(1) : 0,
    clickRate: totals.opened > 0 ? +((totals.clicked / totals.opened) * 100).toFixed(1) : 0,
    conversionRate: totals.clicked > 0 ? +((totals.converted / totals.clicked) * 100).toFixed(1) : 0,
    bounceRate: totals.sent > 0 ? +((totals.bounced / totals.sent) * 100).toFixed(1) : 0,
  };
}

export async function getMarketingMetrics(): Promise<MarketingMetrics> {
  await delay(300);
  return computeMetrics();
}
