
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        The page you're looking for doesn't exist or the username hasn't been claimed yet.
      </p>
      <div className="flex gap-4">
        <Link to="/">
          <Button variant="default">Go Home</Button>
        </Link>
        <Link to="/signup">
          <Button variant="outline">Claim Username</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
