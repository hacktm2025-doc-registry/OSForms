// frontend_tm_2025/src/pages/DocumentDetail.jsx

import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { BACKEND_BASE_URL } from '../constants';

function DocumentDetail() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    const role = queryParams.get('role');

    const [document, setDocument] = useState(null); // document is initially null
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                setLoading(true);
                setError(null);

                const url = `${BACKEND_BASE_URL}/dashboard/document?id=${id}`;
                
                console.log('Frontend: Fetching document details from:', url);

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.document) {
                        setDocument(data.document);
                        console.log('Frontend: Successfully fetched document:', data.document);
                    } else {
                        setError(data.message || "Backend did not return document as expected.");
                        console.error('Frontend: Backend response data issue:', data);
                    }
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || `Failed to fetch document: ${response.status} ${response.statusText}`);
                    console.error('Frontend: HTTP error response:', response.status, response.statusText, errorData);
                }
            } catch (err) {
                setError(`Network error: ${err.message}. Please ensure the backend server is running and accessible.`);
                console.error('Frontend: Network error during document fetch:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id && role) {
            fetchDocument();
        } else {
            setError("Document ID or Role not provided in the URL.");
            setLoading(false);
        }
    }, [id, role]);

    // These checks should ideally prevent rendering with null 'document'
    if (loading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading document details...</div>;
    }

    if (error) {
        return <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>Error: {error}</div>;
    }

    if (!document) { // This means document is null, even after loading finished without an error
        return <div style={{ padding: '20px', textAlign: 'center' }}>Document not found.</div>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '20px auto', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <Link to="/dashboard" style={{ textDecoration: 'none', color: '#007bff', fontSize: '0.9em' }}>&larr; Back to Dashboard</Link>
            <h1 style={{ textAlign: 'center', color: '#333', marginTop: '20px', marginBottom: '25px' }}>Document Details: {document?.name}</h1> {/* <--- ADDED ?. */}
            
            <div style={{ lineHeight: '1.8', fontSize: '1.1em' }}>
                <p><strong>ID:</strong> {document?._id}</p> {/* <--- ADDED ?. */}
                <p><strong>Name:</strong> {document?.name}</p> {/* <--- ADDED ?. */}
                <p><strong>Description:</strong> {document?.description || 'N/A'}</p> {/* <--- ADDED ?. */}
                <p><strong>Data:</strong></p>
                <div style={{ 
                    border: '1px solid #ddd', 
                    padding: '15px', 
                    backgroundColor: '#f9f9f9', 
                    borderRadius: '5px', 
                    whiteSpace: 'pre-wrap', 
                    wordBreak: 'break-word' 
                }}>
                    {document?.data || 'No data provided'} {/* <--- ADDED ?. */}
                </div>
                <p style={{ marginTop: '15px' }}><strong>Workflow Step:</strong> {document?.workflowStepType}</p> {/* <--- ADDED ?. */}
                <p><strong>Created By User ID:</strong> {document?.createdBy}</p> {/* <--- ADDED ?. */}
                <p><strong>Created At:</strong> {new Date(document?.createdAt).toLocaleString()}</p> {/* <--- ADDED ?. */}
                {/* For docHistory, check if document exists before accessing docHistory */}
                {document?.docHistory && document.docHistory.length > 0 && (
                    <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                        <h4>Document History:</h4>
                        {document.docHistory.map((historyItem, index) => (
                            <div key={index} style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f0f8ff', borderRadius: '5px' }}>
                                <p style={{ margin: '0' }}><strong>Action:</strong> {historyItem.action}</p>
                                <p style={{ margin: '0' }}><strong>By:</strong> {historyItem.user}</p>
                                <p style={{ margin: '0' }}><strong>Timestamp:</strong> {new Date(historyItem.timestamp).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

    );
}

export default DocumentDetail;