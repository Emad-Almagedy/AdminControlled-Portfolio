import mongoose from 'mongoose';
import { connectDB, Project, TechStack, Experience, Education, Testimonial, Certificate, Message, About, User, Specialization } from './db.cjs';

const mockProjects = [
  {
    title: 'E-commerce Platform',
    description: 'A full-featured e-commerce platform with product management, shopping cart, and payment processing.',
    image: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Stripe'],
    demoUrl: 'https://demo-ecommerce.example.com',
    githubUrl: 'https://github.com/username/ecommerce-project',
    featured: true
  },
  {
    title: 'Weather Forecast App',
    description: 'A real-time weather application using modern APIs and geolocation.',
    image: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    technologies: ['React', 'OpenWeather API', 'Geolocation API', 'Tailwind CSS'],
    demoUrl: 'https://weather-app.example.com',
    githubUrl: 'https://github.com/username/weather-app',
    featured: true
  },
  {
    title: 'Task Management System',
    description: 'A Kanban-style project management tool with drag and drop functionality.',
    image: 'https://images.pexels.com/photos/3243/pen-calendar-to-do-checklist.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    technologies: ['React', 'Redux', 'Firebase', 'Material UI'],
    demoUrl: 'https://task-manager.example.com',
    githubUrl: 'https://github.com/username/task-manager',
    featured: false
  },
  {
    title: 'Social Media Dashboard',
    description: 'A dashboard to monitor social media metrics and engagement.',
    image: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    technologies: ['React', 'Chart.js', 'Node.js', 'Express'],
    demoUrl: 'https://social-dashboard.example.com',
    githubUrl: 'https://github.com/username/social-dashboard',
    featured: false
  },
  {
    title: 'Blog Platform',
    description: 'A modern blogging platform with markdown support and SEO optimization.',
    image: 'https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    technologies: ['Next.js', 'React', 'GraphQL', 'Apollo'],
    demoUrl: 'https://blog-platform.example.com',
    githubUrl: 'https://github.com/username/blog-platform',
    featured: true
  },
  {
    title: 'Fitness Tracker',
    description: 'An app to track workouts, nutrition, and progress over time.',
    image: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    technologies: ['React Native', 'Firebase', 'Redux'],
    demoUrl: 'https://fitness-tracker.example.com',
    githubUrl: 'https://github.com/username/fitness-tracker',
    featured: false
  }
];

const mockSpecializations = [
  {
    title: 'Machine Learning & AI',
    description: 'Predictive Modeling, Feature Engineering, Natural Language Processing, Generative AI, CNNs, LLMs, RAG.',
    icon: 'https://cdn-icons-png.flaticon.com/512/1055/1055687.png'
  },
  {
    title: 'Computer Vision',
    description: 'Image processing, Deep learning-based generation (e.g., Stable Diffusion), OpenCV, TensorFlow, PyTorch.',
    icon: 'https://cdn-icons-png.flaticon.com/512/1055/1055687.png'
  },
  {
    title: 'Data Science & Visualization',
    description: 'Advanced Analytics, Data Processing, Matplotlib, Seaborn, Plotly, Interactive Dashboards.',
    icon: 'https://cdn-icons-png.flaticon.com/512/1055/1055687.png'
  },
  {
    title: 'Software & Web Development',
    description: 'Full-Stack Development, Python, JavaScript, HTML, CSS, C/C++, SQL, Visual Studio Code, PyCharm, React, Node.js.',
    icon: 'https://cdn-icons-png.flaticon.com/512/1055/1055687.png'
  },
  {
    title: 'Database & System Knowledge',
    description: 'Database Management, Networking Protocols, Operating Systems.',
    icon: 'https://cdn-icons-png.flaticon.com/512/1055/1055687.png'
  }
];

