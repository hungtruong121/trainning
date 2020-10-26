import {put, call, select} from 'redux-saga/effects';
import {todoListService} from '../Services/TodoListService';
import TodoListActions from '../Stores/TodoList/Actions';
import UserActions from '../Stores/User/Actions';

export function* fetchDetailTodoList(action) {
  try {
    const {todoListId} = action;
    yield put(TodoListActions.fetchDetailTodoListLoading());

    const response = yield call(
      todoListService.fetchDetailTodoList,
      todoListId,
    );
    if (response.success) {
      const data = response.data && data !== null ? response.data : {};
      yield put(TodoListActions.fetchDetailTodoListSuccess(data));
    } else {
      const {message, errorCode} = response;
      yield put(UserActions.setErrorCode(errorCode));
      yield put(TodoListActions.fetchAccountingFailure(message));
    }
  } catch (error) {
    yield put(TodoListActions.fetchDetailTodoListFailure('Error'));
  }
}
