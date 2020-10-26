/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import UserActions from '../../Stores/User/Actions';
import Style from './TodoListDetailScreenStyle';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Screens} from '../../Utils/screens';
import {ApplicationStyles, Colors, Images} from '../../Theme';
import TeamActions from '../../Stores/Team/Actions';
import TodoListActions from '../../Stores/TodoList/Actions';
import {Config} from '../../Config/index';
import ItemChildTask from './ItemChildTask';
import moment from 'moment';
import {todoListService} from '../../Services/TodoListService';
import {
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import {
  Block,
  Text,
  Header,
  Input,
  DateTimePicker,
  CheckBox,
  BottomSheet,
  ModalNotifcation,
  Progress,
  Button,
} from '../../Components';
import { strings } from '../../Locate/I18n';
const {width} = Dimensions.get('window');

const SINGLE_TASK = 'SINGLE_TASK';
const PARENT_TASK = 'PARENT_TASK';
const CHILD_GROUP_TASK = 'CHILD_GROUP_TASK';
class TodoListParentDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorCode: '',
      isOpenDateTime: false,
      dateTimePicker: new Date(),
      listUserMember: [],
      listStatusIncluce: [],
      keyword: '',
      type: null,
      parent: null,
      todoListId: null,
      messageNotification: '',
      isOpen: false,
      loading: false,
      todoListParent: {},
    };
    this.bottomSheetMenu = React.createRef();
    this.bottomSheetPickMember = React.createRef();
  }

  static getDerivedStateFromProps(nextProps) {
    const {errorCode, memberList, navigation} = nextProps;
    const {type, todoListId} = navigation.state.params;
    const data = {errorCode, type, todoListId};
    const userAdmin = memberList.teamAdmin ? memberList.teamAdmin : [];
    const userMember = memberList.teamMember ? memberList.teamMember : [];
    data.listUserMember = userAdmin.concat(userMember);

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
    const {todoList, todoListActions} = this.props;
    const {todoListId} = this.state;
    // this.convertListUserIncluce();
    todoListActions.fetchDetailTodoList(todoListId);
    this.fetchMemberList();
    console.log(todoList);
  };

  showDatePicker = () => {
    this.setDatePickerVisibility(true);
  };

  hideDatePicker = () => {
    this.setDatePickerVisibility(false);
  };

  handleConfirm = (date) => {
    // let {accounting} = this.state;
    // accounting.dateDeadline = date.getTime();
    // this.setState({
    //   accounting,
    // });

    this.hideDatePicker(true);
  };

  setDatePickerVisibility = (isOpenDateTime) => {
    this.setState({
      isOpenDateTime,
    });
  };

  fetchMemberList = (keyword) => {
    const {teamActions, team} = this.props;
    const {firstResult, maxResult} = this.state;
    const data = {
      teamId: team.teamId,
      keyword: keyword,
      firstResult,
      maxResult,
    };
    teamActions.fetchMemberList(data);
  };

  handleCancelPickMember = () => {
    // this.setState({
    //   listUserIncluce: [],
    //   listStatusIncluce: [],
    //   checkedOnly: false,
    //   checkedAll: false,
    // });
    this.bottomSheetPickMember.current.close();
  };

  handleConfirmPickMember = () => {
    // const {listUserIncluce, accounting, allTeam, listUserMember} = this.state;
    // let userFullNameList = [];

    // for (let i = 0; i < listUserIncluce.length; i++) {
    //   const elementPick = listUserIncluce[i];
    //   for (let j = 0; j < listUserMember.length; j++) {
    //     const element = listUserMember[j];
    //     if (element.userId == elementPick) {
    //       userFullNameList.push(listUserMember[j].userFullName);
    //     }
    //   }
    // }

    // accounting.userInclude = allTeam ? allTeam : userFullNameList;
    // this.setState({
    //   accounting,
    // });
    this.bottomSheetPickMember.current.close();
  };

  handleLoading = (loading) => {
    this.setState({
      loading: loading,
    });
  };

  handleRemind = async (todoListId, userId) => {
    const data = {
      todoListId: todoListId,
      userId: userId,
    };
    try {
      todoListService.remind(data).then((response) => {
        console.log(response);
        const {message} = response;
        if (response.success) {
          this.setState({
            messageNotification: message,
            isOpen: true,
          });
        } else {
          this.setState({
            messageNotification: message,
            isOpen: true,
          });
        }
      });
    } catch (error) {
      console.log(error);
      this.setState({
        isOpen: true,
        messageNotification: strings('remind_failed'),
      });
    }
  };

  handleFetchParentTask = async (todoListId) => {
    let {todoListParent} = this.state;
    try {
      todoListService.fetchDetailTodoList(todoListId).then((response) => {
        const {message} = response;
        todoListParent = response.data;
        if (response.success) {
          this.setState({
            todoListParent,
          });
        } else {
          this.setState({
            messageNotification: message,
            isOpen: true,
          });
        }
      });
    } catch (error) {
      console.log(error);
      this.setState({
        isOpen: true,
        messageNotification: strings('fetch_todolist_parent_failed'),
      });
    }
  };

  renderMenuFeature = () => {
    const {navigation} = this.props;
    const {accounting} = this.state;

    return (
      <Block center>
        <TouchableOpacity
          style={Style.menuFeature}
          onPress={() => {
            navigation.navigate(Screens.ACCOUNTING_CREATE_NEW, {
              accountingTeam: accounting,
            });
            this.bottomSheetMenu.current.close();
          }}>
          <Text size={12}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={Style.menuFeature}
          onPress={() => this.handleDeleteAccounting()}>
          <Text size={12} color={Colors.red}>
            Delete
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={Style.menuFeature}
          onPress={() => this.bottomSheetMenu.current.close()}>
          <Text size={12}>Cancel</Text>
        </TouchableOpacity>
      </Block>
    );
  };

  renderListUserProgress = () => {
    const {todoList, userId, navigation} = this.props;
    const {listUserAssigned, generalProgress} = todoList;
    let isDoneTask = false;
    let listHtml = [];
    if (listUserAssigned && listUserAssigned.length > 0) {
      listUserAssigned.forEach((item, index) => {
        let imageUrl = `${Config.GET_IMAGE_URL}${
          item.userAvatar ? item.userAvatar : null
        }`;
        isDoneTask = item.isDoneTask;
        listHtml.push(
          <TouchableOpacity
            key={index}
            onPress={() =>
              userId === item.userId
                ? navigation.navigate(Screens.PROFILE)
                : navigation.navigate(Screens.PROFILE_MEMBER, {
                    userId: item.userId,
                  })
            }>
            <Block
              key={index}
              flex={false}
              row
              center
              style={{
                borderBottomWidth: 0.5,
                borderBottomColor: Colors.gray17,
                height: 60,
              }}>
              <Block row center>
                <Image
                  source={{uri: imageUrl}}
                  style={{
                    height: 50,
                    width: 50,
                    marginRight: 20,
                    borderRadius: 40,
                  }}
                />
                <Text
                  size={12.5}
                  style={{...ApplicationStyles.fontMPLUS1pRegular}}>
                  {item.userFullName}
                </Text>
              </Block>
              {isDoneTask ? (
                <Image
                  source={Images.iconCheckGreen}
                  style={{
                    height: 20,
                    width: 20,
                  }}
                />
              ) : (
                <Button
                  color={Colors.white}
                  style={Style.button}
                  onPress={() =>
                    this.handleRemind(todoList.todoListId, item.userId)
                  }>
                  <Text size={11}>Remind</Text>
                </Button>
              )}
            </Block>
          </TouchableOpacity>,
        );
      });
    }

    return (
      <Block
        color={Colors.white}
        style={{
          marginTop: 15,
          borderRadius: 5,
          padding: 10,
        }}>
        <Block row margin={[0, 0, 5, 0]}>
          <Text size={12.5} style={{...ApplicationStyles.fontMPLUS1pRegular}}>
            General Progress:{' '}
          </Text>
          <Text size={12}>{generalProgress ? generalProgress : 0}%</Text>
        </Block>
        <Progress
          type="bar"
          style={{marginBottom: 5}}
          progress={generalProgress > 0 ? generalProgress / 100 : 0.1 / 100}
        />
        {listHtml}
      </Block>
    );
  };

  renderDialogPickMember = () => {
    const {keyword, checkedOnly, checkedAll, listUserMember} = this.state;

    return (
      <Block flex={false}>
        <Block
          flex={false}
          row
          space={'between'}
          style={{
            backgroundColor: Colors.primary,
            paddingRight: 10,
            paddingLeft: 10,
          }}>
          <TouchableOpacity
            style={{paddingVertical: 10}}
            onPress={() => this.handleCancelPickMember()}>
            <Text color={Colors.white} size={15}>
              Cancel
            </Text>
          </TouchableOpacity>
          <Text
            color={Colors.white}
            size={16}
            style={{...ApplicationStyles.fontMPLUS1pBold, marginTop: 10}}>
            Pick Member
          </Text>
          <TouchableOpacity
            style={{paddingVertical: 10}}
            onPress={() => this.handleConfirmPickMember()}>
            <Text
              color={Colors.white}
              size={13.5}
              style={{...ApplicationStyles.fontMPLUS1pBold}}>
              OK
            </Text>
          </TouchableOpacity>
        </Block>
        <Block column flex={false} margin={[15, 0, 0, 0]}>
          <TouchableOpacity onPress={() => this.handleSelectOnlyMe()}>
            <Block
              row
              flex={false}
              style={Style.sectionHeader}
              space={'between'}>
              <Text size={12.5} style={{...ApplicationStyles.fontMPLUS1pBold}}>
                You
              </Text>
              <CheckBox
                size={19}
                checked={checkedOnly}
                onSelected={() => this.handleSelectOnlyMe()}
              />
            </Block>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.handleSelectAllTeam()}>
            <Block
              row
              flex={false}
              style={Style.sectionHeader}
              space={'between'}>
              <Text size={12.5} style={{...ApplicationStyles.fontMPLUS1pBold}}>
                All team
              </Text>
              <CheckBox
                size={19}
                checked={checkedAll}
                onSelected={() => this.handleSelectAllTeam()}
              />
            </Block>
          </TouchableOpacity>
          <Block
            row
            flex={false}
            style={[Style.sectionHeader, {borderBottomColor: Colors.white}]}
            space={'between'}>
            <Text size={12.5} style={{...ApplicationStyles.fontMPLUS1pBold}}>
              Specific people
            </Text>
          </Block>
          <Block row flex={false} style={Style.viewInputSearch}>
            {!keyword ? (
              <Block flex={false} style={{width: '5%', marginRight: 5}}>
                <AntDesign name={'search1'} size={18} color={Colors.gray17} />
              </Block>
            ) : null}
            <Block flex={false} style={{width: '95%'}}>
              <Input
                style={Style.inputSearch}
                onChangeText={(keyword) => {
                  this.setState({keyword});
                  this.fetchMemberList(keyword);
                }}
                value={keyword}
              />
            </Block>
          </Block>
        </Block>
        <Block flex={false} style={{paddingRight: 10, paddingLeft: 10}}>
          <FlatList
            data={listUserMember}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </Block>
      </Block>
    );
  };

  renderItem = ({item, index}) => {
    const {listStatusIncluce} = this.state;
    let imageUrl = `${Config.GET_IMAGE_URL}${
      item.userAvatar ? item.userAvatar : null
    }`;

    return (
      <TouchableOpacity onPress={() => this.handleSelectMember(item.userId)}>
        <Block
          flex={false}
          row
          center
          style={{
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.gray17,
            height: 60,
          }}>
          <Block row center>
            <Image
              source={{uri: imageUrl}}
              style={{
                height: 50,
                width: 50,
                marginRight: 30,
                borderRadius: 40,
              }}
            />
            <Text size={12.5} style={{...ApplicationStyles.fontMPLUS1pRegular}}>
              {item.userFullName}
            </Text>
          </Block>
          <CheckBox
            checked={listStatusIncluce[index]}
            onSelected={() => this.handleSelectMember(item.userId)}
            size={19}
          />
        </Block>
      </TouchableOpacity>
    );
  };

  renderChildTaskAndSingleTask = () => {
    let assignType = null;
    let listUserFullName = [];
    const {todoList} = this.props;
    const {privacyId, listUserAssigned, todoListNotice} = todoList;
    if (listUserAssigned && listUserAssigned.length > 0) {
      listUserAssigned.map((user) => {
        listUserFullName.push(user.userFullName);
      });
    }

    if (privacyId === 2) {
      assignType = strings(all_team);
    } else if (privacyId === 3) {
      if (listUserFullName && listUserFullName.length === 1) {
        assignType = listUserFullName[0];
      } else if (listUserFullName && listUserFullName.length > 1) {
        assignType =
          listUserFullName[0] +
          ' and ' +
          (listUserFullName.length - 1) +
          ' more';
      }
    } else {
      assignType = strings('only_me');
    }
    return (
      <Block>
        <Text
          size={13.5}
          style={{...ApplicationStyles.fontMPLUS1pBold, marginTop: 15}}>
          Assign
        </Text>
        <Text
          size={12.5}
          color={Colors.white}
          style={[
            Style.textSelect,
            {textAlignVertical: 'center', paddingLeft: 10, borderRadius: 5},
          ]}>
          {assignType}
        </Text>

        {this.renderListUserProgress()}
        <Text
          size={13.5}
          style={{...ApplicationStyles.fontMPLUS1pBold, marginTop: 15}}>
          Notice
        </Text>
        <Text style={[Style.textArea, {marginTop: 10, borderRadius: 5}]}>
          {todoListNotice}
        </Text>
      </Block>
    );
  };

  renderParentTask = () => {
    const {todoListParent} = this.state;
    const {generalProgress, todoListChild} = todoListParent;
    let listHtml = [];
    let assignType = null;
    let listUserFullName = [];
    if (todoListChild && todoListChild.length > 0) {
      todoListChild.forEach((item) => {
        if (item.listUserAssigned && item.listUserAssigned.length > 0) {
          item.listUserAssigned.map((user) => {
            listUserFullName.push(user.userFullName);
          });
        }
        if (item.privacyId === 2) {
          assignType = strings('all_team');
        } else if (item.privacyId === 3) {
          if (listUserFullName && listUserFullName.length === 1) {
            assignType = listUserFullName[0];
          } else if (listUserFullName && listUserFullName.length > 1) {
            assignType =
              listUserFullName[0] +
              ' and ' +
              (listUserFullName.length - 1) +
              ' more';
          }
        } else {
          assignType = strings('only_me');
        }
        listHtml.push(
          <ItemChildTask
            title={item.todoListTitle}
            assigned={assignType}
            deadline={moment(item.dateDeadline).format('DD/MM/YYYY')}
            progress={item.generalProgress}
          />,
        );
      });
    }
    return (
      <Block column>
        <Block row margin={[15, 0, 5, 0]}>
          <Text size={12.5} style={{...ApplicationStyles.fontMPLUS1pBold}}>
            General Progress:{' '}
          </Text>
          <Text size={12}>{generalProgress}%</Text>
        </Block>
        <Progress
          type="bar"
          style={{marginBottom: 5, marginTop: 10}}
          progress={generalProgress > 0 ? generalProgress / 100 : 0.1 / 100}
        />
        <Text
          size={13.5}
          style={{...ApplicationStyles.fontMPLUS1pBold, marginTop: 10}}>
          Child tasks
        </Text>
        {listHtml}
      </Block>
    );
  };

  render() {
    const {navigation, todoList} = this.props;
    const {todoListTitle, createdby, dateDeadline, parentTask} = todoList;
    const {
      dateTimePicker,
      isOpenDateTime,
      type,
      parent,
      isOpen,
      messageNotification,
      todoListParent,
    } = this.state;
    let imageUrl = null;
    if (parent === PARENT_TASK) {
      imageUrl = `${Config.GET_IMAGE_URL}${
        todoListParent.createdby ? todoListParent.createdby.userAvatar : null
      }`;
    } else {
      imageUrl = `${Config.GET_IMAGE_URL}${
        createdby ? createdby.userAvatar : null
      }`;
    }

    console.log();
    return (
      <Block style={Style.view}>
        <Header
          isShowBack
          rightIcon={
            <TouchableOpacity
              onPress={() => this.bottomSheetMenu.current.open()}>
              <Image
                source={Images.iconFeatureWhite}
                style={{
                  resizeMode: 'center',
                  height: 10,
                  width: 20,
                }}
              />
            </TouchableOpacity>
          }
          title={'Detail'}
          navigation={navigation}
        />
        <ScrollView
          style={[Style.view, {...ApplicationStyles.paddingHorizontalView}]}
          showsVerticalScrollIndicator={false}>
          <Block column margin={[10, 0, 20, 0]}>
            <Text size={13.5} style={{...ApplicationStyles.fontMPLUS1pBold}}>
              Title
            </Text>
            <TouchableOpacity
              onPress={() =>
                this.setState({
                  parent: CHILD_GROUP_TASK,
                })
              }>
              <Input
                editable={false}
                style={[
                  Style.inputStyle,
                  {color: parent === PARENT_TASK ? Colors.blue : Colors.black},
                ]}
                value={
                  parent === PARENT_TASK
                    ? parentTask && parentTask.todoListTitle
                    : todoListTitle
                }
              />
            </TouchableOpacity>
            {type === CHILD_GROUP_TASK ? (
              <Block>
                {parent === PARENT_TASK ? null : (
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        parent: PARENT_TASK,
                      });
                      this.handleFetchParentTask(parentTask.todoListId);
                    }}>
                    <Text
                      size={13.5}
                      style={{
                        ...ApplicationStyles.fontMPLUS1pBold,
                        marginTop: 15,
                      }}>
                      Parent task
                    </Text>

                    <Input
                      style={[Style.inputStyle, {color: Colors.blue}]}
                      editable={false}
                      value={parentTask && parentTask.todoListTitle}
                    />
                  </TouchableOpacity>
                )}
              </Block>
            ) : null}
            <Text
              size={13.5}
              style={{...ApplicationStyles.fontMPLUS1pBold, marginTop: 15}}>
              Creator
            </Text>
            <Block
              margin={[10, 0, 0, 0]}
              flex={false}
              row
              style={{alignItems: 'center'}}>
              <Image
                source={{uri: imageUrl}}
                style={{height: 60, width: 60, borderRadius: 45}}
              />
              <Text
                size={13.5}
                style={{...ApplicationStyles.fontMPLUS1pBold, marginLeft: 15}}>
                {createdby && createdby.userFullName}
              </Text>
            </Block>
            <Text
              size={13.5}
              style={{...ApplicationStyles.fontMPLUS1pBold, marginTop: 15}}>
              Deadline
            </Text>
            <Text
              size={12.5}
              color={Colors.white}
              style={[
                Style.textSelect,
                {
                  width: width / 2.8,
                  textAlignVertical: 'center',
                  paddingLeft: 10,
                  borderRadius: 5,
                },
              ]}>
              {parent === PARENT_TASK
                ? moment(todoListParent.dateDeadline).format('DD/MM/YYYY h:mm')
                : moment(dateDeadline).format('DD/MM/YYYY h:mm')}
            </Text>
            {parent === PARENT_TASK
              ? this.renderParentTask()
              : this.renderChildTaskAndSingleTask()}
          </Block>
        </ScrollView>
        <DateTimePicker
          isOpen={isOpenDateTime}
          mode="datetime"
          onConfirm={this.handleConfirm}
          onCancel={this.hideDatePicker}
          date={dateTimePicker}
        />
        {/* pick memeber */}
        <BottomSheet
          animated={true}
          ref={this.bottomSheetPickMember}
          style={Style.bottomSheet}>
          {this.renderDialogPickMember()}
        </BottomSheet>
        <BottomSheet
          animated={true}
          style={Style.bottomSheetFeature}
          ref={this.bottomSheetMenu}>
          {this.renderMenuFeature()}
        </BottomSheet>
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

TodoListParentDetailScreen.defaultProps = {};

TodoListParentDetailScreen.propTypes = {
  errorCode: PropTypes.string,
  userActions: PropTypes.object,
  teamActions: PropTypes.object,
  profile: PropTypes.object,
  userId: PropTypes.string,
  memberList: PropTypes.array,
};

const mapStateToProps = (state) => ({
  errorCode: state.user.errorCode,
  userId: state.user.userId,
  listRequestJoins: state.team.listRequestJoins,
  team: state.team.team,
  profile: state.user.profile,
  memberList: state.team.memberList,
  todoList: state.todoList.todoList,
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
  teamActions: bindActionCreators(TeamActions, dispatch),
  todoListActions: bindActionCreators(TodoListActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TodoListParentDetailScreen);
