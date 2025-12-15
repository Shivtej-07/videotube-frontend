import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Downloads() {
    const [downloads, setDownloads] = useState([]);

    useEffect(() => {
        // Load from local storage
        const saved = JSON.parse(localStorage.getItem('downloads') || '[]');
        setDownloads(saved);
    }, []);

    const removeDownload = (id) => {
        const updated = downloads.filter(v => v._id !== id);
        setDownloads(updated);
        localStorage.setItem('downloads', JSON.stringify(updated));
    };

    return (
        <div className="p-4 md:p-8">
            <div className="mb-6 flex items-center">
                <span className="text-3xl mr-4">⬇️</span>
                <h1 className="text-2xl font-bold text-white">Downloads</h1>
            </div>

            <p className="text-gray-400 mb-8 text-sm">
                Videos saved for offline viewing (Simulated).
                <br />
                These are stored in your browser's local storage.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {downloads.length > 0 ? downloads.map(video => (
                    <div key={video._id} className="relative group bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
                        <div className="aspect-video relative">
                            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-80" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-4xl text-white opacity-80">▶️</span>
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="text-white font-medium truncate mb-2">{video.title}</h3>
                            <div className="flex justify-between items-center">
                                <Link to={`/video/${video._id}`} className="text-blue-400 text-xs hover:text-blue-300">Watch Now</Link>
                                <button
                                    onClick={() => removeDownload(video._id)}
                                    className="text-red-400 text-xs hover:text-red-300"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full text-center py-10 text-gray-500">
                        No downloads yet.
                    </div>
                )}
            </div>
        </div>
    );
}

export default Downloads;
