import axios from 'axios';

const prompts = (state = [], action) => {
  if (action.type === 'SET_PROMPTS') {
    state = action.prompts.sort((p1, p2) => p1.orderNum - p2.orderNum);
  }
  return state;
};

export const _setPrompts = (prompts) => {
  return {
    type: 'SET_PROMPTS',
    prompts,
  };
};

export const fetchPrompts = () => {
  return async (dispatch) => {
    const prompts = (await axios.get('/api/prompts')).data;
    dispatch(_setPrompts(prompts));
  };
};

// const callActions = (dispatch) => (res) => {
//   dispatch({
//     type: 'FETCH_DATA',
//     payload: res.data,
//   });
//   setHadLoaded(res);
// };

// export const fetchPrompts = (dispatch) => () => {
//   dispatch({ type: 'START_FETCH' });
//   const p = axios.get('/api/prompts');
//   Promise.all(p).then(callActions(dispatch));
// };

export default prompts;
