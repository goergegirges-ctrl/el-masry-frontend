import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import StoreContextProvider from './context/StoreContext.jsx'

// Global Button Ripple Effect
document.addEventListener('click', (e) => {
  const target = e.target.closest('button');
  if (!target) return;

  const ripple = document.createElement('span');
  ripple.classList.add('ripple');

  const rect = target.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;

  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;

  target.appendChild(ripple);

  setTimeout(() => ripple.remove(), 600);
});

import { HelmetProvider } from 'react-helmet-async'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <HelmetProvider>
      <StoreContextProvider>
        <App />
      </StoreContextProvider>
    </HelmetProvider>
  </BrowserRouter>
)
