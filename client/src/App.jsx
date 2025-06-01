// frontend_tm_2025/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import DashboardPage from './pages/DashboardPage'; // Your main dashboard component
import Register from './pages/Register';
import ConfirmEmail from './pages/ConfirmEmail';
import DynamicFormPage from './pages/DynamicFormPage';
import FormBuilderPage from './pages/FormBuilderPage';
import DocumentDetail from './pages/DocumentDetail'; // <--- Make sure this is imported

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* THIS IS THE CRUCIAL ROUTE: It must match the path from your Link component */}
        <Route path="/dashboard/document" element={<DocumentDetail />} /> {/* <--- ENSURE THIS ROUTE IS EXACTLY AS SHOWN */}
        <Route path="/dynamic-form" element={<DynamicFormPage />} />
        <Route path="/form-builder/:formId?" element={<FormBuilderPage />} />
        {/* Add more routes here as your app grows */}
      </Routes>
    </Router>
  );
}

export default App;