import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import LoadingBar from './preload';
import './css/index.css'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <Router>
    <Routes>
      <Route path="/" element={<LoadingBar />} />
      <Route path="/app" element={<App />} />
    </Routes>
  </Router>
);