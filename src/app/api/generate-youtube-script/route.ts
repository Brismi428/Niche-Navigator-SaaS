import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// YouTube script generation system instruction
const SYSTEM_INSTRUCTION = `You are a professional YouTube content creator and script writer with expertise in creating engaging, high-performing video scripts.

Your goal is to create compelling YouTube video scripts that:
- Hook viewers in the first 3-5 seconds to prevent drop-off
- Maintain engagement throughout with storytelling and value delivery
- Are optimized for YouTube's algorithm and viewer retention
- Include strategic timestamps for key sections
- Incorporate clear calls-to-action and engagement prompts
- Match the specified tone and target audience
- Are formatted as production-ready HTML

Script Structure Guidelines:
1. HOOK (0:00-0:15): Attention-grabbing opening that promises value
2. INTRO (0:15-0:45): Brief introduction, channel reminder, what they'll learn
3. CONTENT SECTIONS: Main value delivery with clear transitions
4. ENGAGEMENT PROMPTS: Strategic asks for likes, comments, subscriptions
5. CONCLUSION: Summary of key points and final CTA
6. OUTRO: End screen suggestions, next video recommendations

Best Practices:
- Write in a conversational, spoken style (not formal written prose)
- Include [VISUAL CUES] for B-roll, graphics, or on-screen elements
- Add [PAUSE] markers for emphasis or transitions
- Use pattern interrupts to maintain attention
- Include personality and authenticity
- Optimize for 8-15 minute videos (YouTube's sweet spot)
- Add timestamps for easy navigation

Output Format - CRITICAL HTML FORMATTING RULES:
You MUST output clean, semantic HTML that renders beautifully for teleprompter use or script reading.

Required HTML structure:
1. TITLE: <h1>Video Title Here</h1>
2. TIMESTAMP SECTIONS: <h2>0:00 - Hook</h2>
3. SUB-SECTIONS: <h3>Key Takeaway</h3>
4. SPEAKING BLOCKS: <p>Script text here</p>
5. VISUAL CUES: <p><em>[VISUAL: B-roll description]</em></p>
6. EMPHASIS: Use <strong>CAPS</strong> for words to emphasize while speaking
7. Production notes: Use <em> for [VISUAL], [PAUSE], etc.

Example HTML structure:
"""
<h1>How to Master Content Creation in 30 Days</h1>

<h2>0:00 - Hook</h2>

<p>Hey what's up! <em>[VISUAL: Energetic opening shot]</em> Did you know that 90% of people struggle with this exact problem? Well today, I'm going to show you the <strong>SOLUTION</strong>.</p>

<h2>0:15 - Introduction</h2>

<p>Welcome back to the channel! If you're new here, I'm [Name] and I help you achieve [benefit]. Today's video is going to be <strong>GAME-CHANGING</strong> because...</p>

<p><em>[VISUAL: Channel logo animation]</em></p>

<h2>1:23 - First Main Point</h2>

<p>Let me break this down for you. The <strong>FIRST</strong> thing you need to understand is...</p>

<h3>Key Takeaway</h3>

<p>This is the crucial point that most people miss.</p>
"""

IMPORTANT RULES:
- Output ONLY the HTML content (no <html>, <head>, or <body> tags)
- Use semantic HTML5 tags
- Keep HTML clean and minimal (no inline styles or classes)
- Use <strong> for emphasis and CAPS words
- Use <em> for production cues like [VISUAL], [PAUSE]
- The HTML should paste perfectly into Google Docs, Notion, or script reading apps`;

interface GenerateYouTubeScriptRequest {
  topic: string;
  keywords: string;
  intent: string;
  angle: string;
  platforms: string;
}

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured. Please add GEMINI_API_KEY to your environment variables.' },
        { status: 503 }
      );
    }

    // Parse request body
    const body: GenerateYouTubeScriptRequest = await request.json();
    const { topic, keywords, intent, angle, platforms } = body;

    // Validate required fields
    if (!topic || !keywords || !intent || !angle) {
      return NextResponse.json(
        { error: 'Missing required fields: topic, keywords, intent, and angle are all required.' },
        { status: 400 }
      );
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    // Build user prompt
    const userPrompt = `Create a complete, engaging YouTube video script for the following:

Video Topic: ${topic}

Target Keywords (for SEO): ${keywords}

Viewer Intent: ${intent}

Unique Angle: ${angle}

Distribution Platforms: ${platforms}

Please generate a full YouTube video script as CLEAN HTML that:
1. Opens with a powerful hook in the first 5 seconds
2. Incorporates the target keywords naturally for SEO: ${keywords}
3. Addresses viewer intent: ${intent}
4. Uses this unique angle throughout: ${angle}
5. Includes timestamps for major sections (e.g., 0:00, 1:23, 3:45)
6. Contains [VISUAL: description] cues for B-roll, graphics, or screen recordings
7. Has strategic engagement prompts (like, comment, subscribe)
8. Maintains a conversational, authentic tone
9. Provides clear, actionable value to viewers
10. Ends with a strong call-to-action and next video suggestion

Target video length: 8-12 minutes

CRITICAL HTML FORMATTING REQUIREMENTS:
- Use <h1> for the video title
- Use <h2> for timestamp sections (e.g., <h2>0:00 - Hook</h2>)
- Use <h3> for sub-sections
- Wrap all speaking text in <p> tags
- Use <strong>CAPS</strong> for words to EMPHASIZE while speaking
- Use <em>[VISUAL: description]</em> for production notes
- Use <em>[PAUSE]</em> for pause markers
- NO wrapper tags (no <html>, <head>, <body>)
- NO inline styles or CSS classes
- Output ONLY the content HTML

The script should be ready to copy into teleprompter software or Google Docs.

Example output format:
<h1>Your Video Title Here</h1>

<h2>0:00 - Hook</h2>

<p>Hey what's up! <em>[VISUAL: Energetic opening]</em> Today I'm going to show you something <strong>INCREDIBLE</strong>...</p>

<h2>0:30 - Introduction</h2>

<p>Welcome back! If you're new here, smash that subscribe button...</p>`;

    // Call Gemini API
    const result = await model.generateContent(userPrompt);
    const response = result.response;
    const content = response.text();

    // Return generated content
    return NextResponse.json({ content }, { status: 200 });

  } catch (error) {
    console.error('Error generating YouTube script:', error);

    // Provide user-friendly error messages
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      {
        error: 'Failed to generate YouTube script. Please try again.',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
