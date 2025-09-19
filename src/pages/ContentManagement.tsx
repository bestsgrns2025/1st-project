import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ContentItem {
  _id: string;
  key: string; // e.g., "heroTitle", "aboutUsText"
  value: string;
}

const ContentManagement = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/content'); // Assuming a new API endpoint for fetching content
      if (response.ok) {
        const data = await response.json();
        setContent(data);
      } else {
        throw new Error('Failed to fetch content');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred while fetching content.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (item: ContentItem) => {
    setEditingKey(item.key);
    setEditingValue(item.value);
  };

  const handleSaveClick = async (key: string) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/content', { // Assuming a new API endpoint for updating content
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key, value: editingValue }),
      });

      if (response.ok) {
        toast({
          title: "Update Successful",
          description: "Content updated successfully.",
        });
        setEditingKey(null);
        setEditingValue('');
        fetchContent(); // Refresh content list
      } else {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Content update failed');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred while updating content.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = () => {
    setEditingKey(null);
    setEditingValue('');
  };

  if (loading) {
    return (
      <div className="text-center py-16 premium-glass glow-border rounded-lg p-6">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-center text-lg">Loading content...</p>
      </div>
    );
  }

  return (
    <div className="premium-glass glow-border rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-foreground">Content Management</h2>
      
      {content.length === 0 ? (
        <p className="text-muted-foreground">No content items found. You might need to add some default content in the database or via an API.</p>
      ) : (
        <div className="space-y-4">
          {content.map((item) => (
            <div key={item._id} className="p-4 border border-gray-700 rounded-md bg-background">
              <div className="font-semibold text-primary mb-2">Key: {item.key}</div>
              {editingKey === item.key ? (
                <div>
                  <textarea
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-foreground"
                    rows={4}
                  />
                  <div className="mt-2 space-x-2">
                    <button
                      onClick={() => handleSaveClick(item.key)}
                      className="hero-button"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancelClick}
                      className="hero-button bg-gray-600 hover:bg-gray-700"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <p className="text-muted-foreground flex-grow pr-4">{item.value}</p>
                  <button
                    onClick={() => handleEditClick(item)}
                    className="hero-button bg-blue-600 hover:bg-blue-700"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentManagement;
