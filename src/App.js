import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './Pages/Authentication/AuthContext';
import Home from './Pages/Home/Home';
import Signup from './Pages/Authentication/Signup'
import Login from './Pages/Authentication/Login'
import Tasks from './Pages/Tasks/Tasks';
import NotFound from './Pages/NotFound/NotFound';
import './App.css'
import './styles/themes.css'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
