'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/providers/useAuth';
import { Icon } from "@iconify/react/dist/iconify.js";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';

interface Template {
  id: string;
  name: string;
  preview_url: string;
  external_id: string;
  createdAt: any;
}

export default function Templates() {
  const router = useRouter();
  const { user } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!user?.uid) return;

      try {
        const q = query(
          collection(db, "templates"),
          where("userId", "==", user.uid)
        );

        const querySnapshot = await getDocs(q);
        const templatesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Template[];

        // Sort templates by createdAt in descending order (newest first)
        const sortedTemplates = templatesData.sort((a, b) => {
          const dateA = a.createdAt?.toDate() || new Date(0);
          const dateB = b.createdAt?.toDate() || new Date(0);
          return dateB.getTime() - dateA.getTime();
        });

        setTemplates(sortedTemplates);
      } catch (err) {
        console.error('Error fetching templates:', err);
        setError('Failed to load templates');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [user]);

  const handleDeleteTemplate = async (e: React.MouseEvent, templateId: string) => {
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this template?')) {
      return;
    }

    if (!user?.uid) {
      console.error('No user ID available');
      alert('Authentication required');
      return;
    }

    try {
      const response = await fetch(`/api/templates/${templateId}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'user-id': user.uid
        } as HeadersInit
      });

      if (!response.ok) {
        throw new Error('Failed to delete template');
      }

      // Remove template from local state
      setTemplates(templates.filter(template => template.id !== templateId));
    } catch (err) {
      console.error('Error deleting template:', err);
      alert('Failed to delete template');
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="w-full flex-1 shadow-lg h-full p-2 bg-zinc-50 rounded-xl">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold">Templates</h1>
        <button
          onClick={() => router.push('/dashboard/productivity/template-builder')}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-1"
        >
          <Icon icon="tabler:plus" className="size-5" />
          New Template
        </button>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No templates yet. Create your first template!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 px-0">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white p-3 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer w-full"
              onClick={() => router.push(`/dashboard/productivity/templates/${template.external_id}/send`)}
            >
              {template.preview_url ? (
                <img
                  src={template.preview_url}
                  alt={template.name}
                  className="w-full h-60 object-cover rounded-md mb-4"
                />
              ) : (
                <div className="w-full h-60 bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                  <Icon icon="tabler:file-text" className="size-12 text-gray-400" />
                </div>
              )}
              <h3 className="font-semibold text-lg mb-2 line-clamp-1">{template.name}</h3>
              <p className="text-sm text-gray-500">
                Created {template.createdAt?.toDate().toLocaleDateString()}
              </p>
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dashboard/productivity/template-builder/edit?id=${template.external_id}&docId=${template.id}`);
                    }}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <Icon icon="tabler:edit" className="size-5" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteTemplate(e, template.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Icon icon="tabler:trash" className="size-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}