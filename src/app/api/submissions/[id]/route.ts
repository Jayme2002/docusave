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
      url: `https://api.docuseal.com/submissions/${params.id}`,
      headers: { 'X-Auth-Token': API_KEY }
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching submission:', error);
    const errorMessage = error.response?.data?.error || 'Failed to fetch submission';
    const statusCode = error.response?.status || 500;
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const API_KEY = process.env.DOCUSEAL_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: 'DOCUSEAL_API_KEY not configured' }, { status: 500 });
  }

  try {
    const response = await axios({
      method: 'DELETE',
      url: `https://api.docuseal.com/submissions/${params.id}`,
      headers: { 'X-Auth-Token': API_KEY }
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error archiving submission:', error);
    const errorMessage = error.response?.data?.error || 'Failed to archive submission';
    const statusCode = error.response?.status || 500;
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
} 