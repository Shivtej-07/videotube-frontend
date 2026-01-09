import React from 'react';

function VideoCardSkeleton() {
    return (
        <div className="flex flex-col gap-3 animate-pulse">
            {/* Thumbnail Skeleton */}
            <div className="bg-gray-800 h-48 sm:rounded-xl w-full"></div>

            <div className="flex gap-3 px-3 sm:px-0">
                {/* Avatar Skeleton */}
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-800 rounded-full"></div>
                </div>

                {/* Text Skeletons */}
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                </div>
            </div>
        </div>
    );
}

export default VideoCardSkeleton;
