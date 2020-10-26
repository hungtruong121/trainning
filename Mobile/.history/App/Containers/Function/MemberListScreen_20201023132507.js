/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import {
  Image,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import {
  Block,
  Text,
  Header,
  Input,
  BottomSheet,
  ModalNotifcation,
  CheckBox,
} from '../../Components';
import UserActions from '../../Stores/User/Actions';
import Icon from 'react-native-vector-icons/AntDesign';
import Style from './MemberListScreenStyle';
import {Images, Colors} from '../../Theme';
import {Config} from '../../Config';
import TeamActions from '../../Stores/Team/Actions';
import {Constants} from '../../Utils/constants';
import {teamService} from '../../Services/TeamService';
import {userService} from '../../Services/UserService';
import {Screens} from '../../Utils/screens';
import {strings} from '../../Locate/I18n';
const {height} = Dimensions.get('window');

class MemberListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorCode: '',
      isAdmin: false,
      dataMembers: [],
      keyword: null,
      positions: [],
      firstResult: 0,
      maxResult: 100,
      itemSelect: {},
      teamId: null,
      listTeam: [],
      msgNotification: '',
      isOpen: false,
      isOpenChangeRole: false,
      isOpenKickUser: false,
      activeTeam: null,
      isEditing: false,
      isRefreshing: false,
    };
    this.bottomSheet = React.createRef();
    this.bottomSheetActiveTeam = React.createRef();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      errorCode,
      navigation,
      memberList,
      positions,
      listTeam,
      team,
    } = nextProps;
    const {isEditing} = prevState;
    const {teamId} = navigation.state.params;
    
    const data = {
      errorCode,
      teamId,
      positions: positions.length > 0 ? positions[0].split(',') : [],
      listTeam: listTeam ? listTeam : [],
    };
    const adminRole = team.teamMemberRole;
    data.isAdmin = adminRole === Constants.TEAM_ADMIN ? true : false;
    if (!isEditing) {
      data.activeTeam = teamId;
    }
    const userAdmin = memberList.teamAdmin ? memberList.teamAdmin : [];
    const userMember = memberList.teamMember ? memberList.teamMember : [];
    data.dataMembers = [
      {
        title: 'Admin',
        data: userAdmin,
      },
      {
        title: 'Member',
        data: userMember,
      },
    ];

    return data;
  }

  componentDidMount = () => {
    const {teamActions} = this.props;
    const {teamId} = this.state;
    this.fetchMemberList();
    teamActions.fetchPositions(teamId);
  };

  fetchMemberList = (keyword) => {
    const {teamActions} = this.props;
    const {firstResult, maxResult, teamId} = this.state;
    const data = {
      teamId,
      keyword,
      firstResult,
      maxResult,
    };
    teamActions.fetchMemberList(data);
  };

  renderItem = (item) => {
    const {navigation, userId} = this.props;
    return (
      <TouchableHighlight
        onPress={() => {}}
        style={Style.rowFront}
        underlayColor={Colors.gray3}
        disabled>
        <Block row>
          <Block center flex={false} style={{width: 60}}>
            <TouchableOpacity
              onPress={() =>
                userId == item.userId
                  ? navigation.navigate(Screens.PROFILE)
                  : navigation.navigate(Screens.PROFILE_MEMBER, {
                      userId: item.userId,
                    })
              }>
              <Image
                source={{
                  uri: `${Config.GET_IMAGE_URL}${
                    item.userAvatar ? item.userAvatar : null
                  }`,
                }}
                style={Style.userAvatar}
              />
            </TouchableOpacity>
          </Block>
          <Block>
            <Block middle style={{paddingLeft: 10}}>
              <TouchableOpacity
                onPress={() =>
                  userId == item.userId
                    ? navigation.navigate(Screens.PROFILE)
                    : navigation.navigate(Screens.PROFILE_MEMBER, {
                        userId: item.userId,
                      })
                }>
                <Text size={13} bold>
                  {item.userFullName ? item.userFullName : ''}
                </Text>
              </TouchableOpacity>
              <Block flex={false} row style={{marginTop: 10}}>
                <Block flex={false} style={{width: '70%'}}>
                  <Text style={Style.text}>{`Position: ${
                    item.positionSport ? item.positionSport : ''
                  }`}</Text>
                </Block>
                <Block flex={false} style={{width: '30%'}}>
                  <Text style={Style.text}>{`Active Rate: ${
                    item.activeRate ? item.activeRate : 0
                  }%`}</Text>
                </Block>
              </Block>
            </Block>
          </Block>
        </Block>
      </TouchableHighlight>
    );
  };

  handleChangePosition = (itemSelect) => {
    this.setState({
      itemSelect,
    });
    this.bottomSheet.current.open();
  };

  changePosition = () => {
    this.bottomSheet.current.close();
    const {itemSelect, teamId} = this.state;
    const {positionSport, userId} = itemSelect;
    const data = {
      teamId,
      userId,
      positionSport,
    };
    try {
      teamService.changePosition(data).then((response) => {
        if (response.success) {
          this.fetchMemberList();
        } else {
          const {message} = response;
          this.setState({
            msgNotification: message,
            isOpen: true,
          });
        }
      });
      this.resetItemState('itemSelect', {});
    } catch (error) {
      this.setState({
        msgNotification: strings('update_position_failed'),
        isOpen: true,
      });
      this.resetItemState('itemSelect', {});
    }
  };

  handleChangeRole = (itemSelect) => {
    this.setState({
      itemSelect,
      isOpenChangeRole: true,
    });
  };

  changeRole = () => {
    this.setState({
      isOpenChangeRole: false,
    });
    const {itemSelect, teamId, activeTeam} = this.state;
    const {teamActions} = this.props;
    const {userId} = itemSelect;
    const teamMemberRole =
      itemSelect.teamMemberRole === Constants.TEAM_ADMIN
        ? Constants.TEAM_MEMBER
        : Constants.TEAM_ADMIN;
    const data = {
      teamId,
      userId,
      teamMemberRole,
    };
    try {
      teamService.changeRole(data).then((response) => {
        if (response.success) {
          this.fetchMemberList();
          if (this.props.userId == userId) {
            teamActions.fetchTeam(activeTeam, this.state.userId);
          }
        } else {
          const {message} = response;
          this.setState({
            msgNotification: message,
            isOpen: true,
          });
        }
      });
      this.resetItemState('itemSelect', {});
    } catch (error) {
      this.setState({
        msgNotification: strings('update_role_failed'),
        isOpen: true,
      });
      this.resetItemState('itemSelect', {});
    }
  };

  handleKick = (itemSelect) => {
    const {listTeam} = this.state;
    if (listTeam.length > 1) {
      this.setState({
        itemSelect,
      });
      this.bottomSheetActiveTeam.current.open();
    } else {
      this.setState({
        itemSelect,
        isOpenKickUser: true,
      });
    }
  };

  kickUser = () => {
    this.setState({
      isOpenKickUser: false,
    });
    const {userId, navigation, teamActions, userActions} = this.props;
    const {teamId, itemSelect, activeTeam} = this.state;
    const data = {
      teamId,
      userId: itemSelect.userId,
    };
    if (userId == itemSelect.userId) {
      try {
        teamService.requetLeaveTeam(data).then((response) => {
          if (response.success) {
            teamActions.fetchTeamUserJoined(userId);
            if (activeTeam !== teamId) {
              const dataActive = {
                userId,
                teamId: activeTeam,
              };
              try {
                userService.activeTeam(dataActive).then((response) => {
                  if (response.success) {
                    userActions.fetchProfile(userId);
                    teamActions.fetchTeam(activeTeam, userId);
                    teamActions.fetchPublicPost(activeTeam);
                    navigation.navigate(Screens.FUNCTION);
                  }
                });
              } catch (error) {
                console.log(error);
              }
            } else {
              userActions.fetchProfile(userId);
              teamActions.resetActiveTeam();
              navigation.navigate(Screens.FUNCTION);
            }
          } else {
            const {message} = response;
            this.setState({
              msgNotification: message,
              isOpen: true,
            });
          }
        });
        this.resetItemState('itemSelect', {});
      } catch (error) {
        this.setState({
          msgNotification: strings('leave_team_failed'),
          isOpen: true,
        });
        this.resetItemState('itemSelect', {});
      }
    } else {
      try {
        teamService.kichUser(data).then((response) => {
          if (response.success) {
            this.fetchMemberList();
          } else {
            const {message} = response;
            this.setState({
              msgNotification: message,
              isOpen: true,
            });
          }
        });
        this.resetItemState('itemSelect', {});
      } catch (error) {
        this.setState({
          msgNotification: strings('kich_user_failed'),
          isOpen: true,
        });
        this.resetItemState('itemSelect', {});
      }
    }
  };

  resetItemState = (key, value) => {
    this.setState({
      [key]: value,
    });
  };

  closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  renderHiddenItem = (rowData, rowMap) => {
    const {userId} = this.props;
    const item = JSON.parse(JSON.stringify(rowData.item));
    return (
      <Block row>
        <TouchableOpacity
          style={[Style.backRightBtn, Style.backRightBtnLeft]}
          onPress={() => {
            this.closeRow(rowMap, item.userId);
            this.handleChangePosition(item);
          }}>
          <Image source={Images.iconChangePosition} style={Style.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            Style.backRightBtn,
            Style.backRightBtnCenter,
            (item.teamMemberRole === Constants.TEAM_ADMIN &&
              userId == item.userId) ||
            item.teamMemberRole !== Constants.TEAM_ADMIN
              ? {backgroundColor: '#EBEBEB'}
              : {backgroundColor: Colors.gray},
          ]}
          onPress={() => {
            this.closeRow(rowMap, item.userId);
            this.handleChangeRole(item);
          }}
          disabled={
            item.teamMemberRole === Constants.TEAM_ADMIN &&
            userId != item.userId
          }>
          <Image source={Images.iconChangeRole} style={Style.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            Style.backRightBtn,
            Style.backRightBtnRight,
            (item.teamMemberRole === Constants.TEAM_ADMIN &&
              userId == item.userId) ||
            item.teamMemberRole !== Constants.TEAM_ADMIN
              ? {backgroundColor: Colors.primary}
              : {backgroundColor: Colors.gray},
          ]}
          onPress={() => this.handleKick(item)}
          disabled={
            item.teamMemberRole === Constants.TEAM_ADMIN &&
            userId != item.userId
          }>
          <Image source={Images.iconKickUser} style={Style.icon} />
        </TouchableOpacity>
      </Block>
    );
  };

  renderPosition = () => {
    let {positions, itemSelect} = this.state;
    const {positionSport} = itemSelect;
    let html = [];
    if (positions && positions.length > 0) {
      positions.forEach((item) => {
        html.push(
          <TouchableOpacity
            style={{marginVertical: 15}}
            onPress={() => {
              itemSelect.positionSport = item;
              this.setState({
                itemSelect,
              });
            }}
            key={item}>
            <Block flex={false} row>
              <CheckBox
                checked={positionSport === item}
                onSelected={() => {
                  itemSelect.positionSport = item;
                  this.setState({
                    itemSelect,
                  });
                }}
              />
              <Text style={Style.textPosition}>{item}</Text>
            </Block>
          </TouchableOpacity>,
        );
      });
    }
    return (
      <Block style={{padding: 20}}>
        <Block center flex={false} row space="between">
          <TouchableOpacity
            onPress={() => {
              this.resetItemState('itemSelect', {});
              this.bottomSheet.current.close();
            }}>
            <Text size={13.5}>Cancel</Text>
          </TouchableOpacity>
          <Text size={14} bold>
            Change Position
          </Text>
          <TouchableOpacity onPress={() => this.changePosition()}>
            <Text size={13.5}>Done</Text>
          </TouchableOpacity>
        </Block>
        <ScrollView showsVerticalScrollIndicator={false}>{html}</ScrollView>
      </Block>
    );
  };

  handleBeforeKich = () => {
    const {activeTeam, teamId} = this.state;
    if (activeTeam === teamId) {
      this.setState({
        isOpen: true,
        msgNotification: 'You must change Active Team before leave',
      });
    } else {
      this.bottomSheetActiveTeam.current.close();
      this.setState({
        isOpenKickUser: true,
      });
    }
  };

  renderTeamJoin = () => {
    let {listTeam, activeTeam} = this.state;
    let html = [];
    if (listTeam && listTeam.length > 0) {
      listTeam.forEach((item) => {
        const {teamName, teamId} = item;
        html.push(
          <TouchableOpacity
            style={{marginVertical: 15}}
            onPress={() => {
              this.setState({
                isEditing: true,
                activeTeam: teamId,
              });
            }}
            key={teamId}>
            <Block flex={false} row>
              <CheckBox
                checked={teamId && teamId === activeTeam}
                onSelected={() => {
                  this.setState({
                    isEditing: true,
                    activeTeam: teamId,
                  });
                }}
              />
              <Text style={Style.textPosition}>{teamName ? teamName : ''}</Text>
            </Block>
          </TouchableOpacity>,
        );
      });
    }
    return (
      <Block style={{padding: 20}}>
        <Block center flex={false} row space="between">
          <TouchableOpacity
            onPress={() => {
              this.setState({
                isEditing: false,
              });
              this.bottomSheetActiveTeam.current.close();
            }}>
            <Text size={13.5}>Cancel</Text>
          </TouchableOpacity>
          <Text size={14} bold>
            Change Active Team
          </Text>
          <TouchableOpacity onPress={() => this.handleBeforeKich()}>
            <Text size={13.5}>Done</Text>
          </TouchableOpacity>
        </Block>
        <ScrollView showsVerticalScrollIndicator={false}>{html}</ScrollView>
      </Block>
    );
  };

  render() {
    const {navigation, userId, teamActions} = this.props;
    const {
      keyword,
      dataMembers,
      isAdmin,
      isOpen,
      msgNotification,
      isOpenChangeRole,
      isOpenKickUser,
      itemSelect,
      teamId,
    } = this.state;
    return (
      <Block style={Style.view}>
        <Header
          title={strings('member_list')}
          isShowBack
          navigation={navigation}
          rightIcon={
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(Screens.INVITE);
              }}
              style={{paddingVertical: 15}}>
              <Icon name={'plus'} size={15} color={Colors.white} />
            </TouchableOpacity>
          }
        />
        <Input
          style={Style.input}
          placeholder={strings('member_list')}
          placeholderTextColor={Colors.gray}
          onChangeText={(keyword) => {
            this.setState({keyword});
            this.fetchMemberList(keyword);
          }}
          value={keyword}
        />
        <SwipeListView
          useSectionList
          closeOnRowOpen
          closeOnRowPress
          sections={dataMembers}
          disableRightSwipe
          disableLeftSwipe={!isAdmin}
          renderItem={(rowData) => this.renderItem(rowData.item)}
          renderHiddenItem={(rowData, rowMap) =>
            this.renderHiddenItem(rowData, rowMap)
          }
          renderSectionHeader={({section: {title}}) => (
            <Text bold style={Style.title}>
              {title}
            </Text>
          )}
          keyExtractor={(item) => item.userId}
          rightOpenValue={-225}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={() => {
                teamActions.fetchTeam(teamId, userId);
                this.fetchMemberList();
              }}
            />
          }
        />
        <ModalNotifcation
          isOpen={isOpen}
          message={msgNotification}
          onAccept={() => {
            this.setState({
              isOpen: false,
              msgNotification: '',
            });
          }}
        />
        <ModalNotifcation
          isConfirm
          isOpen={isOpenChangeRole}
          message={
            itemSelect.userId == userId
              ? strings('msg_are_you_sure_to_change_your_role')
              : strings('msg_are_you_sure_to_change_the_member_role')
          }
          onAccept={() => this.changeRole()}
          onCancel={() => {
            this.setState({
              isOpenChangeRole: false,
              msgNotification: '',
              itemSelect: {},
            });
          }}
        />
        <ModalNotifcation
          isConfirm
          isOpen={isOpenKickUser}
          message={
            itemSelect.userId == userId
              ? strings('msg_are_you_sure_to_leave_the_team')
              : strings('msg_are_you_sure_to_kick_this_member')
          }
          onAccept={() => this.kickUser()}
          onCancel={() => {
            this.setState({
              isOpenKickUser: false,
              msgNotification: '',
              itemSelect: {},
            });
          }}
        />
        <BottomSheet
          animated={true}
          ref={this.bottomSheet}
          style={{
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: (height * 2) / 3,
          }}
          onClose={() => this.resetItemState('itemSelect', {})}>
          {this.renderPosition()}
        </BottomSheet>
        <BottomSheet
          animated={true}
          ref={this.bottomSheetActiveTeam}
          style={{
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: (height * 2) / 3,
          }}
          onClose={() => this.setState({isEditing: false})}>
          {this.renderTeamJoin()}
        </BottomSheet>
      </Block>
    );
  }
}

MemberListScreen.defaultProps = {};

MemberListScreen.propTypes = {
  userActions: PropTypes.object,
  userId: PropTypes.string,
  memberList: PropTypes.object,
  teamActions: PropTypes.object,
  positions: PropTypes.array,
  listTeam: PropTypes.array,
  team: PropTypes.object,
};

const mapStateToProps = (state) => ({
  errorCode: state.user.errorCode,
  userId: state.user.userId,
  memberList: state.team.memberList,
  positions: state.team.positions,
  listTeam: state.team.listTeam,
  team: state.team.team,
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
  teamActions: bindActionCreators(TeamActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(MemberListScreen);
