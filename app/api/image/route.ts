import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const googleAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { prompt, size = '1024x1024', quality = 'standard', style = 'vivid', model = 'dall-e-3' } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Generate with Imagen 3 (Google)
    if (model === 'imagen-3') {
      const imagenModel = googleAI.getGenerativeModel({ model: 'imagen-3.0-generate-001' });

      const result = await imagenModel.generateContent({
        contents: [{
          role: 'user',
          parts: [{ text: prompt }]
        }]
      });

      const response = result.response;
      const candidates = response.candidates;

      if (!candidates || candidates.length === 0) {
        return NextResponse.json({ error: 'Failed to generate image with Imagen 3' }, { status: 500 });
      }

      // Extract image data from response
      const imagePart = candidates[0].content.parts.find((part: any) => part.inlineData);

      if (!imagePart || !imagePart.inlineData) {
        return NextResponse.json({ error: 'No image data in Imagen 3 response' }, { status: 500 });
      }

      // Convert base64 image to data URL
      const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;

      return NextResponse.json({
        imageUrl,
        revisedPrompt: prompt,
        originalPrompt: prompt,
        model: 'Imagen 3',
      });
    }

    // Generate image with DALL-E 3 (OpenAI)
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: size as '1024x1024' | '1792x1024' | '1024x1792',
      quality: quality as 'standard' | 'hd',
      style: style as 'vivid' | 'natural',
    });

    const imageUrl = response.data?.[0]?.url;
    const revisedPrompt = response.data?.[0]?.revised_prompt;

    if (!imageUrl) {
      return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
    }

    return NextResponse.json({
      imageUrl,
      revisedPrompt,
      originalPrompt: prompt,
    });
  } catch (error: any) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate image' },
      { status: 500 }
    );
  }
}
