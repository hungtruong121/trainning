import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import {Platform, Linking} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import I18n from 'react-native-i18n';
import UserActions from '../../Stores/User/Actions';
import TeamActions from '../../Stores/Team/Actions';
import PaymentActions from '../../Stores/Payment/Actions';
import {getToken, getLanguage, getUserId} from '../../Utils/storage.helper';
import {Screens} from '../../Utils/screens';
import {strings} from '../../Locate/I18n';
import Style from './NowScreenStyle';
import {
  Block,
  Header,
  PostList,
  SwitchTeam,
  RightHeader,
} from '../../Components';
import {Constants} from '../../Utils/constants';
import {userService} from '../../Services/UserService';

class NowScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      privacyId: 0,
      refreshing: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      userId,
      teamId,
      teamActions,
      userActions,
      paymentActions,
    } = nextProps;
    if (userId !== prevState.userId || teamId !== prevState.teamId) {
      teamActions.fetchPublicPost(teamId);
      teamActions.fetchTeam(teamId, userId);
      teamActions.fetchTeamMembers(teamId, '');
      paymentActions.fetchTeamRank();
      paymentActions.fetchMemberRank();
      const data = {
        teamId,
        firstResult: 0,
        maxResult: 10,
      };
      userActions.fetchNotification(data);
      return {userId, teamId};
    }

    return null;
  }

  componentDidMount = async () => {
    const {userActions, teamActions, navigation} = this.props;
    this.focusListener = navigation.addListener('didFocus', async () => {
      this.getPublicPosts();
    });

    const token = await getToken();
    if (!token) {
      navigation.navigate(Screens.LOGIN);
    } else {
      const userId = await getUserId();
      if (userId) {
        const language = await getLanguage(userId);
        const userInfo = {
          token: token ? token : '',
          language: language ? language : Constants.EN,
          userId: userId ? userId : '',
        };
        I18n.locale = userInfo.language;
        userActions.setInfoUser(userInfo);
        userActions.fetchProfile(userId);
        teamActions.fetchTeamUserJoined(userId);
        teamActions.fetchTeamFollowing(userId);
      }
    }
    Linking.getInitialURL().then((url) => {
      this.handleOpenURL(url, token);
    });
    Linking.addEventListener('url', (e) => this.handleOpenURL(e.url, token));
    this.requestUserPermission();
  };

  handleOpenURL = (url, token) => {
    const {navigation} = this.props;

    if (token && url) {
      const teamId = this.getParameterByName('teamId', url);
      if (teamId) {
        navigation.navigate(Screens.TEAM_PROFILE, {teamId});
      }
    }
  };

  getParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) {
      return null;
    }
    if (!results[2]) {
      return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  getPublicPosts() {
    const {teamId, teamActions} = this.props;
    teamActions.fetchPublicPost(teamId);
  }

  requestUserPermission = async () => {
    const {userId} = this.state;
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      messaging().onMessage(async (remoteMessage) => {
        if (userId && userId !== '') {
          this.pushNotification(remoteMessage);
        }
      });
      messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        if (userId && userId !== '') {
          this.pushNotification(remoteMessage);
        }
      });
      messaging()
        .getToken()
        .then((token) => {
          if (userId && userId !== '') {
            this.saveTokenToDatabase(userId, token);
          }
        });
      messaging().onTokenRefresh((token) => {
        if (userId && userId !== '') {
          this.saveTokenToDatabase(userId, token);
        }
      });
    }
  };

  saveTokenToDatabase = (userId, token) => {
    const data = {
      customerId: userId,
      device: token,
    };
    try {
      userService.saveToken(data);
    } catch (error) {}
  };

  pushNotification = (remoteMessage) => {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.presentLocalNotification({
        alertTitle: remoteMessage.notification.title,
        alertBody: remoteMessage.notification.body,
        applicationIconBadgeNumber: 1,
      });
    } else {
      PushNotification.localNotification({
        title: remoteMessage.notification.title,
        message: remoteMessage.notification.body,
        soundName: 'default',
      });
    }
  };

  componentWillUnmount() {
    if (this.focusListener) {
      this.focusListener.remove();
    }
    Linking.removeEventListener('url', this.handleOpenURL);
  }

  render() {
    const {listPublicPosts, navigation} = this.props;
    return (
      <Block style={Style.view}>
        <Header
          title={strings('now')}
          leftIcon={<SwitchTeam navigation={navigation} />}
          rightIcon={<RightHeader navigation={navigation} />}
        />
        {listPublicPosts.length > 0 && (
          <PostList
            teamPosts={listPublicPosts}
            refreshControl={() => this.getPublicPosts()}
          />
        )}
      </Block>
    );
  }
}

NowScreen.defaultProps = {};

NowScreen.propTypes = {
  errorCode: PropTypes.string,
  userActions: PropTypes.object,
  profile: PropTypes.object,
  listTeamInfo: PropTypes.array,
  userId: PropTypes.string,
  paymentActions: PropTypes.object,
};

const mapStateToProps = (state) => ({
  errorCode: state.user.errorCode,
  listTeamInfo: state.user.listTeamInfo,
  userId: state.user.userId,
  teamId: state.user.profile.activeTeam,
  listPublicPosts: state.team.listPublicPosts,
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
  teamActions: bindActionCreators(TeamActions, dispatch),
  paymentActions: bindActionCreators(PaymentActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(NowScreen);
