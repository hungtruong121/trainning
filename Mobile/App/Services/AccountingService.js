import {Api} from './Api';

function searchAccounting(data) {
  return Api.post(`/accounting/admin/search`, data, true);
}

function fetchAccounting(accountingId) {
  return Api.get(`/accounting/detail?accountingId=${accountingId}`, true);
}

function addEvidencePay(data) {
  return Api.post(`/accounting/add/evidence`, data, true);
}

function remindAllMember(data) {
  return Api.post(`/accounting/remindall`, data, true);
}

function remindOneMember(data) {
  return Api.post(`/accounting/remind`, data, true);
}

function confirmAllMember(data) {
  return Api.post(`/accounting/confirmall`, data, true);
}

function confirmOneMember(data) {
  return Api.post(`/accounting/confirm`, data, true);
}

function deleteAccounting(data) {
  return Api.post(`/accounting/delete`, data, true);
}

function createAccounting(data) {
  return Api.post(`/accounting/update`, data, true);
}

export const accountingService = {
  searchAccounting,
  fetchAccounting,
  addEvidencePay,
  remindAllMember,
  remindOneMember,
  confirmAllMember,
  confirmOneMember,
  deleteAccounting,
  createAccounting,
};
