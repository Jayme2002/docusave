import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  const API_KEY = process.env.DOCUSEAL_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: 'DOCUSEAL_API_KEY not configured' }, { status: 500 });
  }

  try {
    const requestData = await request.json();
    
    const response = await axios.request({
      method: 'POST',
      url: 'https://api.docuseal.com/submissions/emails',
      headers: {
        'X-Auth-Token': API_KEY,
        'content-type': 'application/json'
      },
      data: requestData
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error creating submission from emails:', error);
    const errorMessage = error.response?.data?.error || 'Failed to create submission from emails';
    const statusCode = error.response?.status || 500;
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
} 