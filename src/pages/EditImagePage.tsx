import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Image {
  _id: string;
  filename: string;
  path: string;
  mimetype: string;
  size: number;
  createdAt: string;
  category: string;
}

interface Category {
  _id: string;
  name: string;
}

const EditImagePage = () => {
  const { imageId } = useParams<{ imageId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [editingImage, setEditingImage] = useState<Image | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImageCategory, setNewImageCategory] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImageDetails();
    fetchCategories();
  }, [imageId]);

  const fetchImageDetails = async () => {
    if (!imageId) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/images?_id=${imageId}`); // Assuming API supports filtering by _id
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setEditingImage(data[0]);
          setNewImageCategory(data[0].category);
        } else {
          toast({ title: "Error", description: "Image not found", variant: "destructive" });
          navigate('/admin/dashboard/image-management'); // Redirect if image not found
        }
      } else {
        throw new Error('Failed to fetch image details');
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      navigate('/admin/dashboard/image-management'); // Redirect on error
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

  const handleUpdateImage = async () => {
    if (!editingImage) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('category', newImageCategory);
    if (newImageFile) {
      formData.append('image', newImageFile);
    }

    try {
      const response = await fetch(`http://localhost:5000/api/images/${editingImage._id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        toast({ title: "Image Updated", description: "Image updated successfully." });
        navigate('/admin/dashboard/image-management'); // Navigate back after update
      } else {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Image update failed');
      }
    } catch (error: any) {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading image details...</div>;
  }

  if (!editingImage) {
    return <div>Image not found or an error occurred.</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Edit Image</h1>
      <div className="space-y-4">
        <img src={`http://localhost:5000${editingImage.path}`} alt={editingImage.filename} className="w-full h-64 object-cover rounded-md" />
        <label htmlFor="edit-image-file" className="block text-sm font-medium text-foreground">Replace Image File</label>
        <Input type="file" id="edit-image-file" accept="image/*" onChange={(e) => setNewImageFile(e.target.files ? e.target.files[0] : null)} />
        <label htmlFor="edit-image-category" className="block text-sm font-medium text-foreground">Change Category</label>
        <Select onValueChange={setNewImageCategory} value={newImageCategory}>
          <SelectTrigger id="edit-image-category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="outline" onClick={() => navigate('/admin/dashboard/image-management')}>Exit</Button>
        <Button onClick={handleUpdateImage}>Replace</Button>
      </div>
    </div>
  );
};

export default EditImagePage;
