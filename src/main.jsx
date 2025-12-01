import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

const bootstrapTelegram = () => {
  const webApp = window?.Telegram?.WebApp;
  if (webApp) {
    webApp.ready();
    webApp.expand();
  }
  const initData = webApp?.initDataUnsafe || {};
  const startParam = initData.start_param || new URLSearchParams(window.location.search).get('start');
  return { initData, startParam };
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App bootstrap={bootstrapTelegram()} />
  </React.StrictMode>,
);
