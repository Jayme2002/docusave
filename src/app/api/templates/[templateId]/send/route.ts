import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(
  request: Request,
  { params }: { params: { templateId: string } }
) {
  const API_KEY = process.env.DOCUSEAL_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: 'DOCUSEAL_API_KEY not configured' }, { status: 500 });
  }

  try {
    // First fetch the template to get its fields and roles
    const templateResponse = await axios({
      method: 'GET',
      url: `https://api.docuseal.com/templates/${params.templateId}`,
      headers: { 'X-Auth-Token': API_KEY }
    });

    const template = templateResponse.data;
    
    // Get the roles from the template schema
    const roles = template.schema?.map((field: any) => field.role).filter(Boolean) || ['Signer'];
    
    // Get the request data
    const { submitters, order = 'preserved', message, send_email = true } = await request.json();

    // Ensure each submitter has a valid role from the template
    const validatedSubmitters = submitters.map((submitter: any, index: number) => ({
      email: submitter.email,
      role: submitter.role || roles[index] || 'Signer',
      name: submitter.name,
      send_email
    }));

    const response = await axios.request({
      method: 'POST',
      url: 'https://api.docuseal.com/submissions',
      headers: {
        'X-Auth-Token': API_KEY,
        'content-type': 'application/json'
      },
      data: {
        template_id: params.templateId,
        order,
        message,
        submitters: validatedSubmitters
      }
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error sending template:', error);
    const errorMessage = error.response?.data?.error || 'Failed to send template';
    const statusCode = error.response?.status || 500;
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}