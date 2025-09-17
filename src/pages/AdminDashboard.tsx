import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
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
}

const AdminDashboard = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInquiries = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast({
          title: "Unauthorized",
          description: "Please log in to access the dashboard.",
          variant: "destructive",
        });
        navigate('/admin/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/admin/inquiries', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setInquiries(data);
        } else if (response.status === 401) {
          toast({
            title: "Session Expired",
            description: "Please log in again.",
            variant: "destructive",
          });
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
        } else {
          throw new Error('Failed to fetch inquiries');
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "An unexpected error occurred while fetching inquiries.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/admin/login');
  };

  const handleExport = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/inquiries/export');
      if (!response.ok) {
        throw new Error('Failed to export inquiries');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'inquiries.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred while exporting inquiries.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
        <p className="mt-4 text-center text-lg">Loading inquiries...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-center sm:text-left">
            Admin Dashboard
          </h1>
          <div className="flex flex-wrap justify-center sm:justify-end gap-3">
            <button
              onClick={handleExport}
              className="hero-button w-full sm:w-auto"
            >
              Export to Excel
            </button>
            <button
              onClick={handleLogout}
              className="hero-button bg-red-600 hover:bg-red-700 w-full sm:w-auto"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Inquiries */}
        {inquiries.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg sm:text-xl text-muted-foreground">
              No project inquiries found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto premium-glass glow-border rounded-lg p-6">
            <table className="min-w-full bg-transparent">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Budget</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Timeline</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Coordinates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Submitted on</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {inquiries.map((inquiry) => (
                  <tr key={inquiry._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">{inquiry.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{inquiry.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{inquiry.company || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{inquiry.service}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{inquiry.budget || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{inquiry.timeline || '-'}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{inquiry.message}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{inquiry.location || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {inquiry.latitude && inquiry.longitude ? (
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${inquiry.latitude},${inquiry.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {inquiry.latitude}, {inquiry.longitude}
                        </a>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(inquiry.createdAt), 'PPP p')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
