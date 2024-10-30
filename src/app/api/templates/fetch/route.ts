import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  const API_KEY = process.env.DOCUSEAL_API_KEY;
  const { searchParams } = new URL(request.url);
  const templateId = searchParams.get('templateId');

  if (!API_KEY) {
    return NextResponse.json({ error: 'DOCUSEAL_API_KEY not configured' }, { status: 500 });
  }

  try {
    const response = await axios({
      method: 'GET',
      url: `https://api.docuseal.com/templates/${templateId}`,
      headers: { 'X-Auth-Token': API_KEY }
    });

    // Extract PDF URL from the response
    const pdfUrl = response.data.documents?.[0]?.url || null;
    const previewUrl = response.data.documents?.[0]?.preview_image_url || null;

    return NextResponse.json({ 
      templateData: response.data,
      pdfUrl,
      previewUrl
    });
  } catch (error) {
    console.error('Error fetching template:', error);
    return NextResponse.json({ error: 'Failed to fetch template' }, { status: 500 });
  }
}