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
    <div className="min-h-screen flex items-center justify-center bg-engenha-light-blue">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-engenha-dark-navy">404</h1>
        <p className="text-xl text-engenha-dark-navy opacity-70 mb-4">Oops! Page not found</p>
        <a href="/" className="text-engenha-orange hover:text-engenha-dark-orange underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
