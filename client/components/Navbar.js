import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../store';

const Navbar = ({ handleClick, isLoggedIn, username }) => (
  <div className='border-0'>
    <nav className='border-0 p-3'>
      {isLoggedIn ? (
        <div className='flex border-0 text-white'>
          {/* The navbar will show these links after you log in */}
          <Link className='' to='/'>
            <img src='/test-brew-logo-boba.svg' className='h-8' />
          </Link>
          <Link className='p-2' to='/jest8'>
            Tests
          </Link>
          <Link className='p-2' href='#' onClick={handleClick}>
            Logout
          </Link>
          <span>Welcome, {username}</span>
          <Link className='ml-auto p-2 pr-10' href='#'>
            Account
          </Link>
        </div>
      ) : (
        <div>
          {/* The navbar will show these links before you log in */}
          <Link className='p-2' to='/login'>
            Login
          </Link>
          <Link className='p-2' to='/signup'>
            Sign Up
          </Link>
        </div>
      )}
    </nav>
    <hr />
  </div>
);

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    isLoggedIn: !!state.auth.id,
    username: state.auth.username,
  };
};

const mapDispatch = (dispatch) => {
  return {
    handleClick() {
      dispatch(logout());
    },
  };
};

export default connect(mapState, mapDispatch)(Navbar);
