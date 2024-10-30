"use client";

import useAuth from "@/providers/useAuth";
import { useEffect, useState } from 'react';
import { db } from "@/firebase/config";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";

interface Template {
  id: string;
  name: string;
  createdAt: Date;
  external_id: string;
  document_urls?: string[];
  preview_url?: string;
  pdfUrl?: string;
}

export default function Templates() {
  const { user } = useAuth();
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

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
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as Template[];

      setTemplates(templatesData);
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [user?.uid]);

  const handleDelete = async (templateId: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      try {
        await deleteDoc(doc(db, "templates", templateId));
        await fetchTemplates(); // Refresh the list
      } catch (error) {
        console.error("Error deleting template:", error);
      }
    }
  };

  const handleEdit = (template: Template) => {
    router.push(`/dashboard/productivity/template-builder?templateId=${template.id}`);
  };

  return (
    <div className="w-full flex-1 shadow-lg h-full p-16 bg-zinc-50 rounded-xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Templates</h1>
        <Link 
          href="/dashboard/productivity/template-builder"
          className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center gap-2 hover:bg-blue-600 transition-colors"
        >
          <Icon icon="tabler:plus" className="size-5" />
          New Template
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <span className="loader" />
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center text-zinc-500 mt-8">
          <p>No templates yet. Create your first template!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {templates.map((template) => (
            <div 
              key={template.id}
              className="p-4 border border-zinc-200 rounded-lg hover:border-blue-500 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{template.name}</h3>
                  <p className="text-sm text-zinc-500">
                    Created: {template.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(template)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <Icon icon="tabler:edit" className="size-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(template.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Icon icon="tabler:trash" className="size-5" />
                  </button>
                </div>
              </div>
              <div className="w-full h-[400px] border rounded-md overflow-hidden bg-white">
                {(template.pdfUrl || template.preview_url) ? (
                  <embed
                    src={template.pdfUrl || template.preview_url}
                    type="application/pdf"
                    className="w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-zinc-400">
                    <div className="text-center">
                      <p>No preview available</p>
                      <p className="text-sm mt-2">Document URL: {template.document_urls?.[0] || 'None'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}