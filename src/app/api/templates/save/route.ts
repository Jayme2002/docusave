import { NextResponse } from 'next/server';
import { db, storage } from '@/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

export async function POST(request: Request) {
  try {
    const templateData = await request.json();
    
    if (!templateData.userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 401 });
    }

    // Get PDF from Docuseal if available
    let pdfUrl = null;
    if (templateData.document_urls?.[0]) {
      try {
        const response = await fetch(templateData.document_urls[0]);
        const pdfBlob = await response.blob();
        
        // Upload to Firebase Storage
        const storageRef = ref(storage, `templates/${templateData.userId}/${templateData.id}.pdf`);
        const pdfBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(pdfBlob);
        });

        await uploadString(storageRef, pdfBase64 as string, 'data_url');
        pdfUrl = await getDownloadURL(storageRef);
      } catch (error) {
        console.error('Error processing PDF:', error);
      }
    }

    // Save to Firestore
    const cleanData = {
      userId: templateData.userId,
      name: templateData.name || 'Untitled Template',
      createdAt: serverTimestamp(),
      external_id: templateData.id,
      document_urls: templateData.document_urls || [],
      preview_url: templateData.preview_url || null,
      pdfUrl: pdfUrl,
      schema: templateData.schema || [],
      fields: templateData.fields || []
    };

    const docRef = await addDoc(collection(db, "templates"), cleanData);

    return NextResponse.json({ 
      success: true, 
      templateId: docRef.id,
      pdfUrl 
    });
  } catch (error) {
    console.error('Error saving template:', error);
    return NextResponse.json(
      { error: 'Failed to save template' },
      { status: 500 }
    );
  }
}