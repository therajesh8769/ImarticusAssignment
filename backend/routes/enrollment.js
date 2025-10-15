import express from 'express';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, mobile, location, experience, courseId, razorpayOrderId } = req.body;

    if (!name || !email || !mobile || !location || !experience || !courseId || !razorpayOrderId) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const enrollment = new Enrollment({
      name,
      email,
      mobile,
      location,
      experience,
      courseId,
      paymentId: razorpayOrderId,
      razorpayOrderId,
      paymentStatus: 'pending'
    });

    await enrollment.save();

    res.status(201).json({
      success: true,
      enrollment
    });
  } catch (error) {
    console.error('Error creating enrollment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create enrollment',
      error: error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id).populate('courseId');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    res.json({
      success: true,
      enrollment
    });
  } catch (error) {
    console.error('Error fetching enrollment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enrollment',
      error: error.message
    });
  }
});

router.get('/verify/:enrollmentId', async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.enrollmentId).populate('courseId');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    if (enrollment.paymentStatus !== 'completed') {
      return res.status(403).json({
        success: false,
        message: 'Payment not completed'
      });
    }

    res.json({
      success: true,
      enrollment,
      course: enrollment.courseId
    });
  } catch (error) {
    console.error('Error verifying enrollment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify enrollment',
      error: error.message
    });
  }
});

export default router;
