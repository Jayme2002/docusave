'use client';

import { useState, useEffect } from 'react';
import { DocusealBuilder } from '@docuseal/react';
import { useRouter } from 'next/navigation';
import useAuth from '@/providers/useAuth';

export default function TemplateBuilder() {
  const router = useRouter();
  const { user } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingTemplate, setPendingTemplate] = useState<any>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch('/api/docuseal');
        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
          return;
        }

        setToken(data.jwt);
      } catch (err) {
        setError('Failed to initialize form builder');
      }
    };

    fetchToken();
  }, []);

  const handleTemplateChange = (templateData: any) => {
    console.log('Template data received:', {
      id: templateData.id,
      name: templateData.name,
      schema: templateData.schema,
      fields: templateData.fields,
      document_urls: templateData.document_urls,
      preview_url: templateData.preview_url
    });
    setPendingTemplate(templateData);
  };

  const handleSaveClick = async () => {
    if (!pendingTemplate || !user?.uid) {
      alert('No template changes to save or user not authenticated');
      return;
    }
  
    setIsSaving(true);
    try {
      const response = await fetch('/api/templates/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...pendingTemplate,
          userId: user.uid
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save template');
      }
  
      const result = await response.json();
      
      if (result.success) {
        alert('Template saved successfully');
        router.push('/dashboard/productivity/templates');
      }
    } catch (err) {
      setError('Failed to save template');
      console.error(err);
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
          <div className="p-4 bg-white border-b flex justify-between items-center">
            <button
              onClick={handleSaveClick}
              disabled={isSaving || !pendingTemplate}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Template'}
            </button>
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