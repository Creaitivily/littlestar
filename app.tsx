import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import LandingPage from './components/landing-page';
import './styles/globals.css';

function App() {
  return (
    <HelmetProvider>
      <div className="App">
        <LandingPage />
      </div>
    </HelmetProvider>
  );
}

export default App;