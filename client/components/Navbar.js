import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../store';

const Navbar = ({ handleClick, isLoggedIn, username }) => (
  <div className='bg-gray-800'>
    <nav className='p-3'>
      {isLoggedIn ? (
        <div className='flex'>
          {/* The navbar will show these links after you log in */}
          <Link className='p-2 pl-10 text-white' to='/home'>
            Home
          </Link>
          <Link className='p-2 text-white' to='/tests'>
            Tests
          </Link>
          <a className='p-2 text-white' href='#' onClick={handleClick}>
            Logout
          </a>
          <a className='ml-auto p-2 pr-10 text-white'>Welcome, {username}</a>
        </div>
      ) : (
        <div>
          {/* The navbar will show these links before you log in */}
          <Link className='p-2 text-white' to='/login'>
            Login
          </Link>
          <Link className='p-2 text-white' to='/signup'>
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
