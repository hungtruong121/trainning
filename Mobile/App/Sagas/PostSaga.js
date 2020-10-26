import {put, call, select} from 'redux-saga/effects';
import {postService} from '../Services/PostService';
import TeamActions from '../Stores/Team/Actions';
import PostActions from '../Stores/Post/Actions';

export function* fetchPostDetail({postId}) {
  try {
    const response = yield call(postService.fetchPostDetail, postId);
    if (response.success) {
      yield put(PostActions.fetchPostDetailSuccess(response.data));
    }
  } catch (error) {}
}

export function* fetchPostPhotoDetail({postId}) {
  try {
    const response = yield call(postService.fetchPostPhotoDetail, postId);
    if (response.success) {
      yield put(PostActions.fetchPostDetailSuccess(response.data));
    }
  } catch (error) {}
}

export function* fetchLikeComment({data}) {
  try {
    const response = yield call(postService.likeComment, data);
    if (response.success) {
      yield call(fetchPostPhotoDetail, {postId: data.postId});
    }
  } catch (error) {}
}

export function* fetchSendComment({data}) {
  try {
    const response = yield call(postService.sendComment, data);
    if (response.success) {
      yield call(fetchPostDetail, {postId: data.postId});
      yield call(fetchPostPhotoDetail, {postId: data.postId});
    }
  } catch (error) {}
}

export function* fetchDeletePost({data}) {
  try {
    const response = yield call(postService.fetchDeletePost, data);
    if (response.success) {
      yield put(TeamActions.fetchPublicPost(data.teamId, false));
    }
  } catch (error) {}
}

export function* fetchSendAnswerSurvey({data}) {
  try {
    const {activeTeam} = yield select(state => state.user.profile);

    const response = yield call(postService.sendSurveyAnswer, data);
    if (response.success) {
      yield put(TeamActions.fetchPublicPost(activeTeam, false));
    }
  } catch (error) {}
}

export function* fetchVoteSelection({data}) {
  try {
    const {activeTeam} = yield select(state => state.user.profile);

    const response = yield call(postService.sendSurveyVote, data);
    if (response.success) {
      yield put(TeamActions.fetchPublicPost(activeTeam, false));
    }
  } catch (error) {}
}
