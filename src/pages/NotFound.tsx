
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location]);

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center bg-white p-10 rounded-lg shadow-lg max-w-md">
        <h1 className="text-6xl font-bold mb-4 text-navy">404</h1>
        <p className="text-xl text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
        <a 
          href="/" 
          onClick={handleHomeClick} 
          className="px-6 py-3 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-colors inline-block"
        >
          Return Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
