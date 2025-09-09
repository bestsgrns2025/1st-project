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
          headers: {
            'Authorization': `Bearer ${token}`,
          },
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
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <p className="ml-4">Loading inquiries...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <div className="flex space-x-4">
            <button onClick={handleExport} className="hero-button">
              Export to Excel
            </button>
            <button onClick={handleLogout} className="hero-button bg-red-600 hover:bg-red-700">
              Logout
            </button>
          </div>
        </div>

        {inquiries.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No project inquiries found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inquiries.map((inquiry) => (
              <div key={inquiry._id} className="premium-glass glow-border rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-2 text-primary">{inquiry.name}</h2>
                <p className="text-muted-foreground mb-1"><strong>Email:</strong> {inquiry.email}</p>
                {inquiry.company && <p className="text-muted-foreground mb-1"><strong>Company:</strong> {inquiry.company}</p>}
                <p className="text-muted-foreground mb-1"><strong>Service:</strong> {inquiry.service}</p>
                {inquiry.budget && <p className="text-muted-foreground mb-1"><strong>Budget:</strong> {inquiry.budget}</p>}
                {inquiry.timeline && <p className="text-muted-foreground mb-1"><strong>Timeline:</strong> {inquiry.timeline}</p>}
                <p className="text-muted-foreground mb-4"><strong>Message:</strong> {inquiry.message}</p>
                <p className="text-sm text-gray-500">Submitted on: {format(new Date(inquiry.createdAt), 'PPP p')}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
