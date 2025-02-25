import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  const API_KEY = process.env.DOCUSEAL_API_KEY;
  const { searchParams } = new URL(request.url);
  
  // Extract query parameters
  const templateId = searchParams.get('template_id');
  const status = searchParams.get('status');
  const q = searchParams.get('q');
  const templateFolder = searchParams.get('template_folder');
  const limit = searchParams.get('limit') || '10';
  const after = searchParams.get('after');
  const before = searchParams.get('before');

  if (!API_KEY) {
    return NextResponse.json({ error: 'DOCUSEAL_API_KEY not configured' }, { status: 500 });
  }

  try {
    // Build query parameters
    const queryParams = new URLSearchParams();
    if (templateId) queryParams.append('template_id', templateId);
    if (status) queryParams.append('status', status);
    if (q) queryParams.append('q', q);
    if (templateFolder) queryParams.append('template_folder', templateFolder);
    if (limit) queryParams.append('limit', limit);
    if (after) queryParams.append('after', after);
    if (before) queryParams.append('before', before);

    const queryString = queryParams.toString();
    const url = `https://api.docuseal.com/submissions${queryString ? '?' + queryString : ''}`;

    const response = await axios({
      method: 'GET',
      url,
      headers: { 'X-Auth-Token': API_KEY }
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching submissions:', error);
    const errorMessage = error.response?.data?.error || 'Failed to fetch submissions';
    const statusCode = error.response?.status || 500;
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}

export async function POST(request: Request) {
  const API_KEY = process.env.DOCUSEAL_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: 'DOCUSEAL_API_KEY not configured' }, { status: 500 });
  }

  try {
    const requestData = await request.json();
    
    const response = await axios.request({
      method: 'POST',
      url: 'https://api.docuseal.com/submissions',
      headers: {
        'X-Auth-Token': API_KEY,
        'content-type': 'application/json'
      },
      data: requestData
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error creating submission:', error);
    const errorMessage = error.response?.data?.error || 'Failed to create submission';
    const statusCode = error.response?.status || 500;
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
} 