// PrivacyNotice.js
import React from 'react';
import './PrivacyNotice.css';

const PrivacyNotice = () => {
  return (
    <div className="privacy-notice">
      <h4>We're privacy first</h4>
      <p>
        We use cookies to personalise content and ads, to provide social media features and to analyse our traffic. Feel free to decline — it will not affect your viewing of the site.
      </p>
      <div className="privacy-buttons">
        <button>Go ahead!</button>
        <button>No thanks</button>
      </div>
    </div>
  );
};

export default PrivacyNotice;
