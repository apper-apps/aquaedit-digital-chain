import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-darker">
      <div className="text-center space-y-6 p-8 max-w-md">
        <div className="relative">
          <ApperIcon name="AlertCircle" size={80} className="text-coral mx-auto mb-4" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-white">404</h1>
          <h2 className="text-2xl font-semibold text-ocean-teal">Page Not Found</h2>
          <p className="text-gray-400 leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button variant="primary" className="w-full sm:w-auto">
              <ApperIcon name="Home" size={16} className="mr-2" />
              Go Home
            </Button>
          </Link>
          <Link to="/gallery">
            <Button variant="secondary" className="w-full sm:w-auto">
              <ApperIcon name="Image" size={16} className="mr-2" />
              Browse Gallery
            </Button>
          </Link>
        </div>

        <div className="pt-6 border-t border-slate-dark">
          <h3 className="text-sm font-medium text-ocean-teal mb-3">Popular Pages</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link to="/editor" className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded bg-slate-dark hover:bg-slate-700">
              Editor
            </Link>
            <Link to="/presets" className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded bg-slate-dark hover:bg-slate-700">
              Presets
            </Link>
            <Link to="/community" className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded bg-slate-dark hover:bg-slate-700">
              Community
            </Link>
            <Link to="/dashboard" className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded bg-slate-dark hover:bg-slate-700">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;