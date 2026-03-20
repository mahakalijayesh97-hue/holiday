// app/api/plans/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { generateMockPlans } from '@/lib/mockPlans';

// ── Destination hero images ───────────────────────────────────────────────────
const DEST_IMAGES: Record<string, string> = {
  paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80',
  tokyo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80',
  bali: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
  dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80',
  london: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80',
  rome: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80',
  mumbai: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=600&q=80',
  goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80',
  ahmedabad: 'https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?w=600&q=80',
  'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80',
  nyc: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80',
  singapore: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=80',
  bangkok: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=600&q=80',
  maldives: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80',
  barcelona: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&q=80',
  amsterdam: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600&q=80',
  santorini: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80',
  kyoto: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80',
  istanbul: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&q=80',
  cairo: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600&q=80',
  sydney: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&q=80',
  delhi: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80',
  jaipur: 'https://images.unsplash.com/photo-1477587458883-47145ed6979e?w=600&q=80',
  kerala: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80',
};

function getDestinationImage(destination: string): string {
  const key = destination.toLowerCase().split(',')[0].trim();
  if (DEST_IMAGES[key]) return DEST_IMAGES[key];
  const partial = Object.keys(DEST_IMAGES).find(
    (k) => key.includes(k) || k.includes(key)
  );
  return partial
    ? DEST_IMAGES[partial]
    : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80';
}

// ── System prompt ─────────────────────────────────────────────────────────────
// response_format json_object requires root to be {} not [],
// so we ask for { "plans": [...] } and unwrap below.
const SYSTEM_PROMPT = `You are a travel planning API. Return ONLY a valid JSON object shaped exactly as:
{ "plans": [ ...exactly 5 plan objects... ] }

No markdown, no explanation, no code fences — pure JSON only.

Each plan object:
{
  "id": "plan-budget" | "plan-comfort" | "plan-luxury" | "plan-adventure" | "plan-cultural",
  "title": string,
  "description": string,
  "budget": "low" | "medium" | "high",
  "estimatedCost": string,
  "highlights": [string, string, string, string],
  "bestFor": string,
  "days": [
    {
      "day": number,
      "title": string,
      "places": [string, string, string],
      "route": string,
      "activities": [string, string, string]
    }
  ]
}

CRITICAL: Every value in places[] MUST be a real, named, well-known attraction, area, or restaurant at the destination. NEVER use generic names like "Main Attraction", "Local Museum", "City Center 1".`;

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { destination, days } = await req.json();

    if (!destination || !days) {
      return NextResponse.json(
        { error: 'Destination and days are required' },
        { status: 400 }
      );
    }

    const numDays = parseInt(String(days), 10);
    if (isNaN(numDays) || numDays < 1 || numDays > 30) {
      return NextResponse.json(
        { error: 'Days must be between 1 and 30' },
        { status: 400 }
      );
    }

    // ── Toggle: Mock vs AI ──
    const useMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'false';
    const apiKey = process.env.OPENAI_API_KEY ?? '';

    // If Mock mode is ON or API key is missing, return mock data immediately
    if (useMock || !apiKey || apiKey.length < 20) {
      console.log(`[plans/generate] Mode: ${useMock ? 'FORCE_MOCK' : 'FALLBACK_MOCK'} (Key: ${!!apiKey})`);
      const plans = generateMockPlans(destination, numDays);
      const destImage = getDestinationImage(destination);
      const plansWithImage = plans.map((p: any) => ({
        ...p,
        destinationImage: destImage,
      }));
      return NextResponse.json({ 
        plans: plansWithImage, 
        source: 'mock',
        isMock: true,
        message: useMock ? 'Using development mock data' : 'Fallback to mock data (API key missing)'
      });
    }

    // ── Initialise OpenAI SDK client ───────────────────────────────────────
    // Using the SDK instead of raw fetch avoids environment-specific fetch issues.
    const openai = new OpenAI({
      apiKey,
      // Increase default timeout to 60 s — plan generation can be slow
      timeout: 60_000,
      maxRetries: 1,
    });

    // ── Call OpenAI ────────────────────────────────────────────────────────
    let completion: Awaited<ReturnType<typeof openai.chat.completions.create>>;
    try {
      completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        max_tokens: 3500,
        temperature: 0.6,
        response_format: { type: 'json_object' }, // guarantees valid JSON {}
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content:
              `Create 5 travel plans for "${destination}" for ${numDays} day(s). ` +
              `The 5 plan types: budget backpacker, comfort traveler, luxury escape, ` +
              `adventure seeker, cultural immersion. ` +
              `Every place in places[] must be a real named location in "${destination}".`,
          },
        ],
      });
    } catch (sdkErr: any) {
      // SDK throws typed errors — decode them clearly
      console.error('[plans/generate] OpenAI SDK error:', sdkErr);

      const status = sdkErr?.status ?? sdkErr?.statusCode ?? 0;
      const msg: string = sdkErr?.message ?? String(sdkErr);

      if (status === 401 || msg.includes('401') || msg.toLowerCase().includes('api key')) {
        return NextResponse.json(
          {
            error:
              'Invalid OpenAI API key (401). Go to platform.openai.com/api-keys, ' +
              'create a new key, update OPENAI_API_KEY in .env.local, and restart the server.',
          },
          { status: 502 }
        );
      }

      if (status === 429 || msg.includes('429') || msg.toLowerCase().includes('quota')) {
        return NextResponse.json(
          {
            error:
              'OpenAI quota exceeded (429). Check your usage and billing at ' +
              'platform.openai.com/usage.',
          },
          { status: 502 }
        );
      }

      if (status === 400) {
        return NextResponse.json(
          { error: `OpenAI rejected the request (400): ${msg}` },
          { status: 502 }
        );
      }

      // Generic network / timeout
      return NextResponse.json(
        {
          error: `OpenAI request failed: ${msg}. Check your internet connection and API key.`,
        },
        { status: 502 }
      );
    }

    // ── Parse the JSON response ────────────────────────────────────────────
    const raw = completion.choices?.[0]?.message?.content ?? '';
    console.log('[plans/generate] Raw response length:', raw.length);
    console.log('[plans/generate] Raw preview:', raw.slice(0, 200));

    let plans: unknown[] = [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        plans = parsed;
      } else if (Array.isArray(parsed.plans)) {
        plans = parsed.plans;
      } else {
        // Grab the first array-valued key as a last resort
        const firstArr = Object.values(parsed).find((v) => Array.isArray(v));
        if (firstArr) plans = firstArr as unknown[];
      }
    } catch (parseErr) {
      console.error('[plans/generate] JSON parse failed. Raw:', raw.slice(0, 500));
      return NextResponse.json(
        { error: 'OpenAI returned malformed JSON. Please try again.' },
        { status: 500 }
      );
    }

    if (!plans.length) {
      console.error('[plans/generate] Empty plans array. Raw:', raw.slice(0, 500));
      return NextResponse.json(
        { error: 'OpenAI returned no plans. Please try again.' },
        { status: 500 }
      );
    }

    // ── Attach destination hero image ──────────────────────────────────────
    const destImage = getDestinationImage(destination);
    const plansWithImage = plans.map((p: any) => ({
      ...p,
      destinationImage: destImage,
    }));

    console.log('[plans/generate] Success — returning', plansWithImage.length, 'plans');
    return NextResponse.json({ plans: plansWithImage, source: 'openai' });

  } catch (error: any) {
    console.error('[plans/generate] Unhandled error:', error);
    return NextResponse.json(
      { error: `Unexpected server error: ${error?.message ?? String(error)}` },
      { status: 500 }
    );
  }
}