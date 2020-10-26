import {put, call} from 'redux-saga/effects';
import {teamService} from '../Services/TeamService';
import TeamActions from '../Stores/Team/Actions';
import UserActions from '../Stores/User/Actions';

export function* fetchTeam(action) {
  try {
    const {teamId, userId} = action;
    yield put(TeamActions.fetchTeamLoading());

    const response = yield call(teamService.fetchTeam, teamId, userId);
    if (response.success) {
      const data = response.data && data !== null ? response.data : {};
      yield put(TeamActions.fetchTeamSuccess(data));
    } else {
      const {message, errorCode} = response;
      yield put(UserActions.setErrorCode(errorCode));
      yield put(TeamActions.fetchTeamFailure(message));
    }
  } catch (error) {
    yield put(TeamActions.fetchTeamFailure('Error'));
  }
}

export function* fetchPostPublic(action) {
  try {
    const {teamId, isTeamPost} = action;
    yield put(TeamActions.fetchPublicPostLoading());

    const response = yield call(teamService.fetchPostPublic, teamId);
    if (response.success) {
      const data = response.data && data !== null ? response.data : [];
      yield put(TeamActions.fetchPublicPostSuccess(data, isTeamPost));
    } else {
      const {message, errorCode} = response;
      yield put(UserActions.setErrorCode(errorCode));
      yield put(TeamActions.fetchPublicPostFailure(message));
    }
  } catch (error) {
    yield put(TeamActions.fetchPublicPostFailure('Error'));
  }
}

export function* fetchListRequestJoin(action) {
  try {
    const {teamId} = action;
    yield put(TeamActions.fetchListRequestJoinTeamLoading());

    const response = yield call(teamService.fetchListRequestJoin, teamId);
    if (response.success) {
      const data = response.data && data !== null ? response.data : [];
      yield put(TeamActions.fetchListRequestJoinTeamSuccess(data));
    } else {
      const {message, errorCode} = response;
      yield put(UserActions.setErrorCode(errorCode));
      yield put(TeamActions.fetchListRequestJoinTeamFailure(message));
    }
  } catch (error) {
    yield put(TeamActions.fetchListRequestJoinTeamFailure('Error'));
  }
}

export function* fetchMemberList(action) {
  try {
    const {dataPost} = action;
    yield put(TeamActions.fetchMemberListLoading());
    const response = yield call(teamService.fetchMemberList, dataPost);
    if (response.success) {
      const data = response.data && data !== null ? response.data : {};
      yield put(TeamActions.fetchMemberListSuccess(data));
    } else {
      const {message, errorCode} = response;
      yield put(UserActions.setErrorCode(errorCode));
      yield put(TeamActions.fetchMemberListFailure(message));
    }
  } catch (error) {
    yield put(TeamActions.fetchTeamFailure('Error'));
  }
}

export function* fetchPositions(action) {
  try {
    const {teamId} = action;
    yield put(TeamActions.fetchPositionsLoading());
    const response = yield call(teamService.fetchPositions, teamId);
    if (response.success) {
      const data = response.data && data !== null ? response.data : [];
      yield put(TeamActions.fetchPositionsSuccess(data));
    } else {
      const {message, errorCode} = response;
      yield put(UserActions.setErrorCode(errorCode));
      yield put(TeamActions.fetchPositionsFailure(message));
    }
  } catch (error) {
    yield put(TeamActions.fetchPositionsFailure('Error'));
  }
}

export function* fetchTeamUserJoined(action) {
  try {
    const {userId} = action;
    yield put(TeamActions.fetchTeamUserJoinedLoading());
    const response = yield call(teamService.fetchTeamUserJoined, userId);
    if (response.success) {
      const data = response.data && data !== null ? response.data : [];
      yield put(TeamActions.fetchTeamUserJoinedSuccess(data));
    } else {
      const {message, errorCode} = response;
      yield put(UserActions.setErrorCode(errorCode));
      yield put(TeamActions.fetchTeamUserJoinedFailure(message ? message : ''));
    }
  } catch (error) {
    yield put(TeamActions.fetchTeamUserJoinedFailure('Error'));
  }
}

export function* fetchSports() {
  try {
    yield put(TeamActions.fetchSportsLoading());
    const response = yield call(teamService.fetchSports);
    if (response.success) {
      const data = response.data && data !== null ? response.data : [];
      yield put(TeamActions.fetchSportsSuccess(data));
    } else {
      const {message, errorCode} = response;
      yield put(UserActions.setErrorCode(errorCode));
      yield put(TeamActions.fetchSportsFailure(message ? message : ''));
    }
  } catch (error) {
    yield put(TeamActions.fetchSportsFailure('Error'));
  }
}

export function* fetchTeamFollowing(action) {
  try {
    const {userId} = action;
    yield put(TeamActions.fetchTeamFollowingLoading());
    const response = yield call(teamService.fetchTeamFollowing, userId);
    if (response.success) {
      const data = response.data && data !== null ? response.data : {};
      yield put(TeamActions.fetchTeamFollowingSuccess(data));
    } else {
      const {message, errorCode} = response;
      yield put(UserActions.setErrorCode(errorCode));
      yield put(TeamActions.fetchTeamFollowingFailure(message ? message : ''));
    }
  } catch (error) {
    yield put(TeamActions.fetchTeamFollowingFailure('Error'));
  }
}

export function* fetchTeamMembers(action) {
  try {
    const {teamId, keyword} = action;
    const response = yield call(teamService.fetchTeamMembers, teamId, keyword);
    if (response.success) {
      const data = response.data || [];
      yield put(TeamActions.fetchTeamMembersSuccess(data));
    }
  } catch (error) {}
}

export function* fetchFolder(action) {
  try {
    const {folderId, teamId} = action;
    yield put(TeamActions.fetchFolderLoading());
    const response = yield call(
      teamService.fetchFolderOfTeam,
      folderId,
      teamId,
    );
    if (response.success) {
      const data = response.data || [];
      if (folderId == '') {
        yield put(TeamActions.fetchFolderLoadingSuccess(data));
      } else {
        yield put(TeamActions.fetchFolderDetailLoadingSuccess(data));
      }
    } else {
      const {message, errorCode} = response;
      yield put(UserActions.setErrorCode(errorCode));
      yield put(TeamActions.fetchFolderLoadingFailure(message));
    }
  } catch (error) {
    yield put(TeamActions.fetchFolderLoadingFailure('Error'));
  }
}
