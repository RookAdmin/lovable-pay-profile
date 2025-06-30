import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";

const Payms = () => {
  useEffect(() => {
    document.title = 'Payms - Rook Payment Platform';
  }, []);

  return (
    <div>
      <h1>Payms Page</h1>
      <Button>Test</Button>
    </div>
  );
};

export default Payms;
