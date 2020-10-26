import {put, call} from 'redux-saga/effects';
import {userService} from '../Services/UserService';
import UserActions from '../Stores/User/Actions';

export function* fetchProfile(action) {
  try {
    const {userId, isMember} = action;
    yield put(UserActions.fetchProfileLoading());
    const response = yield call(userService.fetchProfile, userId);
    if (response.success) {
      const data = response.data && data !== null ? response.data : {};
      yield put(UserActions.fetchProfileSuccess(data, isMember));
    } else {
      const {message, errorCode} = response;
      yield put(UserActions.setErrorCode(errorCode));
      yield put(
        UserActions.fetchProfileFailure(message ? message : '', isMember),
      );
    }
  } catch (error) {
    yield put(UserActions.fetchProfileFailure('Error'));
  }
}

export function* fetchPersonalTeamInfo(action) {
  try {
    const {userId, isMember} = action;
    yield put(UserActions.fetchPersonalTeamInfoLoading());
    const response = yield call(userService.fetchPersonalTeamInfo, userId);
    if (response.success) {
      const data = response.data && data !== null ? response.data : {};
      yield put(UserActions.fetchPersonalTeamInfoSuccess(data, isMember));
    } else {
      const {message, errorCode} = response;
      yield put(UserActions.setErrorCode(errorCode));
      yield put(
        UserActions.fetchPersonalTeamInfoFailure(message ? message : ''),
      );
    }
  } catch (error) {
    yield put(UserActions.fetchPersonalTeamInfoFailure('Error'));
  }
}

export function* fetchPersonalRelatedPost(action) {
  try {
    const {userId} = action;
    yield put(UserActions.fetchPersonalRelatedPostLoading());
    const response = yield call(userService.fetchPersonalRelatedPost, userId);

    if (response.success) {
      const data = response.data && data !== null ? response.data : {};
      yield put(UserActions.fetchPersonalRelatedPostSuccess(data));
    } else {
      const {message, errorCode} = response;
      yield put(UserActions.setErrorCode(errorCode));
      yield put(
        UserActions.fetchPersonalRelatedPostFailure(message ? message : ''),
      );
    }
  } catch (error) {
    yield put(UserActions.fetchPersonalRelatedPostFailure('Error'));
  }
}

export function* fetchNotification(action) {
  try {
    const {dataPost} = action;
    yield put(UserActions.fetchNotificationLoading());
    const response = yield call(userService.fetchNotification, dataPost);
    if (response.success) {
      const data = response.data && data !== null ? response.data : [];
      yield put(UserActions.fetchNotificationSuccess(data));
    } else {
      const {message, errorCode} = response;
      yield put(UserActions.setErrorCode(errorCode));
      yield put(UserActions.fetchNotificationFailure(message));
    }
  } catch (error) {
    yield put(UserActions.fetchNotificationFailure('Error'));
  }
}
