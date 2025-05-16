'use client';

import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { Mail, PhoneCall, Clock, MapPin } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    college: '',
    studentId: '',
    resume: null, // Can be any file type
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }
    if (!formData.dob) {
      newErrors.dob = 'Date of Birth is required';
    }
    if (!formData.college) {
      newErrors.college = 'College/University is required';
    }
    if (!formData.studentId || formData.studentId.length < 5) {
      newErrors.studentId = 'Student ID must be at least 5 characters long';
    }
    if (!formData.resume) {
      newErrors.resume = 'File is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage('');

    let resumeLink = 'N/A';
    if (formData.resume) {
      try {
        // Validate file size client-side (10 MB limit for Cloudinary free tier)
        const maxSize = 10 * 1024 * 1024; // 10 MB in bytes
        if (formData.resume.size > maxSize) {
          setMessage('File size exceeds 10 MB limit');
          setIsLoading(false);
          return;
        }

        const uploadFormData = new FormData();
        uploadFormData.append('resume', formData.resume);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to upload file');

        resumeLink = data.url;
      } catch (error) {
        setMessage(error.message || 'Failed to upload file. Please try again.');
        setIsLoading(false);
        return;
      }
    }

    const templateParams = {
      from_name: formData.name,
      dob: formData.dob,
      college: formData.college,
      student_id: formData.studentId,
      resume: resumeLink,
    };

    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setMessage('Form submitted successfully! Check your email.');
          setFormData({
            name: '',
            dob: '',
            college: '',
            studentId: '',
            resume: null,
          });
          setShowModal(true);
        },
        (error) => {
          setMessage(`Failed to send email: ${error.text}`);
        }
      )
      .finally(() => {
        setIsLoading(false);
      });
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between items-center gap-5 md:gap-12 px-6 py-7 md:py-10 lg:py-16 max-w-[1440px] mx-auto">
      {/* Left Section */}
      <div className="flex-1 space-y-8">
        <div>
          <h2 className="md:text-3xl text-2xl lg:text-4xl font-bold tracking-tight text-black">
            You Will Grow, You Will <br /> Succeed. We Promise That
          </h2>
          <p className="mt-4 text-gray-700 max-w-[654px]">
            Pellentesque arcu facilisis nunc mi proin. Dignissim mattis in lectus tincidunt tincidunt ultrices.
            Diam convallis morbi pellentesque adipiscing
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-start space-x-4">
            <PhoneCall className="text-emerald-600 w-6 h-6 mt-1" />
            <div>
              <h4 className="font-semibold text-black">Call for inquiry</h4>
              <p className="text-gray-800">+1(236)833-9770</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Mail className="text-emerald-600 w-6 h-6 mt-1" />
            <div>
              <h4 className="font-semibold text-black">Send us email</h4>
              <p className="text-gray-800">globalstaffing499@gmail.com</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Clock className="text-emerald-600 w-6 h-6 mt-1" />
            <div>
              <h4 className="font-semibold text-black">Opening hours</h4>
              <p className="text-gray-800">Mon - Fri: 10AM - 10PM</p>
            </div>
          </div>
          {/* <div className="flex items-start space-x-4">
            <MapPin className="text-emerald-600 w-6 h-6 mt-1" />
            <div>
              <h4 className="font-semibold text-black">Office</h4>
              <p className="text-gray-800">19 North Road Piscataway, NY 08854</p>
            </div>
          </div> */}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 w-full bg-[#EBF5F4] p-5 md:p-8 rounded-2xl max-w-[584px]">
        <h3 className="text-xl font-semibold text-center text-black">User Information Form</h3>
        <p className="text-center text-gray-700 mt-1 mb-6">
          Submit your details and file to get started
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.name ? 'border-red-500' : 'border-gray-300 focus:ring-emerald-500'
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium mb-1">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.dob ? 'border-red-500' : 'border-gray-300 focus:ring-emerald-500'
              }`}
            />
            {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
          </div>

          {/* College/University */}
          <div>
            <label className="block text-sm font-medium mb-1">College/University</label>
            <input
              type="text"
              name="college"
              value={formData.college}
              onChange={handleChange}
              placeholder="Your college/university"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.college ? 'border-red-500' : 'border-gray-300 focus:ring-emerald-500'
              }`}
            />
            {errors.college && <p className="text-red-500 text-xs mt-1">{errors.college}</p>}
          </div>

          {/* Student ID */}
          <div>
            <label className="block text-sm font-medium mb-1">Student ID</label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="Your student ID"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.studentId ? 'border-red-500' : 'border-gray-300 focus:ring-emerald-500'
              }`}
            />
            {errors.studentId && <p className="text-red-500 text-xs mt-1">{errors.studentId}</p>}
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">File (PDF, Images)</label>
            <input
              type="file"
              name="resume"
              accept=".pdf,image/*,.xls,.xlsx,.csv"
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.resume ? 'border-red-500' : 'border-gray-300 focus:ring-emerald-500'
              }`}
            />
            {errors.resume && <p className="text-red-500 text-xs mt-1">{errors.resume}</p>}
          </div>

          {/* Submit Button with Loader */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center text-white font-medium py-2 rounded-md transition ${
              isLoading ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p className={`mt-4 text-center text-sm ${message.includes('Failed') ? 'text-red-500' : 'text-green-600'}`}>
            {message}
          </p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold text-center text-green-600">Thank You!</h2>
            <p className="text-center text-gray-700 mt-2">
              Your form has been submitted successfully. We appreciate your response.
            </p>
            <button
              onClick={closeModal}
              className="mt-4 w-full bg-emerald-600 text-white font-medium py-2 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}