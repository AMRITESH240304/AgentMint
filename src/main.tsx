import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import Web3Providers from './components/WalletButton.tsx'; // Import Web3Providers

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Web3Providers>
      <App />
    </Web3Providers>
  </StrictMode>
);
