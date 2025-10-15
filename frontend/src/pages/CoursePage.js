import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { PlayCircle, FileText, Sparkles, CheckCircle, Loader } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5001/api';

export default function CoursePage() {
  const { enrollmentId } = useParams();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [summaries, setSummaries] = useState({});
  const [loadingSummary, setLoadingSummary] = useState(null);

  useEffect(() => {
    const fetchEnrollmentAndCourse = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/enrollments/verify/${enrollmentId}`);
        if (response.data.success) {
          setEnrollment(response.data.enrollment);
          setCourse(response.data.course);
          if (response.data.course.lessons.length > 0) {
            setSelectedLesson(response.data.course.lessons[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        alert('Failed to load course. Please check your enrollment.');
      } finally {
        setLoading(false);
      }
    };

    if (enrollmentId) {
      fetchEnrollmentAndCourse();
    }
  }, [enrollmentId]);

  const handleSummarize = async (doc) => {
    if (summaries[doc._id]) {
      setSummaries({ ...summaries, [doc._id]: '' });
      return;
    }

    setLoadingSummary(doc._id);
    try {
      const response = await axios.post(`${API_BASE_URL}/ai/summarize-pdf`, {
        pdfUrl: doc.pdfUrl,
        title: doc.title
      });

      if (response.data.success) {
        setSummaries({ ...summaries, [doc._id]: response.data.summary });
      }
    } catch (error) {
      console.error('Error summarizing PDF:', error);
      alert('Failed to generate summary. Please try again.');
    } finally {
      setLoadingSummary(null);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading your course...</p>
        </div>
      </div>
    );
  }

  if (!course || !enrollment) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h2 className="text-danger mb-3">Access Denied</h2>
          <p className="text-muted">Unable to verify your enrollment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      <div className="bg-success text-white py-4 shadow-sm">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 mb-1">{course.title}</h1>
              <p className="mb-0 opacity-75">Welcome, {enrollment.name}</p>
            </div>
            <div className="text-end">
              <span className="badge  px-3 py-2">
                <CheckCircle size={16} className="me-1" />
                Enrolled
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4">
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body p-0">
                {selectedLesson && (
                  <div>
                    <div className="ratio ratio-16x9">
                      <iframe
                        src={selectedLesson.youtubeUrl}
                        title={selectedLesson.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="p-4">
                      <h3 className="h4 mb-2">{selectedLesson.title}</h3>
                      {selectedLesson.duration && (
                        <p className="text-muted mb-0">Duration: {selectedLesson.duration}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="card shadow-sm border-0">
              <div className="card-header bg-white py-3">
                <h4 className="mb-0">
                  <FileText size={20} className="me-2" />
                  Course Documents
                </h4>
              </div>
              <div className="card-body">
                {course.documents.length === 0 ? (
                  <p className="text-muted mb-0">No documents available yet.</p>
                ) : (
                  <div className="list-group list-group-flush">
                    {course.documents.map((doc) => (
                      <div key={doc._id} className="list-group-item px-0">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="flex-grow-1">
                            <h6 className="mb-1">{doc.title}</h6>
                            {doc.description && (
                              <p className="text-muted small mb-2">{doc.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="d-flex gap-2">
                          <a
                            href={doc.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-primary"
                          >
                            <FileText size={16} className="me-1" />
                            View PDF
                          </a>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleSummarize(doc)}
                            disabled={loadingSummary === doc._id}
                          >
                            {loadingSummary === doc._id ? (
                              <>
                                <Loader size={16} className="me-1 spinner-border spinner-border-sm" />
                                Summarizing...
                              </>
                            ) : summaries[doc._id] ? (
                              <>Hide Summary</>
                            ) : (
                              <>
                                <Sparkles size={16} className="me-1" />
                                Summarize with AI
                              </>
                            )}
                          </button>
                        </div>
                        {summaries[doc._id] && (
                          <div className="mt-3 p-3 bg-light rounded">
                            <h6 className="text-primary mb-2">
                              <Sparkles size={16} className="me-1" />
                              AI Summary
                            </h6>
                            <p className="mb-0 small" style={{ whiteSpace: 'pre-line' }}>
                              {summaries[doc._id]}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card shadow-sm border-0 sticky-top" style={{ top: '1rem' }}>
              <div className="card-header bg-white py-3">
                <h5 className="mb-0">
                  <PlayCircle size={20} className="me-2" />
                  Course Lessons
                </h5>
              </div>
              <div className="list-group list-group-flush">
                {course.lessons.map((lesson, index) => (
                  <button
                    key={lesson._id}
                    className={`list-group-item list-group-item-action ${
                      selectedLesson && selectedLesson._id === lesson._id ? 'active' : ''
                    }`}
                    onClick={() => setSelectedLesson(lesson)}
                  >
                    <div className="d-flex align-items-start">
                      <span className="badge bg-secondary me-2 mt-1">{index + 1}</span>
                      <div className="flex-grow-1">
                        <div className="fw-semibold">{lesson.title}</div>
                        {lesson.duration && (
                          <small className={selectedLesson && selectedLesson._id === lesson._id ? 'text-white-50' : 'text-muted'}>
                            {lesson.duration}
                          </small>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
