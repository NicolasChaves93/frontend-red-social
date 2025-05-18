import React from "react";
import AppRouter from './app/router'
import './App.css'

function App() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Red Social - Test</h1>
      <p>Si puedes ver esto, la renderización básica funciona</p>
      <AppRouter />
    </div>
  );
}

export default App;
