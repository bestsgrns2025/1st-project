import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Image {
  _id: string;
  filename: string;
  path: string;
}

const CategoryImages = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchImages = async () => {
      if (!categoryId) return;
      try {
        const response = await fetch(`http://localhost:5000/api/images?category=${categoryId}`);
        if (response.ok) {
          const data = await response.json();
          setImages(data);
        } else {
          throw new Error('Failed to fetch images');
        }
      } catch (error: any) {
        toast({
          title: 'Error fetching images',
          description: 'Could not fetch images for this category.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [categoryId, toast]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Category Images</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div key={image._id} className="border rounded-lg overflow-hidden">
            <img src={`http://localhost:5000${image.path}`} alt={image.filename} className="w-full h-48 object-cover" />
            <div className="p-2">
              <p className="text-sm">{image.filename}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryImages;
