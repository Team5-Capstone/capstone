import React from 'react';
import { connect } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../store';

const Navbar = ({ handleClick, isLoggedIn }) => {
  const location = useLocation();

  const LoggedInLinks = () => {
    return (
      <div>
        {location.pathname.includes('jest') ? (
          <div className='flex h-[40px] items-center gap-x-8 self-center'>
            <Link className='m-0 p-0 ' to='#'>
              Account
            </Link>
            <Link
              className='m-0 p-0 text-slate-500'
              to='#'
              onClick={handleClick}>
              Log out
            </Link>
          </div>
        ) : (
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

              className='self-center rounded-md bg-gradient-to-r from-lime-500 to-lime-400 px-4 py-2 text-slate-900 transition-all hover:shadow-md hover:shadow-lime-400/40'

              to='/jest'>
              Learn
            </Link>
          </div>
        )}
      </div>
    );
  };

  const LoginButtons = () => {
    return (
      <div>
        {location.pathname === '/login' || location.pathname === '/signup' ? (
          <div className='h-[40px]'></div>
        ) : (
          <div>
            {/* The navbar will show these links before you log in */}
            <Link
              className='inline-block self-center rounded-md bg-gradient-to-r from-lime-500 to-lime-400 px-4 py-2 text-slate-900 transition-all hover:shadow-md hover:shadow-lime-400/40'
              to='/login'>
              Login
            </Link>
            <Link
              className='ml-4 inline-block self-center rounded-md border border-lime-400 px-4 py-2 text-lime-400 transition-all '
              to='/signup'>
              Sign Up
            </Link>
          </div>
        )}
      </div>
    );
  };
  return (
    <div className='supports-backdrop-blur:bg-white/95 sticky top-0 z-40 min-h-[72px] w-full flex-none border-b border-slate-700 backdrop-blur transition-colors duration-500'>
      <div
        className={
          location.pathname.includes('jest')
            ? 'mx-auto px-4'
            : 'mx-auto max-w-[1440px]'
        }>
        <nav className='flex justify-between p-4'>
          <Link className='self-center' to='/'>
            <img src='/test-brew-logo.svg' className='h-7' />
          </Link>
          {isLoggedIn ? <LoggedInLinks /> : <LoginButtons />}
        </nav>
      </div>
    </div>
  );
};

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
