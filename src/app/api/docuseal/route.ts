import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET() {
  const API_KEY = process.env.DOCUSEAL_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: 'DOCUSEAL_API_KEY not configured' }, { status: 500 });
  }

  try {
    const token = jwt.sign({
      user_email: process.env.DOCUSEAL_ADMIN_EMAIL,
      integration_email: 'user@example.com', // Replace with actual user email
      external_id: `form_${Date.now()}`, // Generate unique ID
      name: 'Document Form',
      document_urls: [], // Add your document URLs here or leave empty for user upload
    }, API_KEY);

    return NextResponse.json({ jwt: token });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
  }
}