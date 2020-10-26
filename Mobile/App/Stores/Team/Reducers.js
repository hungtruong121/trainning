/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import {INITIAL_STATE} from './InitialState';
import {createReducer} from 'reduxsauce';
import {TeamTypes} from './Actions';

export const fetchTeamLoading = (state) => ({
  ...state,
  loadingTeam: true,
  errorMessage: null,
});

export const fetchTeamSuccess = (state, {team}) => ({
  ...state,
  team,
  loadingTeam: false,
  errorMessage: null,
});

export const fetchTeamFailure = (state, {errorMessage}) => ({
  ...state,
  team: {},
  loadingTeam: false,
  errorMessage,
});

export const fetchPublicPostLoading = (state) => ({
  ...state,
  loadingPublicPost: true,
  errorMessage: null,
});

export const fetchPublicPostSuccess = (
  state,
  {listPublicPosts, isTeamPost},
) => {
  let data = {
    ...state,
    loadingPublicPost: false,
    errorMessage: null,
  };
  if (isTeamPost) {
    data.teamPost = listPublicPosts;
  } else {
    data.listPublicPosts = listPublicPosts;
  }
  return data;
};

export const fetchPublicPostFailure = (state, {errorMessage}) => ({
  ...state,
  listPublicPosts: [],
  loadingPublicPost: false,
  errorMessage,
});

export const fetchListRequestJoinTeamLoading = (state) => ({
  ...state,
  loadingListRequestJoin: true,
  errorMessage: null,
});

export const fetchListRequestJoinTeamSuccess = (state, {listRequestJoins}) => ({
  ...state,
  listRequestJoins,
  loadingListRequestJoin: false,
  errorMessage: null,
});

export const fetchListRequestJoinTeamFailure = (state, {errorMessage}) => ({
  ...state,
  listRequestJoins: [],
  loadingListRequestJoin: false,
  errorMessage,
});

export const fetchMemberListLoading = (state) => ({
  ...state,
  loadingMemberList: true,
  errorMessage: null,
});

export const fetchMemberListSuccess = (state, {memberList}) => ({
  ...state,
  memberList,
  loadingMemberList: false,
  errorMessage: null,
});

export const fetchMemberListFailure = (state, {errorMessage}) => ({
  ...state,
  memberList: {},
  loadingMemberList: false,
  errorMessage,
});

export const fetchPositionsLoading = (state) => ({
  ...state,
  loadingPostions: true,
  errorMessage: null,
});

export const fetchPositionsSuccess = (state, {positions}) => ({
  ...state,
  positions,
  loadingPostions: false,
  errorMessage: null,
});

export const fetchPositionsFailure = (state, {errorMessage}) => ({
  ...state,
  positions: [],
  loadingPostions: false,
  errorMessage,
});

export const fetchTeamUserJoinedLoading = (state) => ({
  ...state,
  errorMessage: null,
});

export const fetchTeamUserJoinedSuccess = (state, {listTeam}) => ({
  ...state,
  listTeam,
  errorMessage: null,
});

export const fetchTeamUserJoinedFailure = (state, {errorMessage}) => ({
  ...state,
  listTeam: [],
  errorMessage,
});

export const fetchSportsLoading = (state) => ({
  ...state,
  errorMessage: null,
});

export const fetchSportsSuccess = (state, {listSport}) => ({
  ...state,
  listSport,
  errorMessage: null,
});

export const fetchSportsFailure = (state, {errorMessage}) => ({
  ...state,
  listSport: [],
  errorMessage,
});

export const fetchTeamFollowingLoading = (state) => ({
  ...state,
  errorMessage: null,
});

export const fetchTeamFollowingSuccess = (state, {listTeamFollow}) => ({
  ...state,
  listTeamFollow,
  errorMessage: null,
});

export const fetchTeamFollowingFailure = (state, {errorMessage}) => ({
  ...state,
  listTeamFollow: {},
  errorMessage,
});

export const fetchTeamMembersSuccess = (state, {listTeamMembers}) => ({
  ...state,
  listTeamMembers,
  loadingTeam: false,
  errorMessage: null,
});

export const fetchFolderLoading = (state) => ({
  ...state,
  loadingFolder: true,
  errorMessage: null,
});

