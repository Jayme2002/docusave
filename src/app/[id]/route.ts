import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const API_KEY = process.env.DOCUSEAL_API_KEY;

  if (!API_KEY) {
    console.error('DOCUSEAL_API_KEY not configured in environment variables');
    return NextResponse.json({ error: 'DOCUSEAL_API_KEY not configured' }, { status: 500 });
  }

  try {
    console.log(`Fetching template with ID: ${params.id}...`);
    
    const response = await fetch(`https://api.docuseal.com/templates/${params.id}`, {
      headers: {
        'X-Auth-Token': API_KEY
      }
    });

    if (!response.ok) {
      // Get detailed error information
      const errorText = await response.text();
      console.error(`DocuSeal API error: ${response.status} ${response.statusText}`, errorText);
      
      // Throw error with status code and details
      throw new Error(`Failed to fetch template: ${response.status} ${response.statusText} - ${errorText.substring(0, 100)}`);
    }

    const template = await response.json();
    console.log(`Successfully fetched template: ${params.id}`);
    return NextResponse.json(template);
  } catch (error) {
    // Enhanced error logging
    console.error('Error fetching template:', error);
    
    // Return more specific error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}