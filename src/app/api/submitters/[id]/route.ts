import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const API_KEY = process.env.DOCUSEAL_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: 'DOCUSEAL_API_KEY not configured' }, { status: 500 });
  }

  try {
    const response = await axios({
      method: 'GET',
      url: `https://api.docuseal.com/submitters/${params.id}`,
      headers: { 'X-Auth-Token': API_KEY }
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching submitter:', error);
    const errorMessage = error.response?.data?.error || 'Failed to fetch submitter';
    const statusCode = error.response?.status || 500;
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const API_KEY = process.env.DOCUSEAL_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: 'DOCUSEAL_API_KEY not configured' }, { status: 500 });
  }

  try {
    const requestData = await request.json();
    
    const response = await axios({
      method: 'PUT',
      url: `https://api.docuseal.com/submitters/${params.id}`,
      headers: {
        'X-Auth-Token': API_KEY,
        'content-type': 'application/json'
      },
      data: requestData
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error updating submitter:', error);
    const errorMessage = error.response?.data?.error || 'Failed to update submitter';
    const statusCode = error.response?.status || 500;
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
} 