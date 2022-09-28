import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Routes from './Routes';
import './style.css';
import { useLocation } from 'react-router-dom';

const App = () => {
  const location = useLocation().pathname;
  return (
    <div className=''>
      <Navbar />
      <Routes />
      {location.includes('jest') ? null : <Footer />}
    </div>
  );
};

export default App;
