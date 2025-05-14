/* app/page.jsx */
'use client';

import { useState } from 'react';
import emailjs from '@emailjs/browser';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    isStudent: false,
    studentId: '',
    campaign: '',
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }
    if (formData.isStudent && formData.studentId.length < 5) {
      newErrors.studentId = 'Student ID must be at least 5 characters long';
    }
    if (!formData.campaign) {
      newErrors.campaign = 'Please select if you are in the campaign';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage('');

    const templateParams = {
      from_name: formData.name,
      email: formData.email,
      phone: formData.phone,
      is_student: formData.isStudent ? 'Yes' : 'No',
      student_id: formData.isStudent ? formData.studentId : 'N/A',
      campaign: formData.campaign || 'Not specified',
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
            email: '',
            phone: '',
            isStudent: false,
            studentId: '',
            campaign: '',
          });
          setShowModal(true); // Show modal on successful submission
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">User Information Form</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.name ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.email ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.phone ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Is Student Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isStudent"
              name="isStudent"
              checked={formData.isStudent}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isStudent" className="ml-2 text-sm text-gray-700">
              Is Student
            </label>
          </div>

          {/* Student ID (Conditional) */}
          {formData.isStudent && (
            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
                Student ID
              </label>
              <input
                type="text"
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                className={`mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.studentId ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.studentId && <p className="text-red-500 text-xs mt-1">{errors.studentId}</p>}
            </div>
          )}

          {/* Campaign Radio Buttons */}
          <div>
            <p className="text-sm font-medium text-gray-700">Are you in this campaign?</p>
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="campaignYes"
                  name="campaign"
                  value="Yes"
                  checked={formData.campaign === 'Yes'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="campaignYes" className="ml-2 text-sm text-gray-700">
                  Yes
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="campaignNo"
                  name="campaign"
                  value="No"
                  checked={formData.campaign === 'No'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="campaignNo" className="ml-2 text-sm text-gray-700">
                  No
                </label>
              </div>
              {errors.campaign && <p className="text-red-500 text-xs mt-1">{errors.campaign}</p>}
            </div>
          </div>

          {/* Submit Button with Loader */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full p-2 rounded-md flex items-center justify-center text-white ${
              isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
          <p className={`mt-4 text-center text-sm ${message.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
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
              className="mt-4 w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}