import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import AppSidebar from '@/components/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

interface AdminUser {
  _id: string;
  email: string;
  role: string;
  lastLogin: string; // ISO date string
}

const AdminUsersManagement = () => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('admin-dashboard-active');
    return () => {
      document.body.classList.remove('admin-dashboard-active');
    };
  }, []);

  useEffect(() => {
    const fetchAdminUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('adminToken'); // Assuming token is stored in localStorage
        if (!token) {
          toast({ title: "Error", description: "Not authenticated. Please log in.", variant: "destructive" });
          navigate('/admin/login'); // Redirect to login if no token
          return;
        }

        const response = await fetch('http://localhost:5000/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAdminUsers(data);
        } else if (response.status === 403) {
          toast({ title: "Error", description: "You are not authorized to view this page.", variant: "destructive" });
          navigate('/admin/dashboard'); // Redirect if not authorized
        }
        else {
          throw new Error('Failed to fetch admin users');
        }
      } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchAdminUsers();
  }, [navigate, toast]);

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen bg-gray-100">
          <AppSidebar />
          <main className="flex-1 p-8">
            <h1 className="text-3xl font-bold mb-8">Admin Users</h1>
            <p>Loading admin users...</p>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-100">
        <AppSidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">Admin Users</h1>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Last Login</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.lastLogin ? format(new Date(user.lastLogin), 'PPP p') : 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminUsersManagement;
