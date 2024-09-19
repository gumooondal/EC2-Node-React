import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 성능 측정 및 Google Analytics 이벤트 기록
reportWebVitals((metric) => {
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_title: metric.name,
      page_location: window.location.href,
      page_path: window.location.pathname,
    });
  }
});