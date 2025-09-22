import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  type: string;
  price: number;
  category: Category;
  images: string[];
}

const ProductManagement = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    type: '',
    price: 0,
    category: undefined,
    images: [],
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('admin-dashboard-active');
    return () => {
      document.body.classList.remove('admin-dashboard-active');
    };
  }, []);

  useEffect(() => {
    // Hardcoded categories
    const predefinedCategories = [
      { _id: 'portfolio', name: 'Portfolio' },
      { _id: 'teams', name: 'Teams' },
    ];
    setCategories(predefinedCategories);

    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        throw new Error('Failed to fetch products');
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]; // Get only the first file
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);

      // Ensure category is selected for the product before uploading images
      if (!formData.category) {
        toast({
          title: "Category Required",
          description: "Please select a category for the product before uploading images.",
          variant: "destructive",
        });
        return;
      }
      uploadFormData.append('category', formData.category._id);

      try {
        const response = await axios.post('http://localhost:5000/api/upload', uploadFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const imagePath = response.data.image.path; // Get single image path
        setFormData((prev) => ({
          ...prev,
          images: [...(prev.images || []), imagePath],
        }));
        toast({ title: "Image Uploaded" });
      } catch (error: any) {
        toast({ title: "Upload Error", description: error.message || "An unexpected error occurred during image upload.", variant: "destructive" });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const method = editingProduct ? 'PUT' : 'POST';
    const url = editingProduct ? `http://localhost:5000/api/products/${editingProduct._id}` : 'http://localhost:5000/api/products';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({ title: "Success", description: `Product ${editingProduct ? 'updated' : 'added'} successfully.` });
        setFormData({ name: '', description: '', type: '', price: 0, category: undefined, images: [] });
        setEditingProduct(null);
        fetchProducts();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.msg || `Failed to ${editingProduct ? 'update' : 'add'} product`);
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast({
          title: "Unauthorized",
          description: "Please log in to delete a product.",
          variant: "destructive",
        });
        navigate('/admin/login');
        return;
      }
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        toast({ title: "Deleted", description: "Product deleted successfully." });
        fetchProducts();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to delete product');
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Category Management Functions
  const handleCreateCategory = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      toast({
        title: "Unauthorized",
        description: "Please log in to create a category.",
        variant: "destructive",
      });
      navigate('/admin/login');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: newCategory }),
      });
      if (response.ok) {
        setNewCategory('');
        // fetchCategories(); // No need to fetch categories as they are hardcoded
        toast({ title: "Category created" });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to create category');
      }
    } catch (error: any) {
      toast({ title: "Error creating category", description: error.message, variant: "destructive" });
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;
    const token = localStorage.getItem('adminToken');
    if (!token) {
      toast({
        title: "Unauthorized",
        description: "Please log in to update a category.",
        variant: "destructive",
      });
      navigate('/admin/login');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/categories/${editingCategory._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: editingCategory.name }),
      });
      if (response.ok) {
        setEditingCategory(null);
        // fetchCategories(); // No need to fetch categories as they are hardcoded
        toast({ title: "Category updated" });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to update category');
      }
    } catch (error: any) {
      toast({ title: "Error updating category", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast({
          title: "Unauthorized",
          description: "Please log in to delete a category.",
          variant: "destructive",
        });
        navigate('/admin/login');
        return;
      }
      try {
        const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.ok) {
          // fetchCategories(); // No need to fetch categories as they are hardcoded
          toast({ title: "Category deleted" });
        } else {
          const errorData = await response.json();
          throw new Error(errorData.msg || 'Failed to delete category');
        }
      } catch (error: any) {
        toast({ title: "Error deleting category", description: error.message, variant: "destructive" });
      }
    }
  };

  const filteredProducts = products.filter(p => selectedCategoryFilter === 'all' || p.category?._id === selectedCategoryFilter);

  return (
    <div className="premium-glass glow-border rounded-lg p-6">
      <div className="flex border-b mb-4">
        <button onClick={() => setActiveTab('products')} className={`py-2 px-4 ${activeTab === 'products' ? 'border-b-2 border-primary' : ''}`}>Products</button>
        <button onClick={() => setActiveTab('categories')} className={`py-2 px-4 ${activeTab === 'categories' ? 'border-b-2 border-primary' : ''}`}>Categories</button>
      </div>

      {activeTab === 'products' && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-foreground">Product Management</h2>
          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            <input name="name" value={formData.name || ''} onChange={handleInputChange} placeholder="Product Name" className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-foreground" />
            <textarea name="description" value={formData.description || ''} onChange={handleInputChange} placeholder="Product Description" className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-foreground" />
            <input name="type" value={formData.type || ''} onChange={handleInputChange} placeholder="Product Type" className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-foreground" />
            <input name="price" type="number" value={formData.price || 0} onChange={handleInputChange} placeholder="Product Price" className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-foreground" />
            <select name="category" value={formData.category?._id || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-foreground">
              <option value="">Select Category</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <input type="file" onChange={handleImageUpload} className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-foreground" />
            <button type="submit" className="hero-button">{editingProduct ? 'Update' : 'Create'}</button>
          </form>

          <div className="mb-4">
            <select onChange={(e) => setSelectedCategoryFilter(e.target.value)} value={selectedCategoryFilter} className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-foreground">
              <option value="all">All Categories</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <div key={product._id} className="premium-glass glow-border rounded-lg p-4">
                <h4 className="text-lg font-semibold text-primary">{product.name}</h4>
                <p className="text-muted-foreground text-sm">{product.category?.name}</p>
                <p className="text-foreground mt-2">{product.description}</p>
                <p className="text-foreground mt-2">Type: {product.type}</p>
                <p className="text-primary font-bold mt-2">${product.price.toFixed(2)}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.images.map((imagePath, index) => (
                    <img key={index} src={`http://localhost:5000${imagePath}`} alt={product.name} className="w-16 h-16 object-cover rounded-md border border-gray-700" />
                  ))}
                </div>
                <div className="mt-4 space-x-2">
                  <button onClick={() => handleEdit(product)} className="hero-button bg-blue-600 hover:bg-blue-700">Edit</button>
                  <button onClick={() => handleDelete(product._id)} className="hero-button bg-red-600 hover:bg-red-700">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Category Management</h2>
          <div className="mb-4">
            {/* Removed input and button for creating categories */}
            <p className="text-muted-foreground">Predefined categories are used. Dynamic category creation is disabled.</p>
          </div>
          <ul>
            {categories.map(cat => (
              <li key={cat._id} className="flex items-center justify-between p-2 border-b">
                <span>{cat.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
