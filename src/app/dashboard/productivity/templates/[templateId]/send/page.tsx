'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from "@iconify/react/dist/iconify.js";

interface Submitter {
  email: string;
  role: string;
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
  const [emailMessage, setEmailMessage] = useState<EmailMessage>({
    subject: 'Please sign {template.name}',
    body: `You have been invited to sign the "{template.name}".

[Review and Sign]({submitter.link})

Please contact us by replying to this email if you have any questions.

Thanks,
{account.name}`
  });

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
    <div className="w-full flex-1 shadow-lg h-full p-6 bg-zinc-50 rounded-xl">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Send Template</h1>
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-800"
          >
            <Icon icon="tabler:x" className="size-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-600 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Subject
            </label>
            <input
              type="text"
              value={emailMessage.subject}
              onChange={(e) => setEmailMessage(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full p-2 border rounded-md"
              placeholder="Please sign {template.name}"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Message
            </label>
            <div className="text-xs text-gray-500 mb-2">
              Available variables: {'{template.name}'}, {'{submitter.link}'}, {'{account.name}'}, 
              {'{sender.name}'}, {'{submitter.email}'}, {'{submitter.name}'}
            </div>
            <textarea
              value={emailMessage.body}
              onChange={(e) => setEmailMessage(prev => ({ ...prev, body: e.target.value }))}
              className="w-full p-2 border rounded-md h-32"
            />
          </div>
        </div>

        <div className="space-y-4">
          {submitters.map((submitter, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={submitter.email}
                  onChange={(e) => handleSubmitterChange(index, 'email', e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="email@example.com"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  value={submitter.role}
                  onChange={(e) => handleSubmitterChange(index, 'role', e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Signer"
                />
              </div>
              {submitters.length > 1 && (
                <button
                  onClick={() => handleRemoveSubmitter(index)}
                  className="mt-6 text-red-500 hover:text-red-600"
                >
                  <Icon icon="tabler:trash" className="size-5" />
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleAddSubmitter}
          className="mt-4 text-blue-500 hover:text-blue-600 flex items-center gap-2"
        >
          <Icon icon="tabler:plus" className="size-5" />
          Add Another Signer
        </button>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSend}
            disabled={sending}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
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