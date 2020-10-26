import {Api} from './Api';

function login(data, language) {
  return Api.post(`/login?language=${language}`, data, false);
}

function logOut() {
  return Api.get('/logout', true);
}

function signUp(data, language) {
  return Api.post(`/user/create?language=${language}`, data, false);
}

function sendOTP(data, language) {
  return Api.post(`/user/forgotpass?language=${language}`, data, false);
}

function resetPassword(data, language) {
  return Api.post(`/user/changepass/otp?language=${language}`, data, false);
}

function fetchProfile(userId) {
  return Api.get(`/user/info?userId=${userId}`, true);
}

function fetchPersonalTeamInfo(userId) {
  return Api.get(`/user/personal/team/info?userId=${userId}`, true);
}

function activeTeam(data) {
  return Api.post('/user/team/active', data, true);
}

function leaveTeam(data) {
  return Api.post('/user/team/leave', data, true);
}

function saveToken(data) {
  return Api.post('/firebase/token', data, true);
}

function updateProfile(data) {
  return Api.post('/user/update', data, true);
}

function updateAvatar(data) {
  return Api.post('/user/update/avatar', data, true);
}

function fetchPersonalRelatedPost(userId) {
  return Api.get(`/user/personal/related/post?userId=${userId}`, true);
}

function unfollowTeam(data) {
  return Api.post('/user/team/unfollow', data, true);
}

function changePassword(data) {
  return Api.post('/user/changepass', data, true);
}

function fetchNotification(data) {
  return Api.post('/notifications', data, true);
}

function readNotification(data) {
  return Api.post('/notifications/read', data, true);
}

function readsNotification(data) {
  return Api.post('/notifications/reads', data, true);
}

export const userService = {
  login,
  logOut,
  signUp,
  sendOTP,
  resetPassword,
  fetchProfile,
  fetchPersonalTeamInfo,
  saveToken,
  updateProfile,
  updateAvatar,
  activeTeam,
  leaveTeam,
  fetchPersonalRelatedPost,
  unfollowTeam,
  changePassword,
  fetchNotification,
  readNotification,
  readsNotification,
};
