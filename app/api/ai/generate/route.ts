import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

type Platform = 'instagram' | 'linkedin' | 'facebook';

export async function POST(req: Request) {
  try {
    const { platform, idea, preferences, nonce } = (await req.json()) as {
      platform: Platform;
      idea: string;
      preferences?: string;
      nonce?: string | number;
    };

    const apiKey = process.env.GEMINI_API_KEY;
    const model = 'gemini-2.0-flash';

    const system =
      'You are an assistant for social media post and bio descriptions. Write engaging, platform-appropriate captions in 3-5 sentences (at least 3). Keep it natural, avoid placeholders, include 1-2 relevant emojis, and up to 2 relevant hashtags when helpful.';

    const headers = { 'Cache-Control': 'no-store' } as Record<string, string>;

    if (!apiKey) {
      console.warn('[AI Generate] No API key found, returning fallback content');
      const fallback = `${idea?.trim()} ✨`;
      return NextResponse.json({ text: fallback, source: 'fallback' }, { status: 200, headers });
    }

    const promptText = `${system}\n\nPlatform: ${platform}\nUser idea: ${idea}\nUser preferences: ${preferences ?? 'N/A'}\nCreative iteration: ${nonce ?? Math.random().toString(36).slice(2)}\n\nReturn ONLY the final caption text (no code blocks, no quotes).`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: promptText }],
          },
        ],
        generationConfig: {
          temperature: 0.9,
          topP: 0.95,
          maxOutputTokens: 400,
        },
      }),
    });
    console.log('[AI Generate] status', res.status, 'model', model);
    if (!res.ok) {
      return NextResponse.json({ text: '', source: 'error' }, { status: 503, headers });
    }

    const data = await res.json();
    console.log('[AI Generate] data head:', JSON.stringify(data).slice(0, 400));
    const parts = data?.candidates?.[0]?.content?.parts ?? [];
    const combined = parts
      .map((p: any) => (typeof p?.text === 'string' ? p.text : ''))
      .filter(Boolean)
      .join(' ');
    const text = String(combined || '').trim();
    console.log('[AI Generate] final text length:', text.length);
    return NextResponse.json({ text, source: 'gemini' }, { status: 200, headers });
  } catch (err) {
    console.error('[AI Generate] error', err);
    const text = 'Could not generate now. Try again in a moment ✨';
    return NextResponse.json({ text, source: 'fallback' }, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  }
}


