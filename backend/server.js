require('dotenv').config();
const config = require('./config');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer'); // Add multer
const path = require('path'); // Add path
const Image = require('./models/Image'); // Add Image model
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory
app.use('/public', express.static(path.join(__dirname, 'public'))); // Add this line

// Create upload directory if it doesn't exist
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/'); // Images will be stored in backend/public/uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  }
});

const upload = multer({ storage: storage });

// MongoDB Connection
mongoose.connect(config.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    console.log('Connected to database:', mongoose.connection.name); // Added for debugging
  })
  .catch(err => console.error(err));

// Routes
app.use('/api/inquiries', require('./routes/inquiryRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/content', require('./routes/contentRoutes')); // Add content routes
app.use('/api/categories', require('./routes/categoryRoutes')); // Add category routes

// Image upload route
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const newImage = new Image({
      filename: req.file.filename,
      path: `/public/uploads/${req.file.filename}`,
      mimetype: req.file.mimetype,
      size: req.file.size,
      category: req.body.category
    });

    await newImage.save();

    res.json({
      msg: 'Image uploaded successfully',
      image: {
        id: newImage._id,
        filename: newImage.filename,
        path: newImage.path,
        category: newImage.category
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Route to get all images or images by category
app.get('/api/images', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const images = await Image.find(filter);
    res.json(images);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/images/:id
// @desc    Update an image
// @access  Private (for now, no auth)
app.put('/api/images/:id', upload.single('image'), async (req, res) => {
  try {
    let image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ msg: 'Image not found' });
    }

    // If a new file is uploaded, delete the old one and update image details
    if (req.file) {
      // Delete old file
      const oldImagePath = path.join(__dirname, image.path);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      image.filename = req.file.filename;
      image.path = `/public/uploads/${req.file.filename}`;
      image.mimetype = req.file.mimetype;
      image.size = req.file.size;
    }

    // Update category if provided
    if (req.body.category) {
      image.category = req.body.category;
    }

    await image.save();

    res.json({ msg: 'Image updated successfully', image });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/images/:id
// @desc    Delete an image
// @access  Private (for now, no auth)
app.delete('/api/images/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ msg: 'Image not found' });
    }

    // Delete file from file system
    const imagePath = path.join(__dirname, image.path);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await image.deleteOne(); // Use deleteOne() instead of findByIdAndRemove()

    res.json({ msg: 'Image removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
