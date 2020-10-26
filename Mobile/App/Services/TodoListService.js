import {Api} from './Api';

function searchYourTask(data) {
  return Api.post(`/todolist/your/search`, data, true);
}

function searchTeamTask(data) {
  return Api.post(`/todolist/team/search`, data, true);
}

function fetchDetailTodoList(todoListId) {
  return Api.get(`/todolist/detail?todoListId=${todoListId}`, true);
}

function remind(data) {
  return Api.post(`/todolist/remind`, data, true);
}

function deleteTodoList(data) {
  return Api.post(`/todolist/delete`, data, true);
}

function changeStatus(data) {
  return Api.post(`/todolist/changestatus`, data, true);
}
export const todoListService = {
  searchYourTask,
  searchTeamTask,
  fetchDetailTodoList,
  remind,
  deleteTodoList,
  changeStatus,
};
