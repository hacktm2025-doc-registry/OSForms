import React, { useState, useEffect } from 'react';
import { Form } from '@formio/react'; // Import the Form component
import { BACKEND_BASE_URL } from '../constants';

function DynamicFormPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({}); // State to hold form data

  useEffect(() => {
    async function fetchFormData() {
      try {
        const backendUrl = `${BACKEND_BASE_URL}/dashboard/documents`;
        const allDocumentTemplatesFetcher = await fetch(backendUrl, {
                  method: 'GET',
                  headers: {
                      'Content-Type': 'application/json',
                  },
              });
        const documentsTemplates = await allDocumentTemplatesFetcher.json();
        console.log('All Document Templates:', documentsTemplates);
        const myDocumentFetcher = await fetch(`${backendUrl}/${documentsTemplates.documents[0]._id}`, {
                  method: 'GET',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                });
        const myDocument = await myDocumentFetcher.json();
        console.log('My Document Template:', myDocument.document);
        setFormData(myDocument.document.data); // Set the fetched form JSON
      }
      catch (err) {
        console.error('Error fetching form data:', err);
        setError('Failed to load form data. Please try again later.');
      }
    }
    fetchFormData();
    setLoading(false);
  }, []);

  const handleSubmit = (submission) => {
    console.log('Form submitted!', submission);
    // Here, you would send the submission data to your backend
    fetch('http://127.0.0.1:3000/dashboard/submit_form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({role: "user", data: submission}),
    })
    .then(res => res.json())
    .then(data => console.log('Submission saved:', data))
    .catch(err => console.error('Error saving submission:', err));

    alert('Form submitted! Check console for data.');
  };

  if (loading) {
    return <div className="auth-container"><div className="auth-box"><p>Loading form...</p></div></div>;
  }

  if (error) {
    return <div className="auth-container"><div className="auth-box"><p className="error-message">{error}</p></div></div>;
  }

  return (
    <div className="auth-container">
      <div className="auth-box" style={{ maxWidth: '600px' }}> {/* Adjust max-width for forms */}
        <h2 className="auth-title">My Dynamic Form</h2>
        <p className="auth-subtitle">Rendered by Form.io</p>
        {!loading && (
          <div>
          <link rel="stylesheet" href="https://formio.github.io/formio.js/dist/formio.embed.css"/>
          <link rel="stylesheet" href="https://formio.github.io/formio.js/dist/formio.full.min.css"/>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css"/>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap/dist/css/bootstrap.min.css"/>
          <Form
            form={formData} // Pass the JSON form definition
            onSubmit={handleSubmit} // Handle form submission
            // You can also pass a 'src' prop if your form is hosted on a Form.io server:
            // src="https://examples.form.io/example"
            // options={{ readOnly: false, noAlerts: false }} // Additional options
          />
          </div>
        )}
      </div>
    </div>
  );
}

export default DynamicFormPage;