import React from 'react';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  company?: string;
  service: string;
  budget?: string;
  timeline?: string;
  message: string;
  createdAt: string;
  latitude?: number;
  longitude?: number;
  location?: string;
}

const InquiryEmailPreview = () => {
  const location = useLocation();
  const { inquiries } = location.state as { inquiries: Inquiry[] };

  const adminEmail = 'best.rns.2025@gmail.com';
  const subject = 'All Project Inquiries';
  let body = 'Here are all the project inquiries:\n\n';

  inquiries.forEach(inquiry => {
    body += `----------------------------------------\n`;
    body += `Name: ${inquiry.name}\n`;
    body += `Email: ${inquiry.email}\n`;
    body += `Company: ${inquiry.company || '-'}\n`;
    body += `Service: ${inquiry.service}\n`;
    body += `Budget: ${inquiry.budget || '-'}\n`;
    body += `Timeline: ${inquiry.timeline || '-'}\n`;
    body += `Message: ${inquiry.message}\n`;
    body += `Submitted on: ${format(new Date(inquiry.createdAt), 'PPP p')}\n\n`;
  });

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-3xl font-bold mb-4">Inquiry Email Preview</h1>
      <div className="bg-card p-4 rounded-lg shadow-lg">
        <p className="mb-2"><b>To:</b> {adminEmail}</p>
        <p className="mb-2"><b>Subject:</b> {subject}</p>
        <hr className="my-4" />
        <pre className="whitespace-pre-wrap">{body}</pre>
      </div>
      <div className="mt-4">
        <button
          onClick={() => navigator.clipboard.writeText(body)}
          className="hero-button"
        >
          Copy Body to Clipboard
        </button>
      </div>
    </div>
  );
};

export default InquiryEmailPreview;
