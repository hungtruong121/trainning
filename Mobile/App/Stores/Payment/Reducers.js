/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import {INITIAL_STATE} from './InitialState';
import {createReducer} from 'reduxsauce';
import {PaymentTypes} from './Actions';

export const fetchTeamInfoLoading = (state) => ({
  ...state,
  loadingTeamInfo: true,
  errorMessage: null,
});

export const fetchTeamInfoSuccess = (state, {teamInfo}) => ({
  ...state,
  teamInfo,
  loadingTeamInfo: false,
  errorMessage: null,
});

export const fetchTeamInfoFailure = (state, {errorMessage}) => ({
  ...state,
  teamInfo: {},
  loadingTeamInfo: false,
  errorMessage: null,
});

export const fetchMemberInfoLoading = (state) => ({
  ...state,
  loadingMemberInfo: true,
  errorMessage: null,
});

export const fetchMemberInfoSuccess = (state, {memberInfo}) => ({
  ...state,
  memberInfo,
  loadingMemberInfo: false,
  errorMessage: null,
});

export const fetchMemberInfoFailure = (state, {errorMessage}) => ({
  ...state,
  memberInfo: [],
  loadingMemberInfo: false,
  errorMessage,
});

export const fetchTeamRankLoading = (state) => ({
  ...state,
  loadingTeamRank: true,
  errorMessage: null,
});

export const fetchTeamRankSuccess = (state, {teamRank}) => ({
  ...state,
  teamRank,
  loadingTeamRank: false,
  errorMessage: null,
});

export const fetchTeamRankFailure = (state, {errorMessage}) => ({
  ...state,
  teamRank: [],
  loadingTeamRank: false,
  errorMessage,
});

export const fetchMemberRankLoading = (state) => ({
  ...state,
  loadingMemberRank: true,
  errorMessage: null,
});

export const fetchMemberRankSuccess = (state, {memberRank}) => ({
  ...state,
  memberRank,
  loadingMemberRank: false,
  errorMessage: null,
});

export const fetchMemberRankFailure = (state, {errorMessage}) => ({
  ...state,
  memberRank: [],
  loadingMemberRank: false,
  errorMessage,
});

/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
export const reducer = createReducer(INITIAL_STATE, {
  [PaymentTypes.FETCH_TEAM_INFO_LOADING]: fetchTeamInfoLoading,
  [PaymentTypes.FETCH_TEAM_INFO_SUCCESS]: fetchTeamInfoSuccess,
  [PaymentTypes.FETCH_TEAM_INFO_FAILURE]: fetchTeamInfoFailure,
  [PaymentTypes.FETCH_MEMBER_INFO_LOADING]: fetchMemberInfoLoading,
  [PaymentTypes.FETCH_MEMBER_INFO_SUCCESS]: fetchMemberInfoSuccess,
  [PaymentTypes.FETCH_MEMBER_INFO_FAILURE]: fetchMemberInfoFailure,
  [PaymentTypes.FETCH_TEAM_RANK_LOADING]: fetchTeamRankLoading,
  [PaymentTypes.FETCH_TEAM_RANK_SUCCESS]: fetchTeamRankSuccess,
  [PaymentTypes.FETCH_TEAM_RANK_FAILURE]: fetchTeamRankFailure,
  [PaymentTypes.FETCH_MEMBER_RANK_LOADING]: fetchMemberRankLoading,
  [PaymentTypes.FETCH_MEMBER_RANK_SUCCESS]: fetchMemberRankSuccess,
  [PaymentTypes.FETCH_MEMBER_RANK_FAILURE]: fetchMemberRankFailure,
});
