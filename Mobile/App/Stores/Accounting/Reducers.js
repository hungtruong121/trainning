/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import {INITIAL_STATE} from './InitialState';
import {createReducer} from 'reduxsauce';
import {AccountingTypes} from './Actions';

export const fetchAccountingLoading = (state) => ({
  ...state,
  loadingAccounting: true,
  errorMessage: null,
});

export const fetchAccountingSuccess = (state, {accountingTeam}) => ({
  ...state,
  accountingTeam,
  loadingAccounting: false,
  errorMessage: null,
});

export const fetchAccountingFailure = (state, {errorMessage}) => ({
  ...state,
  accountingTeam: {},
  loadingAccounting: false,
  errorMessage,
});
/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
export const reducer = createReducer(INITIAL_STATE, {
  // Accounting
  [AccountingTypes.FETCH_ACCOUNTING_LOADING]: fetchAccountingLoading,
  [AccountingTypes.FETCH_ACCOUNTING_SUCCESS]: fetchAccountingSuccess,
  [AccountingTypes.FETCH_ACCOUNTING_FAILURE]: fetchAccountingFailure,
});