export const fetchFolderLoadingSuccess = (state, {folder}) => ({
  ...state,
  folder,
  loadingFolder: false,
  errorMessage: null,
});

export const fetchFolderDetailLoadingSuccess = (state, {folderDetail}) => ({
  ...state,
  folderDetail,
  loadingFolder: false,
  errorMessage: null,
});

export const fetchFolderLoadingFailure = (state, {errorMessage}) => ({
  ...state,
  folder: {},
  errorMessage,
});
export const resetActiveTeam = (state) => ({
  ...state,
  team: {},
  listPublicPosts: [],
});

/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
export const reducer = createReducer(INITIAL_STATE, {
  // Team
  [TeamTypes.FETCH_TEAM_LOADING]: fetchTeamLoading,
  [TeamTypes.FETCH_TEAM_SUCCESS]: fetchTeamSuccess,
  [TeamTypes.FETCH_TEAM_FAILURE]: fetchTeamFailure,
  // PublicPost
  [TeamTypes.FETCH_PUBLIC_POST_LOADING]: fetchPublicPostLoading,
  [TeamTypes.FETCH_PUBLIC_POST_SUCCESS]: fetchPublicPostSuccess,
  [TeamTypes.FETCH_PUBLIC_POST_FAILURE]: fetchPublicPostFailure,
  // listRequestJoinTeams
  [TeamTypes.FETCH_LIST_REQUEST_JOIN_TEAM_LOADING]: fetchListRequestJoinTeamLoading,
  [TeamTypes.FETCH_LIST_REQUEST_JOIN_TEAM_SUCCESS]: fetchListRequestJoinTeamSuccess,
  [TeamTypes.FETCH_LIST_REQUEST_JOIN_TEAM_FAILURE]: fetchListRequestJoinTeamFailure,
  // memberList
  [TeamTypes.FETCH_MEMBER_LIST_LOADING]: fetchMemberListLoading,
  [TeamTypes.FETCH_MEMBER_LIST_SUCCESS]: fetchMemberListSuccess,
  [TeamTypes.FETCH_MEMBER_LIST_FAILURE]: fetchMemberListFailure,
  // postion
  [TeamTypes.FETCH_POSITIONS_LOADING]: fetchPositionsLoading,
  [TeamTypes.FETCH_POSITIONS_SUCCESS]: fetchPositionsSuccess,
  [TeamTypes.FETCH_POSITIONS_FAILURE]: fetchPositionsFailure,
  // teams user joined
  [TeamTypes.FETCH_TEAM_USER_JOINED_LOADING]: fetchTeamUserJoinedLoading,
  [TeamTypes.FETCH_TEAM_USER_JOINED_SUCCESS]: fetchTeamUserJoinedSuccess,
  [TeamTypes.FETCH_TEAM_USER_JOINED_FAILURE]: fetchTeamUserJoinedFailure,
  // list sport
  [TeamTypes.FETCH_SPORTS_LOADING]: fetchSportsLoading,
  [TeamTypes.FETCH_SPORTS_SUCCESS]: fetchSportsSuccess,
  [TeamTypes.FETCH_SPORTS_FAILURE]: fetchSportsFailure,
  // teams user following
  [TeamTypes.FETCH_TEAM_FOLLOWING_LOADING]: fetchTeamFollowingLoading,
  [TeamTypes.FETCH_TEAM_FOLLOWING_SUCCESS]: fetchTeamFollowingSuccess,
  [TeamTypes.FETCH_TEAM_FOLLOWING_FAILURE]: fetchTeamFollowingFailure,

  [TeamTypes.FETCH_TEAM_MEMBERS_SUCCESS]: fetchTeamMembersSuccess,
  // folder of team
  [TeamTypes.FETCH_FOLDER_LOADING]: fetchFolderLoading,
  [TeamTypes.FETCH_FOLDER_LOADING_SUCCESS]: fetchFolderLoadingSuccess,
  [TeamTypes.FETCH_FOLDER_DETAIL_LOADING_SUCCESS]: fetchFolderDetailLoadingSuccess,
  [TeamTypes.FETCH_FOLDER_LOADING_FAILURE]: fetchFolderLoadingFailure,
  [TeamTypes.RESET_ACTIVE_TEAM]: resetActiveTeam,
});
