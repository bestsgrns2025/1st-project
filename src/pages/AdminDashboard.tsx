import React from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="max-w-4xl w-full bg-card p-8 rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="hero-button bg-red-600 hover:bg-red-700"
          >
            Exit
          </button>
        </div>

        {/* Navigation Links */}
        <div className="mb-8">
          <nav className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Link
              to="/admin/inquiries"
              className="bg-card-foreground text-background hover:bg-primary hover:text-primary-foreground text-center p-4 rounded-lg transition-colors duration-300"
            >
              Inquiry Management
            </Link>
            <Link
              to="/admin/product-management"
              className="bg-card-foreground text-background hover:bg-primary hover:text-primary-foreground text-center p-4 rounded-lg transition-colors duration-300"
            >
              Product Management
            </Link>
            <Link
              to="content-management"
              className="bg-card-foreground text-background hover:bg-primary hover:text-primary-foreground text-center p-4 rounded-lg transition-colors duration-300"
            >
              Content Management
            </Link>
          </nav>
        </div>

        {/* Content Outlet */}
        <div className="flex-grow">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
