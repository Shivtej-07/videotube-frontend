import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import '../index.css';

function Register() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        username: '',
        password: '',
        avatar: null,
        coverImage: null
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const data = new FormData();
        data.append('fullName', formData.fullName);
        data.append('email', formData.email);
        data.append('username', formData.username);
        data.append('password', formData.password);
        if (formData.avatar) data.append('avatar', formData.avatar);
        if (formData.coverImage) data.append('coverImage', formData.coverImage);

        try {
            const response = await api.post('/users/register', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log("Register success:", response.data);
            navigate('/login');
        } catch (err) {
            console.error("Register failed:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-wrapper">
            <div className="register-card">
                <div className="text-center" style={{ marginBottom: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🚀</div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Create Account</h2>
                    <p style={{ color: '#aaa' }}>Join VideoTube today</p>
                </div>

                {error && <div className="error-alert">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="row-group">
                        <div className="input-group">
                            <label>Full Name</label>
                            <input type="text" name="fullName" placeholder="John Doe" onChange={handleChange} required className="modern-input" />
                        </div>
                        <div className="input-group">
                            <label>Username</label>
                            <input type="text" name="username" placeholder="john_d" onChange={handleChange} required className="modern-input" />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Email Address</label>
                        <input type="email" name="email" placeholder="john@example.com" onChange={handleChange} required className="modern-input" />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required className="modern-input" />
                    </div>

                    <div className="row-group">
                        <div className="input-group" style={{ flex: 1 }}>
                            <label className="file-label">
                                <span>Avatar (Required)</span>
                                <input type="file" name="avatar" onChange={handleChange} required accept="image/*" className="file-input" />
                                <div className="file-custom-btn">{formData.avatar ? formData.avatar.name : 'Choose File'}</div>
                            </label>
                        </div>
                        <div className="input-group" style={{ flex: 1 }}>
                            <label className="file-label">
                                <span>Cover Image (Optional)</span>
                                <input type="file" name="coverImage" onChange={handleChange} accept="image/*" className="file-input" />
                                <div className="file-custom-btn">{formData.coverImage ? formData.coverImage.name : 'Choose File'}</div>
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="modern-btn" disabled={loading} style={{ marginTop: '1rem' }}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: '#aaa' }}>
                    Already have an account? <Link to="/login" style={{ color: '#3ea6ff', textDecoration: 'none' }}>Sign in</Link>
                </div>
            </div>

            <style>{`
                .register-wrapper {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 90vh;
                    padding: 2rem 0;
                }
                .register-card {
                    background-color: #1e1e1e;
                    padding: 3rem;
                    border-radius: 16px;
                    width: 100%;
                    max-width: 500px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    border: 1px solid #333;
                }
                .row-group {
                    display: flex;
                    gap: 16px;
                }
                .input-group {
                    margin-bottom: 1.25rem;
                    flex: 1;
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
                
                /* File Input Styling */
                .file-input {
                    display: none;
                }
                .file-label span {
                    display: block;
                    margin-bottom: 6px;
                }
                .file-custom-btn {
                    background-color: #272727;
                    border: 1px dashed #444;
                    padding: 10px;
                    border-radius: 8px;
                    text-align: center;
                    cursor: pointer;
                    font-size: 0.9rem;
                    color: #aaa;
                    transition: all 0.2s;
                }
                .file-label:hover .file-custom-btn {
                    border-color: #3ea6ff;
                    color: white;
                }
            `}</style>
        </div>
    );
}

export default Register;