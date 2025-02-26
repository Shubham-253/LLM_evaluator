import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layers, BarChart2, Terminal, PlusCircle } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  
  // Check if the current path matches
  const isActive = (path) => {
    if (path === '/experiments' && location.pathname.startsWith('/experiments')) {
      return true;
    }
    return location.pathname === path;
  };
  
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md">
      <div className="container mx-auto py-4 px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Layers className="mr-2" size={24} />
            <Link to="/" className="text-2xl font-bold">LLM Evaluation Platform</Link>
          </div>
          
          <nav>
            <ul className="flex space-x-1 md:space-x-6">
              <li>
                <Link
                  to="/experiments"
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/experiments') 
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`}
                >
                  <BarChart2 size={16} className="mr-1" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/new-evaluation"
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/new-evaluation') 
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`}
                >
                  <PlusCircle size={16} className="mr-1" />
                  <span>New Evaluation</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/console"
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/console') 
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`}
                >
                  <Terminal size={16} className="mr-1" />
                  <span>Console</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;