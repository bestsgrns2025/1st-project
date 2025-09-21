import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Category {
  _id: string;
  name: string;
}

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      toast({
        title: "Error fetching categories",
        description: "Could not fetch categories from the server.",
        variant: "destructive",
      });
    }
  };

  const handleCreateCategory = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategory }),
      });

      if (response.ok) {
        setNewCategory('');
        fetchCategories();
        toast({ title: "Category created" });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to create category');
      }
    } catch (error: any) {
      toast({
        title: "Error creating category",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/categories/${editingCategory._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editingCategory.name }),
      });

      if (response.ok) {
        setEditingCategory(null);
        fetchCategories();
        toast({ title: "Category updated" });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to update category');
      }
    } catch (error: any) {
      toast({
        title: "Error updating category",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          fetchCategories();
          toast({ title: "Category deleted" });
        } else {
          const errorData = await response.json();
          throw new Error(errorData.msg || 'Failed to delete category');
        }
      } catch (error: any) {
        toast({
          title: "Error deleting category",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Category Management</h1>

      <div className="mb-4">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
          className="p-2 border rounded"
        />
        <button onClick={handleCreateCategory} className="ml-2 p-2 bg-blue-500 text-white rounded">Create</button>
      </div>

      <ul>
        {categories.map(cat => (
          <li key={cat._id} className="flex items-center justify-between p-2 border-b">
            {
              editingCategory && editingCategory._id === cat._id ? (
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="p-2 border rounded"
                />
              ) : (
                <span>{cat.name}</span>
              )
            }
            <div>
              {
                editingCategory && editingCategory._id === cat._id ? (
                  <button onClick={handleUpdateCategory} className="p-2 bg-green-500 text-white rounded">Save</button>
                ) : (
                  <button onClick={() => setEditingCategory(cat)} className="p-2 bg-yellow-500 text-white rounded">Edit</button>
                )
              }
              <button onClick={() => handleDeleteCategory(cat._id)} className="ml-2 p-2 bg-red-500 text-white rounded">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryManagement;
