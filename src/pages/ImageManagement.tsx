import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

interface Image {
  _id: string;
  filename: string;
  path: string;
  mimetype: string;
  size: number;
  createdAt: string;
  category: string;
}

const ImageManagement = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<{ _id: string, name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const navigate = useNavigate(); // Initialize useNavigate

  const fetchImages = async (categoryId: string = 'all') => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/images${!categoryId || categoryId === 'all' ? '' : `?category=${categoryId}`}`);
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      } else {
        throw new Error('Failed to fetch images');
      }
    } catch (error) {
      toast({
        title: "Error fetching images",
        description: "Could not fetch images from the server.",
        variant: "destructive",
      });
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
      toast({
        title: "Error fetching categories",
        description: "Could not fetch categories from the server.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchImages();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select an image to upload.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('category', selectedCategory);

    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Upload Successful",
          description: "Image uploaded successfully.",
        });
        setSelectedFile(null);
        fetchImages(); // Refresh the list of images
      } else {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Image upload failed');
      }
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    fetchImages(categoryId);
  };

  const handleEditImage = (image: Image) => {
    navigate(`/admin/image-management/edit/${image._id}`); // Navigate to edit page
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/images/${imageId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        toast({ title: "Image Deleted", description: "Image deleted successfully." });
        fetchImages(selectedCategory);
      } else {
        throw new Error('Failed to delete image');
      }
    } catch (error: any) {
      toast({ title: "Delete Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = selectedCategory === 'all' ? images : images.filter(image => image.category === selectedCategory);

  return (
    <div className="premium-glass glow-border rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-foreground">Image Management</h2>
      
      <div className="mb-6">
        <label htmlFor="image-upload" className="block text-sm font-medium mb-2 text-foreground">Upload New Image</label>
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-muted-foreground
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-primary file:text-primary-foreground
            hover:file:bg-primary/90"
        />
        <button
          onClick={handleUpload}
          disabled={!selectedFile || loading}
          className="hero-button mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Uploading...' : 'Upload Image'}
        </button>
      </div>

      <div className="mb-4">
        <label htmlFor="category-filter" className="block text-sm font-medium mb-2 text-foreground">Filter by Category</label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">Select a category</option>
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category._id} value={category._id}>{category.name}</option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-3 text-foreground">Existing Images</h3>
        {loading ? (
          <p className="text-muted-foreground">Loading images...</p>
        ) : filteredImages.length === 0 ? (
          <p className="text-muted-foreground">No images uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image) => (
              <div key={image._id} className="relative group rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={`http://localhost:5000${image.path}`}
                  alt={image.filename}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm">{image.filename}</p>
                  <div className="absolute bottom-2 left-2 right-2 flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" onClick={() => handleEditImage(image)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteImage(image._id)}>Delete</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageManagement;
