// app/api/destinations/autocomplete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    
    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    const mocks = [
        { name: 'India', country: 'India', emoji: '🇮🇳', lat: 20.5937, lng: 78.9629 },
        { name: 'Goa', country: 'India', emoji: '🌴', lat: 15.2993, lng: 74.1240 },
        { name: 'Mumbai', country: 'India', emoji: '🏙️', lat: 19.0760, lng: 72.8777 },
        { name: 'Delhi', country: 'India', emoji: '🏛️', lat: 28.6139, lng: 77.2090 },
        { name: 'Ahmedabad', country: 'India', emoji: '🕌', lat: 23.0225, lng: 72.5714 },
        { name: 'Jaipur', country: 'India', emoji: '🐘', lat: 26.9124, lng: 75.7873 },
        { name: 'Kerala', country: 'India', emoji: '🛶', lat: 10.8505, lng: 76.2711 },
        { name: 'Paris', country: 'France', emoji: '🇫🇷', lat: 48.8566, lng: 2.3522 },
        { name: 'Tokyo', country: 'Japan', emoji: '🇯🇵', lat: 35.6762, lng: 139.6503 },
        { name: 'New York', country: 'USA', emoji: '🇺🇸', lat: 40.7128, lng: -74.0060 },
        { name: 'Bali', country: 'Indonesia', emoji: '🇮🇩', lat: -8.4095, lng: 115.1889 },
        { name: 'London', country: 'UK', emoji: '🇬🇧', lat: 51.5074, lng: -0.1278 },
        { name: 'Dubai', country: 'UAE', emoji: '🇦🇪', lat: 25.2048, lng: 55.2708 },
        { name: 'Maldives', country: 'Maldives', emoji: '🇲🇻', lat: 3.2028, lng: 73.2207 },
        { name: 'Switzerland', country: 'Switzerland', emoji: '🇨🇭', lat: 46.8182, lng: 8.2275 },
        { name: 'Thailand', country: 'Thailand', emoji: '🇹🇭', lat: 15.8700, lng: 100.9900 },
        { name: 'Singapore', country: 'Singapore', emoji: '🇸🇬', lat: 1.3521, lng: 103.8198 },
        { name: 'Amsterdam', country: 'Netherlands', emoji: '🇳🇱', lat: 52.3676, lng: 4.9041 },
        { name: 'Rome', country: 'Italy', emoji: '🇮🇹', lat: 41.9028, lng: 12.4964 }
    ].filter(m => 
        m.name.toLowerCase().includes(query.toLowerCase()) || 
        m.country.toLowerCase().includes(query.toLowerCase())
    );

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ suggestions: mocks });
    }

    try {
      const openai = new OpenAI({ apiKey, timeout: 5000 });
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a destination autocomplete API. Return exactly 5 city suggestions for the given query as a JSON array: { "suggestions": [{ name, country, emoji, lat, lng }] }.'
          },
          { role: 'user', content: `Suggestions for: "${query}"` }
        ],
        response_format: { type: 'json_object' }
      });

      const body = JSON.parse(response.choices[0].message?.content || '{}');
      return NextResponse.json(body);
    } catch (apiErr) {
      // If OpenAI fails, fall back to mocks instead of returning empty
      return NextResponse.json({ suggestions: mocks });
    }

  } catch (error: any) {
    console.error('[autocomplete] Fatal Error:', error);
    return NextResponse.json({ suggestions: [] });
  }
}
