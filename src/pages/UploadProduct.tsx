import React, { useState } from 'react';
import axios from 'axios';

const UploadProduct: React.FC = () => {
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');

    if (!selectedFile) {
      setMessage('Please select an image file.');
      return;
    }

    try {
      // 1. Upload image
      const formData = new FormData();
      formData.append('image', selectedFile);

      const uploadRes = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const imageId = uploadRes.data.image.id;

      // 2. Create product with imageId
      const productData = {
        description,
        type,
        price,
        imageId,
      };

      const productRes = await axios.post('http://localhost:5000/api/products', productData);

      setMessage('Product uploaded successfully!');
      console.log('Product created:', productRes.data);

      // Clear form
      setDescription('');
      setType('');
      setPrice(0);
      setSelectedFile(null);
    } catch (error) {
      setMessage('Error uploading product.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <input
            type="text"
            id="description"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <input
            type="text"
            id="type"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            id="price"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            required
          />
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Image
          </label>
          <input
            type="file"
            id="image"
            className="mt-1 block w-full"
            onChange={handleFileChange}
            accept="image/*"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Send
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
    </div>
  );
};

export default UploadProduct;