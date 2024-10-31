import { NextResponse } from 'next/server';
import { db } from '@/firebase/config';
import { doc, updateDoc } from 'firebase/firestore';

export async function PATCH(
  request: Request,
  { params }: { params: { templateId: string } }
) {
  try {
    const templateData = await request.json();
    const { userId } = templateData;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 401 });
    }

    // Update using the Firestore document ID directly
    const templateRef = doc(db, 'templates', params.templateId);
    
    const updateData = {
      name: templateData.name || 'Untitled Template',
      updatedAt: new Date(),
      external_id: templateData.id,
      document_urls: templateData.document_urls || [],
      preview_url: templateData.preview_url || null,
      schema: templateData.schema || [],
      fields: templateData.fields || []
    };

    await updateDoc(templateRef, updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating template:', error);
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    );
  }
}
