const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const {
  connectDB,
  Project,
  TechStack,
  Experience,
  Education,
  Testimonial,
  Certificate,
  Message,
  About,
  User
} = require('./db.cjs');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Connect to MongoDB
connectDB();

// Middleware
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

// Authentication middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const validPassword = await user.validatePassword(password);
    if (!validPassword) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Protected route test
app.get('/admin', authenticate, (req, res) => {
  return res.json({ message: 'Welcome to admin area', user: req.user });
});

// Public GET endpoint for About (no authentication)
app.get('/api/about', async (req, res) => {
  try {
    const aboutData = await About.findOne();
    if (!aboutData) return res.status(404).json({ message: 'About data not found' });
    res.json(aboutData);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Public POST endpoint for Messages (no authentication)
app.post('/api/messages', async (req, res) => {
  try {
    const messageData = {
      ...req.body,
      date: new Date().toISOString()
    };
    const message = new Message(messageData);
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

// Generic CRUD and count endpoints for any model
const createCrudEndpoints = (path, Model, options = {}) => {
  const { publicGet = false } = options;

  if (publicGet) {
    app.get(`/api/${path}`, async (req, res) => {
      try {
        const items = await Model.find();
        res.json(items);
      } catch (err) {
        res.status(500).json({ message: 'Server error' });
      }
    });
  } else {
    app.get(`/api/${path}`, authenticate, async (req, res) => {
      try {
        const items = await Model.find();
        res.json(items);
      } catch (err) {
        res.status(500).json({ message: 'Server error' });
      }
    });
  }

  app.post(`/api/${path}`, authenticate, async (req, res) => {
    try {
      let itemData = req.body;
      if (path === 'messages') {
        itemData = {
          ...req.body,
          date: new Date().toISOString()
        };
      }
      const item = new Model(itemData);
      await item.save();
      res.status(201).json(item);
    } catch (err) {
      res.status(400).json({ message: 'Invalid data' });
    }
  });

  app.put(`/api/${path}/:id`, authenticate, async (req, res) => {
    try {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!item) return res.status(404).json({ message: `${path} item not found` });
      res.json(item);
    } catch (err) {
      res.status(400).json({ message: 'Invalid data' });
    }
  });

  app.delete(`/api/${path}/:id`, authenticate, async (req, res) => {
    try {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) return res.status(404).json({ message: `${path} item not found` });
      res.json({ message: `${path} item deleted` });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get(`/api/${path}/count`, authenticate, async (req, res) => {
    try {
      const count = await Model.countDocuments();
      res.json({ count });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
};

createCrudEndpoints('projects', Project, { publicGet: true });
createCrudEndpoints('techstack', TechStack, { publicGet: true });
createCrudEndpoints('experience', Experience, { publicGet: true });
createCrudEndpoints('education', Education, { publicGet: true });
createCrudEndpoints('testimonials', Testimonial, { publicGet: true });
createCrudEndpoints('certificates', Certificate, { publicGet: true });
createCrudEndpoints('messages', Message);
  
// PATCH endpoint to update read status of a message
app.patch('/api/messages/:id/read', authenticate, async (req, res) => {
  try {
    const { read } = req.body;
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { read },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json(message);
  } catch (err) {
    console.error('Error updating message read status:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

createCrudEndpoints('about', About);

// Create user endpoint
app.post('/api/users', authenticate, async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const user = new User({ username, email, role });
    await user.setPassword(password);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(400).json({ message: 'Invalid data' });
  }
});
app.post('/api/users', authenticate, async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const user = new User({ username, email, role });
    await user.setPassword(password);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

// Update user endpoint with password hashing
app.put('/api/users/:id', authenticate, async (req, res) => {
  try {
    const { password, ...updateData } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (updateData.username !== undefined) user.username = updateData.username;
    if (updateData.email !== undefined) user.email = updateData.email;
    if (updateData.role !== undefined) user.role = updateData.role;

    if (password && password.trim() !== '') {
      await user.setPassword(password);
    }

    await user.save();
    res.json(user);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(400).json({ message: 'Invalid data' });
  }
});

// Generic user endpoints
createCrudEndpoints('users', User);

app.get('/api/users/count', authenticate, async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
