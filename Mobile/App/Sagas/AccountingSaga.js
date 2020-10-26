import {put, call, select} from 'redux-saga/effects';
import {accountingService} from '../Services/AccountingService';
import AccoutingActions from '../Stores/Accounting/Actions';
import UserActions from '../Stores/User/Actions';

export function* fetchAccounting(action) {
  try {
    const {accountingId} = action;
    yield put(AccoutingActions.fetchAccountingLoading());

    const response = yield call(
      accountingService.fetchAccounting,
      accountingId,
    );
    if (response.success) {
      const data = response.data && data !== null ? response.data : {};
      yield put(AccoutingActions.fetchAccountingSuccess(data));
    } else {
      const {message, errorCode} = response;
      yield put(UserActions.setErrorCode(errorCode));
      yield put(AccoutingActions.fetchAccountingFailure(message));
    }
  } catch (error) {
    yield put(AccoutingActions.fetchAccountingFailure('Error'));
  }
}
