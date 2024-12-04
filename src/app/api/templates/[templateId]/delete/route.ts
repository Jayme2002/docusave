import { NextResponse } from 'next/server';
import { db } from '@/firebase/config';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';

export async function DELETE(
  request: Request,
  { params }: { params: { templateId: string } }
) {
  try {
    // First get the template to check ownership
    const templateRef = doc(db, 'templates', params.templateId);
    const templateSnap = await getDoc(templateRef);
    
    if (!templateSnap.exists()) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Get the user ID from the request headers or authentication token
    const userId = request.headers.get('user-id'); // You'll need to set this in your frontend

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if the user owns the template
    const templateData = templateSnap.data();
    if (templateData.userId !== userId) {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      );
    }

    // If all checks pass, delete the template
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