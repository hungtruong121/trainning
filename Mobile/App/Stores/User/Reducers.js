/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import {INITIAL_STATE} from './InitialState';
import {createReducer} from 'reduxsauce';
import {UserTypes} from './Actions';

export const setErrorCode = (state, {errorCode}) => ({
  ...state,
  errorCode,
});

export const setInfoUser = (state, {user}) => ({
  ...state,
  ...user,
});

export const resetUser = (state, {}) => ({
  ...state,
  profile: {},
  errorCode: '',
  userId: '',
  language: '',
});

export const fetchProfileLoading = (state) => ({
  ...state,
  loading: true,
  errorMessage: null,
});

export const fetchProfileSuccess = (state, {profile, isMember}) => {
  let data = {
    ...state,
    loading: false,
    errorMessage: null,
  };
  if (isMember) {
    data.profileMember = profile;
  } else {
    data.profile = profile;
  }
  return data;
};

export const fetchProfileFailure = (state, {errorMessage, isMember}) => {
  let data = {
    ...state,
    loading: false,
    errorMessage,
  };
  if (isMember) {
    data.profileMember = {};
  } else {
    data.profile = {};
  }
  return data;
};

export const fetchPersonalTeamInfoLoading = (state) => ({
  ...state,
  loadingListTeamInfo: true,
  errorMessage: null,
});

export const fetchPersonalTeamInfoSuccess = (
  state,
  {listTeamInfo, isMember},
) => {
  let data = {
    ...state,
    loadingListTeamInfo: false,
    errorMessage: null,
  };
  if (isMember) {
    data.listTeamInfoMember = listTeamInfo;
  } else {
    data.listTeamInfo = listTeamInfo;
  }
  return data;
};

export const fetchPersonalTeamInfoFailure = (state, {errorMessage}) => ({
  ...state,
  listTeamInfo: [],
  loadingListTeamInfo: false,
  errorMessage,
});

export const fetchPersonalRelatedPostLoading = (state) => ({
  ...state,
  loadingListRelatedPost: true,
  errorMessage: null,
});

export const fetchPersonalRelatedPostSuccess = (state, {listRelatedPost}) => ({
  ...state,
  listRelatedPost,
  loadingListRelatedPost: false,
  errorMessage: null,
});

export const fetchPersonalRelatedPostFailure = (state, {errorMessage}) => ({
  ...state,
  listRelatedPost: [],
  loadingListRelatedPost: false,
  errorMessage,
});

export const fetchNotificationLoading = (state) => ({
  ...state,
  loadingNotification: true,
  errorMessage: null,
});

export const fetchNotificationSuccess = (state, {notifications}) => ({
  ...state,
  notifications,
  loadingNotification: false,
  errorMessage: null,
});

export const fetchNotificationFailure = (state, {errorMessage}) => ({
  ...state,
  notifications: [],
  loadingNotification: false,
  errorMessage,
});

export const updateLanguage = (state, {language}) => ({
  ...state,
  language,
});

/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
export const reducer = createReducer(INITIAL_STATE, {
  [UserTypes.SET_ERROR_CODE]: setErrorCode,
  [UserTypes.SET_INFO_USER]: setInfoUser,
  [UserTypes.FETCH_PROFILE_LOADING]: fetchProfileLoading,
  [UserTypes.FETCH_PROFILE_SUCCESS]: fetchProfileSuccess,
  [UserTypes.FETCH_PROFILE_FAILURE]: fetchProfileFailure,
  //peronal info team
  [UserTypes.FETCH_PERSONAL_TEAM_INFO_LOADING]: fetchPersonalTeamInfoLoading,
  [UserTypes.FETCH_PERSONAL_TEAM_INFO_SUCCESS]: fetchPersonalTeamInfoSuccess,
  [UserTypes.FETCH_PERSONAL_TEAM_INFO_FAILURE]: fetchPersonalTeamInfoFailure,
  //personal RelatedPost
  [UserTypes.FETCH_PERSONAL_RELATED_POST_LOADING]: fetchPersonalRelatedPostLoading,
  [UserTypes.FETCH_PERSONAL_RELATED_POST_SUCCESS]: fetchPersonalRelatedPostSuccess,
  [UserTypes.FETCH_PERSONAL_RELATED_POST_FAILURE]: fetchPersonalRelatedPostFailure,
  //notification
  [UserTypes.FETCH_NOTIFICATION_LOADING]: fetchNotificationLoading,
  [UserTypes.FETCH_NOTIFICATION_SUCCESS]: fetchNotificationSuccess,
  [UserTypes.FETCH_NOTIFICATION_FAILURE]: fetchNotificationFailure,
  [UserTypes.UPDATE_LANGUAGE]: updateLanguage,
});
