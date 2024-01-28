import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Admin from './Admin.jsx';
import Display from './Display.jsx';

function App() {
  return (
    <div className="App bg-background h-full w-full">
      <Routes>
        <Route path="/" element={<Display></Display>}></Route>
        <Route path="/admin" element={<Admin></Admin>}></Route>
        <Route path="*" element={<Navigate to="/" />}></Route>
      </Routes>
    </div>
  );
}

export default App; 
