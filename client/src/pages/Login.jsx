import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css'; // Re-use global styles
import { BACKEND_BASE_URL } from '../constants';

function Login() {
    const [selectedRole, setSelectedRole] = useState('user'); // State to hold the selected role, default to 'user'
    const [error, setError] = useState(''); // State to hold error messages
    const [loading, setLoading] = useState(false); // State to indicate loading status

    const navigate = useNavigate(); // Hook for programmatic navigation

    // Define the available roles
    const roles = ['user', 'dep_sef', 'sec_prim', 'prim', 'god'];

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission (page reload)
        setError(''); // Clear any previous errors
        setLoading(true); // Set loading state to true

        try {
            const backendUrl =  `${BACKEND_BASE_URL}/auth/login`; // New backend endpoint

            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role: selectedRole }), // Send only the selected role
            });

            const data = await response.json(); // Parse the JSON response

            if (response.ok) {
                // For testing purposes, we save the role directly to localStorage
                // In a real app, the backend would return a JWT with the role
                localStorage.setItem('userRole', selectedRole); // Save the selected role
                console.log('Role selected and saved:', selectedRole, 'Backend response:', data);

                // Redirect to the dashboard
                navigate('/dashboard');
            } else {
                // If backend returns an error (e.g., role not recognized)
                console.error('Role selection failed on backend:', data.message || 'Something went wrong');
                setError(data.message || 'Failed to set role. Please try again.');
            }
        } catch (err) {
            // Network errors or issues reaching the backend
            console.error('Network error or server unreachable:', err);
            setError('Could not connect to the server. Please try again later.');
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2 className="auth-title">Select Your Test Role</h2>
                <p className="auth-subtitle">Choose a role to access the dashboard</p>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="role-select">Select Role</label>
                        <select
                            id="role-select"
                            className="form-control" // You might need to add styling for this class in App.css
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            disabled={loading}
                            style={{ padding: '0.8rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '1rem', width: '100%' }}
                        >
                            {roles.map((role) => (
                                <option key={role} value={role}>
                                    {role.replace(/_/g, ' ').toUpperCase()} {/* Format for display */}
                                </option>
                            ))}
                        </select>
                    </div>

                    {error && <p className="error-message">{error}</p>} {/* Display error message */}

                    <button
                        type="submit"
                        className="btn btn-primary auth-btn"
                        disabled={loading} // Disable button while loading
                    >
                        {loading ? 'Submitting...' : 'Submit Role'} {/* Change button text based on loading */}
                    </button>
                </form>
                <p className="auth-footer">
                    {/* No registration link needed if only testing roles */}
                    This is a test login for role-based page access.
                </p>
            </div>
        </div>
    );
}

export default Login;