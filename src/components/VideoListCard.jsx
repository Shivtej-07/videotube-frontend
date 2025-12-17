import React from 'react';
import { Link } from 'react-router-dom';

function VideoListCard({ video }) {
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
            className="flex gap-2 group mb-2"
        >
            {/* Thumbnail */}
            <div className="relative w-40 flex-shrink-0 aspect-video rounded-lg overflow-hidden bg-gray-800">
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-medium px-1 py-0.5 rounded">
                    {formatDuration(video.duration)}
                </span>
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col min-w-0">
                <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight mb-1 group-hover:text-red-400 transition-colors">
                    {video.title}
                </h3>
                <div className="text-xs text-gray-400">
                    <div>{video.owner?.username || "Unknown"}</div>
                    <div>{formatViewCount(video.views)} views • {formatTimeAgo(video.createdAt)}</div>
                </div>
            </div>
        </Link>
    );
}

export default VideoListCard;
