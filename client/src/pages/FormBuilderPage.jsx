import React, { useState, useEffect } from 'react';
import { FormBuilder } from '@formio/react'; // Import the FormBuilder component
import { useNavigate, useParams } from 'react-router-dom'; // For navigation and potential ID from URL
import '../App.css'; // General styling
import './FormBuilderPage.css'; // Specific styles for the builder
import { BACKEND_BASE_URL } from '../constants';

function FormBuilderPage() {
    const navigate = useNavigate();
    const { formId } = useParams(); // If you want to load a form for editing via URL: /form-builder/:formId

    const [formSchema, setFormSchema] = useState({ components: [] }); // Initial empty schema for builder
    const [formTitle, setFormTitle] = useState('');
    const [formName, setFormName] = useState(''); // A unique machine-readable name for the form
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isEditMode, setIsEditMode] = useState(false); // To distinguish create vs. edit

    const backendBaseUrl = `http://${import.meta.env.VITE_SERVER_URL}:${import.meta.env.VITE_SERVER_PORT}/api/forms`; // Your backend API endpoint for forms

    useEffect(() => {
        // If formId is present, we are in edit mode, so load the form
        if (formId) {
            setIsEditMode(true);
            setLoading(true);
            setError('');
            setSuccessMessage('');
            const fetchForm = async () => {
                try {
                    const response = await fetch(`http://${import.meta.env.VITE_SERVER_URL}:${import.meta.env.VITE_SERVER_PORT}/${formId}`);
                    const data = await response.json();
                    if (response.ok) {
                        setFormTitle(data.title);
                        setFormName(data.name);
                        setFormSchema(data.schema || { components: [] }); // Ensure schema exists
                    } else {
                        setError(data.message || 'Failed to load form for editing.');
                    }
                } catch (err) {
                    setError('Network error: Could not load form.');
                    console.error('Error loading form:', err);
                } finally {
                    setLoading(false);
                }
            };
            fetchForm();
        } else {
            // Not in edit mode, ensure clean state for new form
            setIsEditMode(false);
            setFormTitle('');
            setFormName('');
            setFormSchema({ components: [] });
        }
    }, [formId, backendBaseUrl]);

    const handleFormChange = (schema) => {
        // This callback is fired whenever the form schema changes in the builder
        setFormSchema(schema);
        // console.log("Current Form Schema:", schema); // For debugging
    };

    const handleSaveForm = async () => {
        setLoading(true);
        setError('');
        setSuccessMessage('');

        // Basic validation before saving
        if (!formTitle.trim()) {
            setError('Form title is required.');
            setLoading(false);
            return;
        }
        if (!formName.trim()) {
            setError('Form name (unique identifier) is required.');
            setLoading(false);
            return;
        }
        if (!formSchema || !formSchema.components) {
             setError('Form schema is empty. Please add components to the form.');
             setLoading(false);
             return;
        }


        const formPayload = {
            title: formTitle.trim(),
            name: formName.trim(), // Use a unique slug/name for your form
            schema: formSchema // The JSON schema generated by Form.io builder
        };

        try {
            const url = isEditMode ? `${backendBaseUrl}/${formId}` : backendBaseUrl;
            const method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    // Add authorization header if your backend requires a token
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formPayload),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(data.message || (isEditMode ? 'Form updated successfully!' : 'Form created successfully!'));
                // After successful creation, you might want to redirect to edit mode or a list of forms
                if (!isEditMode && data._id) { // If it's a new form and backend returns ID
                    navigate(`/form-builder/${data._id}`); // Redirect to edit mode for the new form
                }
            } else {
                setError(data.message || (isEditMode ? 'Failed to update form.' : 'Failed to create form.'));
            }
        } catch (err) {
            setError('Network error: Could not save form.');
            console.error('Error saving form:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditMode) {
        return <div className="auth-container"><div className="auth-box"><p>Loading form for editing...</p></div></div>;
    }

    return (
        <div className="auth-container">
            <div className="auth-box" style={{ maxWidth: '90%' }}> {/* Wider box for builder */}
                <h2 className="auth-title">{isEditMode ? 'Edit Form' : 'Create New Form'}</h2>

                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}

                <div className="form-group" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                    <label htmlFor="formTitle">Form Title</label>
                    <input
                        type="text"
                        id="formTitle"
                        placeholder="e.g., Contact Us Form"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <div className="form-group" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                    <label htmlFor="formName">Form Name (Unique Identifier)</label>
                    <input
                        type="text"
                        id="formName"
                        placeholder="e.g., contactUsForm"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        disabled={loading || isEditMode} // Usually, name is set on creation, not edited
                    />
                    <small style={{ color: 'var(--secondary-color)', fontSize: '0.85rem' }}>
                        This should be a unique, machine-readable identifier (e.g., `my-loan-application`).
                    </small>
                </div>

                {/* Form.io Builder */}
                <div className="form-builder-wrapper">
                    {/* Only render FormBuilder when formSchema is initialized or loaded */}
                    {(!isEditMode || (isEditMode && formSchema.components)) && (
                        <FormBuilder
                            form={formSchema} // Pass the current schema state
                            onChange={handleFormChange} // Update state when builder changes
                            options={{
                                // builder: {
                                //     premium: false // Disable premium tab if not licensed
                                // }
                            }}
                        />
                    )}
                </div>

                <button
                    onClick={handleSaveForm}
                    className="btn btn-primary auth-btn"
                    disabled={loading}
                    style={{ marginTop: '2rem' }}
                >
                    {loading ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? 'Update Form' : 'Save Form')}
                </button>
            </div>
        </div>
    );
}

export default FormBuilderPage;