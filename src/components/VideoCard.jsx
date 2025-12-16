import React from 'react';
import { Link } from 'react-router-dom';

function VideoCard({ video }) {
    const formatDuration = (seconds) => {
        if (!seconds) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        return "Just now";
    };

    const formatViewCount = (views = 0) => {
        if (!views) return "0";
        if (views >= 1000000) {
            return (views / 1000000).toFixed(1) + 'M';
        }
        if (views >= 1000) {
            return (views / 1000).toFixed(1) + 'K';
        }
        return views.toString();
    };

    return (
        <Link
            to={`/video/${video._id}`}
            className="group block no-underline mb-4 sm:mb-0"
        >
            <div className="relative aspect-video overflow-hidden sm:rounded-xl bg-gray-800 mb-3">
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-1.5 py-1 rounded">
                    {formatDuration(video.duration)}
                </span>
            </div>

            <div className="flex gap-3 px-3 sm:px-0">
                <div className="flex-shrink-0">
                    {video.owner?.avatar ? (
                        <img
                            src={video.owner.avatar}
                            alt={video.owner.username}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {video.owner?.username?.[0]?.toUpperCase() || 'C'}
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white group-hover:text-red-400 transition-colors line-clamp-2 leading-tight mb-1">
                        {video.title}
                    </h3>
                    <div className="text-sm text-gray-400 flex items-center gap-1">
                        <span>{video.owner?.username || "Unknown Channel"}</span>
                        {/* Optional verified badge could go here */}
                    </div>
                    <div className="text-sm text-gray-400">
                        {formatViewCount(video.views)} views • {formatTimeAgo(video.createdAt)}
                    </div>
                </div>

                {/* Mobile menu vertical dots placeholder (visual only for now) */}
                <button className="sm:hidden text-gray-300 self-start px-1" onClick={(e) => e.preventDefault()}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                </button>
            </div>
        </Link>
    );
}

export default VideoCard;
