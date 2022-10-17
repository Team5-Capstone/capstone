import React from 'react';
import { connect } from 'react-redux';
import '../style.css';
import { Link } from 'react-router-dom';

function TextSection({ isLoggedIn }) {
  return (
    <section className=' w-full border-b border-slate-700 bg-slate-900'>
      <div className='mx-auto flex max-w-[1440px] flex-col items-center justify-start gap-8 py-24'>
        <h2 className='gradient-text pb-8 text-5xl font-bold' style={{}}>
          Why unit testing?
        </h2>
        <div className='flex w-10/12 gap-16'>
          <div className='w-1/2'>
            <p className='pr-4 text-2xl font-light leading-normal text-slate-400'>
              In a testing level hierarchy, unit testing is the first level of
              testing done before integration and other remaining levels of the
              testing. It uses modules for the testing process which reduces the
              dependency of waiting for Unit testing frameworks, stubs, drivers
              and mock objects are used for assistance in unit testing.
            </p>
            <Link
              to={isLoggedIn ? '/jest' : '/jest'}
              className='filled-button group mt-8 inline-flex items-center gap-4 rounded-lg bg-gradient-to-r from-lime-500 to-lime-400 px-8 py-4 text-[18px] text-slate-900 transition-all'>
              Start learning
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
          <div className='w-1/2 rounded-xl bg-slate-800 px-16 py-10 shadow-lg'>
            <ul className='list-disc text-2xl font-light leading-normal text-slate-400'>
              <li className='mb-4'>
                Unit testing helps tester and developers to understand the base
                of code that makes them able to change defect causing code
                quickly.
              </li>
              <li className='mb-4'>Unit testing helps in the documentation.</li>
              <li className='mb-4'>
                Unit testing fixes defects very early in the development phase
                that's why there is a possibility to occur a smaller number of
                defects in upcoming testing levels.
              </li>
              <li>
                It helps with code reusability by migrating code and test cases.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

const mapState = (state) => {
  return {
    isLoggedIn: !!state.auth.id,
  };
};

export default connect(mapState)(TextSection);
