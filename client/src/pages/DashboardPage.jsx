// frontend_tm_2025/src/pages/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // <--- Import Link
import { BACKEND_BASE_URL } from '../constants'; 
import '../App.css'; 

const getUserRole = () => {
    return localStorage.getItem('userRole');
};

function DashboardPage() { 
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const selectedRole = getUserRole() || 'user';
    

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                setLoading(true);
                setError(null);

                const url = `http://${import.meta.env.VITE_SERVER_URL}:${import.meta.env.VITE_SERVER_PORT}/dashboard/my_documents?role=${selectedRole}`;
                
                console.log('Frontend: Attempting to fetch documents from:', url);

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Frontend: Received response from backend:', data);
                    
                    if (Array.isArray(data.documents)) {
                        setDocuments(data.documents);
                        console.log('Frontend: Successfully fetched documents:', data.documents);
                    } else {
                        setError(data.message || "Backend did not return documents as expected (success: false or documents not array).");
                        console.error('Frontend: Backend response data issue:', data);
                    }
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || `Failed to fetch documents: ${response.status} ${response.statusText}`);
                    console.error('Frontend: HTTP error response:', response.status, response.statusText, errorData);
                }
            } catch (err) {
                setError(`Network error: ${err.message}. Please ensure the backend server is running and accessible.`);
                console.error('Frontend: Network error during document fetch:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, [selectedRole]); 

    return (
        <div className="dashboard-container">
            <nav className="dashboard-navbar">
                <div className="container">
                    <span className="navbar-brand">OS<span className="brand-accent">Forms</span>-Dashboard</span>
                    <ul className="navbar-nav">
                        <li><Link to="/dashboard">My Documents</Link></li> 
                        {/* <li><Link to="/settings">Settings</Link></li> */}
                        <li><Link to="/">Logout</Link></li>
                    </ul>
                </div>
            </nav>
            <div className="dashboard-content container">
                <h2>Hello {selectedRole}</h2>
                <p>Welcome to OSForms! This is where you'll manage your documents.</p>

                <div className="dashboard-actions">
                    <button className="btn btn-primary btn-large">Upload Document</button>
                    <button className="btn btn-secondary btn-large">View All Documents</button>

                    <Link to="/dynamic-form" className="btn btn-primary btn-large">
                        Access a Form
                    </Link>
                    <Link to="/form-builder" className="btn btn-accent btn-large">
                        Build New Form
                    </Link>
                </div>

                <div className="dashboard-section" style={{ marginTop: '30px' }}>
                    <h3>Your Documents</h3>
                    
                    {loading && <p style={{ textAlign: 'center', color: '#555' }}>Loading documents...</p>}

                    {error && <p style={{ textAlign: 'center', color: 'red', fontWeight: 'bold' }}>Error: {error}</p>}

                    {!loading && !error && documents.length === 0 && (
                        <p style={{ textAlign: 'center', color: '#777' }}>No documents found for this role.</p>
                    )}

                    {!loading && !error && documents.length > 0 && (
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                            gap: '20px',
                            marginTop: '20px'
                        }}>
                            {documents.map(doc => (
                                // Wrap the document div with Link
                                <Link 
                                    to={`/dashboard/document?id=${doc._id}&role=${selectedRole}`}
                                    key={doc._id} 
                                    style={{ textDecoration: 'none', color: 'inherit' }} // Remove default link styling
                                >
                                    <div style={{ 
                                        border: '1px solid #ddd', 
                                        padding: '15px', 
                                        borderRadius: '8px', 
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                        backgroundColor: '#fff',
                                        transition: 'transform 0.2s ease-in-out',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        cursor: 'pointer' // Add a pointer cursor
                                    }}>
                                        <h3 style={{ margin: '0 0 10px 0', color: '#0056b3' }}>{doc.name}</h3>
                                        <p style={{ margin: '0 0 5px 0', color: '#555', fontSize: '0.9em' }}>
                                            <strong>Description:</strong> {doc.description || 'N/A'}
                                        </p>
                                        <p style={{ margin: '0 0 5px 0', color: '#555', fontSize: '0.9em' }}>
                                            <strong>Created By:</strong> {doc.createdBy}
                                        </p>
                                        <p style={{ margin: '0 0 5px 0', color: '#555', fontSize: '0.9em' }}>
                                            <strong>Workflow Step:</strong> {doc.workflowStepType}
                                        </p>
                                        <p style={{ margin: '0', color: '#777', fontSize: '0.8em' }}>
                                            <strong>Created At:</strong> {new Date(doc.createdAt).toLocaleDateString()} {new Date(doc.createdAt).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <div className="dashboard-section" style={{ marginTop: '30px' }}>
                    <h3>Other Dashboard Information</h3>
                    <p>Perhaps some charts or other user-specific data here.</p>
                </div>
                
            </div>
        </div>
    );
}

export default DashboardPage;