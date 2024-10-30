'use client';

import { useState, useEffect } from 'react';
import { DocusealBuilder } from '@docuseal/react';

export default function TemplateBuilder() {
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
    setPendingTemplate(templateData);
  };

  const handleSaveClick = async () => {
    if (!pendingTemplate) {
      alert('No template changes to save');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/templates/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pendingTemplate),
      });

      if (!response.ok) {
        throw new Error('Failed to save template');
      }

      alert('Template saved successfully');
      setPendingTemplate(null); // Clear pending changes after successful save
    } catch (err) {
      setError('Failed to save template');
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
          <div className="p-4 bg-white border-b">
            <button
              onClick={handleSaveClick}
              disabled={isSaving || !pendingTemplate}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Template'}
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