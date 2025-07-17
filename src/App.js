import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Signup from './Pages/Authentication/Signup'
import Login from './Pages/Authentication/Login'
import Tasks from './Pages/Tasks/Tasks';
import NotFound from './Pages/NotFound/NotFound';
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="*" element={<NotFound />} /> {/* Catch-all route for 404*/}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
