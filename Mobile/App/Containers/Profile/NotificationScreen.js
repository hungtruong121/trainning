/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import {TouchableOpacity, FlatList, Image, ScrollView} from 'react-native';
import {Block, Text, Header, Badge} from '../../Components';
import UserActions from '../../Stores/User/Actions';
import {strings} from '../../Locate/I18n';
import {Images, Colors} from '../../Theme';
import {Config} from '../../Config';
import Style from './NotificationScreenStyle';
import HTML from 'react-native-render-html';
import PostActions from '../../Stores/Post/Actions';
import {userService} from '../../Services/UserService';
import {Screens} from '../../Utils/screens';
import {getTimeAgo} from '../../Utils/commonFunction';

class NotificationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorCode: '',
      teamId: null,
      dataTeamActive: {},
      dataOtherTeam: [],
      firstResult: 0,
      maxResult: 10,
      isEditing: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {errorCode, notifications, teamId} = nextProps;
    const {isEditing} = prevState;
    const data = {
      errorCode,
    };

    if (!isEditing) {
      data.teamId = teamId;
    }
    if (notifications && notifications.length > 0) {
      data.dataTeamActive = notifications[0];

      if (notifications.length === 1) {
        data.dataOtherTeam = [];
      } else {
        let temp = JSON.parse(JSON.stringify(notifications));
        temp.shift();
        data.dataOtherTeam = temp;
      }
    }
    return data;
  }

  componentDidMount = () => {};

  fetchNotification = (teamId) => {
    const {userActions} = this.props;
    const {firstResult, maxResult} = this.state;
    const data = {
      teamId,
      firstResult,
      maxResult,
    };
    userActions.fetchNotification(data);
  };

  handleReadsNotification = (teamId) => {
    const data = {
      teamId,
    };
    try {
      userService.readsNotification(data).then((response) => {
        if (response.success) {
          this.fetchNotification(teamId);
        }
      });
    } catch (error) {}
  };

  renderRightHeader = (dataTeamActive) => {
    const {teamId} = this.state;
    return (
      <TouchableOpacity
        onPress={() => this.handleReadsNotification(teamId)}
        disabled={Object.keys(dataTeamActive).length === 0}
        style={{paddingVertical: 15}}>
        <Image source={Images.iconCheck} style={{height: 15, width: 15}} />
      </TouchableOpacity>
    );
  };

  handleNavigateScreen = (mobileScreenKey, teamId, postId) => {
    const {navigation, postActions} = this.props;
    if (Screens.INVITE === mobileScreenKey) {
      navigation.navigate(Screens.INVITE, {teamId});
    } else if (Screens.POST_DETAIL === mobileScreenKey) {
      postActions.fetchPostDetailSuccess(postId);
      navigation.navigate(Screens.POST_DETAIL);
    }
  };

  handlePressNotification = (item) => {
    const {notificationId, mobileScreenKey, teamId, postId, isRead} = item;
    const data = {
      notificationId,
    };
    if (isRead === 1) {
      this.handleNavigateScreen(mobileScreenKey, teamId, postId);
    } else {
      try {
        userService.readNotification(data).then((response) => {
          if (response.success) {
            this.fetchNotification(this.state.teamId);
            this.handleNavigateScreen(mobileScreenKey, teamId, postId);
          }
        });
      } catch (error) {}
    }
  };

  renderItem = ({item}) => {
    const {
      notificationFromAvatar,
      notificationContent,
      isRead,
      createdDate,
    } = item;
    const imageUrl = `${Config.GET_IMAGE_URL}${
      notificationFromAvatar ? notificationFromAvatar : ''
    }`;

    return (
      <TouchableOpacity
        style={{
          flex: 1,
          height: 98,
          width: '100%',
          backgroundColor: isRead ? Colors.white : Colors.gray3,
        }}
        activeOpacity={0.6}
        onPress={() => this.handlePressNotification(item)}>
        <Block block row center>
          <Image source={{uri: imageUrl}} style={Style.avatarNotification} />
          <Block
            block
            column
            middle
            margin={[0, 15, 0, 10]}
            style={{
              height: 98,
            }}>
            <HTML
              html={notificationContent ? notificationContent : ''}
              baseFontStyle={Style.notificationContent}
            />
            <Text style={Style.notificationTime}>
              {getTimeAgo(createdDate)}
            </Text>
          </Block>
        </Block>
        <Block flex={false} style={Style.separatorBar} />
      </TouchableOpacity>
    );
  };

  renderActiveTeam = (dataTeamActive) => {
    const {totalUnreadNotification, teamAvatar, teamName} = dataTeamActive;
    return (
      <Block flex={false} row center style={Style.teamSelectContainer}>
        <Block flex={false} style={{position: 'relative'}}>
          {totalUnreadNotification > 0 && (
            <Badge
              size={20}
              color={Colors.primary}
              children={
                <Text style={Style.badgeContent}>
                  {totalUnreadNotification}
                </Text>
              }
              style={Style.badgeContainer}
            />
          )}
          <Image
            source={{
              uri: `${Config.GET_IMAGE_URL}${teamAvatar ? teamAvatar : ''}`,
            }}
            style={Style.avatarTeam}
          />
        </Block>
        <Text style={Style.teamSelectName}>{teamName ? teamName : ''}</Text>
      </Block>
    );
  };

  handleChangeActiveTeam = (teamId) => {
    this.setState({isEditing: true, teamId});
    this.fetchNotification(teamId);
  };

  renderOtherTeam = (dataOtherTeam) => {
    return (
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <Block
          flex={false}
          row
          center
          style={{
            height: 78,
            marginLeft: 15,
          }}>
          {dataOtherTeam.map((item) => {
            const {teamAvatar, totalUnreadNotification, teamId} = item;
            const imageUrl = `${Config.GET_IMAGE_URL}${
              teamAvatar ? teamAvatar : ''
            }`;

            return (
              <TouchableOpacity
                key={teamId}
                style={{position: 'relative'}}
                activeOpacity={0.6}
                onPress={() => this.handleChangeActiveTeam(teamId)}>
                {totalUnreadNotification > 0 && (
                  <Badge
                    size={20}
                    color={Colors.primary}
                    children={
                      <Text style={Style.badgeContent}>
                        {totalUnreadNotification}
                      </Text>
                    }
                    style={Style.badgeContainer}
                  />
                )}
                <Image source={{uri: imageUrl}} style={Style.avatarTeam} />
              </TouchableOpacity>
            );
          })}
        </Block>
        <Block flex={false} style={{width: 15, height: 78}} />
      </ScrollView>
    );
  };

  render() {
    const {navigation} = this.props;
    const {dataTeamActive, dataOtherTeam} = this.state;
    const {notifications} = dataTeamActive;
    return (
      <Block style={Style.view}>
        <Header
          isShowBack
          navigation={navigation}
          rightIcon={this.renderRightHeader(dataTeamActive)}
          title={strings('notification')}
        />
        {/* Select Team Container */}
        {dataOtherTeam.length > 0 && (
          <>
            <Block flex={false} row center style={{height: 78}}>
              {Object.keys(dataTeamActive).length > 0 &&
                this.renderActiveTeam(dataTeamActive)}
              {dataOtherTeam.length > 0 && this.renderOtherTeam(dataOtherTeam)}
            </Block>
            {Object.keys(dataTeamActive).length > 0 && (
              <Block flex={false} style={Style.separatorBar} />
            )}
          </>
        )}

        {/* Notification Container */}
        <FlatList
          data={notifications ? notifications : []}
          renderItem={(item) => this.renderItem(item)}
          keyExtractor={(item) => `${item.notificationId}`}
          showsVerticalScrollIndicator={false}
        />
      </Block>
    );
  }
}

NotificationScreen.defaultProps = {};

NotificationScreen.propTypes = {
  errorCode: PropTypes.string,
  userActions: PropTypes.object,
  teamId: PropTypes.number,
  notifications: PropTypes.array,
  postActions: PropTypes.object,
};

const mapStateToProps = (state) => ({
  errorCode: state.user.errorCode,
  teamId: state.user.profile.activeTeam,
  notifications: state.user.notifications,
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
  postActions: bindActionCreators(PostActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationScreen);
