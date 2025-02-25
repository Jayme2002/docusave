import { NextResponse } from 'next/server';
import { db, storage } from '@/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

export async function POST(request: Request) {
  try {
    console.log('Template save request received');
    const templateData = await request.json();
    
    if (!templateData.userId) {
      console.error('Missing userId in template data');
      return NextResponse.json({ error: 'User ID is required' }, { status: 401 });
    }

    console.log(`Processing template save for user: ${templateData.userId}`);
    
    // Skip storage operations for now to isolate Firestore issue
    let pdfUrl = null;
    
    // Save to Firestore with minimal data to test permissions
    const cleanData = {
      userId: templateData.userId,
      name: templateData.name || 'Untitled Template',
      createdAt: serverTimestamp(),
      external_id: templateData.id || `temp_${Date.now()}`
    };
    
    console.log('Attempting to save to Firestore with data:', JSON.stringify(cleanData));
    
    try {
      const docRef = await addDoc(collection(db, "templates"), cleanData);
      console.log('Successfully saved to Firestore:', docRef.id);
      
      return NextResponse.json({ 
        success: true, 
        templateId: docRef.id
      });
    } catch (firestoreError: any) {
      console.error('Firestore error details:', firestoreError);
      // Return specific Firestore error
      return NextResponse.json(
        { error: `Firestore error: ${firestoreError.message || 'Unknown error'}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in templates/save API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to save template: ${errorMessage}` },
      { status: 500 }
    );
  }
}