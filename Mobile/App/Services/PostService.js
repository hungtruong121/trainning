import {Api} from './Api';

function createPost(data) {
  return Api.post('/post/update', data, true);
}

function getHashTags(teamId, keyword) {
  return Api.get(`/post/hashtags?teamId=${teamId}&keyword=${keyword}`, true);
}

function getListPosts(userId) {
  return Api.get(`/user/personal/related/post?userId=${userId}`, true);
}

function getTeamPosts(teamId) {
  return Api.get(`/team/postpublic?teamId=${teamId}`, true);
}

function fetchPostDetail(postId) {
  return Api.get(`/post/detail?postId=${postId}`, true);
}

function sendComment(data) {
  return Api.post('/post/comment', data, true);
}

function likeComment(data) {
  return Api.post('/post/like', data, true);
}

function fetchDeletePost(data) {
  return Api.post('/post/delete', data, true);
}

function fetchUpdatePrivacy(data) {
  return Api.post('/post/privacys', data, true);
}

function postPhotoAlbum(data) {
  return Api.post('/postalbum/photo/add', data, true);
}

function updatePhotoAlbum(data) {
  return Api.post('/postalbum/photo/update', data, true);
}

function fetchPostPhotoDetail(postId) {
  return Api.get(`/postalbum/photo/detail?postId=${postId}`, true);
}

function fetchCreateAlbum(data) {
  return Api.post('/postalbum/create', data, true);
}

function fetchListAlbum(teamId) {
  return Api.get(`/postalbum/team/listalbum?teamId=${teamId}`, true);
}

function fetchListPostAlbum(albumId) {
  return Api.get(`/postalbum/post/list?postId=${albumId}`, true);
}

function deletePhoto(data) {
  return Api.post('/postalbum/delete', data, true);
}

function createPostSurvey(data) {
  return Api.post('/survey/update', data, true);
}

function sendSurveyAnswer(data) {
  return Api.post('/survey/answer', data, true);
}

function sendSurveyVote(data) {
  return Api.post('/survey/vote', data, true);
}

function getListSurveyAnswer(postId) {
  return Api.get(`/survey/listanswer?postId=${postId}`, true);
}

function getListSurveyVote(postId) {
  return Api.post(`/survey/listuservoteans`, {postId}, true);
}

export const postService = {
  createPost,
  getHashTags,
  getListPosts,
  getTeamPosts,
  fetchPostDetail,
  sendComment,
  likeComment,
  fetchDeletePost,
  fetchUpdatePrivacy,
  postPhotoAlbum,
  updatePhotoAlbum,
  fetchPostPhotoDetail,
  fetchCreateAlbum,
  fetchListAlbum,
  fetchListPostAlbum,
  deletePhoto,
  createPostSurvey,
  sendSurveyAnswer,
  sendSurveyVote,
  getListSurveyAnswer,
  getListSurveyVote,
};
