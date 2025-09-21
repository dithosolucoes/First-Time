import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Injetando estilos globais para o novo sistema de design (Bege e Roxo)
const style = document.createElement('style');
style.textContent = `
  :root {
    --font-sans: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    
    /* Palette: Beige & Purple Theme */
    --bg-primary: #FAF8F5; /* Bege principal, quase branco */
    --bg-secondary: #ffffff; /* Branco puro para painéis e cards */
    --bg-tertiary: #F9FAFB; /* Um cinza muito claro para fundos sutis */
    --bg-interactive: #F3F4F6; /* Cinza um pouco mais escuro para interações */
    
    --text-primary: #1C1917; /* Cinza-escuro (quase preto) para textos */
    --text-secondary: #57534E; /* Cinza médio-quente */
    --text-tertiary: #A8A29E; /* Cinza-claro para metadados */

    --border-primary: #E7E5E4; /* Borda principal */
    --border-secondary: #D6D3D1; /* Borda secundária */

    --accent-primary: #7C3AED; /* Roxo vibrante principal */
    --accent-primary-hover: #6D28D9; /* Roxo mais escuro para hover */
    --accent-light: #F5F3FF; /* Roxo muito claro para fundos de destaque */
    --accent-text: #ffffff; /* Texto sobre o roxo */
    --accent-text-deep: #5B21B6; /* Texto roxo escuro sobre fundos claros */

    --black-button-bg: #1C1917;
    --black-button-hover-bg: #2d2a27;
  }

  body {
    background-color: var(--bg-primary);
    color: var(--text-primary);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Custom scrollbar to match the aesthetic */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: var(--bg-tertiary);
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb {
    background: #D6D3D1;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #A8A29E;
  }
`;
document.head.appendChild(style);


const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
