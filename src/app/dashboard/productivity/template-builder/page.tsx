"use client";

import useAuth from "@/providers/useAuth";
import { DocusealBuilder } from '@docuseal/react';
import { useState, useEffect } from 'react';

export default function TemplateBuilder() {
  const { user } = useAuth();
  const [token, setToken] = useState<string>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (user?.email) {
      fetch('/api/docuseal/builder_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userEmail: user.email
        })
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.token) {
            setToken(data.token);
          } else {
            setError(data.error || 'Failed to get token');
          }
        })
        .catch((error) => {
          setError(error.message);
          console.error('Error fetching builder token:', error);
        });
    }
  }, [user?.email]);

  return (
    <div className="w-full flex-1 shadow-lg h-full p-16 bg-zinc-50 rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Template Builder</h1>
      {error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : token ? (
        <div className="w-full h-[calc(100vh-200px)]">
          <DocusealBuilder token={token} />
        </div>
      ) : (
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <span className="loader" />
        </div>
      )}
    </div>
  );
}