import React from 'react';
// TODO: PUT BACK NAVBAR
// import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Routes from './Routes';
import './style.css';
import { useLocation } from 'react-router-dom';

const App = () => {
  const location = useLocation().pathname;
  return (
    <div className=''>
      {/* // TODO: PUT BACK NAVBAR */}
      {/* <Navbar /> */}
      <Routes />
      {location.includes('jest') ? null : <Footer />}
    </div>
  );
};

export default App;
