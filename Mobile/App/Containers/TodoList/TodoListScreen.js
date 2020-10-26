/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import UserActions from '../../Stores/User/Actions';
import Style from './TodoListScreenStyle';
import {Screens} from '../../Utils/screens';
import {ApplicationStyles, Colors} from '../../Theme';
import TeamActions from '../../Stores/Team/Actions';
import {TouchableOpacity, ScrollView} from 'react-native';
import moment from 'moment';
import { strings } from '../../Locate/I18n';
import {
  Block,
  Text,
  Header,
  Badge,
  Loading,
  ModalNotifcation,
} from '../../Components';
import ItemTask from './ItemTask';
import {Constants} from '../../Utils/constants';
import {todoListService} from '../../Services/TodoListService';

const tabs = ['Your tasks', `Team's tasks`];
const SINGLE_TASK = 'SINGLE';
const GROUP_TASK = 'GROUP';
const CHILD_GROUP_TASK = 'CHILD_GROUP_TASK';
class TodoListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorCode: '',
      active: strings('your_tasks'),
      isChangeTab: false,
      checked: false,
      loading: false,
      listYourTask: [],
      numberYourTaskNotDone: null,
      numberTeamTaskNotDone: null,
      listTeamTask: [],
      messageNotification: '',
      listStatus: [],
      isOpen: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {errorCode} = nextProps;
    const data = {errorCode};
    const {isChangeTab} = prevState;

    if (!isChangeTab) {
      data.active = tabs[0];
    }

    return data;
  }

  componentDidMount = async () => {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      // The screen is focused
      // Call any action
      this.fetchData();
    });
  };

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener && this.focusListener.remove();
  }

  fetchData = () => {
    // const {isChangeTab} = this.state;
    this.handleSearchYourTask();
    this.handleSeachTeamTask();
  };

  onSelected = (todoListId) => {
    let {listStatus, listYourTask} = this.state;
    console.log(listYourTask);
    for (let index = 0; index < listYourTask.length; index++) {
      const element = listYourTask[index];
      const elementStatus = listStatus[index];
      if (element.todoListId === todoListId) {
        listStatus[index] = elementStatus ? false : true;
        if (listStatus[index]) {
          this.handleChangeStatus(element.todoListId);
        } else {
          this.handleChangeStatus(element.todoListId);
        }
      }
      console.log(listStatus[index]);
    }
    this.setState({
      listStatus,
    });
  };

  handleLoading = (loading) => {
    this.setState({
      loading: loading,
    });
  };

  handleChangeStatus = async (todoListId) => {
    const data = {
      todoListId: todoListId,
    };
    try {
      todoListService.changeStatus(data).then((response) => {
        console.log(response);
        if (response.success) {
          this.handleSearchYourTask();
        } else {
          const {message} = response;
          this.setState({
            messageNotification: message,
            isOpen: true,
          });
        }
      });
    } catch (error) {
      this.setState({
        isOpen: true,
        messageNotification: strings('msg_change_status_failed'),
      });
    }
  };

  handleSearchYourTask = async () => {
    const {team} = this.props;
    let {listYourTask, numberYourTaskNotDone} = this.state;
    const data = {
      teamId: 24,
      keyword: '',
      firstResult: 0,
      maxResult: 10,
    };
    try {
      this.handleLoading(true);
      todoListService.searchYourTask(data).then((response) => {
        if (response.success) {
          this.handleLoading(false);
          listYourTask = response.data.listTasks;
          numberYourTaskNotDone = response.data.totalNotDone;
          this.setState({
            listYourTask,
            numberYourTaskNotDone,
          });
        } else {
          const {message} = response;
          this.setState({
            messageNotification: message,
            isOpen: true,
          });
        }
      });
    } catch (error) {
      this.setState({
        isOpen: true,
        messageNotification: strings('search_failed'),
      });
    }
  };

  handleSeachTeamTask = async () => {
    const {team} = this.props;
    let {listTeamTask, numberTeamTaskNotDone} = this.state;
    const data = {
      teamId: 24,
      keyword: '',
      firstResult: 0,
      maxResult: 10,
    };
    try {
      this.handleLoading(true);
      todoListService.searchTeamTask(data).then((response) => {
        if (response.success) {
          this.handleLoading(false);
          listTeamTask = response.data.listTasks;
          numberTeamTaskNotDone = response.data.totalNotDone;
          this.setState({
            listTeamTask,
            numberTeamTaskNotDone,
          });
        } else {
          const {message} = response;
          this.setState({
            messageNotification: message,
            isOpen: true,
          });
        }
      });
    } catch (error) {
      this.setState({
        isOpen: true,
        messageNotification: strings('search_failed'),
      });
    }
  };

  renderYouTask = () => {
    const {listYourTask, listStatus} = this.state;
    const {navigation} = this.props;
    let listHtml = [];
    let userAssign = null;
    if (listYourTask && listYourTask.length > 0) {
      let listUserFullName = [];
      let parentTask = null;
      listYourTask.forEach((item, index) => {
        if (item.listUserAssigned && item.listUserAssigned.length > 0) {
          item.listUserAssigned.map((user) => {
            listUserFullName.push(user.userFullName);
          });
        }
        if (listUserFullName && listUserFullName.length === 1) {
          userAssign = listUserFullName[0];
        } else if (listUserFullName && listUserFullName.length > 1) {
          userAssign =
            listUserFullName[0] +
            ' and ' +
            (listUserFullName.length - 1) +
            ' more';
        }
        if (item.parentTask && item.parentTask !== null) {
          parentTask = item.parentTask.todoListTitle;
        }
        listHtml.push(
          <Block key={index}>
            <ItemTask
              title={item.todoListTitle}
              assigned={userAssign}
              parentTask={parentTask}
              deadline={moment(item.dateDeadline).format('DD/MM/YYYY')}
              progress={item.generalProgress}
              checked={listStatus[index]}
              onSelected={() => this.onSelected(item.todoListId)}
              onPress={() =>
                navigation.navigate(Screens.TODO_LIST_DETAIL, {
                  type:
                    item.todoListType === SINGLE_TASK
                      ? SINGLE_TASK
                      : CHILD_GROUP_TASK,
                  todoListId: item.todoListId,
                })
              }
            />
          </Block>,
        );
      });
    }
    return <Block>{listHtml}</Block>;
  };

  renderTeamTask = () => {
    const {checked, listTeamTask} = this.state;
    const {navigation} = this.props;
    let listHtml = [];
    let userAssign = null;
    if (listTeamTask && listTeamTask.length > 0) {
      let listUserFullName = [];
      let typeTask = null;
      listTeamTask.forEach((item, index) => {
        if (item.listUserAssigned && item.listUserAssigned.length > 0) {
          item.listUserAssigned.map((user) => {
            listUserFullName.push(user.userFullName);
          });
        }
        if (listUserFullName && listUserFullName.length === 1) {
          userAssign = listUserFullName[0];
        } else if (listUserFullName && listUserFullName.length > 1) {
          userAssign =
            listUserFullName[0] +
            ' and ' +
            (listUserFullName.length - 1) +
            ' more';
        } else if (item.privacyId === 2) {
          userAssign = strings('all_team');
        }
        item.todoListType && item.todoListType === SINGLE_TASK
          ? (typeTask = 'Single task')
          : (typeTask = 'Group task');
        listHtml.push(
          <Block key={index}>
            <ItemTask
              title={item.todoListTitle}
              type={typeTask}
              assigned={userAssign}
              deadline={moment(item.dateDeadline).format('DD/MM/YYYY')}
              progress={item.generalProgress}
              onPress={() =>
                navigation.navigate(Screens.TODO_LIST_DETAIL, {
                  type:
                    item.todoListType === SINGLE_TASK
                      ? SINGLE_TASK
                      : CHILD_GROUP_TASK,
                  todoListId: item.todoListId,
                })
              }
            />
          </Block>,
        );
      });
    }
    return <Block>{listHtml}</Block>;
  };

  handleChangeTab = (isChangeTab) => {
    this.setState({
      isChangeTab: isChangeTab,
    });
  };

  handleTab = (tab) => {
    this.handleChangeTab(true);
    this.setState({
      active: tab,
    });
    tab === 'Your tasks'
      ? this.handleSearchYourTask()
      : this.handleSeachTeamTask();
  };

  renderTab = (tab, key) => {
    const {active, numberTeamTaskNotDone, numberYourTaskNotDone} = this.state;
    const isActive = active === tab;
    return (
      <TouchableOpacity
        key={key}
        onPress={() => this.handleTab(tab)}
        style={[Style.tab, isActive ? Style.active : null]}>
        <Block center flex={false} row>
          <Text
            color={isActive ? '#4F4F4F' : Colors.gray6}
            size={isActive ? 16 : 13.5}
            medium
            style={{...ApplicationStyles.fontMPLUS1pBold}}>
            {tab}
          </Text>
          <Badge
            size={19}
            color={isActive ? Colors.primary : Colors.gray6}
            style={{marginLeft: 5}}>
            <Text
              size={isActive ? 13.5 : 12.5}
              color={Colors.white}
              style={{...ApplicationStyles.fontMPLUS1pRegular}}>
              {tab === 'Your tasks'
                ? numberYourTaskNotDone
                : numberTeamTaskNotDone}
            </Text>
          </Badge>
        </Block>
      </TouchableOpacity>
    );
  };

  render() {
    const {navigation} = this.props;
    const {active, loading, isOpen, messageNotification} = this.state;
    return (
      <Block style={Style.view}>
        <Header
          isShowBack
          rightIcon={
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(Screens.ACCOUNTING_CREATE_NEW, {
                  accountingTeam: null,
                })
              }
              style={{padding: 10}}>
              <Text color={Colors.white}>New</Text>
            </TouchableOpacity>
          }
          title={'Todo-List'}
          navigation={navigation}
        />
        <Block flex={false}>
          <ScrollView horizontal style={Style.tabs}>
            {tabs.map((tab, index) => this.renderTab(tab, index))}
          </ScrollView>
        </Block>
        <ScrollView
          style={[Style.view, {...ApplicationStyles.paddingHorizontalView}]}
          showsVerticalScrollIndicator={false}>
          {loading ? (
            <Loading size={25} color={Colors.primary} />
          ) : (
            <Block style={Style.container}>
              {active === 'Your tasks'
                ? this.renderYouTask()
                : this.renderTeamTask()}
            </Block>
          )}
        </ScrollView>
        {/* message notification call API */}
        <ModalNotifcation
          isOpen={isOpen}
          message={messageNotification}
          onAccept={() => {
            this.setState({
              isOpen: false,
              messageNotification: '',
            });
          }}
        />
      </Block>
    );
  }
}

TodoListScreen.defaultProps = {};

TodoListScreen.propTypes = {
  errorCode: PropTypes.string,
  userActions: PropTypes.object,
  teamActions: PropTypes.object,
  profile: PropTypes.object,
  userId: PropTypes.string,
};

const mapStateToProps = (state) => ({
  errorCode: state.user.errorCode,
  userId: state.user.userId,
  listRequestJoins: state.team.listRequestJoins,
  team: state.team.team,
  profile: state.user.profile,
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
  teamActions: bindActionCreators(TeamActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(TodoListScreen);
