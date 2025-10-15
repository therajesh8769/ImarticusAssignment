import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/Course.js';

dotenv.config();

const seedCourse = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    await Course.deleteMany({});
    console.log('Cleared existing courses');

    const mlCourse = new Course({
      title: 'Introduction To Machine Learning',
      description: 'A comprehensive introduction to Machine Learning covering fundamental concepts, algorithms, and practical applications. Perfect for beginners looking to start their ML journey.',
      price: 500,
      lessons: [
        {
          title: 'What is Machine Learning?',
          youtubeUrl: 'https://www.youtube.com/embed/ukzFI9rgwfU',
          duration: '15:30',
          order: 1
        },
        {
          title: 'Types of Machine Learning',
          youtubeUrl: 'https://www.youtube.com/embed/81ymPYEtFuM',
          duration: '12:45',
          order: 2
        },
        {
          title: 'Linear Regression Explained',
          youtubeUrl: 'https://www.youtube.com/embed/7ArmBVF2dCs',
          duration: '18:20',
          order: 3
        },
        {
          title: 'Decision Trees and Random Forests',
          youtubeUrl: 'https://www.youtube.com/embed/LDRbO9a6XPU',
          duration: '22:15',
          order: 4
        },
        {
          title: 'Neural Networks Introduction',
          youtubeUrl: 'https://www.youtube.com/embed/aircAruvnKk',
          duration: '19:13',
          order: 5
        }
      ],
      documents: [
        {
          title: 'Machine Learning Fundamentals Guide',
          pdfUrl: 'https://arxiv.org/pdf/1810.08055.pdf',
          description: 'Comprehensive guide covering the basics of machine learning algorithms and concepts',
          order: 1
        },
        {
          title: 'Python for Machine Learning',
          pdfUrl: 'https://arxiv.org/pdf/1908.10821.pdf',
          description: 'Essential Python programming concepts and libraries for ML practitioners',
          order: 2
        },
        {
          title: 'Supervised Learning Deep Dive',
          pdfUrl: 'https://arxiv.org/pdf/1811.12808.pdf',
          description: 'In-depth exploration of supervised learning techniques and applications',
          order: 3
        },
        {
          title: 'Neural Networks and Deep Learning',
          pdfUrl: 'https://arxiv.org/pdf/1807.11164.pdf',
          description: 'Advanced concepts in neural networks and deep learning architectures',
          order: 4
        }
      ],
      isActive: true
    });

    await mlCourse.save();
    console.log('Course seeded successfully:', mlCourse.title);
    console.log('Course ID:', mlCourse._id);

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedCourse();
