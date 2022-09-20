/* eslint-disable prettier/prettier */
import React from 'react';
import { connect } from 'react-redux';
import Editor from './Editor.js';
import '../style.css';

/**
 * COMPONENT
 */
export const Home = () => {
  return (
    <div>
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
