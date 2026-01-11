import './bootstrap.js';
import '../css/app.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './i18n/config.js';

console.log('Build v' + Date.now());
const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