const mockTechStack = [
  { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', category: 'frontend', proficiency: 90 },
  { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', category: 'frontend', proficiency: 85 },
  { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', category: 'backend', proficiency: 80 },
  { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', category: 'backend', proficiency: 75 },
  { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', category: 'tools', proficiency: 70 },
  { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', category: 'tools', proficiency: 85 },
  { name: 'GraphQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg', category: 'backend', proficiency: 65 },
];

const mockExperience = [
  {
    title: 'Senior Software Engineer',
    company: 'Tech Innovations Inc.',
    location: 'San Francisco, CA',
    from: '2020-01',
    to: null,
    current: true,
    description: 'Led development team in creating scalable web applications. Implemented CI/CD pipelines and improved performance by 40%.'
  },
  {
    title: 'Full Stack Developer',
    company: 'Digital Solutions LLC',
    location: 'Austin, TX',
    from: '2018-03',
    to: '2019-12',
    current: false,
    description: 'Developed and maintained multiple web applications using React and Node.js. Collaborated with UX/UI designers to implement responsive designs.'
  },
  {
    title: 'Software Engineer',
    company: 'Creative Apps Co.',
    location: 'New York, NY',
    from: '2016-06',
    to: '2018-02',
    current: false,
    description: 'Worked on mobile and web applications, improving user experience and performance.'
  },
  {
    title: 'Junior Developer',
    company: 'Startup Hub',
    location: 'Boston, MA',
    from: '2015-01',
    to: '2016-05',
    current: false,
    description: 'Assisted in developing web applications and fixing bugs.'
  }
];

const mockEducation = [
  {
    degree: 'M.S. Computer Science',
    institution: 'Stanford University',
    location: 'Stanford, CA',
    from: '2016',
    to: '2018',
    description: 'Focus on artificial intelligence and machine learning. Thesis on neural network optimization.'
  },
  {
    degree: 'B.S. Computer Engineering',
    institution: 'MIT',
    location: 'Cambridge, MA',
    from: '2012',
    to: '2016',
    description: 'GPA: 3.85/4.0. Member of ACM student chapter. Senior project on embedded systems.'
  },
  {
    degree: 'B.A. Graphic Design',
    institution: 'Rhode Island School of Design',
    location: 'Providence, RI',
    from: '2010',
    to: '2014',
    description: 'Specialized in digital media and visual communication.'
  },
  {
    degree: 'Diploma in Web Development',
    institution: 'Code Academy',
    location: 'Online',
    from: '2019',
    to: '2020',
    description: 'Completed intensive web development bootcamp focusing on full stack JavaScript.'
  }
];

const mockTestimonials = [
  {
    name: 'Sarah Johnson',
    role: 'CTO',
    company: 'Innovate Labs',
    testimonial: 'One of the most talented engineers I\'ve had the pleasure to work with. Their attention to detail and problem-solving skills are exceptional.',
    image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    name: 'Michael Chen',
    role: 'Product Manager',
    company: 'TechForward',
    testimonial: 'Their ability to translate complex requirements into elegant solutions made our project successful. Always delivers high-quality work on time.',
    image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    name: 'Emily Davis',
    role: 'Lead Designer',
    company: 'Creative Studio',
    testimonial: 'A creative mind with excellent design skills. Their work significantly improved our product\'s user experience.',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    name: 'David Lee',
    role: 'UX Researcher',
    company: 'UserFirst',
    testimonial: 'Their research insights helped us redesign our product for better usability and engagement.',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  }
];

const mockCertificates = [
  {
    title: 'AWS Certified Solutions Architect',
    issuer: 'Amazon Web Services',
    date: '2021-05',
    url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/'
  },
  {
    title: 'Google Professional Cloud Developer',
    issuer: 'Google Cloud',
    date: '2022-01',
    url: 'https://cloud.google.com/certification/cloud-developer'
  },
  {
    title: 'Microsoft Certified: Azure Developer Associate',
    issuer: 'Microsoft',
    date: '2023-03',
    url: 'https://learn.microsoft.com/en-us/certifications/azure-developer/'
  },
  {
    title: 'Certified Kubernetes Administrator',
    issuer: 'Cloud Native Computing Foundation',
    date: '2022-11',
    url: 'https://www.cncf.io/certification/cka/'
  },
  {
    title: 'Certified Ethical Hacker',
    issuer: 'EC-Council',
    date: '2023-06',
    url: 'https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/'
  }
];

const mockMessages = [
  {
    name: 'John Smith',
    email: 'john@example.com',
    message: 'I would love to discuss a potential project with you. Please contact me when you have a chance.',
    date: new Date('2023-03-15T10:30:00'),
    read: true
  },
  {
    name: 'Lisa Wong',
    email: 'lisa@example.com',
    message: 'Your portfolio is impressive! I\'m looking for a developer to join our team. Would you be interested in discussing?',
    date: new Date('2023-03-20T14:45:00'),
    read: false
  }
];

const mockAbout = {
  fullName: 'Alex Morgan',
  title: 'Software Engineer & Full Stack Developer',
  bio: 'I\'m a passionate software engineer with over 5 years of experience building web applications. I specialize in React, Node.js, and cloud technologies. I love solving complex problems and creating intuitive user experiences.',
  profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  location: 'San Francisco, CA',
  email: 'alex@example.com',
  phone: '+1 (555) 123-4567',
  resumeUrl: '/resume.pdf',
  social: {
    github: 'https://github.com/alexmorgan',
    linkedin: 'https://linkedin.com/in/alexmorgan',
    twitter: 'https://twitter.com/alexmorgan',
    website: 'https://alexmorgan.dev'
  }
};

import bcrypt from 'bcryptjs';

const mockUsers = [
  {
    username: 'admin',
    email: 'admin@example.com',
    passwordHash: bcrypt.hashSync('admin123', 10),
    role: 'admin'
  },
  {
    username: 'user1',
    email: 'user1@example.com',
    passwordHash: bcrypt.hashSync('user123', 10),
    role: 'user'
  }
];

async function deleteAllExceptAbout() {
  await Project.deleteMany({});
  await TechStack.deleteMany({});
  await Experience.deleteMany({});
  await Education.deleteMany({});
  await Testimonial.deleteMany({});
  await Certificate.deleteMany({});
  await Message.deleteMany({});
  await User.deleteMany({});
}

async function seed() {
  try {
    await connectDB();

    // Clear existing data except About
    await deleteAllExceptAbout();

    // Insert mock data
    await Project.insertMany(mockProjects);
    await TechStack.insertMany(mockTechStack);
    await Experience.insertMany(mockExperience);
    await Education.insertMany(mockEducation);
    await Testimonial.insertMany(mockTestimonials);
    await Certificate.insertMany(mockCertificates);
    await Message.insertMany(mockMessages);
    await User.insertMany(mockUsers);
    await Specialization.insertMany(mockSpecializations);

    // Ensure About collection has only one document
    const aboutCount = await About.countDocuments();
    if (aboutCount === 0) {
      await About.create(mockAbout);
    }

    console.log('Mock data seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seed();
