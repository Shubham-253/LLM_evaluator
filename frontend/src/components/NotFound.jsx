import React from 'react';
import { Link } from 'react-router-dom';
import Header from './ui/Header';

const NotFound = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-6xl font-bold text-gray-800">404</h2>
          <p className="text-xl text-gray-600 mt-4">Page not found</p>
          <p className="text-gray-500 mt-2">The page you're looking for doesn't exist or has been moved.</p>
          <Link
            to="/"
            className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
