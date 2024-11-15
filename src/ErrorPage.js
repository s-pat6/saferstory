// src/ErrorPage.js
import React from 'react';
import './ErrorPage.css'; // Make sure to import the CSS for styling

function ErrorPage() {
  return (
    <div className="error-page">
      <div className="error-content">
        <h1>Access Denied</h1>
        <p>You must be logged in to view this page.</p>
      </div>
    </div>
  );
}

export default ErrorPage;
