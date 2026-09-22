import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { ThumbsUp, Send, MessageSquare, User } from 'lucide-react';

function CommentList({ videoId }) {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchComments = async () => {
        try {
            const response = await api.get(`/comments/${videoId}?page=1&limit=20`);
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

    if (loading) return <div className="text-zinc-500 text-sm mt-4 animate-pulse">Loading comments...</div>;
    if (error) return <div className="text-red-400 text-sm mt-4">{error}</div>;

    return (
        <div className="mt-6 max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-bold text-zinc-100">{comments.length} Comments</h3>
            </div>

            {/* Add Comment Form */}
            <div className="flex gap-3 mb-8">
                {user?.avatar ? (
                    <img
                        src={user.avatar}
                        alt="Current User"
                        className="w-10 h-10 rounded-full flex-shrink-0 object-cover ring-1 ring-zinc-700"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 flex-shrink-0 ring-1 ring-zinc-700">
                        <User className="w-5 h-5" />
                    </div>
                )}
                <form onSubmit={handleSubmit} className="flex-1">
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full bg-zinc-900/80 border-b border-zinc-800 text-zinc-100 pb-2.5 px-3 rounded-t-lg focus:outline-none focus:border-red-500 transition-colors text-sm placeholder-zinc-500"
                    />
                    <div className="flex justify-end mt-2">
                        <button
                            type="submit"
                            disabled={!newComment.trim()}
                            className={`flex items-center gap-1.5 px-5 py-2 rounded-full font-semibold text-xs sm:text-sm transition-all active:scale-95 ${
                                newComment.trim()
                                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/30 cursor-pointer'
                                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                            }`}
                        >
                            <Send className="w-3.5 h-3.5" />
                            <span>Comment</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
                {comments.length === 0 ? (
                    <div className="text-center py-10 text-zinc-500 text-sm italic border border-dashed border-zinc-800 rounded-2xl">
                        No comments yet. Be the first to start the conversation!
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className="flex gap-3">
                            {comment.owner?.avatar ? (
                                <img
                                    src={comment.owner.avatar}
                                    alt={comment.owner?.username}
                                    className="w-9 h-9 rounded-full flex-shrink-0 object-cover ring-1 ring-zinc-700"
                                />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 flex-shrink-0 ring-1 ring-zinc-700">
                                    <User className="w-4 h-4" />
                                </div>
                            )}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className="font-semibold text-xs sm:text-sm text-zinc-200">
                                        @{comment.owner?.username || 'VideoTube User'}
                                    </span>
                                    <span className="text-[11px] text-zinc-500">
                                        {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </div>
                                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                                    {comment.content}
                                </p>

                                <div className="flex items-center gap-4 mt-2">
                                    <button className="flex items-center gap-1.5 text-zinc-400 hover:text-red-400 text-xs transition-colors">
                                        <ThumbsUp className="w-3.5 h-3.5" />
                                        <span>{comment.likes || 0}</span>
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