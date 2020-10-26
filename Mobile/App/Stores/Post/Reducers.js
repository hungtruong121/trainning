/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import {INITIAL_STATE} from './InitialState';
import {createReducer} from 'reduxsauce';
import {PostTypes} from './Actions';

export const fetchPostDetailSuccess = (state, {postDetail}) => ({
  ...state,
  postDetail,
});

export const reducer = createReducer(INITIAL_STATE, {
  // Post
  [PostTypes.FETCH_POST_DETAIL_SUCCESS]: fetchPostDetailSuccess,
});
