import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Đang tải...</p>
      </div>
    </div>
  );
}
