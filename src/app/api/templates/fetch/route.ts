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
      // Fetch template data
      const templateResponse = await axios({
        method: 'GET',
        url: `https://api.docuseal.com/templates/${templateId}`,
        headers: { 'X-Auth-Token': API_KEY }
      });
  
      // Fetch submissions for this template
      const submissionsResponse = await axios({
        method: 'GET',
        url: `https://api.docuseal.com/templates/${templateId}/submissions`,
        headers: { 'X-Auth-Token': API_KEY }
      });
  
      const document = templateResponse.data.documents?.[0];
      
      return NextResponse.json({ 
        templateData: {
          ...templateResponse.data,
          submissions: submissionsResponse.data
        },
        documentUrl: document?.url || null,
        previewUrl: document?.preview_image_url || null,
        filename: document?.filename || 'template.pdf'
      });
    } catch (error) {
      console.error('Error fetching template:', error);
      return NextResponse.json({ error: 'Failed to fetch template' }, { status: 500 });
    }
  }