/* eslint-disable prettier/prettier */
import React from 'react';
import { connect } from 'react-redux';
import '../styles.css';
import Editor from './Editor';
import jestLogo from '/public/jestLogo';

/**
 * COMPONENT
 */
export const Home = (props) => {
  return (
    <div>
      <div className='w-2/3 bg-cyan-600 border-2 p-4 flex-col mt-12'>
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
                    className='w-20 h-20 rounded-full max-w-xs'
                    src={jestLogo.imgSrc}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Editor />
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
