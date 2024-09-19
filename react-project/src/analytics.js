export const gtag = window.gtag || function() {
  (window.dataLayer = window.dataLayer || []).push(arguments);
};

export const initializeAnalytics = () => {
  if (!window.gtag) {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-7XDQHF9RVK';
    document.head.appendChild(script);

    script.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag() { window.dataLayer.push(arguments); }
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', 'G-7XDQHF9RVK');
    };
  } else {
    gtag('config', 'G-7XDQHF9RVK');
  }
};

