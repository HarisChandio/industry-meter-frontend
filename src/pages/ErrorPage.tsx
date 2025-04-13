import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-800/80">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-white">404</h1>
        <h2 className="text-2xl font-semibold text-gray-300">Page Not Found</h2>
        <p className="text-gray-400">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="mt-4">
          <Link to="/">Go Back Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
