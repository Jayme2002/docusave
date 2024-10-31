import { NextResponse } from 'next/server';
import { db } from '@/firebase/config';
import { doc, deleteDoc } from 'firebase/firestore';

export async function DELETE(
  request: Request,
  { params }: { params: { templateId: string } }
) {
  try {
    const templateRef = doc(db, 'templates', params.templateId);
    await deleteDoc(templateRef);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting template:', error);
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    );
  }
}