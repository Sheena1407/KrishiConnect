import React from 'react';
import { Sprout } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading farm data...' }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-5 text-center min-vh-25">
      <div className="position-relative mb-3">
        <div
          className="spinner-border text-success"
          style={{ width: '3.5rem', height: '3.5rem', borderWidth: '3px', borderColor: '#2D6A4F transparent #52B788 transparent' }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="position-absolute top-50 start-50 translate-middle text-success">
          <Sprout size={20} className="animate-pulse" />
        </div>
      </div>
      <p className="text-muted fw-semibold small mb-0">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
