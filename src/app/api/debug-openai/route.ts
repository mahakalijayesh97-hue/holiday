// app/api/debug-openai/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET() {
  const apiKey = process.env.OPENAI_API_KEY ?? '';

  // 1. Key presence check
  if (!apiKey || apiKey.length < 20) {
    return NextResponse.json({
      ok: false,
      step: 'key-check',
      error: 'OPENAI_API_KEY is missing or empty in this environment.',
      fix: 'Add OPENAI_API_KEY=sk-... to .env.local (NOT .env) and run: killall node && npm run dev',
    });
  }

  // 2. Key format check
  if (!apiKey.startsWith('sk-')) {
    return NextResponse.json({
      ok: false,
      step: 'key-format',
      keyPrefix: apiKey.slice(0, 6),
      error: 'Key does not start with "sk-". It may be malformed or from the wrong variable.',
    });
  }

  // 3. Live API call — minimal & free
  try {
    const openai = new OpenAI({ apiKey, timeout: 15_000, maxRetries: 0 });

    const res = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 5,
      messages: [{ role: 'user', content: 'Say: OK' }],
    });

    return NextResponse.json({
      ok: true,
      step: 'live-call',
      keyPrefix: apiKey.slice(0, 10) + '...',
      reply: res.choices?.[0]?.message?.content,
      model: res.model,
    });

  } catch (err: any) {
    const status = err?.status ?? err?.statusCode ?? 0;
    return NextResponse.json({
      ok: false,
      step: 'live-call',
      httpStatus: status,
      error: err?.message ?? String(err),
      keyPrefix: apiKey.slice(0, 10) + '...',
      fix:
        status === 401
          ? 'Key is invalid or revoked. Generate a new key at platform.openai.com/api-keys.'
          : status === 429
          ? 'Quota exceeded. Check billing at platform.openai.com/usage.'
          : 'Check network connectivity and that the key is correct.',
    });
  }
}
