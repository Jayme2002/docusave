'use client';

import { useState, useEffect } from 'react';
import { DocusealBuilder } from '@docuseal/react';
import { useRouter } from 'next/navigation';
import useAuth from '@/providers/useAuth';
import { useSearchParams } from 'next/navigation';

export default function EditTemplate() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('id');
  const docId = searchParams.get('docId');
  const { user } = useAuth();
  
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingTemplate, setPendingTemplate] = useState<any>(null);

  useEffect(() => {
    if (!templateId || !docId) {
      setError('Missing template information');
      return;
    }

    const fetchTemplate = async () => {
      try {
        const response = await fetch(`/api/templates/${templateId}/edit`);
        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
          return;
        }

        setToken(data.jwt);
      } catch (err) {
        setError('Failed to initialize template editor');
      }
    };

    fetchTemplate();
  }, [templateId, docId]);

  const handleTemplateChange = async (templateData: any) => {
    try {
      setIsSaving(true);
      // Fetch complete template data from Docuseal
      const response = await fetch(`/api/templates/fetch?templateId=${templateData.id}`);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const updatedTemplate = {
        ...templateData,
        pdfUrl: data.pdfUrl,
        preview_url: data.previewUrl,
        docusealData: data.templateData
      };

      // Use the Firestore document ID for the update
      const saveResponse = await fetch(`/api/templates/${docId}/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updatedTemplate,
          userId: user?.uid,
          templateId: templateId
        }),
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to update template');
      }

      const result = await saveResponse.json();
      
      if (result.success) {
        alert('Template updated successfully');
        router.push('/dashboard/productivity/templates');
      }
    } catch (err) {
      console.error('Error updating template:', err);
      setError('Failed to update template');
    } finally {
      setIsSaving(false);
    }
  };

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="w-full h-screen">
      {token ? (
        <>
          <div className="p-4 bg-white border-b flex justify-end items-center">
            <button
              onClick={() => router.push('/dashboard/productivity/templates')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
          <DocusealBuilder 
            token={token}
            className="w-full h-[calc(100%-4rem)]"
            onSave={handleTemplateChange}
            autosave={false}
            customCss={`
              #save_button {
                background-color: rgb(37 99 235) !important;
                color: white !important;
                border-radius: 0.375rem !important;
                padding: 0.5rem 1rem !important;
                font-weight: 600 !important;
              }
              #save_button:hover {
                background-color: rgb(29 78 216) !important;
              }
              #save_button:disabled {
                opacity: 0.5 !important;
                cursor: not-allowed !important;
              }
            `}
          />
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      )}
    </div>
  );
}
