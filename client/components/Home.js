/* eslint-disable prettier/prettier */
import React from 'react';
import { connect } from 'react-redux';
import '../style.css';
import { Link } from 'react-router-dom';

/**
 * COMPONENT
 */
export const Home = ({ isLoggedIn }) => {
  console.log(isLoggedIn);
  return (
    <div className='w-full'>
      <section className=''>
        <div className='left-0 flex min-h-[70vh] w-full flex-col items-center justify-center border-b border-slate-700 bg-gradient-to-t from-slate-800 to-slate-900'>
          <div className='max-w-[700px] py-10 text-center lg:w-3/4'>
            <p className='py-4 text-center leading-normal text-lime-400'>
              Welcome to TestBrew
            </p>
            <h1 className='text-center font-inter text-[64px] leading-tight'>
              <b>The quickest way to learn unit testing</b>
            </h1>
            <h3 className='pt-8 text-center text-[24px] leading-normal text-slate-500'>
              TestBrew helps you learn the fundamental syntax of some of the
              most popular testing languages. Learn to write unit tests today!
            </h3>
            <p className='inline-block py-8 text-center leading-normal text-slate-300'>
              Select a language to get started:
            </p>
            <div className='mt-2 mb-6 flex items-center justify-center gap-10'>
              <img className='h-14 self-center' src='/jest-logo.svg' />
              <img className='h-16' src='/mocha-logo.svg' />
              <img className='h-14 self-center' src='/karma-logo.svg' />
              <img className='h-16' src='/jasmine-logo.svg' />
            </div>
            <Link
              to={isLoggedIn ? '/jest' : '/login'}
              className='group my-6 inline-flex items-center gap-4 rounded-lg bg-gradient-to-r from-lime-500 to-lime-400 px-8 py-4 text-[18px] text-slate-900 transition-all hover:shadow-lg hover:shadow-lime-400/40'>
              {isLoggedIn ? 'Continue your progress' : 'Get started for free'}
              <svg
                // className='transition-all group-hover:ml-4'
                width='17'
                height='18'
                viewBox='0 0 17 18'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M1.48022 8.87939H14.5'
                  stroke='#101827'
                  strokeWidth='2'
                  strokeLinecap='square'
                  strokeLinejoin='round'
                />
                <path
                  d='M8.48022 1.87939L15.4802 8.87939L8.48022 15.8794'
                  stroke='#101827'
                  strokeWidth='2'
                  strokeLinecap='square'
                />
              </svg>
            </Link>
          </div>
        </div>
        <div id='modal-root'></div>
      </section>
      {/* <section className='mx-auto min-h-screen max-w-[1440px]'>
        <div className='py-8'>
          <p className='font-black'>What is a unit test?</p>

          <p>
            A unit test should test the behaviour of a given input, expecting a
            specific end result. Unit tests should be:
          </p>
          <div>
            <ul className='list-decimal pl-4'>
              <li>Repeatable</li>
              <li>Fast</li>
              <li>Consistent</li>
              <li>Easy to write and read</li>
            </ul>
          </div>
        </div>
      </section> */}
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

export default connect(mapState)(Home);
