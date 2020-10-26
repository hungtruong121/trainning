import {createActions} from 'reduxsauce';

/**
 * We use reduxsauce's `createActions()` helper to easily create redux actions.
 *
 * Keys are action names and values are the list of parameters for the given action.
 *
 * Action names are turned to SNAKE_CASE into the `Types` variable. This can be used
 * to listen to actions:
 *
 * - to trigger reducers to update the state, for example in App/Stores/Example/Reducers.js
 * - to trigger sagas, for example in App/Sagas/index.js
 *
 * Actions can be dispatched:
 *
 * - in React components using `dispatch(...)`, for example in App/App.js
 * - in sagas using `yield put(...)`, for example in App/Sagas/ExampleSaga.js
 *
 * @see https://github.com/infinitered/reduxsauce#createactions
 */
const {Types, Creators} = createActions({
  // Get team
  fetchTeam: ['teamId', 'userId'],
  fetchTeamLoading: null,
  fetchTeamSuccess: ['team'],
  fetchTeamFailure: ['errorMessage'],
  // Get publicPost
  fetchPublicPost: ['teamId', 'isTeamPost'],
  fetchPublicPostLoading: null,
  fetchPublicPostSuccess: ['listPublicPosts', 'isTeamPost'],
  fetchPublicPostFailure: ['errorMessage'],
  // Get list request join team
  fetchListRequestJoinTeam: ['teamId'],
  fetchListRequestJoinTeamLoading: null,
  fetchListRequestJoinTeamSuccess: ['listRequestJoins'],
  fetchListRequestJoinTeamFailure: ['errorMessage'],
  // Get member list
  fetchMemberList: ['dataPost'],
  fetchMemberListLoading: null,
  fetchMemberListSuccess: ['memberList'],
  fetchMemberListFailure: ['errorMessage'],
  // Get postion
  fetchPositions: ['teamId'],
  fetchPositionsLoading: null,
  fetchPositionsSuccess: ['positions'],
  fetchPositionsFailure: ['errorMessage'],
  // Get list team user joined
  fetchTeamUserJoined: ['userId'],
  fetchTeamUserJoinedLoading: null,
  fetchTeamUserJoinedSuccess: ['listTeam'],
  fetchTeamUserJoinedFailure: ['errorMessage'],
  // Get list sports in system
  fetchSports: [''],
  fetchSportsLoading: null,
  fetchSportsSuccess: ['listSport'],
  fetchSportsFailure: ['errorMessage'],
  // Get list team user following
  fetchTeamFollowing: ['userId'],
  fetchTeamFollowingLoading: null,
  fetchTeamFollowingSuccess: ['listTeamFollow'],
  fetchTeamFollowingFailure: ['errorMessage'],

  // Get list team's members
  fetchTeamMembers: ['teamId', 'keyword'],
  fetchTeamMembersSuccess: ['listTeamMembers'],

  //Get folder of team
  fetchFolder: ['folderId', 'teamId'],
  fetchFolderLoading: null,
  fetchFolderLoadingSuccess: ['folder'],
  fetchFolderDetailLoadingSuccess: ['folderDetail'],
  fetchFolderLoadingFailure: ['errorMessage'],

  // Reset when leave team
  resetActiveTeam: null,
});

export const TeamTypes = Types;
export default Creators;
