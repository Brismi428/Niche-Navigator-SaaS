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
- Are formatted as clean, readable prose for easy recording

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

Output Format:
CRITICAL: Output ONLY formatted prose - a clean, readable script with:
- Title at the top (ALL CAPS or emphasized with spacing)
- Timestamps in plain text (like "0:00 - Hook")
- TWO blank lines before each major section with timestamps
- Natural paragraph breaks for each speaking section
- [VISUAL CUES] in brackets for production notes
- Section headings on their own lines (NO Markdown symbols like # or **)
- ONE blank line between speaking paragraphs
- Display-ready content that can be read directly while recording

DO NOT use Markdown formatting symbols. Write as if creating a finished script with clear visual hierarchy through spacing.`;

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

Please generate a full YouTube video script that:
1. Opens with a powerful hook in the first 5 seconds
2. Incorporates the target keywords naturally for SEO: ${keywords}
3. Addresses viewer intent: ${intent}
4. Uses this unique angle throughout: ${angle}
5. Includes timestamps for major sections (e.g., 0:00, 1:23, 3:45)
6. Contains [VISUAL CUES] for B-roll, graphics, or screen recordings
7. Has strategic engagement prompts (like, comment, subscribe)
8. Maintains a conversational, authentic tone
9. Provides clear, actionable value to viewers
10. Ends with a strong call-to-action and next video suggestion

Target video length: 8-12 minutes

IMPORTANT: Output only formatted prose text with clear visual structure:
- Title at the top (ALL CAPS or emphasized with spacing)
- TWO blank lines before each timestamp section
- Timestamps in plain text format (0:00 - Hook) as section headers
- Natural paragraph breaks for speaking sections
- ONE blank line between speaking paragraphs
- [VISUAL CUES] in brackets
- Clear visual hierarchy through strategic spacing
- Ready for the creator to read directly while recording

The script should be ready to record immediately with obvious section breaks.`;

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
