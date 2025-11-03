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
- Are formatted as production-ready HTML

Guidelines:
1. Start with an attention-grabbing introduction that hooks the reader
2. Use clear section headings for scannability
3. Integrate keywords naturally throughout the content
4. Include practical examples, tips, or case studies where relevant
5. Write in an engaging, conversational style that maintains professionalism
6. End with a strong conclusion and clear call-to-action
7. Aim for 1200-1800 words for comprehensive coverage
8. Use bullet points and numbered lists for better readability

Output Format - CRITICAL HTML FORMATTING RULES:
You MUST output clean, semantic HTML that renders beautifully in any CMS (WordPress, Medium, Ghost, etc.).

Required HTML structure:
1. TITLE: <h1>Title Here</h1>
2. MAJOR SECTIONS: <h2>Step 1: Section Title</h2>
3. SUB-SECTIONS: <h3>Subsection Title</h3>
4. PARAGRAPHS: <p>Paragraph text here</p>
5. BOLD/EMPHASIS: <strong>important text</strong>
6. BULLET LISTS: <ul><li>Item one</li><li>Item two</li></ul>
7. NUMBERED LISTS: <ol><li>First item</li><li>Second item</li></ol>

Example HTML structure:
"""
<h1>The Complete Guide to Content Marketing Success</h1>

<p>Are you struggling to create content that resonates with your audience? You're not alone. This comprehensive guide will walk you through everything you need to know about building a <strong>successful content marketing strategy</strong>.</p>

<h2>Step 1: Understanding Your Audience</h2>

<p>Before creating any content, you need to deeply understand who you're creating it for. This foundational step will inform every decision you make.</p>

<h3>Conducting Audience Research</h3>

<p>Start by gathering data about your target audience using these methods:</p>

<ul>
<li>Surveys and questionnaires</li>
<li>Social media analytics</li>
<li>Customer interviews</li>
<li>Website behavior analysis</li>
</ul>

<p>The insights you gain here will become the <strong>foundation</strong> of your entire content strategy.</p>

<h2>Step 2: Creating Your Content Calendar</h2>

<p>A well-organized content calendar keeps your team aligned and ensures consistent publishing...</p>
"""

IMPORTANT RULES:
- Output ONLY the HTML content (no <html>, <head>, or <body> tags)
- Use semantic HTML5 tags
- Keep HTML clean and minimal (no inline styles or classes)
- Ensure proper nesting and closing of all tags
- Use <strong> for emphasis, not <b>
- Use <em> for italics when needed
- The HTML should paste perfectly into WordPress visual editor, Medium, or any rich text CMS`;

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

Topic: ${topic}

Target Keywords: ${keywords}

Search Intent: ${intent}

Unique Angle: ${angle}

Target Platforms: ${platforms}

Please generate a complete blog post as CLEAN HTML that:
1. Incorporates the target keywords naturally throughout (use <strong> for key terms)
2. Addresses the search intent (${intent})
3. Uses the unique angle to differentiate the content: ${angle}
4. Is formatted as production-ready HTML ready to paste into any CMS
5. Includes an engaging introduction, well-structured body sections, and a compelling conclusion
6. Provides actionable value to readers
7. Is optimized for ${platforms}

CRITICAL HTML FORMATTING REQUIREMENTS:
- Use <h1> for the main title
- Use <h2> for major sections (e.g., <h2>Step 1: Understanding the Basics</h2>)
- Use <h3> for sub-sections
- Wrap all paragraphs in <p> tags
- Use <strong> for important terms and emphasis
- Use <ul><li> for bullet lists
- Use <ol><li> for numbered lists
- NO wrapper tags (no <html>, <head>, <body>)
- NO inline styles or CSS classes
- Output ONLY the content HTML

The blog post should be approximately 1200-1800 words.

Example output format:
<h1>Your Engaging Title Here</h1>

<p>Opening paragraph that hooks the reader...</p>

<h2>Step 1: First Major Section</h2>

<p>Content with <strong>emphasized keywords</strong> naturally integrated.</p>

<h3>Subsection Title</h3>

<p>More detailed content here.</p>

<ul>
<li>Bullet point one</li>
<li>Bullet point two</li>
</ul>`;

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
