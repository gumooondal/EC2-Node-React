// src/analytics.js
export const gtag = window.gtag || function() {
    (window.dataLayer = window.dataLayer || []).push(arguments);
  };
  
  gtag('js', new Date());
  gtag('config', 'G-7XDQHF9RVK'); // Google Analytics의 Measurement ID
  