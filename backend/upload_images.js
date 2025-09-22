const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const images = [
  "E:\\Bestsgproject\\1st-project\\src\\assets\\author1.jpg",
  "E:\\Bestsgproject\\1st-project\\src\\assets\\author2.jpg",
  "E:\\Bestsgproject\\1st-project\\src\\assets\\logo1.png",
  "E:\\Bestsgproject\\1st-project\\src\\assets\\logo2.png",
  "E:\\Bestsgproject\\1st-project\\src\\assets\\logosg.png",
  "E:\\Bestsgproject\\1st-project\\src\\assets\\Portfolio\\Dashboard.png",
  "E:\\Bestsgproject\\1st-project\\src\\assets\\Portfolio\\E-Commerce.png",
  "E:\\Bestsgproject\\1st-project\\src\\assets\\Portfolio\\fashion.jpg",
  "E:\\Bestsgproject\\1st-project\\src\\assets\\Portfolio\\fitness.jpeg",
  "E:\\Bestsgproject\\1st-project\\src\\assets\\Portfolio\\grocery.png",
  "E:\\Bestsgproject\\1st-project\\src\\assets\\Portfolio\\healthapp.png",
  "E:\\Bestsgproject\\1st-project\\src\\assets\\Portfolio\\real.jpg",
  "E:\\Bestsgproject\\1st-project\\src\\assets\\Portfolio\\Resta.avif",
  "E:\\Bestsgproject\\1st-project\\src\\assets\\Portfolio\\sociallearning.avif",
  "E:\\Bestsgproject\\1st-project\\src\\assets\\Portfolio\\supplychain.png",
  "E:\\Bestsgproject\\1st-project\\src\\assets\\Portfolio\\travel.jpg",
  "E:\\Bestsgproject\\1st-project\\src\\assets\\Portfolio\\travel.png",
  "E:\\Bestsgproject\\1st-project\\src\\assets\\Teams\\nancyphoto.jfif",
  "E:\\Bestsgproject\\1st-project\\src\\assets\\Teams\\Rubyphoto.jpeg",
  "E:\\Bestsgproject\\1st-project\\src\\assets\\Teams\\shaphoto.png",
  "E:\\Bestsgproject\\1st-project\\src\\assets\\travels\\flight_travel.svg",
  "E:\\Bestsgproject\\1st-project\\src\\assets\\travels\\redbus.svg",
  "E:\\Bestsgproject\\1st-project\\src\\assets\\travels\\train_booking.svg"
];

const uploadImage = async (filePath) => {
  try {
    const form = new FormData();
    form.append('image', fs.createReadStream(filePath));

    const response = await axios.post('http://localhost:5000/api/upload', form, {
      headers: {
        ...form.getHeaders()
      }
    });

    console.log(`Uploaded ${filePath}:`, response.data);
  } catch (error) {
    console.error(`Error uploading ${filePath}:`, error.message);
  }
};

const uploadAllImages = async () => {
  for (const image of images) {
    await uploadImage(image);
  }
};

uploadAllImages();
