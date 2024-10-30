import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

interface RequestBody {
  userEmail: string;
  templateId?: string;
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();

    if (!process.env.DOCUSEAL_API_KEY) {
      throw new Error('DOCUSEAL_API_KEY is not configured');
    }

    const token = jwt.sign({
      user_email: process.env.DOCUSEAL_ADMIN_EMAIL,
      integration_email: body.userEmail,
      external_id: body.templateId || `form_${Date.now()}`,
      name: body.templateId ? 'Edit Form' : 'New Form',
      document_urls: [],
    }, process.env.DOCUSEAL_API_KEY);

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error generating builder token:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}