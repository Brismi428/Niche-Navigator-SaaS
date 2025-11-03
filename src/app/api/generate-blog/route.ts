import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Blog post generation system instruction
const SYSTEM_INSTRUCTION = `You are a professional content writer and SEO expert specializing in creating high-quality, engaging blog posts.

Your goal is to create comprehensive, well-structured blog posts that:
- Are SEO-optimized with natural keyword integration
- Engage readers with compelling storytelling and valuable insights
- Follow proper blog post structure (introduction, body sections, conclusion)
- Include actionable takeaways and clear calls-to-action
- Match the specified tone and target audience
- Are formatted in Markdown for easy publishing

Guidelines:
1. Start with an attention-grabbing introduction that hooks the reader
2. Use clear section headings (H2, H3) for scannability
3. Integrate keywords naturally throughout the content
4. Include practical examples, tips, or case studies where relevant
5. Write in an engaging, conversational style that maintains professionalism
6. End with a strong conclusion and clear call-to-action
7. Aim for 1200-1800 words for comprehensive coverage
8. Use bullet points and numbered lists for better readability

Output Format:
Provide the complete blog post in Markdown format, ready to publish.`;

interface GenerateBlogRequest {
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
    const body: GenerateBlogRequest = await request.json();
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
    const userPrompt = `Create a comprehensive, SEO-optimized blog post for the following topic:

**Topic:** ${topic}

**Target Keywords:** ${keywords}

**Search Intent:** ${intent}

**Unique Angle:** ${angle}

**Target Platforms:** ${platforms}

Please generate a complete blog post that:
1. Incorporates the target keywords naturally throughout
2. Addresses the search intent (${intent})
3. Uses the unique angle to differentiate the content: ${angle}
4. Is formatted in clean Markdown with proper headings
5. Includes an engaging introduction, well-structured body sections, and a compelling conclusion
6. Provides actionable value to readers
7. Is optimized for ${platforms}

The blog post should be ready to publish and approximately 1200-1800 words.`;

    // Call Gemini API
    const result = await model.generateContent(userPrompt);
    const response = result.response;
    const content = response.text();

    // Return generated content
    return NextResponse.json({ content }, { status: 200 });

  } catch (error) {
    console.error('Error generating blog post:', error);

    // Provide user-friendly error messages
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      {
        error: 'Failed to generate blog post. Please try again.',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
