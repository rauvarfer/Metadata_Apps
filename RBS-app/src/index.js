// src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css'; // Archivo de estilos globales si existe

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

