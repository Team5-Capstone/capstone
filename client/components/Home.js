/* eslint-disable prettier/prettier */
import React from 'react';
import { connect } from 'react-redux';
import '../styles.css';

/**
 * COMPONENT
 */
export const Home = () => {
  return <div>Welcome to the Home Page!</div>;
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
