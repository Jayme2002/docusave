import { NextResponse } from 'next/server';
import { db } from '@/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const templateData = await request.json();
    console.log('Received template data:', templateData);
    
    if (!templateData.userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 401 });
    }

    // Extract relevant data from the Docuseal template
    const cleanData = {
      userId: templateData.userId,
      name: templateData.name || 'Untitled Template',
      createdAt: serverTimestamp(),
      external_id: templateData.id,
      document_urls: templateData.document_urls || [],
      preview_url: templateData.preview_url || null,
      schema: templateData.schema || [],
      fields: templateData.fields || []
    };

    console.log('Saving to Firebase:', cleanData);

    // Save to Firebase
    const docRef = await addDoc(collection(db, "templates"), cleanData);
    console.log('Saved template with ID:', docRef.id);

    return NextResponse.json({ 
      success: true, 
      templateId: docRef.id 
    });
  } catch (error) {
    console.error('Error saving template:', error);
    return NextResponse.json(
      { error: 'Failed to save template' },
      { status: 500 }
    );
  }
}