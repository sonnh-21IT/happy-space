import React from 'react';
import { AppProvider } from './context/AppContext';
import { Router } from './components/Router';

function App() {
  return (
    <AppProvider>
      <div className="app">
        <Router />
      </div>
    </AppProvider>
  );
}

export default App;
