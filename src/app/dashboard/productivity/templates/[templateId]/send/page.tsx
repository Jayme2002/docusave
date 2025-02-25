'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from "@iconify/react/dist/iconify.js";

interface Submitter {
  email: string;
  role: string;
  name?: string;
}

interface EmailMessage {
  subject: string;
  body: string;
}

export default function SendTemplate({ params }: { params: { templateId: string } }) {
  const router = useRouter();
  const [submitters, setSubmitters] = useState<Submitter[]>([
    { email: '', role: 'Signer' }
  ]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState<string>('');
  const [emailMessage, setEmailMessage] = useState<EmailMessage>({
    subject: 'Please sign {template.name}',
    body: `You have been invited to sign the "{template.name}".

[Review and Sign]({submitter.link})

Please contact us by replying to this email if you have any questions.

Thanks,
{account.name}`
  });

  useEffect(() => {
    // Fetch template details to get the name
    const fetchTemplate = async () => {
      try {
        const response = await fetch(`/api/templates/fetch?templateId=${params.templateId}`);
        const data = await response.json();
        if (data.templateData?.name) {
          setTemplateName(data.templateData.name);
          setEmailMessage(prev => ({
            ...prev,
            subject: prev.subject.replace('{template.name}', data.templateData.name),
            body: prev.body.replace('{template.name}', data.templateData.name)
          }));
        }
      } catch (err) {
        console.error('Error fetching template:', err);
      }
    };
    fetchTemplate();
  }, [params.templateId]);

  const handleAddSubmitter = () => {
    setSubmitters([...submitters, { email: '', role: 'Signer' }]);
  };

  const handleRemoveSubmitter = (index: number) => {
    setSubmitters(submitters.filter((_, i) => i !== index));
  };

  const handleSubmitterChange = (index: number, field: keyof Submitter, value: string) => {
    const newSubmitters = [...submitters];
    newSubmitters[index][field] = value;
    setSubmitters(newSubmitters);
  };

  const handleSend = async () => {
    if (submitters.some(s => !s.email)) {
      setError('All email fields are required');
      return;
    }

    setSending(true);
    setError(null);

    try {
      const messageBody = emailMessage.body.includes('{submitter.link}')
        ? emailMessage.body
        : `${emailMessage.body}\n\n[Review and Sign]({submitter.link})`;

      const response = await fetch(`/api/templates/${params.templateId}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submitters,
          order: 'preserved',
          message: {
            subject: emailMessage.subject || 'Please sign {template.name}',
            body: messageBody
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send template');
      }

      alert('Template sent successfully!');
      router.push('/dashboard/productivity/templates');
    } catch (err) {
      console.error('Error sending template:', err);
      setError('Failed to send template');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50/50 to-white">
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Send Template</h1>
            <p className="text-zinc-600">
              {templateName ? `Sending: ${templateName}` : 'Configure recipients and message'}
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <Icon icon="tabler:x" className="size-5" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2">
            <Icon icon="tabler:alert-circle" className="size-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Recipients</h2>
          <div className="space-y-4">
            {submitters.map((submitter, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-zinc-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={submitter.email}
                    onChange={(e) => handleSubmitterChange(index, 'email', e.target.value)}
                    className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-zinc-700 mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    value={submitter.role}
                    onChange={(e) => handleSubmitterChange(index, 'role', e.target.value)}
                    className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Signer"
                  />
                </div>
                {submitters.length > 1 && (
                  <button
                    onClick={() => handleRemoveSubmitter(index)}
                    className="mt-7 text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Icon icon="tabler:trash" className="size-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={handleAddSubmitter}
            className="mt-4 text-blue-600 hover:text-blue-700 flex items-center gap-2 p-2 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Icon icon="tabler:plus" className="size-5" />
            Add Another Signer
          </button>
        </div>

        <div className="bg-white rounded-2xl border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Email Message</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Subject Line
              </label>
              <input
                type="text"
                value={emailMessage.subject}
                onChange={(e) => setEmailMessage(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Please sign {template.name}"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Message Body
              </label>
              <div className="text-xs text-zinc-500 mb-2 p-2 bg-zinc-50 rounded-lg">
                Available variables: {'{template.name}'}, {'{submitter.link}'}, {'{account.name}'}, 
                {'{sender.name}'}, {'{submitter.email}'}, {'{submitter.name}'}
              </div>
              <textarea
                value={emailMessage.body}
                onChange={(e) => setEmailMessage(prev => ({ ...prev, body: e.target.value }))}
                className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-40"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-2.5 text-zinc-600 hover:text-zinc-800 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sending}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
          >
            {sending ? (
              <>
                <Icon icon="tabler:loader-2" className="size-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Icon icon="tabler:send" className="size-5" />
                Send Template
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}