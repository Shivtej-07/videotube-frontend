import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function Settings() {
    const { user, setUser } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Forms State
    const [passData, setPassData] = useState({ oldPassword: '', newPassword: '' });
    const [accountData, setAccountData] = useState({ fullName: user?.fullName || '', email: user?.email || '' });
    const [loadingAccount, setLoadingAccount] = useState(false);
    const [loadingPass, setLoadingPass] = useState(false);

    const handleFileChange = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append(type === 'avatar' ? 'avatar' : 'coverImage', file);

        setUploading(true);
        setMessage({ type: '', text: '' });

        try {
            const endpoint = type === 'avatar' ? '/users/avatar' : '/users/cover-image';
            const response = await api.patch(endpoint, formData);
            setUser(response.data.data);
            setMessage({ type: 'success', text: `${type === 'avatar' ? 'Avatar' : 'Cover image'} updated successfully!` });
        } catch (error) {
            console.error('Update failed:', error);
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update image.' });
        } finally {
            setUploading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setLoadingPass(true);
        setMessage({ type: '', text: '' });

        try {
            await api.post('/users/change-password', passData);
            setMessage({ type: 'success', text: 'Password changed successfully.' });
            setPassData({ oldPassword: '', newPassword: '' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password.' });
        } finally {
            setLoadingPass(false);
        }
    };

    const handleAccountUpdate = async (e) => {
        e.preventDefault();
        setLoadingAccount(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await api.patch('/users/update-account', accountData);
            setUser(prev => ({ ...prev, ...res.data.data }));
            setMessage({ type: 'success', text: 'Account details updated.' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update account.' });
        } finally {
            setLoadingAccount(false);
        }
    };

    return (
        <div className="p-4 lg:p-8 max-w-4xl mx-auto pb-20">
            <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

            {message.text && (
                <div className={`p-4 rounded-lg mb-6 border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                    {message.text}
                </div>
            )}

            <div className="space-y-8">
                {/* Profile Images Section */}
                <div className="bg-[#121212] border border-gray-800 rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-6">Profile Images</h2>
                    <div className="space-y-8">
                        {/* Avatar */}
                        <div className="flex items-center gap-6">
                            <div className="relative group">
                                <img src={user?.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-2 border-gray-700" />
                                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                                    <span className="text-xs text-white">Change</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-300 mb-2">Profile Picture</h3>
                                <label className="inline-block">
                                    <span className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${uploading ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'}`}>
                                        {uploading ? 'Uploading...' : 'Upload New Picture'}
                                    </span>
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'avatar')} disabled={uploading} />
                                </label>
                            </div>
                        </div>
                        <div className="h-px bg-gray-800" />
                        {/* Cover */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-300 mb-4">Cover Image</h3>
                            <div className="relative aspect-[3/1] w-full bg-gray-900 rounded-lg overflow-hidden border border-gray-800 mb-4">
                                {user?.coverImage ? <img src={user.coverImage} alt="Cover" className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-gray-600">No cover image</div>}
                            </div>
                            <div className="flex justify-end">
                                <label className="inline-block">
                                    <span className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${uploading ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}>
                                        {uploading ? 'Uploading...' : 'Change Cover Image'}
                                    </span>
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'coverImage')} disabled={uploading} />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Details Form */}
                <div className="bg-[#121212] border border-gray-800 rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-6">Personal Information</h2>
                    <form onSubmit={handleAccountUpdate} className="space-y-4 max-w-lg">
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">Full Name</label>
                            <input
                                type="text"
                                value={accountData.fullName}
                                onChange={e => setAccountData({ ...accountData, fullName: e.target.value })}
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-blue-500 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">Email</label>
                            <input
                                type="email"
                                value={accountData.email}
                                onChange={e => setAccountData({ ...accountData, email: e.target.value })}
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-blue-500 outline-none"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loadingAccount}
                            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded font-medium disabled:opacity-50"
                        >
                            {loadingAccount ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>

                {/* Change Password Form */}
                <div className="bg-[#121212] border border-gray-800 rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-6">Security</h2>
                    <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">Current Password</label>
                            <input
                                type="password"
                                value={passData.oldPassword}
                                onChange={e => setPassData({ ...passData, oldPassword: e.target.value })}
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-blue-500 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">New Password</label>
                            <input
                                type="password"
                                value={passData.newPassword}
                                onChange={e => setPassData({ ...passData, newPassword: e.target.value })}
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-blue-500 outline-none"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loadingPass}
                            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded font-medium disabled:opacity-50"
                        >
                            {loadingPass ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Settings;
