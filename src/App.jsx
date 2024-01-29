import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Edit from 'src/pages/Edit';
import Display from 'src/pages/Display';

function App() {
  return (
    <div className="App bg-background min-h-screen h-full w-full">
      <Routes>
        <Route path="/" element={<Display></Display>}></Route>
        <Route path="/edit" element={<Edit></Edit>}></Route>
        <Route path="*" element={<Navigate to="/" />}></Route>
      </Routes>
    </div>
  );
}

export default App; 
