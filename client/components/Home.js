/* eslint-disable prettier/prettier */
import React from 'react';
import { connect } from 'react-redux';
import '../styles.css';
import jestLogo from '/public/jestLogo';

/**
 * COMPONENT
 */
export const Home = (props) => {
  return (
    <div>
      <div className='mt-12 w-2/3 flex-col border-2 bg-cyan-600 p-4'>
        <div>
          <p className='decoration-wavy'>
            {' '}
            Welcome to testBrew{' '}
            <span className='font-black'> {props.username} </span>, a place
            where you can practice writing Unit Tests and learn the fundamental
            syntax of a testing language in 15-minutes!{' '}
          </p>
          <br></br>
          <p className='font-black text-emerald-400'>
            {' '}
            But, what is a unit test?{' '}
          </p>
          <br></br>
          <p>
            {' '}
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
          <div>
            <br></br>
            <p>Pick a testing language below to get started:</p>
            <div>
              <div>
                <a>
                  <img
                    className='h-20 w-20 max-w-xs rounded-full'
                    src={jestLogo.imgSrc}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    username: state.auth.username,
  };
};

export default connect(mapState)(Home);
