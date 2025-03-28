
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  // Check if we're in a router context before using router hooks
  let location;
  try {
    location = useLocation();
  } catch (e) {
    // If useLocation fails, we're outside router context
    console.error("404 page rendered outside Router context");
  }

  useEffect(() => {
    if (location) {
      console.error(
        "404 Error: User attempted to access non-existent route:",
        location.pathname
      );
    }
  }, [location]);

  // Use standard navigation instead of useNavigate for better compatibility
  const handleHomeClick = (e) => {
    e.preventDefault();
    try {
      // Try to use navigate if available
      const navigate = useNavigate();
      navigate("/");
    } catch (e) {
      // Fallback to regular navigation
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <a 
          href="/" 
          onClick={handleHomeClick} 
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
