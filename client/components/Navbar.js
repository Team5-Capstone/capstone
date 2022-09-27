import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../store';

const Navbar = ({ handleClick, isLoggedIn }) => (
  <div className='supports-backdrop-blur:bg-white/95 sticky top-0 z-40 w-full flex-none border-b border-slate-800 backdrop-blur transition-colors duration-500'>
    <div className='mx-auto max-w-[1440px]'>
      <nav className='flex justify-between p-4'>
        <Link className='self-center' to='/'>
          <img src='/test-brew-logo.svg' className='h-7' />
        </Link>
        {isLoggedIn ? (
          <div className='flex items-center gap-x-8 self-center'>
            <Link className='m-0 p-0 ' to='#'>
              Account
            </Link>
            <Link
              className='m-0 p-0 text-slate-500'
              to='#'
              onClick={handleClick}>
              Log out
            </Link>

            <Link
              className='self-center rounded-md bg-lime-400 px-4 py-2 text-slate-900'
              to='/jest8'>
              Learn
            </Link>
          </div>
        ) : (
          //

          <div>
            {/* The navbar will show these links before you log in */}
            <Link className='' to='/login'>
              Login
            </Link>
            <Link className='' to='/signup'>
              Sign Up
            </Link>
          </div>
        )}
      </nav>
    </div>
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
