import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {TouchableOpacity, Image, TouchableHighlight} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import {Header, Block, Text, ModalNotifcation} from '../../Components';
import UserActions from '../../Stores/User/Actions';
import TeamActions from '../../Stores/Team/Actions';
import Style from './SwitchTeamScreenStyle';
import Icon from 'react-native-vector-icons/AntDesign';
import EIcon from 'react-native-vector-icons/Entypo';
import {Colors, ApplicationStyles, Images} from '../../Theme';
import {Screens} from '../../Utils/screens';
import {Config} from '../../Config';
import {userService} from '../../Services/UserService';
import {strings} from '../../Locate/I18n';

class SwitchTeamScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorCode: '',
      listTeam: [],
      activeTeam: null,
      itemSelect: {},
      msgNotification: '',
      isOpen: false,
      isOpenLeaveTeam: false,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    const {listTeam, activeTeam} = nextProps;
    const data = {listTeam, activeTeam};
    return data;
  }

  componentDidMount = () => {
    const {teamActions, userId} = this.props;
    teamActions.fetchTeamUserJoined(userId);
  };

  handleSwitchTeam = (userId, teamId) => {
    const {userActions, teamActions} = this.props;
    const data = {
      userId,
      teamId,
    };

    try {
      userService.activeTeam(data).then((response) => {
        if (response.success) {
          userActions.fetchProfile(userId);
          teamActions.fetchTeam(teamId, userId);
        } else {
          console.log('Switch Team Unsuccessfully');
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  handleLeaveTeam = (item) => {
    this.setState({
      itemSelect: item,
      isOpenLeaveTeam: true,
    });
  };

  redirectTeam = (teamId) => {
    const {navigation} = this.props;
    navigation.navigate(Screens.TEAM_PROFILE_DETAIL, {activeTeam: teamId});
  };

  leaveTeam = () => {
    this.setState({isOpenLeaveTeam: false});
    const {teamActions, userActions, userId} = this.props;
    const {itemSelect} = this.state;
    const data = {
      userId,
      teamId: itemSelect.teamId,
    };
    try {
      userService.leaveTeam(data).then((response) => {
        if (response.success) {
          userActions.fetchProfile(userId);
          teamActions.fetchTeamUserJoined(userId);
          this.resetItemSelect();
        } else {
          const {message, errorCode} = response;
          this.setState({
            msgNotification: message,
            isOpen: true,
            errorCode: errorCode,
          });
        }
      });
    } catch (error) {
      this.setState({
        msgNotification: strings('msg_leave_team_unsuccessfully'),
        isOpen: true,
      });
      this.resetItemSelect();
    }
  };

  resetItemSelect = () => {
    this.setState({
      itemSelect: {},
    });
  };

  renderItem = (item) => {
    const {navigation, userId} = this.props;
    const {activeTeam} = this.state;
    const {plusTeam, teamId, teamAvatar, teamName, totalMember} = item;
    const imageUrl = `${Config.GET_IMAGE_URL}${teamAvatar ? teamAvatar : ''}`;

    if (plusTeam) {
      return (
        <Block row center style={Style.itemContainer}>
          <Block flex={false} center middle style={Style.avatarTeamContainer}>
            <TouchableOpacity
              style={Style.buttonAddTeamStyle}
              onPress={() => navigation.navigate(Screens.CREATE_TEAM)}>
              <EIcon name="plus" size={24} color={Colors.white} />
            </TouchableOpacity>
          </Block>
          <Text
            style={{
              marginLeft: 5,
              fontSize: 15,
              ...ApplicationStyles.fontMPLUS1pMedium,
            }}>
            {' Add team '}
          </Text>
        </Block>
      );
    }
    return (
      <TouchableHighlight
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
        }}
        disabled={teamId && teamId === activeTeam ? true : false}
        onPress={() => this.handleSwitchTeam(userId, teamId)}>
        <Block block style={Style.itemContainer}>
          <Block
            block
            row
            center
            style={{
              backgroundColor: Colors.white,
              ...ApplicationStyles.paddingHorizontalView,
            }}>
            <Block block row>
              <TouchableOpacity onPress={() => this.redirectTeam(teamId)}>
                <Image
                  source={{
                    uri: imageUrl,
                  }}
                  style={Style.avatarTeamContainer}
                />
              </TouchableOpacity>
              <Block flex={false} column middle style={Style.teamInfoContainer}>
                <TouchableOpacity onPress={() => this.redirectTeam(teamId)}>
                  <Text
                    black
                    style={{
                      fontSize: 15,
                      ...ApplicationStyles.fontMPLUS1pBold,
                    }}>
                    {teamName ? teamName : ''}
                  </Text>
                </TouchableOpacity>
                <Text
                  gray
                  style={{
                    fontSize: 13.5,
                    ...ApplicationStyles.fontMPLUS1pMedium,
                  }}>
                  {totalMember ? totalMember : ''} Members
                </Text>
              </Block>
            </Block>
            <Block flex={false} middle center style={Style.activeContainer}>
              {teamId && teamId === activeTeam && (
                <Text
                  gray
                  style={{
                    fontSize: 13.5,
                    ...ApplicationStyles.fontMPLUS1pBold,
                    alignSelf: 'flex-end',
                  }}>
                  {' Active '}
                </Text>
              )}
            </Block>
          </Block>
          <Block flex={false} style={Style.separatorBar} />
        </Block>
      </TouchableHighlight>
    );
  };

  closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  renderHiddenItem = (item, rowMap) => {
    const {plusTeam, teamId} = item;
    if (plusTeam) {
    } else {
      return (
        <Block style={Style.hiddenItemContainer}>
          <TouchableOpacity
            style={Style.buttonLeaveTeamStyle}
            onPress={() => {
              teamId && this.closeRow(rowMap, teamId);
              this.handleLeaveTeam(item);
            }}>
            <Image
              source={Images.iconLeaveTeam}
              style={{width: 26, height: 20}}
            />
          </TouchableOpacity>
        </Block>
      );
    }
  };

  render() {
    const {navigation} = this.props;
    const {
      listTeam,
      isOpenLeaveTeam,
      itemSelect,
      activeTeam,
      isOpen,
      msgNotification,
      errorCode,
    } = this.state;

    return (
      <Block>
        <Header
          title={strings('switch_team')}
          leftIcon={
            <TouchableOpacity
              onPress={() => navigation.navigate(Screens.SCAN_QR_CODE)}>
              <Image
                source={Images.iconScanQRCode}
                style={Style.iconScanQRCodeContainer}
              />
            </TouchableOpacity>
          }
          rightIcon={
            <TouchableOpacity
              style={{paddingVertical: 15}}
              onPress={() => navigation.goBack()}>
              <Icon name="right" size={15} color={Colors.white} />
            </TouchableOpacity>
          }
        />
        <Block flex={false} center middle style={Style.view}>
          <Text
            style={{
              fontSize: 13.5,
              ...ApplicationStyles.fontMPLUS1pRegular,
              color: Colors.black,
            }}>
            Tap to change team and swift left to see action
          </Text>
        </Block>

        <SwipeListView
          useFlatList
          closeOnRowOpen
          closeOnRowPress
          disableRightSwipe
          data={[
            ...listTeam,
            {plusTeam: true, teamId: `plusTeam${new Date()}`},
          ]}
          renderItem={(rowData) => this.renderItem(rowData.item)}
          renderHiddenItem={(rowData, rowMap) =>
            this.renderHiddenItem(rowData.item, rowMap)
          }
          keyExtractor={(item) => `${item.teamId}`}
          rightOpenValue={-80}
        />
        <ModalNotifcation
          isOpen={isOpen}
          message={msgNotification}
          onAccept={() => {
            if (errorCode === 'LAST_ADMIN') {
              navigation.navigate(Screens.MEMBER_LIST, {
                isAdmin: true,
                teamId: itemSelect.teamId,
              });
            }
            this.setState({
              isOpen: false,
              msgNotification: '',
              errorCode: '',
            });
            this.resetItemSelect();
          }}
        />
        <ModalNotifcation
          isConfirm={
            itemSelect.teamId &&
            itemSelect.teamId === activeTeam &&
            listTeam.length !== 1
              ? false
              : true
          }
          isOpen={isOpenLeaveTeam}
          message={
            itemSelect.teamId &&
            itemSelect.teamId === activeTeam &&
            listTeam.length !== 1
              ? strings('msg_this_team_is_currently_active_you_must_switch_to_another_team_before_leaving')
              : strings('msg_are_you_sure_to_leave_the_team')
          }
          onAccept={() => {
            itemSelect.teamId &&
            itemSelect.teamId === activeTeam &&
            listTeam.length !== 1
              ? this.setState({isOpenLeaveTeam: false})
              : this.leaveTeam();
          }}
          onCancel={() => {
            this.setState({isOpenLeaveTeam: false});
            this.resetItemSelect();
          }}
        />
      </Block>
    );
  }
}

SwitchTeamScreen.defaultProps = {};

SwitchTeamScreen.propTypes = {
  userId: PropTypes.string,
  activeTeam: PropTypes.number,
  listTeam: PropTypes.array,
  userActions: PropTypes.object,
  language: PropTypes.string,
};

const mapStateToProps = (state) => ({
  userId: state.user.userId,
  listTeam: state.team.listTeam,
  activeTeam: state.user.profile.activeTeam,
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
  teamActions: bindActionCreators(TeamActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SwitchTeamScreen);
