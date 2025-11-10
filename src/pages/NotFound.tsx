import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="text-center max-w-md w-full">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">404</h1>
        <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">Oops! Page not found</p>
        <a href="/" className="inline-block text-blue-500 hover:text-blue-700 underline text-xs sm:text-sm">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
