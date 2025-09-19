import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[]; // Array of image paths/URLs
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    images: [],
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/products'); // Assuming an API endpoint for fetching products
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        throw new Error('Failed to fetch products');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred while fetching products.",
        variant: "destructive",
      });
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
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await fetch('http://localhost:5000/api/upload', { // Reusing the image upload API
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setFormData((prev) => ({
            ...prev,
            images: [...(prev.images || []), data.image.path], // Add new image path
          }));
          toast({
            title: "Image Uploaded",
            description: "Image uploaded successfully.",
          });
        } else {
          const errorData = await response.json();
          throw new Error(errorData.msg || 'Image upload failed');
        }
      } catch (error: any) {
        toast({
          title: "Upload Error",
          description: error.message || "An unexpected error occurred during image upload.",
          variant: "destructive",
        });
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Product ${editingProduct ? 'updated' : 'added'} successfully.`, 
        });
        setFormData({
          name: '',
          description: '',
          price: 0,
          category: '',
          images: [],
        });
        setEditingProduct(null);
        fetchProducts();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.msg || `Failed to ${editingProduct ? 'update' : 'add'} product`);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
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
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Deleted",
          description: "Product deleted successfully.",
        });
        fetchProducts();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to delete product');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred while deleting product.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !products.length) {
    return (
      <div className="text-center py-16 premium-glass glow-border rounded-lg p-6">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-center text-lg">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="premium-glass glow-border rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-foreground">Product Management</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1 text-foreground">Product Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-foreground"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1 text-foreground">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-foreground"
            rows={4}
            required
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-1 text-foreground">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price || 0}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-foreground"
            required
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1 text-foreground">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-foreground"
            required
          />
        </div>
        <div>
          <label htmlFor="images" className="block text-sm font-medium mb-1 text-foreground">Product Images</label>
          <input
            type="file"
            id="images"
            name="images"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-muted-foreground
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-primary file:text-primary-foreground
              hover:file:bg-primary/90"
            multiple // Allow multiple image selection
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.images && formData.images.map((imagePath, index) => (
              <img 
                key={index} 
                src={`http://localhost:5000${imagePath}`}
                alt="Product" 
                className="w-20 h-20 object-cover rounded-md border border-gray-700"
              />
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="hero-button disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {editingProduct ? 'Update Product' : 'Add Product'}
        </button>
        {editingProduct && (
          <button
            type="button"
            onClick={() => {
              setEditingProduct(null);
              setFormData({
                name: '',
                description: '',
                price: 0,
                category: '',
                images: [],
              });
            }}
            className="hero-button bg-gray-600 hover:bg-gray-700 ml-2"
          >
            Cancel Edit
          </button>
        )}
      </form>

      <h3 className="text-xl font-bold mb-3 text-foreground">Existing Products</h3>
      {products.length === 0 ? (
        <p className="text-muted-foreground">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product._id} className="premium-glass glow-border rounded-lg p-4">
              <h4 className="text-lg font-semibold text-primary">{product.name}</h4>
              <p className="text-muted-foreground text-sm">{product.category}</p>
              <p className="text-foreground mt-2">{product.description}</p>
              <p className="text-primary font-bold mt-2">${product.price.toFixed(2)}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.images.map((imagePath, index) => (
                  <img 
                    key={index} 
                    src={`http://localhost:5000${imagePath}`}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-md border border-gray-700"
                  />
                ))}
              </div>
              <div className="mt-4 space-x-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="hero-button bg-blue-600 hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="hero-button bg-red-600 hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
