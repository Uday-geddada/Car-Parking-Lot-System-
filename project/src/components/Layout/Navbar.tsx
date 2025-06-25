import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Car, User, LogOut, Home, History, PlusCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Car className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ParkEasy
            </span>
          </Link>

          {currentUser && (
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/') 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link 
                to="/book" 
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/book') 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <PlusCircle className="h-4 w-4" />
                <span>Book Slot</span>
              </Link>
              <Link 
                to="/history" 
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/history') 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <History className="h-4 w-4" />
                <span>History</span>
              </Link>
            </div>
          )}

          {currentUser && (
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                <div className="p-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {currentUser.email?.split('@')[0]}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {currentUser && (
        <div className="md:hidden bg-gray-50 border-t border-gray-200">
          <div className="flex justify-around py-2">
            <Link 
              to="/" 
              className={`flex flex-col items-center py-2 px-4 ${
                isActive('/') ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <Home className="h-5 w-5" />
              <span className="text-xs mt-1">Dashboard</span>
            </Link>
            <Link 
              to="/book" 
              className={`flex flex-col items-center py-2 px-4 ${
                isActive('/book') ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <PlusCircle className="h-5 w-5" />
              <span className="text-xs mt-1">Book</span>
            </Link>
            <Link 
              to="/history" 
              className={`flex flex-col items-center py-2 px-4 ${
                isActive('/history') ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <History className="h-5 w-5" />
              <span className="text-xs mt-1">History</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;