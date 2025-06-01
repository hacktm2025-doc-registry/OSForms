import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom'; // Import useSearchParams to get query params
import '../App.css'; // Re-use auth styles

function ConfirmEmail() {
    const [searchParams] = useSearchParams(); // Hook to access URL query parameters
    const token = searchParams.get('token'); // Get the 'token' parameter from the URL

    const [status, setStatus] = useState('pending'); // 'pending', 'success', 'error'
    const [message, setMessage] = useState(''); // Detailed message for the user

    useEffect(() => {
        // This effect runs when the component mounts or when 'token' changes
        const confirmAccount = async () => {
            if (!token) {
                // If no token is present in the URL, user arrived here directly after registration
                setStatus('info');
                setMessage('Thank you for registering! Please check your email inbox (and spam folder) for a confirmation link to activate your account.');
                return;
            }

            // If a token is present, proceed with backend confirmation
            setStatus('pending');
            setMessage('Confirming your email address...');

            try {
                // Backend endpoint for email confirmation
                const backendConfirmUrl = `http://192.168.1.209:3000/confirm?token=${token}`; // Your backend's confirmation endpoint

                const response = await fetch(backendConfirmUrl, {
                    method: 'GET', // Or POST, depending on your backend's API design for confirmation
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setStatus('success');
                    setMessage(data.message || 'Your email has been successfully confirmed! You can now log in.');
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Email confirmation failed. The link might be expired or invalid.');
                    console.error('Email confirmation error:', data.message);
                }
            } catch (err) {
                setStatus('error');
                setMessage('Could not connect to the server. Please try again later.');
                console.error('Network error during email confirmation:', err);
            }
        };

        confirmAccount(); // Call the async function
    }, [token]); // Re-run effect if the token in the URL changes

    const getStatusClass = () => {
        switch (status) {
            case 'success':
                return 'confirmation-success';
            case 'error':
                return 'confirmation-error';
            case 'info':
                return 'confirmation-info';
            default:
                return 'confirmation-pending';
        }
    };

    return (
        <div className="auth-container"> {/* Re-using the central alignment for auth pages */}
            <div className="auth-box">
                <h2 className="auth-title">Email Confirmation</h2>
                <div className={`confirmation-message ${getStatusClass()}`}>
                    <p>{message}</p>
                </div>
                {(status === 'success' || status === 'error') && (
                    <div className="auth-footer" style={{ marginTop: '2rem' }}>
                        <Link to="/login" className="btn btn-primary auth-btn">
                            Go to Login
                        </Link>
                    </div>
                )}
                 {status === 'info' && (
                    <div className="auth-footer" style={{ marginTop: '2rem' }}>
                        <p>Didn't receive the email? <Link to="/resend-confirmation">Resend it</Link></p>
                        <Link to="/login">Go to Login</Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ConfirmEmail;
