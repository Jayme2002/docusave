"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import useAuth from "@/providers/useAuth";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Stats {
  totalTemplates: number;
  recentTemplates: any[];
}

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalTemplates: 0,
    recentTemplates: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.uid) return;

      try {
        const templatesQuery = query(
          collection(db, "templates"),
          where("userId", "==", user.uid)
        );

        const querySnapshot = await getDocs(templatesQuery);
        const templates = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setStats({
          totalTemplates: templates.length,
          recentTemplates: []
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      {/* Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 mb-8">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white">
            Cost Effective Esigning Solutions
          </h1>
          <p className="text-blue-100 mt-2">
            Create, manage, and send documents for signature with our powerful e-signing platform.
          </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-blue-500/20 to-transparent" />
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/20" />
        <div className="absolute -right-5 -bottom-10 h-24 w-24 rounded-full bg-blue-500/20" />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button
          onClick={() => router.push('/dashboard/productivity/templates')}
          className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100 hover:border-blue-300 transition-all text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Icon icon="tabler:files" className="size-8 text-blue-600" />
            </div>
            <Icon icon="tabler:arrow-up-right" className="size-5 text-blue-600" />
          </div>
          <h3 className="text-3xl font-bold mb-1 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            {stats.totalTemplates}
          </h3>
          <p className="text-blue-950/60 font-medium">Total Templates</p>
        </button>

        <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-xl border border-emerald-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <Icon icon="tabler:file-check" className="size-8 text-emerald-600" />
            </div>
            <Icon icon="tabler:arrow-up-right" className="size-5 text-emerald-600" />
          </div>
          <h3 className="text-3xl font-bold mb-1 bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
            0
          </h3>
          <p className="text-emerald-950/60 font-medium">Completed Documents</p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-xl border border-amber-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-500/10 rounded-xl">
              <Icon icon="tabler:file-time" className="size-8 text-amber-600" />
            </div>
            <Icon icon="tabler:arrow-up-right" className="size-5 text-amber-600" />
          </div>
          <h3 className="text-3xl font-bold mb-1 bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
            0
          </h3>
          <p className="text-amber-950/60 font-medium">Pending Signatures</p>
        </div>
      </div>

      {/* Main Actions */}
      <div className="grid md:grid-cols-2 gap-8">
        <button
          onClick={() => router.push('/dashboard/productivity/template-builder')}
          className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl border border-blue-100 hover:shadow-xl hover:shadow-blue-600/5 transition-all h-[300px] text-left"
        >
          <div className="relative z-10">
            <div className="p-4 bg-blue-500/10 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
              <Icon icon="tabler:file-plus" className="size-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Create New Template
            </h2>
            <p className="text-blue-950/60 text-lg mb-6">
              Design a new document template from scratch or upload your own. Add fields, customize layouts, and create professional documents in minutes.
            </p>
            <span className="text-blue-600 font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
              Get Started
              <Icon icon="tabler:arrow-right" className="size-5" />
            </span>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity">
            <Icon icon="tabler:file-plus" className="size-64 text-blue-600" />
          </div>
        </button>

        <button
          onClick={() => router.push('/dashboard/productivity/templates')}
          className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-white p-8 rounded-xl border border-emerald-100 hover:shadow-xl hover:shadow-emerald-600/5 transition-all h-[300px] text-left"
        >
          <div className="relative z-10">
            <div className="p-4 bg-emerald-500/10 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
              <Icon icon="tabler:files" className="size-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
              View Templates
            </h2>
            <p className="text-emerald-950/60 text-lg mb-6">
              Access your template library, manage existing documents, and track signature status. Organize and maintain your document workflow efficiently.
            </p>
            <span className="text-emerald-600 font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
              View Library
              <Icon icon="tabler:arrow-right" className="size-5" />
            </span>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity">
            <Icon icon="tabler:files" className="size-64 text-emerald-600" />
          </div>
        </button>
      </div>
    </div>
  );
}