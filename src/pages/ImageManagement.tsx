import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Image {
  _id: string;
  filename: string;
  path: string;
  category: {
    _id: string;
    name: string;
  };
}

interface Category {
  _id: string;
  name: string;
}

const ImageManagement = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
    fetchImages();
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

  const fetchImages = async (categoryId: string = 'all') => {
    try {
      let url = 'http://localhost:5000/api/images';
      if (categoryId !== 'all') {
        url += `?category=${categoryId}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setImages(data);
    } catch (error) {
      toast({
        title: "Error fetching images",
        description: "Could not fetch images from the server.",
        variant: "destructive",
      });
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    fetchImages(categoryId);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Image Management</h1>

      <div className="mb-4">
        <label htmlFor="category-filter" className="block text-sm font-medium text-gray-400 mb-2">Filter by Category</label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="bg-gray-800 text-white rounded-md p-2"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category._id} value={category._id}>{category.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map(image => (
          <div key={image._id} className="border rounded-lg p-4">
            <img src={`http://localhost:5000${image.path}`} alt={image.filename} className="w-full h-48 object-cover rounded-md mb-2" />
            <p className="text-sm text-gray-400">{image.category?.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageManagement;