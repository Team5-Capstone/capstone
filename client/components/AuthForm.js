import React from 'react';
import { connect } from 'react-redux';
import { authenticate } from '../store';

/**
 * COMPONENT
 */
const AuthForm = (props) => {
  const { name, displayName, handleSubmit, error } = props;

  return (
    <div className='w-full'>
      <div className='left-0 flex min-h-[70vh] w-full flex-col items-center justify-center border-b border-slate-700 bg-gradient-to-t from-slate-800 to-slate-900'>
        <div className='flex max-w-[700px] flex-col items-center justify-center py-10 lg:w-3/4'>
          <form
            onSubmit={handleSubmit}
            name={name}
            className='flex flex-col gap-4 lg:w-1/2'>
            <div className='w-full'>
              <label htmlFor='username'>
                <p className='text-slate-500'>Username</p>
              </label>
              <input
                name='username'
                type='text'
                className='mt-4 w-full rounded-lg py-2 px-4'
              />
            </div>
            <div>
              <label htmlFor='password'>
                <p className='text-slate-500'>Password</p>
              </label>
              <input
                name='password'
                type='password'
                className='my-4 w-full rounded-lg py-2 px-4'
              />
            </div>
            <div className='flex items-center justify-between'>
              <div>
                <button
                  className="className='hover:shadow-lime-400/40' rounded-md bg-gradient-to-r from-lime-500 to-lime-400 px-4 py-2 text-slate-900 transition-all hover:shadow-md"
                  type='submit'>
                  {displayName}
                </button>
                <a
                  href={displayName === 'Log in' ? '/signup' : '/login'}
                  className='ml-8 inline-block text-lime-400'>
                  {displayName === 'Log in' ? 'Sign up' : 'Log in'}
                </a>
              </div>
              <a
                href='#'
                className='ml-4 inline-block rounded-lg text-slate-500'>
                Forgot password?
              </a>
            </div>
            {error && error.response && <div> {error.response.data} </div>}
          </form>
        </div>
      </div>
    </div>
  );
};

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = (state) => {
  return {
    name: 'login',
    displayName: 'Log in',
    error: state.auth.error,
  };
};

const mapSignup = (state) => {
  return {
    name: 'signup',
    displayName: 'Sign up',
    error: state.auth.error,
  };
};

const mapDispatch = (dispatch) => {
  return {
    handleSubmit(evt) {
      evt.preventDefault();
      const formName = evt.target.name;
      const username = evt.target.username.value;
      const password = evt.target.password.value;
      dispatch(authenticate(username, password, formName));
    },
  };
};

export const Login = connect(mapLogin, mapDispatch)(AuthForm);
export const Signup = connect(mapSignup, mapDispatch)(AuthForm);
