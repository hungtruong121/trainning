import {takeLatest, all} from 'redux-saga/effects';
import {UserTypes} from '../Stores/User/Actions';
import {
  fetchProfile,
  fetchPersonalTeamInfo,
  fetchPersonalRelatedPost,
  fetchNotification,
} from './UserSaga';
import {TeamTypes} from '../Stores/Team/Actions';
import {
  fetchTeam,
  fetchPostPublic,
  fetchListRequestJoin,
  fetchMemberList,
  fetchPositions,
  fetchTeamUserJoined,
  fetchSports,
  fetchTeamFollowing,
  fetchTeamMembers,
  fetchFolder,
} from '../Sagas/TeamSaga';
import {fetchAccounting} from '../Sagas/AccountingSaga';
import {AccountingTypes} from '../Stores/Accounting/Actions';
import {fetchDetailTodoList} from '../Sagas/TodoListSaga';
import {TodoListTypes} from '../Stores/TodoList/Actions';
import {
  fetchPostDetail,
  fetchLikeComment,
  fetchSendComment,
  fetchDeletePost,
  fetchSendAnswerSurvey,
  fetchVoteSelection,
} from '../Sagas/PostSaga';
import {PostTypes} from '../Stores/Post/Actions';
import {PaymentTypes} from '../Stores/Payment/Actions';
import {
  fetchTeamInfo,
  fetchTeamRank,
  fetchMemberInfo,
  fetchMemberRank,
} from './PaymentSaga';

export default function* root() {
  yield all([
    /**
     * @see https://redux-saga.js.org/docs/basics/UsingSagaHelpers.html
     */
    // Run the startup saga when the application starts
    takeLatest(UserTypes.FETCH_PROFILE, fetchProfile),
    takeLatest(UserTypes.FETCH_PERSONAL_TEAM_INFO, fetchPersonalTeamInfo),
    takeLatest(TeamTypes.FETCH_TEAM_USER_JOINED, fetchTeamUserJoined),
    takeLatest(TeamTypes.FETCH_TEAM, fetchTeam),
    takeLatest(TeamTypes.FETCH_PUBLIC_POST, fetchPostPublic),
    takeLatest(TeamTypes.FETCH_LIST_REQUEST_JOIN_TEAM, fetchListRequestJoin),
    takeLatest(TeamTypes.FETCH_MEMBER_LIST, fetchMemberList),
    takeLatest(TeamTypes.FETCH_POSITIONS, fetchPositions),
    takeLatest(UserTypes.FETCH_PERSONAL_RELATED_POST, fetchPersonalRelatedPost),
    takeLatest(UserTypes.FETCH_NOTIFICATION, fetchNotification),
    takeLatest(TeamTypes.FETCH_SPORTS, fetchSports),
    takeLatest(TeamTypes.FETCH_TEAM_FOLLOWING, fetchTeamFollowing),
    takeLatest(TeamTypes.FETCH_TEAM_MEMBERS, fetchTeamMembers),
    takeLatest(PostTypes.FETCH_POST_DETAIL, fetchPostDetail),
    takeLatest(PostTypes.FETCH_LIKE_COMMENT, fetchLikeComment),
    takeLatest(PostTypes.FETCH_SEND_COMMENT, fetchSendComment),
    takeLatest(PostTypes.FETCH_DELETE_POST, fetchDeletePost),
    takeLatest(PostTypes.FETCH_SEND_ANSWER_SURVEY, fetchSendAnswerSurvey),
    takeLatest(PostTypes.FETCH_VOTE_SELECTION, fetchVoteSelection),
    takeLatest(TeamTypes.FETCH_FOLDER, fetchFolder),
    takeLatest(AccountingTypes.FETCH_ACCOUNTING, fetchAccounting),
    takeLatest(TodoListTypes.FETCH_DETAIL_TODO_LIST, fetchDetailTodoList),
    takeLatest(PaymentTypes.FETCH_TEAM_INFO, fetchTeamInfo),
    takeLatest(PaymentTypes.FETCH_TEAM_RANK, fetchTeamRank),
    takeLatest(PaymentTypes.FETCH_MEMBER_INFO, fetchMemberInfo),
    takeLatest(PaymentTypes.FETCH_MEMBER_RANK, fetchMemberRank),
  ]);
}
