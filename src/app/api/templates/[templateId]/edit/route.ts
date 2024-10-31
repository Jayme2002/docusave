import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(
  request: Request,
  { params }: { params: { templateId: string } }
) {
  const API_KEY = process.env.DOCUSEAL_API_KEY;
  const templateId = params.templateId;

  if (!API_KEY) {
    return NextResponse.json({ error: 'DOCUSEAL_API_KEY not configured' }, { status: 500 });
  }

  try {
    // Generate JWT token with template_id for editing
    const token = jwt.sign({
      user_email: process.env.DOCUSEAL_ADMIN_EMAIL,
      integration_email: 'user@example.com',
      external_id: templateId,
      mode: 'edit',
      template_id: templateId
    }, API_KEY);

    return NextResponse.json({ jwt: token });
  } catch (error) {
    console.error('Error getting edit token:', error);
    return NextResponse.json({ error: 'Failed to get edit token' }, { status: 500 });
  }
}
