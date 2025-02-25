'use client';

import { useState, useEffect } from 'react';
import { DocusealBuilder } from '@docuseal/react';
import { useRouter } from 'next/navigation';
import useAuth from '@/providers/useAuth';
import { Icon } from "@iconify/react/dist/iconify.js";

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

  const handleTemplateChange = async (templateData: any) => {
    try {
      const response = await fetch(`/api/templates/fetch?templateId=${templateData.id}`);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
  
      setPendingTemplate({
        ...templateData,
        pdfUrl: data.pdfUrl,
        preview_url: data.previewUrl,
        docusealData: data.templateData
      });
    } catch (err) {
      console.error('Error fetching template details:', err);
      setError('Failed to fetch template details');
    }
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
        router.push('/dashboard/productivity/templates');
      }
    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save template');
    } finally {
      setIsSaving(false);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 text-red-600">
            <Icon icon="tabler:alert-circle" className="size-6" />
            <p className="font-medium">{error}</p>
          </div>
          <button
            onClick={() => router.push('/dashboard/productivity/templates')}
            className="mt-4 text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
          >
            <Icon icon="tabler:arrow-left" className="size-4" />
            Back to Templates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-16 bg-white border-b px-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard/productivity/templates')}
            className="text-gray-600 hover:text-gray-800"
          >
            <Icon icon="tabler:arrow-left" className="size-5" />
          </button>
          <h1 className="text-xl font-semibold">New Template</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard/productivity/templates')}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveClick}
            disabled={isSaving || !pendingTemplate}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
          >
            {isSaving ? (
              <>
                <Icon icon="tabler:loader-2" className="size-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Icon icon="tabler:device-floppy" className="size-5" />
                Save Template
              </>
            )}
          </button>
        </div>
      </div>
      <div className="flex-1">
        {token ? (
          <DocusealBuilder 
            token={token}
            className="w-full h-[calc(100vh-4rem)]"
            onSave={handleTemplateChange}
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
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        )}
      </div>
    </div>
  );
}