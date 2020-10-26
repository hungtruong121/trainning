import {Api} from './Api';
function fetchTeam(teamId, userId) {
  return Api.get(`/team/getInfo?teamId=${teamId}&userId=${userId}`, true);
}
function fetchPostPublic(teamId) {
  return Api.get(`/team/postpublic?teamId=${teamId}`, true);
}
function requestJoinTeam(data) {
  return Api.post('/user/requestjointeam', data, true);
}
function requestFollowTeam(data) {
  return Api.post('/user/followteams', data, true);
}
function requestUpdate(data) {
  return Api.post('/user/team/update', data, true);
}
function requestUploadImage(data) {
  return Api.post('file/uploads', data, true);
}
function requetLeaveTeam(data) {
  return Api.post('/user/team/leave', data, true);
}
function fetchListRequestJoin(teamId) {
  return Api.get(`/team/users/listrequestjointeam?teamId=${teamId}`, true);
}
function approvalJoinTeam(data) {
  return Api.post('/team/users/approachjointeam', data, true);
}
function rejectJoinTeam(data) {
  return Api.post('/team/users/rejectjointeam', data, true);
}

function fetchMemberList(data) {
  return Api.post('/team/users', data, true);
}

function fetchPositions(teamId) {
  return Api.get(`/team/users/positions?teamId=${teamId}`, true);
}

function changePosition(data) {
  return Api.post('/team/users/changepositions', data, true);
}

function changeRole(data) {
  return Api.post('/team/users/role/change', data, true);
}

function kichUser(data) {
  return Api.post('/team/users/kick', data, true);
}
function sendMailInvite(data) {
  return Api.post('/team/user/sendemailinvite', data, true);
}
function requestUnfollowTeam(data) {
  return Api.post('/user/team/unfollow', data, true);
}
function updateAvatar(data) {
  return Api.post('/team/updateavatar', data, true);
}

function fetchTeamUserJoined(userId) {
  return Api.get(`/user/teams?userId=${userId}`, true);
}

function fetchSports() {
  return Api.get('/sport/sports', true);
}

function fetchTeamFollowing(userId) {
  return Api.get(`/user/teams/follow?userId=${userId}`, true);
}

function fetchTeamMembers(teamId, keyword) {
  return Api.get(`/team/user/search?teamId=${teamId}&keyword=${keyword}`, true);
}

function fetchFolderOfTeam(folderId, teamId) {
  return Api.get(`/folder/getall?folderId=${folderId}&teamId=${teamId}`, true);
}

function createNewFolder(data) {
  return Api.post('/folder/add', data, true);
}

function updateFolderName(data) {
  return Api.post('/folder/rename', data, true);
}

function deleteFolder(folderId) {
  return Api.get(`/folder/remove?folderId=${folderId}`, true);
}

function autoDeleteFolder(folderId, date, timeZone) {
  return Api.post(
    `/folder/timedelete?folderId=${folderId}&date=${date}&timeZone=${timeZone}`,
    true,
  );
}

function searchFolder(data) {
  return Api.post('/folder/search', data, true);
}

function updateFileName(data) {
  return Api.post('/file/rename', data, true);
}

function deleteFile(fileId) {
  return Api.get(`/file/remove?fileId=${fileId}`, true);
}

function autoDeleteFile(fileId, date, timeZone) {
  return Api.post(
    `/file/timedelete?fileId=${fileId}&date=${date}&timeZone=${timeZone}`,
    true,
  );
}

function addFile(data) {
  return Api.post('/file/add', data, true);
}

export const teamService = {
  fetchTeam,
  fetchPostPublic,
  requestJoinTeam,
  requestFollowTeam,
  requestUnfollowTeam,
  requestUpdate,
  requestUploadImage,
  requetLeaveTeam,
  fetchListRequestJoin,
  approvalJoinTeam,
  rejectJoinTeam,
  sendMailInvite,
  fetchMemberList,
  fetchPositions,
  changePosition,
  changeRole,
  kichUser,
  updateAvatar,
  fetchTeamUserJoined,
  fetchSports,
  fetchTeamFollowing,
  fetchTeamMembers,
  fetchFolderOfTeam,
  updateFolderName,
  deleteFolder,
  createNewFolder,
  autoDeleteFolder,
  searchFolder,
  updateFileName,
  deleteFile,
  autoDeleteFile,
  addFile,
};
