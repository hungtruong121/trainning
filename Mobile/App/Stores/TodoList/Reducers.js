/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import {INITIAL_STATE} from './InitialState';
import {createReducer} from 'reduxsauce';
import {TodoListTypes} from './Actions';

export const fetchDetailTodoListLoading = (state) => ({
  ...state,
  loadingTodoList: true,
  errorMessage: null,
});

export const fetchDetailTodoListSuccess = (state, {todoList}) => ({
  ...state,
  todoList,
  loadingTodoList: false,
  errorMessage: null,
});

export const fetchDetailTodoListFailure = (state, {errorMessage}) => ({
  ...state,
  todoList: {},
  loadingTodoList: false,
  errorMessage,
});
/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
export const reducer = createReducer(INITIAL_STATE, {
  /** TODOLIST */
  [TodoListTypes.FETCH_DETAIL_TODO_LIST_LOADING]: fetchDetailTodoListLoading,
  [TodoListTypes.FETCH_DETAIL_TODO_LIST_SUCCESS]: fetchDetailTodoListSuccess,
  [TodoListTypes.FETCH_DETAIL_TODO_LIST_FAILURE]: fetchDetailTodoListFailure,
});
