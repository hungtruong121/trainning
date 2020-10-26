import {put, call} from 'redux-saga/effects';
import {paymentService} from '../Services/PaymentService';
import PaymentActions from '../Stores/Payment/Actions';
import UserActions from '../Stores/User/Actions';

export function* fetchTeamInfo(action) {
  try {
    const {teamId} = action;
    yield put(PaymentActions.fetchTeamInfoLoading());
    const response = yield call(paymentService.fetchTeamInfo, teamId);
    if (response.success) {
      const data = response.data && data !== null ? response.data : {};
      yield put(PaymentActions.fetchTeamInfoSuccess(data));
    } else {
      const {message, errorCode} = response;
      yield put(UserActions.setErrorCode(errorCode));
      yield put(PaymentActions.fetchTeamInfoFailure(message ? message : ''));
    }
  } catch (error) {
    yield put(PaymentActions.fetchTeamInfoFailure('Error'));
  }
}

export function* fetchTeamRank() {
  try {
    yield put(PaymentActions.fetchTeamRankLoading());
    const response = yield call(paymentService.fetchTeamRank);
    if (response.success) {
      const data = response.data && data !== null ? response.data : [];
      yield put(PaymentActions.fetchTeamRankSuccess(data));
    } else {
      const {message, errorCode} = response;
      yield put(UserActions.setErrorCode(errorCode));
      yield put(PaymentActions.fetchTeamRankFailure(message ? message : ''));
    }
  } catch (error) {
    yield put(PaymentActions.fetchTeamInfoFailure('Error'));
  }
}

export function* fetchMemberInfo(action) {
  try {
    yield put(PaymentActions.fetchMemberInfoLoading());
    const response = yield call(paymentService.fetchMemberInfo);
    if (response.success) {
      const data = response.data && data !== null ? response.data : {};
      yield put(PaymentActions.fetchMemberInfoSuccess(data));
    } else {
      const {message, errorCode} = response;
      yield put(UserActions.setErrorCode(errorCode));
      yield put(PaymentActions.fetchMemberInfoFailure(message ? message : ''));
    }
  } catch (error) {
    yield put(PaymentActions.fetchMemberInfoFailure('Error'));
  }
}

export function* fetchMemberRank() {
  try {
    yield put(PaymentActions.fetchMemberRankLoading());
    const response = yield call(paymentService.fetchMemberRank);
    if (response.success) {
      const data = response.data && data !== null ? response.data : [];
      yield put(PaymentActions.fetchMemberRankSuccess(data));
    } else {
      const {message, errorCode} = response;
      yield put(UserActions.setErrorCode(errorCode));
      yield put(PaymentActions.fetchMemberRankFailure(message ? message : ''));
    }
  } catch (error) {
    yield put(PaymentActions.fetchMemberRankFailure('Error'));
  }
}
