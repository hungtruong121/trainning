/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {TouchableOpacity, Image} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import {Header, Block, Text, ModalNotifcation} from '../../Components';
import Icon from 'react-native-vector-icons/AntDesign';
import {Colors, ApplicationStyles, Images} from '../../Theme';
import {Config} from '../../Config';
import {Screens} from '../../Utils/screens';
import Style from './FollowingScreenStyle';
import TeamActions from '../../Stores/Team/Actions';
import {userService} from '../../Services/UserService';
import {strings} from '../../Locate/I18n';

class FollowingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorCode: '',
      listTeamFollow: [],
      itemSelect: {},
      activeTeam: null,
      msgNotification: '',
      isOpen: false,
      isOpenUnfollow: false,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    const {errorCode, listTeamFollow, activeTeam} = nextProps;
    const data = {
      errorCode,
      activeTeam,
      listTeamFollow: listTeamFollow ? listTeamFollow : [],
    };
    return data;
  }

  componentDidMount = () => {
    const {teamActions, userId} = this.props;
    teamActions.fetchTeamFollowing(userId);
  };

  redirectTeam = (teamId) => {
    const {navigation} = this.props;
    navigation.navigate(Screens.TEAM_PROFILE, {teamId});
  };

  renderItem = (item) => {
    const {teamId, teamAvatar, teamName, membersInTeam, followersInTeam} = item;
    const imageUrl = `${Config.GET_IMAGE_URL}${teamAvatar ? teamAvatar : ''}`;

    return (
      <Block block style={Style.itemContainer}>
        <Block block row center style={{backgroundColor: Colors.white}}>
          <Block block row center>
            <Block block row center margin={[0, 0, 0, 15]}>
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
                  {membersInTeam ? membersInTeam : ''} Members -{' '}
                  {followersInTeam ? followersInTeam : ''} Followers
                </Text>
              </Block>
            </Block>
          </Block>
        </Block>
        <Block flex={false} style={Style.separatorBar} />
      </Block>
    );
  };

  handleUnfollowTeam = (item) => {
    this.setState({
      itemSelect: item,
      isOpenUnfollow: true,
    });
  };

  UnfollowTeam = () => {
    this.setState({isOpenUnfollow: false});
    const {teamActions, userId} = this.props;
    const {itemSelect} = this.state;
    const data = {
      userId,
      teamId: itemSelect.teamId,
    };
    try {
      userService.unfollowTeam(data).then((response) => {
        if (response.success) {
          teamActions.fetchTeamFollowing(userId);
        } else {
          const {message} = response;
          this.setState({
            msgNotification: message,
            isOpen: true,
          });
        }
      });
      this.setState({itemSelect: {}});
    } catch (error) {
      this.setState({
        msgNotification: strings('msg_unfollow_team_unsuccessfully'),
        isOpen: true,
      });
      this.setState({itemSelect: {}});
    }
  };

  closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  renderHiddenItem = (item, rowMap) => {
    const {teamId} = item;

    return (
      <Block style={Style.hiddenItemContainer}>
        <TouchableOpacity
          style={Style.buttonUnfollowTeamStyle}
          onPress={() => {
            this.handleUnfollowTeam(item);
            teamId && this.closeRow(rowMap, teamId);
          }}>
          <Image
            source={Images.iconUnfollowTeam}
            style={{width: 36, height: 34}}
          />
        </TouchableOpacity>
      </Block>
    );
  };

  render() {
    const {navigation} = this.props;
    const {
      listTeamFollow,
      isOpenUnfollow,
      isOpen,
      msgNotification,
    } = this.state;

    return (
      <Block>
        <Header
          title={strings('following')}
          rightIcon={
            <TouchableOpacity
              style={{paddingVertical: 15}}
              onPress={() => navigation.goBack()}>
              <Icon name="right" size={15} color={Colors.white} />
            </TouchableOpacity>
          }
        />

        <Block flex={false} center middle style={Style.view}>
          <Text style={Style.totalTeamFollowing}>
            You are following {listTeamFollow ? listTeamFollow.length : '0'}
            {' teams'}
          </Text>
        </Block>

        <SwipeListView
          useFlatList
          closeOnRowOpen
          closeOnRowPress
          disableRightSwipe
          data={listTeamFollow}
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
            this.setState({
              isOpen: false,
              msgNotification: '',
            });
          }}
        />

        <ModalNotifcation
          isConfirm
          isOpen={isOpenUnfollow}
          message={strings('msg_are_you_sure_to_unfollow_this_team')}
          onAccept={() => {
            this.UnfollowTeam();
          }}
          onCancel={() => {
            this.setState({isOpenUnfollow: false, itemSelect: {}});
          }}
        />
      </Block>
    );
  }
}

FollowingScreen.defaultProps = {};

FollowingScreen.propTypes = {
  userId: PropTypes.string,
  listTeamFollow: PropTypes.array,
  teamActions: PropTypes.object,
};

const mapStateToProps = (state) => ({
  errorCode: state.user.errorCode,
  userId: state.user.userId,
  listTeamFollow: state.team.listTeamFollow.lisTeamFollow,
  activeTeam: state.user.profile.activeTeam,
});

const mapDispatchToProps = (dispatch) => ({
  teamActions: bindActionCreators(TeamActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(FollowingScreen);
