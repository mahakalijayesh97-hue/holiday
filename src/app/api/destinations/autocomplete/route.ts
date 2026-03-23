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
        // GLOBAL & INDIA MAJOR
        { name: 'India', country: 'India', emoji: '🇮🇳', lat: 20.5937, lng: 78.9629 },
        { name: 'Mumbai', country: 'India', emoji: '🏙️', lat: 19.0760, lng: 72.8777 },
        { name: 'Delhi', country: 'India', emoji: '🏛️', lat: 28.6139, lng: 77.2090 },
        { name: 'Goa', country: 'India', emoji: '🌴', lat: 15.2993, lng: 74.1240 },
        { name: 'Jaipur', country: 'India', emoji: '🐘', lat: 26.9124, lng: 75.7873 },
        { name: 'Kerala', country: 'India', emoji: '🛶', lat: 10.8505, lng: 76.2711 },
        
        // GUJARAT - ALL 33 DISTRICTS & KEY CITIES (Synchronized with mockPlans.ts)
        { name: 'Ahmedabad', country: 'India', emoji: '🕌', lat: 23.0225, lng: 72.5714 },
        { name: 'Gandhinagar', country: 'India', emoji: '🏢', lat: 23.2156, lng: 72.6369 },
        { name: 'Vadodara', country: 'India', emoji: '🏰', lat: 22.3072, lng: 73.1812 },
        { name: 'Surat', country: 'India', emoji: '💎', lat: 21.1702, lng: 72.8311 },
        { name: 'Rajkot', country: 'India', emoji: '🌆', lat: 22.3039, lng: 70.8022 },
        { name: 'Junagadh', country: 'India', emoji: '⛰️', lat: 21.5222, lng: 70.4579 },
        { name: 'Jamnagar', country: 'India', emoji: '🛕', lat: 22.4707, lng: 70.0577 },
        { name: 'Bhavnagar', country: 'India', emoji: '⚓', lat: 21.7645, lng: 72.1519 },
        { name: 'Kutch', country: 'India', emoji: '🏜️', lat: 23.2420, lng: 69.6669 },
        { name: 'Bhuj', country: 'India', emoji: '🏰', lat: 23.2420, lng: 69.6669 },
        { name: 'Somnath', country: 'India', emoji: '🔱', lat: 20.8880, lng: 70.4012 },
        { name: 'Dwarka', country: 'India', emoji: '📿', lat: 22.2442, lng: 68.9685 },
        { name: 'Statue of Unity', country: 'India', emoji: '🗿', lat: 21.8380, lng: 73.7191 },
        { name: 'Saputara', country: 'India', emoji: '⛰️', lat: 20.5786, lng: 73.7454 },
        { name: 'Patan', country: 'India', emoji: '🏺', lat: 23.8493, lng: 72.1266 },
        { name: 'Mehsana', country: 'India', emoji: '🥛', lat: 23.5880, lng: 72.3693 },
        { name: 'Anand', country: 'India', emoji: '🍼', lat: 22.5645, lng: 72.9289 },
        { name: 'Bharuch', country: 'India', emoji: '🌉', lat: 21.7051, lng: 72.9959 },
        { name: 'Navsari', country: 'India', emoji: '🏖️', lat: 20.9467, lng: 72.9280 },
        { name: 'Valsad', country: 'India', emoji: '🌊', lat: 20.5992, lng: 72.9342 },
        { name: 'Porbandar', country: 'India', emoji: '🕊️', lat: 21.6417, lng: 69.6093 },
        { name: 'Banaskantha', country: 'India', emoji: '🚩', lat: 24.1722, lng: 72.4333 },
        { name: 'Sabarkantha', country: 'India', emoji: '🌲', lat: 23.5979, lng: 72.9620 },
        { name: 'Aravalli', country: 'India', emoji: '⛰️', lat: 23.4735, lng: 73.3082 },
        { name: 'Kheda', country: 'India', emoji: '🌾', lat: 22.6916, lng: 72.8634 },
        { name: 'Panchmahal', country: 'India', emoji: '🏞️', lat: 22.7753, lng: 73.6163 },
        { name: 'Dahod', country: 'India', emoji: '🏹', lat: 22.8400, lng: 74.2500 },
        { name: 'Mahisagar', country: 'India', emoji: '🌊', lat: 23.1670, lng: 73.3270 },
        { name: 'Chhota Udaipur', country: 'India', emoji: '🎨', lat: 22.3111, lng: 74.0111 },
        { name: 'Narmada', country: 'India', emoji: '🌊', lat: 21.8617, lng: 73.5011 },
        { name: 'Tapi', country: 'India', emoji: '🚣', lat: 21.1147, lng: 73.3941 },
        { name: 'Amreli', country: 'India', emoji: '🦁', lat: 21.6033, lng: 71.2140 },
        { name: 'Surendranagar', country: 'India', emoji: '🚜', lat: 22.7231, lng: 71.6385 },
        { name: 'Botad', country: 'India', emoji: '🛕', lat: 22.1705, lng: 71.6631 },
        { name: 'Morbi', country: 'India', emoji: '🏺', lat: 22.8100, lng: 70.8200 },
        { name: 'Ambaji', country: 'India', emoji: '🚩', lat: 24.3312, lng: 72.8492 },
        { name: 'Palitana', country: 'India', emoji: '🛕', lat: 21.4983, lng: 71.8497 },
        { name: 'Modhera', country: 'India', emoji: '☀️', lat: 23.5835, lng: 72.1330 },
        { name: 'Polo Forest', country: 'India', emoji: '🌲', lat: 23.9317, lng: 73.2847 },
        { name: 'Champaner', country: 'India', emoji: '🏯', lat: 22.4636, lng: 73.5204 },
        
        // GLOBAL
        { name: 'Paris', country: 'France', emoji: '🇫🇷', lat: 48.8566, lng: 2.3522 },
        { name: 'Tokyo', country: 'Japan', emoji: '🇯🇵', lat: 35.6762, lng: 139.6503 },
        { name: 'London', country: 'UK', emoji: '🇬🇧', lat: 51.5074, lng: -0.1278 },
        { name: 'New York', country: 'USA', emoji: '🇺🇸', lat: 40.7128, lng: -74.0060 },
        { name: 'Bali', country: 'Indonesia', emoji: '🇮🇩', lat: -8.4095, lng: 115.1889 },
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
