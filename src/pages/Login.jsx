import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
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

    const handleDemoLogin = async () => {
        setFormData({
            email: 'demo@example.com',
            password: 'demo123'
        });
        // Optionally auto-login with demo credentials
        // await handleSubmit(new Event('submit'));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
            <div className="w-full max-w-md">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block mb-6">
                        <div className="flex items-center justify-center gap-2 text-3xl font-bold">
                            <span className="text-red-600">▶</span>
                            <span className="text-white font-['Oswald'] tracking-tight">VideoTube</span>
                        </div>
                    </Link>
                    <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
                    <p className="text-gray-400">Sign in to continue to VideoTube</p>
                </div>

                {/* Demo Login Option */}
                <div className="mb-6">
                    <button
                        onClick={handleDemoLogin}
                        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02]"
                    >
                        <span className="text-xl">🚀</span>
                        Try Demo Account
                    </button>
                </div>

                {/* Or Divider */}
                <div className="flex items-center my-6">
                    <div className="flex-1 h-px bg-gray-700"></div>
                    <div className="px-4 text-gray-500 text-sm">OR</div>
                    <div className="flex-1 h-px bg-gray-700"></div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-xl text-red-300 text-sm flex items-center gap-3">
                        <span className="text-xl">⚠️</span>
                        <span>{error}</span>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                            Email or Username
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500">📧</span>
                            </div>
                            <input
                                id="email"
                                type="text"
                                name="email"
                                placeholder="Enter your email or username"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500">🔒</span>
                            </div>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                <span className="text-gray-400 hover:text-white transition-colors">
                                    {showPassword ? '🙈' : '👁️'}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center">
                        <input
                            id="remember"
                            type="checkbox"
                            className="h-4 w-4 bg-gray-800 border-gray-700 rounded focus:ring-blue-500 focus:ring-offset-gray-900"
                        />
                        <label htmlFor="remember" className="ml-2 text-sm text-gray-400">
                            Remember me for 30 days
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Signing in...</span>
                            </>
                        ) : (
                            <>
                                <span className="text-xl">→</span>
                                <span>Sign In</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Social Login Options */}
                <div className="mt-8">
                    <div className="text-center text-gray-500 text-sm mb-4">Or continue with</div>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            className="flex items-center justify-center gap-3 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl transition-colors"
                        >
                            <span className="text-xl">G</span>
                            <span className="text-sm font-medium text-gray-300">Google</span>
                        </button>
                        <button
                            type="button"
                            className="flex items-center justify-center gap-3 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl transition-colors"
                        >
                            <span className="text-xl">G</span>
                            <span className="text-sm font-medium text-gray-300">GitHub</span>
                        </button>
                    </div>
                </div>

                {/* Sign Up Link */}
                <div className="mt-8 text-center">
                    <p className="text-gray-500">
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                        >
                            Sign up now
                        </Link>
                    </p>
                    <p className="text-gray-600 text-sm mt-4">
                        By continuing, you agree to our{' '}
                        <a href="#" className="text-blue-400 hover:text-blue-300">Terms</a>{' '}
                        and{' '}
                        <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
                    </p>
                </div>

                {/* Back to Home */}
                <div className="mt-6 text-center">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                    >
                        <span>←</span>
                        <span>Back to home</span>
                    </Link>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-900/10 rounded-full blur-3xl"></div>
            <div className="absolute top-0 left-0 w-64 h-64 bg-purple-900/10 rounded-full blur-3xl"></div>
        </div>
    );
}

export default Login;