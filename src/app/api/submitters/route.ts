import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  const API_KEY = process.env.DOCUSEAL_API_KEY;
  const { searchParams } = new URL(request.url);
  
  // Extract query parameters
  const submissionId = searchParams.get('submission_id');
  const q = searchParams.get('q');
  const completedAfter = searchParams.get('completed_after');
  const completedBefore = searchParams.get('completed_before');
  const externalId = searchParams.get('external_id');
  const limit = searchParams.get('limit') || '10';
  const after = searchParams.get('after');
  const before = searchParams.get('before');

  if (!API_KEY) {
    return NextResponse.json({ error: 'DOCUSEAL_API_KEY not configured' }, { status: 500 });
  }

  try {
    // Build query parameters
    const queryParams = new URLSearchParams();
    if (submissionId) queryParams.append('submission_id', submissionId);
    if (q) queryParams.append('q', q);
    if (completedAfter) queryParams.append('completed_after', completedAfter);
    if (completedBefore) queryParams.append('completed_before', completedBefore);
    if (externalId) queryParams.append('external_id', externalId);
    if (limit) queryParams.append('limit', limit);
    if (after) queryParams.append('after', after);
    if (before) queryParams.append('before', before);

    const response = await axios({
      method: 'GET',
      url: `https://api.docuseal.com/submitters${queryParams.toString() ? '?' + queryParams.toString() : ''}`,
      headers: { 'X-Auth-Token': API_KEY }
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching submitters:', error);
    const errorMessage = error.response?.data?.error || 'Failed to fetch submitters';
    const statusCode = error.response?.status || 500;
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
} 