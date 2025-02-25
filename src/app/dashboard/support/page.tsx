"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";

export default function Support() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">How can we help?</h1>
        <div className="max-w-2xl mx-auto relative">
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 pl-12 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Icon 
            icon="tabler:search" 
            className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-xl border hover:border-blue-500 transition-all">
          <div className="p-3 bg-blue-50 rounded-xl w-fit mb-4">
            <Icon icon="tabler:book" className="size-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold mb-2">Documentation</h2>
          <p className="text-zinc-600 mb-4">Detailed guides and API references</p>
          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            Browse Docs
            <Icon icon="tabler:arrow-right" className="size-4" />
          </a>
        </div>

        <div className="bg-white p-6 rounded-xl border hover:border-blue-500 transition-all">
          <div className="p-3 bg-blue-50 rounded-xl w-fit mb-4">
            <Icon icon="tabler:messages" className="size-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold mb-2">Community Forum</h2>
          <p className="text-zinc-600 mb-4">Connect with other users</p>
          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            Join Discussion
            <Icon icon="tabler:arrow-right" className="size-4" />
          </a>
        </div>

        <div className="bg-white p-6 rounded-xl border hover:border-blue-500 transition-all">
          <div className="p-3 bg-blue-50 rounded-xl w-fit mb-4">
            <Icon icon="tabler:mail" className="size-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold mb-2">Email Support</h2>
          <p className="text-zinc-600 mb-4">Get help from our support team</p>
          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            Contact Support
            <Icon icon="tabler:arrow-right" className="size-4" />
          </a>
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-8">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-2">How do I create my first template?</h3>
            <p className="text-zinc-600">Click on "Template Builder" in the navigation bar and follow our step-by-step guide to create your first document template.</p>
          </div>
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-2">What file formats are supported?</h3>
            <p className="text-zinc-600">We support PDF, Word (docx), and Excel (xlsx) files for template creation.</p>
          </div>
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-2">How secure are my documents?</h3>
            <p className="text-zinc-600">All documents are encrypted and stored securely. We use industry-standard security measures to protect your data.</p>
          </div>
          <div className="pb-4">
            <h3 className="text-lg font-semibold mb-2">Can I customize the signing process?</h3>
            <p className="text-zinc-600">Yes, you can customize the signing order, add multiple signers, and set up email notifications.</p>
          </div>
        </div>
      </div>
    </div>
  );
}