import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app"; // إذا كان اسم الملف app.tsx

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
