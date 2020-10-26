import {Api} from './Api';

function fetchTeamInfo(teamId) {
  return Api.get(`/payment/team/rankinfo?teamId=${teamId}`, true);
}

function fetchTeamRank() {
  return Api.get('/payment/list/teamrank', true);
}

function fetchMemberInfo() {
  return Api.get('/payment/user/rankinfo', true);
}

function fetchMemberRank() {
  return Api.get('/payment/list/userrank', true);
}

export const paymentService = {
  fetchTeamInfo,
  fetchTeamRank,
  fetchMemberInfo,
  fetchMemberRank,
};
