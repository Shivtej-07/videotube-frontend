import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../index.css';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await api.post('/users/login', {
                email: formData.email,
                username: formData.email,
                password: formData.password
            });
            console.log("Login success:", response.data);
            await login(response.data.data.user);
            navigate('/');
        } catch (err) {
            console.error("Login failed:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <div className="text-center" style={{ marginBottom: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔐</div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Welcome Back</h2>
                    <p style={{ color: '#aaa' }}>Sign in to continue to VideoTube</p>
                </div>

                {error && (
                    <div className="error-alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Email or Username</label>
                        <input
                            type="text"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="modern-input"
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="modern-input"
                        />
                    </div>

                    <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
                        {/* Link to forgot password could go here */}
                        <span style={{ fontSize: '0.9rem', color: '#3ea6ff', cursor: 'pointer' }}>Forgot password?</span>
                    </div>

                    <button type="submit" className="modern-btn" disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: '#aaa' }}>
                    Don't have an account? <Link to="/register" style={{ color: '#3ea6ff', textDecoration: 'none' }}>Sign up</Link>
                </div>
            </div>

            <style>{`
                .login-wrapper {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 80vh;
                }
                .login-card {
                    background-color: #1e1e1e;
                    padding: 3rem;
                    border-radius: 16px;
                    width: 100%;
                    max-width: 440px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    border: 1px solid #333;
                }
                .input-group {
                    margin-bottom: 1.25rem;
                }
                .input-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-size: 0.9rem;
                    color: #ddd;
                }
                .modern-input {
                    width: 100%;
                    padding: 12px 16px;
                    border-radius: 8px;
                    background-color: #121212;
                    border: 1px solid #444;
                    color: white;
                    font-size: 1rem;
                    outline: none;
                    transition: border-color 0.2s;
                    box-sizing: border-box;
                }
                .modern-input:focus {
                    border-color: #3ea6ff;
                }
                .modern-btn {
                    width: 100%;
                    padding: 12px;
                    background-color: #3ea6ff;
                    color: black;
                    border: none;
                    border-radius: 24px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                .modern-btn:hover {
                    background-color: #62b4ff;
                }
                .modern-btn:disabled {
                    background-color: #555;
                    color: #888;
                    cursor: not-allowed;
                }
                .error-alert {
                    background-color: rgba(255, 68, 68, 0.1);
                    border: 1px solid #ff4444;
                    color: #ff4444;
                    padding: 12px;
                    border-radius: 8px;
                    margin-bottom: 1.5rem;
                    text-align: center;
                    font-size: 0.9rem;
                }
            `}</style>
        </div>
    );
}

export default Login;
