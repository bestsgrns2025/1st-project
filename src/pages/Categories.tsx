import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Category {
  _id: string;
  name: string;
}

interface Image {
  _id: string;
  filename: string;
  path: string;
  category: string; // Assuming category is an ID string
}

interface GroupedImages {
  [key: string]: Image[];
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, imagesResponse] = await Promise.all([
          fetch('http://localhost:5000/api/categories'),
          fetch('http://localhost:5000/api/images'),
        ]);

        if (categoriesResponse.ok && imagesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          const imagesData = await imagesResponse.json();
          
          const predefinedCategories = [
            { _id: 'portfolio', name: 'Portfolio' },
            { _id: 'teams', name: 'Teams' },
          ];

          setCategories([...predefinedCategories, ...categoriesData]);
          setImages(imagesData);
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (error: any) {
        toast({
          title: 'Error fetching data',
          description: 'Could not fetch data from the server.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const groupedImages = images.reduce((acc, image) => {
    const categoryId = image.category;
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(image);
    return acc;
  }, {} as GroupedImages);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      {categories.map((category) => (
        <div key={category._id} className="mb-8">
          <h2 className="text-xl font-bold mb-4">{category.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(groupedImages[category._id] || []).map((image) => (
              <div key={image._id} className="border rounded-lg overflow-hidden">
                <img src={`http://localhost:5000${image.path}`} alt={image.filename} className="w-full h-48 object-cover" />
                <div className="p-2">
                  <p className="text-sm">{image.filename}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Categories;