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
  preview_url: string | null;
  preview_image_url?: string | null;
  pdfUrl?: string | null;
  external_id: string;
  createdAt: any;
}

export default function Templates() {
  const router = useRouter();
  const { user } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');

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

      setTemplates(templates.filter(template => template.id !== templateId));
    } catch (err) {
      console.error('Error deleting template:', err);
      alert('Failed to delete template');
    }
  };

  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 text-red-600">
            <Icon icon="tabler:alert-circle" className="size-6" />
            <p className="font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50/50 to-white p-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Document Templates</h1>
            <p className="text-zinc-600">Manage and organize your document templates</p>
          </div>
          <button
            onClick={() => router.push('/dashboard/productivity/template-builder')}
            className="shrink-0 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2 font-medium group transition-all"
          >
            <Icon icon="tabler:plus" className="size-5" />
            New Template
            <Icon 
              icon="tabler:arrow-right" 
              className="size-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" 
            />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Icon 
              icon="tabler:search" 
              className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-zinc-400"
            />
          </div>
          <div className="flex items-center gap-2 p-1 bg-zinc-100 rounded-lg">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg ${view === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
            >
              <Icon icon="tabler:layout-grid" className="size-5" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-lg ${view === 'list' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
            >
              <Icon icon="tabler:layout-list" className="size-5" />
            </button>
          </div>
        </div>

        {filteredTemplates.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 flex items-center justify-center">
              <Icon icon="tabler:template" className="size-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No templates found</h3>
            <p className="text-zinc-600 mb-6 max-w-md mx-auto">
              {searchQuery 
                ? 'Try a different search term or clear the search to see all templates' 
                : 'Create your first template to start managing your documents efficiently'
              }
            </p>
            {!searchQuery && (
              <button
                onClick={() => router.push('/dashboard/productivity/template-builder')}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2 font-medium mx-auto group transition-all"
              >
                <Icon icon="tabler:plus" className="size-5" />
                Create Template
                <Icon 
                  icon="tabler:arrow-right" 
                  className="size-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" 
                />
              </button>
            )}
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="group bg-white rounded-2xl border hover:border-blue-500 hover:shadow-xl hover:shadow-blue-100 transition-all overflow-hidden"
              >
                {(template.preview_url || template.preview_image_url) ? (
                  <div className="relative aspect-[4/3] overflow-hidden bg-zinc-50">
                    <img
                      src={template.preview_url || template.preview_image_url || ''}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentNode as HTMLElement;
                        if (parent) {
                          const fallback = document.createElement('div');
                          fallback.className = "w-full h-full bg-zinc-50 flex items-center justify-center";
                          fallback.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="size-12 text-zinc-400" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 3v4a1 1 0 0 0 1 1h4m-5 3v3m-4-3v6m-1-6v3m-5 9h12a2 2 0 0 0 2-2V7.5L14.5 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2"/></svg>';
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-4 gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/dashboard/productivity/template-builder/edit?id=${template.external_id}&docId=${template.id}`);
                        }}
                        className="p-2 bg-white/90 hover:bg-white text-zinc-700 rounded-lg transition-colors backdrop-blur-sm"
                        title="Edit template"
                      >
                        <Icon icon="tabler:edit" className="size-4" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteTemplate(e, template.id)}
                        className="p-2 bg-white/90 hover:bg-white text-zinc-700 rounded-lg transition-colors backdrop-blur-sm"
                        title="Delete template"
                      >
                        <Icon icon="tabler:trash" className="size-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-zinc-50 flex items-center justify-center relative">
                    <Icon icon="tabler:file-text" className="size-12 text-zinc-400" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-4 gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/dashboard/productivity/template-builder/edit?id=${template.external_id}&docId=${template.id}`);
                        }}
                        className="p-2 bg-white/90 hover:bg-white text-zinc-700 rounded-lg transition-colors backdrop-blur-sm"
                        title="Edit template"
                      >
                        <Icon icon="tabler:edit" className="size-4" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteTemplate(e, template.id)}
                        className="p-2 bg-white/90 hover:bg-white text-zinc-700 rounded-lg transition-colors backdrop-blur-sm"
                        title="Delete template"
                      >
                        <Icon icon="tabler:trash" className="size-4" />
                      </button>
                    </div>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-1 line-clamp-1">{template.name}</h3>
                  <p className="text-sm text-zinc-500">
                    Created {template.createdAt?.toDate().toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => router.push(`/dashboard/productivity/templates/${template.external_id}/send`)}
                    className="w-full mt-4 py-2 bg-transparent hover:bg-blue-50 text-blue-600 rounded-lg transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100"
                  >
                    <Icon icon="tabler:send" className="size-4" />
                    Send Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="group bg-white rounded-xl border hover:border-blue-500 hover:shadow-lg hover:shadow-blue-100 transition-all overflow-hidden flex items-center gap-6"
              >
                {(template.preview_url || template.preview_image_url) ? (
                  <div className="relative w-40 h-40 shrink-0 overflow-hidden bg-zinc-50">
                    <img
                      src={template.preview_url || template.preview_image_url || ''}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentNode as HTMLElement;
                        if (parent) {
                          const fallback = document.createElement('div');
                          fallback.className = "w-full h-full bg-zinc-50 flex items-center justify-center";
                          fallback.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="size-12 text-zinc-400" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 3v4a1 1 0 0 0 1 1h4m-5 3v3m-4-3v6m-1-6v3m-5 9h12a2 2 0 0 0 2-2V7.5L14.5 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2"/></svg>';
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-40 h-40 shrink-0 bg-zinc-50 flex items-center justify-center">
                    <Icon icon="tabler:file-text" className="size-12 text-zinc-400" />
                  </div>
                )}
                <div className="flex-1 p-6">
                  <h3 className="font-medium text-xl mb-2">{template.name}</h3>
                  <p className="text-zinc-500">
                    Created {template.createdAt?.toDate().toLocaleDateString()}
                  </p>
                </div>
                <div className="pr-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => router.push(`/dashboard/productivity/templates/${template.external_id}/send`)}
                    className="py-2 px-4 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Icon icon="tabler:send" className="size-4" />
                    Send
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dashboard/productivity/template-builder/edit?id=${template.external_id}&docId=${template.id}`);
                    }}
                    className="p-2 text-zinc-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit template"
                  >
                    <Icon icon="tabler:edit" className="size-5" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteTemplate(e, template.id)}
                    className="p-2 text-zinc-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete template"
                  >
                    <Icon icon="tabler:trash" className="size-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}