import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const style = document.createElement("style");
style.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', system-ui, sans-serif;
    background-color: #f0f2f8;
    background-image:
      radial-gradient(ellipse 80% 60% at 50% -20%, rgba(99,102,241,0.08) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 100%, rgba(79,70,229,0.05) 0%, transparent 50%);
    background-attachment: fixed;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  button { cursor: pointer; font-family: inherit; }
  input, select, textarea { font-family: inherit; }
  a { text-decoration: none; color: inherit; }

  @keyframes fadeIn  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes scaleIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
  @keyframes spin    { to { transform: rotate(360deg); } }

  .page-anim  { animation: fadeIn  0.25s ease; }
  .modal-anim { animation: scaleIn 0.2s  ease; }
  .toast-anim { animation: slideIn 0.2s  ease; }

  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #c7d2fe; border-radius: 99px; }

  input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: #818cf8 !important;
    box-shadow: 0 0 0 4px rgba(99,102,241,0.10) !important;
  }
`;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
