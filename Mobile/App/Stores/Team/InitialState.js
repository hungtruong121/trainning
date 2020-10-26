/**
 * The initial values for the redux state.
 */
export const INITIAL_STATE = {
  // team
  team: {},
  loadingTeam: false,
  // publicPost
  listPublicPosts: [],
  teamPost: [],
  loadingPublicPost: false,
  // listRequestJoins
  listRequestJoins: [],
  loadingListRequestJoin: false,
  // list team user joined
  listTeam: [],
  // list sports
  listSport: [],
  // list team user following
  listTeamFollow: {},
  // list team's members
  listTeamMembers: [],
  // folder of team
  folder: {},
  folderDetail: {},
  loadingFolder: false,
  // error
  errorMessage: null,
  errorCode: '',
  memberList: {},
  loadingMemberList: false,
  positions: [],
  loadingPostions: false,
};
