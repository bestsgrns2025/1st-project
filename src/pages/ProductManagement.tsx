import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AppSidebar from '@/components/AppSidebar';
import { Search, Bell, User, ChevronDown, Filter, Plus } from 'lucide-react';
import { SidebarProvider } from '@/components/ui/sidebar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  stock: number;
  status: 'Active' | 'Draft' | 'Scheduled';
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    type: '',
    price: 0,
    category: '',
    images: [] as string[],
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
<<<<<<< HEAD
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

=======
>>>>>>> 7dc714f05c2befe69d047137e4de87dda7943232
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/products');
      if (response.ok) {
        const data = await response.json();
        const productsWithStatus = data.map((p: any) => ({
          ...p,
          stock: Math.floor(Math.random() * 100),
          status: ['Active', 'Draft', 'Scheduled'][Math.floor(Math.random() * 3)],
        }));
        setProducts(productsWithStatus);
      } else {
        throw new Error('Failed to fetch products');
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      if (response.ok) {
        const data = await response.json();
        const predefinedCategories = [
          { _id: 'portfolio', name: 'Portfolio' },
          { _id: 'teams', name: 'Teams' },
        ];
        setCategories([...predefinedCategories, ...data]);
      } else {
        throw new Error('Failed to fetch categories');
      }
    } catch (error: any) {
      toast({ title: "Error", description: "Could not fetch categories", variant: "destructive" });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setNewProduct((prev) => ({ ...prev, category: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const uploadedImagePaths = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);
        try {
          const response = await axios.post('http://localhost:5000/api/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          uploadedImagePaths.push(response.data.image.path);
        } catch (error) {
          toast({ title: "Upload Error", description: "Failed to upload image", variant: "destructive" });
        }
      }
      setNewProduct((prev) => ({ ...prev, images: [...prev.images, ...uploadedImagePaths] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      if (response.ok) {
        toast({ title: "Success", description: "Product created successfully" });
        setIsAddProductModalOpen(false);
        fetchProducts();
        setNewProduct({ name: '', description: '', type: '', price: 0, category: '', images: [] });
      } else {
        throw new Error('Failed to create product');
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500';
      case 'Draft': return 'bg-yellow-500';
      case 'Scheduled': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-100">
        <AppSidebar />
        <main className="flex-1 p-8">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Products</h1>
            <div className="flex items-center gap-4">
              <Search className="h-6 w-6 text-gray-500" />
              <Bell className="h-6 w-6 text-gray-500" />
              <User className="h-6 w-6 text-gray-500" />
            </div>
          </header>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Products list</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm"><Filter className="h-4 w-4 mr-1" /> Filter</Button>
                <Button variant="outline" size="sm">See All</Button>
                <Dialog open={isAddProductModalOpen} onOpenChange={setIsAddProductModalOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Product</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <Input name="name" placeholder="Product Name" value={newProduct.name} onChange={handleInputChange} />
                      <Textarea name="description" placeholder="Product Description" value={newProduct.description} onChange={handleInputChange} />
                      <Input name="type" placeholder="Product Type" value={newProduct.type} onChange={handleInputChange} />
                      <Input name="price" type="number" placeholder="Product Price" value={newProduct.price} onChange={handleInputChange} />
                      <Select onValueChange={handleCategoryChange} value={newProduct.category}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input type="file" multiple onChange={handleImageUpload} />
                      <DialogFooter>
                        <Button type="submit">Create Product</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="p-2"><input type="checkbox" /></th>
                  <th className="p-2">Product Name <ChevronDown className="inline h-4 w-4" /></th>
                  <th className="p-2">Category <ChevronDown className="inline h-4 w-4" /></th>
                  <th className="p-2">Price <ChevronDown className="inline h-4 w-4" /></th>
                  <th className="p-2">Stock <ChevronDown className="inline h-4 w-4" /></th>
                  <th className="p-2">Status <ChevronDown className="inline h-4 w-4" /></th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b">
                    <td className="p-2"><input type="checkbox" /></td>
                    <td className="p-2 flex items-center gap-2">
                      {product.images && product.images.length > 0 && (
                        <img src={`http://localhost:5000${product.images[0]}`} alt={product.name} className="h-10 w-10 rounded-md object-cover" />
                      )}
                      <span>{product.name}</span>
                    </td>
                    <td className="p-2">{product.category?.name}</td>
                    <td className="p-2">${product.price.toFixed(2)}</td>
                    <td className="p-2">{product.stock}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded-full text-white text-xs ${getStatusColor(product.status)}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="p-2">
                      <Button variant="ghost" size="sm">Details</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center mt-4">
              <Button variant="outline" size="sm">&larr; Previous</Button>
              <div className="flex items-center gap-2 text-sm">
                <Button variant="outline" size="sm">1</Button>
                <Button variant="default" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <span>...</span>
                <Button variant="outline" size="sm">8</Button>
                <Button variant="outline" size="sm">9</Button>
                <Button variant="outline" size="sm">10</Button>
              </div>
              <Button variant="outline" size="sm">Next &rarr;</Button>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ProductManagement;