import React from 'react';
import { Link } from 'react-router-dom';
import { User, Play } from 'lucide-react';

function VideoCard({ video }) {
    const formatDuration = (seconds) => {
        if (!seconds) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatTimeAgo = (dateString) => {
        if (!dateString) return "Recently";
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "mo ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h ago";
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
            className="group block no-underline text-inherit"
        >
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-zinc-900 mb-3 border border-zinc-800/80 group-hover:border-red-500/40 transition-all duration-300 shadow-lg shadow-black/40">
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-xl shadow-red-600/50 scale-75 group-hover:scale-100 transition-transform duration-300">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                </div>
                <span className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-md border border-white/10 text-white text-[11px] font-semibold px-2 py-0.5 rounded-lg shadow-md">
                    {formatDuration(video.duration)}
                </span>
            </div>

            <div className="flex gap-3 px-0.5">
                <div className="flex-shrink-0">
                    {video.owner?.avatar ? (
                        <img
                            src={video.owner.avatar}
                            alt={video.owner.username}
                            className="w-9 h-9 rounded-full object-cover ring-1 ring-zinc-700 group-hover:ring-red-500 transition-all"
                        />
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-700 flex items-center justify-center text-zinc-300 font-semibold ring-1 ring-zinc-700">
                            <User className="w-4 h-4" />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base text-zinc-100 group-hover:text-red-400 transition-colors line-clamp-2 mb-1 leading-snug">
                        {video.title}
                    </h3>
                    <div className="text-xs text-zinc-400 font-medium truncate hover:text-zinc-200 transition-colors">
                        {video.owner?.username || "VideoTube Creator"}
                    </div>
                    <div className="text-xs text-zinc-500 font-normal mt-0.5">
                        {formatViewCount(video.views)} views • {formatTimeAgo(video.createdAt)}
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default VideoCard;

