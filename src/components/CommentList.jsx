import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function CommentList({ videoId }) {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchComments = async () => {
        try {
            const response = await api.get(`/comments/${videoId}?page=1&limit=20`);
            console.log("Comments response:", response.data);

            if (response.data?.data?.docs) {
                setComments(response.data.data.docs);
            } else if (Array.isArray(response.data?.data)) {
                setComments(response.data.data);
            } else {
                setComments([]);
            }
        } catch (err) {
            console.error("Failed to fetch comments", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (videoId) {
            fetchComments();
        }
    }, [videoId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        if (!user) return alert("Please login to comment");

        try {
            const response = await api.post(`/comments/${videoId}`, { content: newComment });
            console.log("Add comment response:", response.data);

            const createdComment = response.data.data;
            if (createdComment) {
                if (!createdComment.owner) {
                    createdComment.owner = user;
                }
                setComments([createdComment, ...comments]);
                setNewComment("");
            }
        } catch (err) {
            console.error("Failed to post comment", err);
            alert("Failed to post comment");
        }
    };

    if (loading) return <div className="text-gray-400 mt-5">Loading comments...</div>;
    if (error) return <div className="text-red-500 mt-5">{error}</div>;

    return (
        <div className="mt-6 max-w-3xl">
            <h3 className="text-xl font-semibold mb-4">{comments.length} Comments</h3>

            {/* Add Comment Form */}
            <div className="flex gap-4 mb-6">
                <img
                    src={user?.avatar || "https://via.placeholder.com/40"}
                    alt="Current User"
                    className="w-10 h-10 rounded-full flex-shrink-0"
                />
                <form onSubmit={handleSubmit} className="flex-1">
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full bg-transparent border-b border-gray-700 text-white pb-2 focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-500"
                    />
                    <div className="flex justify-end mt-3">
                        <button
                            type="submit"
                            disabled={!newComment.trim()}
                            className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${newComment.trim()
                                    ? 'bg-blue-500 text-black hover:bg-blue-600 cursor-pointer'
                                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            Comment
                        </button>
                    </div>
                </form>
            </div>

            {/* Comments List */}
            <div className="space-y-5">
                {comments.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        No comments yet. Be the first to comment!
                    </div>
                ) : (
                    comments.map(comment => (
                        <div key={comment._id} className="flex gap-4">
                            <img
                                src={comment.owner?.avatar || "https://via.placeholder.com/40"}
                                alt={comment.owner?.username}
                                className="w-10 h-10 rounded-full flex-shrink-0"
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className="font-medium text-sm">
                                        @{comment.owner?.username || 'Unknown User'}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
                                    {comment.content}
                                </p>

                                {/* Comment Actions */}
                                <div className="flex items-center gap-4 mt-2">
                                    <button className="flex items-center gap-1 text-gray-400 hover:text-white text-xs transition-colors">
                                        <span>👍</span>
                                        <span>{comment.likes || 0}</span>
                                    </button>
                                    <button className="text-gray-400 hover:text-white text-xs transition-colors">
                                        Reply
                                    </button>
                                    <button className="text-gray-400 hover:text-white text-xs transition-colors">
                                        Share
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default CommentList;