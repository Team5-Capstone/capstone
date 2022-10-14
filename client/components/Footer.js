import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../store';

const Footer = ({ handleClick }) => (
  <div className='flex min-h-[30vh] w-full flex-none flex-col bg-slate-900 pt-4 pb-8'>
    <div className='mx-auto w-full max-w-[1440px] grow py-8'>
      <div className='flex w-full justify-between px-4 pb-4'>
        <div className='flex w-1/4 flex-col justify-between self-stretch'>
          <img src='/boba-cup.svg' className='h-20 self-start' />
        </div>
        <div className='flex flex-col gap-y-3'>
          <Link className='m-0 p-0 ' to='#'>
            Resources
          </Link>
          <Link className='m-0 p-0 text-slate-500' to='#' onClick={handleClick}>
            Coming Soon
          </Link>
        </div>
        <div className='flex flex-col gap-y-3'>
          <Link className='m-0 p-0 ' to='#'>
            Product
          </Link>
          <Link className='m-0 p-0 text-slate-500' to='#' onClick={handleClick}>
            Coming Soon
          </Link>
        </div>
        <div className='flex flex-col gap-y-3'>
          <Link className='m-0 p-0 ' to='#'>
            About
          </Link>
          <Link className='m-0 p-0 text-slate-500' to='#' onClick={handleClick}>
            Coming Soon
          </Link>
        </div>
        <div className='flex flex-col gap-y-3'>
          <Link className='m-0 p-0 ' to='#'>
            Support
          </Link>
          <Link className='m-0 p-0 text-slate-500' to='#' onClick={handleClick}>
            Coming Soon
          </Link>
        </div>
      </div>
    </div>
    <hr className='border-slate-700' />
    <div className='mx-auto flex w-full max-w-[1440px] grow items-center justify-between py-8 px-4'>
      <div className='flex gap-8'>
        <img src='/logo-github.svg' className='h-8 self-center' />
        <img src='/logo-discord.svg' className='h-8 self-center' />
        <img src='/logo-slack.svg' className='h-8 self-center' />
        <img src='/logo-twitter.svg' className='h-8 self-center' />
      </div>
      <p className='text-center'>
        Made with <span className='text-red-500'>♥</span> in CT, IL, NJ & NY
      </p>
    </div>
    <hr className='border-slate-700' />
    <p className='mt-8 text-center text-slate-500'>© 2022 TestBrew</p>
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

export default connect(mapState, mapDispatch)(Footer);
