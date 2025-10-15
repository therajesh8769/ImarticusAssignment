import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { User, Mail, Phone, MapPin, Briefcase } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5001/api';

const ApplicationSection = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+91',
    mobile: '',
    location: '',
    experience: 'beginner'
  });
//will optimize later with dynamic course id
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseId = '68effcabc67ae37e99edafd1';
        
         const response = await axios.get(`${API_BASE_URL}/courses/${courseId}`, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        });

        if (response.data.success) {
          setCourse(response.data.course);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    };
    fetchCourse();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!course) {
      alert('Course not found');
      return;
    }

    const { name, email, mobile, location, experience } = formData;

    if (!name || !email || !mobile || !location || !experience) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);

    try {
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        alert('Failed to load Razorpay SDK. Please check your internet connection.');
        setLoading(false);
        return;
      }

      const orderResponse = await axios.post(`${API_BASE_URL}/payment/create-order`, {
        amount: course.price,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`
      });

      if (!orderResponse.data.success) {
        throw new Error('Failed to create order');
      }

      const { order } = orderResponse.data;

      const enrollmentResponse = await axios.post(`${API_BASE_URL}/enrollments`, {
        name,
        email,
        mobile,
        location,
        experience,
        courseId: course._id,
        razorpayOrderId: order.id
      });

      if (!enrollmentResponse.data.success) {
        throw new Error('Failed to create enrollment');
      }

      const enrollment = enrollmentResponse.data.enrollment;






const getRazorpayKey = () => {
  return (typeof process !== 'undefined' && process.env && process.env.REACT_APP_RAZORPAY_KEY_ID) || null;
};


      const options = {
        key:process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'LMS Platform',
        description: course.title,
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyResponse = await axios.post(`${API_BASE_URL}/payment/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              enrollmentId: enrollment._id
            });

            if (verifyResponse.data.success) {
              navigate(`/course/${enrollment._id}`);
            } else {
              alert('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed');
          }
        },
        prefill: {
          name,
          email,
          contact: mobile
        },
        theme: {
          color: '#0d6efd'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setLoading(false);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment initiation failed. Please try again.');
      setLoading(false);
    }
  };



  return (
    <section style={{ backgroundColor: '#0C5C4C', minHeight: '100vh', padding: '80px 0' }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 text-white">
            <h2 className="mb-5" style={{ fontSize: '48px', fontWeight: 'bold' }}>
              Key Highlights
            </h2>
            <div className="row g-4 mb-5">
              <div className="col-md-6">
                <div style={{ backgroundColor: '#FF7F50', borderRadius: '12px', padding: '40px 30px', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '56px', fontWeight: 'bold', marginBottom: '10px' }}>1600+</h3>
                  <p style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>Students Placed</p>
                </div>
              </div>
              <div className="col-md-6">
                <div style={{ backgroundColor: '#FF7F50', borderRadius: '12px', padding: '40px 30px', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '56px', fontWeight: 'bold', marginBottom: '10px' }}>12LPA</h3>
                  <p style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>Highest CTC</p>
                </div>
              </div>
              <div className="col-md-6">
                <div style={{ backgroundColor: '#FF7F50', borderRadius: '12px', padding: '40px 30px', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '56px', fontWeight: 'bold', marginBottom: '10px' }}>10</h3>
                  <p style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>Assured Interviews</p>
                </div>
              </div>
              <div className="col-md-6">
                <div style={{ backgroundColor: '#FF7F50', borderRadius: '12px', padding: '40px 30px', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '56px', fontWeight: 'bold', marginBottom: '10px' }}>1000+</h3>
                  <p style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>Hiring partners</p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p style={{ fontSize: '18px', marginBottom: '30px' }}>
                The Program has been created in collaboration with Managers from
              </p>
              <div className="d-flex justify-content-center align-items-center gap-4 flex-wrap">
                <span style={{ fontSize: '32px', fontWeight: 'bold', fontStyle: 'italic' }}>zomato</span>
                <span style={{ fontSize: '28px', fontWeight: 'bold' }}>rapido</span>
                <div className="d-flex align-items-center gap-2">
                  <div style={{ width: '40px', height: '40px', backgroundColor: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#0C5C4C', fontSize: '24px', fontWeight: 'bold' }}>+</span>
                  </div>
                  <span style={{ fontSize: '28px', fontWeight: 'bold' }}>mfine</span>
                </div>
                <span style={{ fontSize: '28px', fontWeight: 'bold' }}>Deloitte.</span>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card" style={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
              <div className="card-body p-5">
                <h3 className="mb-4" style={{ fontSize: '24px', fontWeight: 'bold', color: '#2C3E50' }}>
                  Apply For The <span style={{ color: '#FF7F50' }}>MyCaptain Digital Marketing Job Assurance Program</span>
                </h3>
                <form onSubmit={handlePayment}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <User size={18} className="me-2" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <Mail size={18} className="me-2" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <Phone size={18} className="me-2" />
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="+91 1234567890"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <MapPin size={18} className="me-2" />
                      Location
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="City, State"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      <Briefcase size={18} className="me-2" />
                      Experience Level
                    </label>
                    <select
                      className="form-select"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      required
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Processing...
                      </>
                    ) : (
                      `Proceed to Payment - ₹${500}`
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApplicationSection;
