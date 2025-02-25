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
    
    // Get PDF from Docuseal if available and upload to Firebase Storage
    let pdfUrl = null;
    
    // Look for preview in multiple possible locations
    let previewUrl = null;
    
    // Check all possible preview URL sources in order of preference
    if (templateData.preview_image_url) {
      previewUrl = templateData.preview_image_url;
      console.log('Using preview_image_url from template data');
    } else if (templateData.preview_url) {
      previewUrl = templateData.preview_url;
      console.log('Using preview_url from template data');
    } else if (templateData.documents && templateData.documents[0]?.preview_image_url) {
      previewUrl = templateData.documents[0].preview_image_url;
      console.log('Using preview_image_url from first document');
    } else if (templateData.documents && templateData.documents[0]?.preview_url) {
      previewUrl = templateData.documents[0].preview_url;
      console.log('Using preview_url from first document');
    }
    
    console.log('Preview URL found:', previewUrl || 'No preview URL available');
    
    if (templateData.document_urls?.[0]) {
      try {
        console.log('Fetching PDF from DocuSeal');
        const response = await fetch(templateData.document_urls[0]);
        const pdfBlob = await response.blob();
        
        // Upload to Firebase Storage
        console.log('Uploading PDF to Firebase Storage');
        const storageRef = ref(storage, `templates/${templateData.userId}/${templateData.id || Date.now()}.pdf`);
        const pdfBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(pdfBlob);
        });

        await uploadString(storageRef, pdfBase64 as string, 'data_url');
        pdfUrl = await getDownloadURL(storageRef);
        console.log('PDF uploaded successfully, URL:', pdfUrl);
      } catch (error) {
        console.error('Error processing PDF:', error);
        // Continue with save even if PDF upload fails
      }
    }
    
    // Save to Firestore with all necessary data for templates display
    const cleanData = {
      userId: templateData.userId,
      name: templateData.name || 'Untitled Template',
      createdAt: serverTimestamp(),
      external_id: templateData.id || `temp_${Date.now()}`,
      document_urls: templateData.document_urls || [],
      // Store preview URL in both fields to ensure compatibility
      preview_url: previewUrl,
      preview_image_url: previewUrl,
      pdfUrl: pdfUrl,
      schema: templateData.schema || [],
      fields: templateData.fields || [],
    };
    
    console.log('Saving to Firestore with template data including preview:', 
      previewUrl ? 'Preview URL exists' : 'No preview URL available');
    
    try {
      const docRef = await addDoc(collection(db, "templates"), cleanData);
      console.log('Successfully saved to Firestore:', docRef.id);
      
      return NextResponse.json({ 
        success: true, 
        templateId: docRef.id,
        pdfUrl,
        previewUrl
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