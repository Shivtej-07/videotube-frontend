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
            className="group block no-underline"
        >
            <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-800 mb-3">
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-1.5 py-1 rounded">
                    {formatDuration(video.duration)}
                </span>
            </div>

            <div className="flex gap-3">
                <div className="flex-shrink-0">
                    {video.owner?.avatar ? (
                        <img
                            src={video.owner.avatar}
                            alt={video.owner.username}
                            className="w-9 h-9 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {video.owner?.username?.[0]?.toUpperCase() || 'C'}
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white group-hover:text-red-400 transition-colors line-clamp-2 mb-1">
                        {video.title}
                    </h3>
                    <div className="text-sm text-gray-400 truncate">
                        {video.owner?.username || "Unknown Channel"}
                    </div>
                    <div className="text-sm text-gray-400">
                        {formatViewCount(video.views)} views • {formatTimeAgo(video.createdAt)}
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default VideoCard;
