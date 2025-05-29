const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://Emad:EmadSaeid234@clusterportfolio.neaunaj.mongodb.net/portfolio', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Define schemas and models

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  technologies: [String],
  demoUrl: String,
  githubUrl: String,
  featured: Boolean,
});

const Project = mongoose.model('Project', projectSchema);

const techStackSchema = new mongoose.Schema({
  name: String,
  icon: String,
  category: { type: String, enum: ['frontend', 'backend', 'tools', 'other'] },
  proficiency: Number,
});

const TechStack = mongoose.model('TechStack', techStackSchema);

const experienceSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  from: String,
  to: String,
  current: Boolean,
  description: String,
});

const Experience = mongoose.model('Experience', experienceSchema);

const educationSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  location: String,
  from: String,
  to: String,
  description: String,
});

const Education = mongoose.model('Education', educationSchema);

const testimonialSchema = new mongoose.Schema({
  name: String,
  role: String,
  company: String,
  testimonial: String,
  image: String,
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

const certificateSchema = new mongoose.Schema({
  title: String,
  issuer: String,
  date: String,
  url: String,
  image: String,
});

const Certificate = mongoose.model('Certificate', certificateSchema);

const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  date: Date,
  read: Boolean,
});

const Message = mongoose.model('Message', messageSchema);

const aboutSchema = new mongoose.Schema({
  fullName: String,
  title: String,
  bio: String,
  profileImage: String,
  location: String,
  email: String,
  phone: String,
  resumeUrl: String,
  social: {
    github: String,
    linkedin: String,
    twitter: String,
    website: String,
  },
});

const About = mongoose.model('About', aboutSchema);

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
});

const specializationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
});

const Specialization = mongoose.model('Specialization', specializationSchema);

// Method to set password hash
userSchema.methods.setPassword = async function(password) {
  // console.log('setPassword called with password:', password);
  const hashedPassword = await bcrypt.hash(password, 10);
  // console.log('Hashed password:', hashedPassword);
  this.passwordHash = hashedPassword;
  console.log('passwordHash set on user document');
};

// Method to validate password
userSchema.methods.validatePassword = async function(password) {
  return bcrypt.compare(password, this.passwordHash);
};

const User = mongoose.model('User', userSchema);

module.exports = {
  connectDB,
  Project,
  TechStack,
  Experience,
  Education,
  Testimonial,
  Certificate,
  Message,
  About,
  User,
  Specialization,
};
