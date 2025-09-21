import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Injetando estilos globais para o novo sistema de design
const style = document.createElement('style');
style.textContent = `
  :root {
    --font-sans: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    --bg-primary: #f8f9fa; /* Um cinza muito claro, quase branco */
    --bg-secondary: #ffffff; /* Branco para cards e painéis */
    --bg-tertiary: #f1f5f9; /* Cinza para hover e elementos sutis */
    --bg-interactive: #e8eaed; /* Cinza um pouco mais escuro para interações */
    --text-primary: #202124; /* Cinza-escuro para títulos e textos principais */
    --text-secondary: #5f6368; /* Cinza médio para textos secundários e descrições */
    --text-tertiary: #80868b; /* Cinza mais claro para metadados */
    --border-primary: #e0e0e0; /* Cinza para bordas */
    --border-secondary: #dadce0;
    --accent-primary: #1a73e8; /* Azul Google para elementos ativos */
    --accent-primary-hover: #1867cf;
    --accent-text: #ffffff;
    --black-button-bg: #202124;
    --black-button-hover-bg: #3c4043;
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
    background: #ccc;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #bbb;
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
