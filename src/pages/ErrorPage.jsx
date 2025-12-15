import React from 'react';
import { useRouteError, Link } from 'react-router-dom';

const ErrorPage = () => {
    const error = useRouteError();
    console.error(error);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-white p-4 text-center">
            <div className="mb-8">
                {/* Custom SVG Icon for Error */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="120"
                    height="120"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ae7aff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-pulse"
                >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
            </div>

            <h1 className="text-4xl font-bold mb-4 text-[#ae7aff]">
                Oops! Something went wrong.
            </h1>

            <p className="text-lg text-gray-400 mb-8 max-w-md">
                We can't seem to find the page you're looking for or an unexpected error occurred.
            </p>

            {error && (
                <div className="bg-[#2a2a2a] p-4 rounded-lg mb-8 max-w-lg w-full overflow-auto text-left">
                    <p className="font-mono text-red-400 text-sm">
                        {error.statusText || error.message}
                    </p>
                    {error.status && <p className="font-mono text-gray-500 text-xs mt-1">Status: {error.status}</p>}
                </div>
            )}

            <Link
                to="/"
                className="px-6 py-3 bg-[#ae7aff] text-black font-semibold rounded-lg hover:bg-[#9a6eea] transition-colors shadow-lg hover:shadow-[#ae7aff]/50"
            >
                Go Back Home
            </Link>
        </div>
    );
};

export default ErrorPage;
