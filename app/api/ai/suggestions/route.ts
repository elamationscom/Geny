import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

type Platform = 'instagram' | 'linkedin' | 'facebook';

export async function POST(req: Request) {
  try {
    const { platform, seed } = (await req.json()) as { platform: Platform; seed?: string | number };
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.warn('[AI Suggestions] No API key found, returning fallback suggestions');
      return NextResponse.json(
        { ideas: ['Share your daily routine', 'Behind the scenes content', 'Industry insights', 'Team spotlight', 'Customer success story'], source: 'fallback' },
        { headers: { 'Cache-Control': 'no-store' } }
      );
    }
    
    const model = 'gemini-2.0-flash';

    const prompt = `You are a social media expert. Generate 5 concise, catchy post ideas for ${platform}.
Return ONLY a JSON array of strings (no prose), each idea 8-20 words, informal, engaging, and platform-appropriate.
Diversity token: ${seed ?? Math.random().toString(36).slice(2)}`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${prompt}\nReturn only a JSON array of 5 strings.`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.95,
          topP: 0.95,
          maxOutputTokens: 400,
        },
      }),
    });
    console.log('[AI Suggestions] status', res.status, 'model', model);
    if (!res.ok) {
      return NextResponse.json(
        { ideas: [], source: 'error' },
        { status: 503, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const data = await res.json();
    console.log('[AI Suggestions] data head:', JSON.stringify(data).slice(0, 400));
    const parts = (data as any)?.candidates?.[0]?.content?.parts ?? [];
    let content: any = parts
      .map((p: any) => (typeof p?.text === 'string' ? p.text : ''))
      .filter(Boolean)
      .join(' ');
    content = String(content ?? '');
    console.log('[AI Suggestions] raw content (first 200 chars):', content.slice(0, 200));

    let ideas: string[] = [];
    try {
      // Try parsing the whole string first
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) ideas = parsed.map((s) => String(s));
    } catch {
      // Try extracting a JSON array substring
      const arrMatch = content.match(/\[[\s\S]*\]/);
      if (arrMatch) {
        try {
          const parsed = JSON.parse(arrMatch[0]);
          if (Array.isArray(parsed)) ideas = parsed.map((s: any) => String(s));
        } catch {}
      }
      // Fallback: split lines
      if (ideas.length === 0) {
        ideas = content
          .split(/\r?\n/)
          .map((l: string) => l.replace(/^[-*\d.\s]+/, '').trim())
          .filter(Boolean)
          .slice(0, 5);
      }
    }

    console.log('[AI Suggestions] ideas count:', ideas.length);
    return NextResponse.json({ ideas, source: 'openrouter' }, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    console.error('[AI Suggestions] error', err);
    return NextResponse.json(
      { ideas: [], source: 'error', message: String(err) },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}


