import React from 'react';
import { useLocation } from 'react-router-dom';

const NotFound = () => {
  const location = useLocation();

  return (
    <div>
      <h3>
        La page { location.pathname } n'existe pas, veuillez
      </h3>
    </div>
  );
}

export default NotFound;
