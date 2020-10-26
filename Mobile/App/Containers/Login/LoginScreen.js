/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  Image,
  Keyboard,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import OcIcon from 'react-native-vector-icons/Octicons';
import ADIcon from 'react-native-vector-icons/AntDesign';
import {GoogleSignin} from '@react-native-community/google-signin';
import {
  GraphRequest,
  GraphRequestManager,
  LoginManager,
  AccessToken,
} from 'react-native-fbsdk';
import Style from './CommonStyle';
import UserActions from '../../Stores/User/Actions';
import TeamActions from '../../Stores/Team/Actions';
import {userService} from '../../Services/UserService';
import {saveToken, saveUserId} from '../../Utils/storage.helper';
import MainContainer from './MainContainer';
import {
  Input,
  Button,
  Block,
  Text,
  Loading,
  ModalNotifcation,
} from '../../Components';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Screens} from '../../Utils/screens';
import {Colors, Images} from '../../Theme';
import {Constants} from '../../Utils/constants';
import {getLanguage} from '../../Utils/storage.helper';
import I18n from 'react-native-i18n';
import {defineLanguage} from '../../Utils/commonFunction';
import {strings} from '../../Locate/I18n';
import {Config} from '../../Config';

GoogleSignin.configure({
  webClientId: Config.GOOGLE_WEB_CLIENT_ID,
});

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      msgError: '',
      username: '',
      password: '',
      isOpen: false,
      msgNotification: '',
    };
    this.didFocusSubscription = props.navigation.addListener(
      'didFocus',
      (payload) =>
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress),
    );
  }

  componentDidMount() {
    this.willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      (payload) =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.handleBackPress,
        ),
    );
  }

  componentWillUnmount() {
    this.didFocusSubscription && this.didFocusSubscription.remove();
    this.willBlurSubscription && this.willBlurSubscription.remove();
  }

  handleBackPress = () => {
    BackHandler.exitApp();
    return true;
  };

  clearText = () => {
    this.setState({
      username: '',
      password: '',
    });
  };

  handleInfoUser = async (userId) => {
    const {userActions} = this.props;
    const language = await getLanguage(userId);
    const userInfo = {
      language: language ? language : Constants.EN,
      userId,
    };
    I18n.locale = userInfo.language;
    userActions.setInfoUser(userInfo);
  };

  handleLogin = async (locale) => {
    Keyboard.dismiss();
    let msgError = '';
    const {userActions, teamActions} = this.props;
    const {username, password} = this.state;
    const data = {
      username,
      password,
    };

    this.handleLoading(true);
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (data.username.trim() === '') {
      msgError = strings('msg_error_require_email', {locale});
    } else if (data.username.length > 100) {
      msgError = strings('msg_error_length_email', {locale});
    } else if (!regex.exec(data.username)) {
      msgError = strings('msg_error_format_email', {locale});
    } else if (data.password.trim() === '') {
      msgError = strings('msg_error_require_password', {locale});
    } else if (data.password.length < 8) {
      msgError = strings('msg_error_length_password', {locale});
    }

    this.setState({msgError});
    if (msgError === '') {
      try {
        userService.login(data, locale).then((response) => {
          this.handleLoading(false);
          if (response.success) {
            const {userId, token} = response.data;
            this.handleInfoUser(userId);
            saveToken(token);
            saveUserId(userId);
            userActions.fetchProfile(userId);
            teamActions.fetchTeamUserJoined(userId);
            teamActions.fetchTeamFollowing(userId);
            this.props.navigation.navigate(Screens.NOW);
          } else {
            const {message} = response;
            const msgNotification = message
              ? message
              : strings('msg_login_failed', {locale});
            this.setState({
              msgNotification,
              isOpen: true,
            });
          }
        });
      } catch (error) {
        this.handleLoading(false);
        this.setState({
          msgNotification: strings('msg_login_failed', {locale}),
          isOpen: true,
        });
      }
    } else {
      this.handleLoading(false);
    }
  };

  handleLoading = (loading) => {
    this.setState({
      loading,
    });
  };

  responseInfoCallback = (error, result, data) => {
    if (error) {
      console.log('Error fetching data: ' + error.toString());
    } else {
      console.log(result);
    }
  };

  onFacebookButtonPress = async () => {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);
    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();
    if (data) {
      new GraphRequestManager()
        .addRequest(
          new GraphRequest(
            '/me',
            {
              accessToken: data.accessToken,
              parameters: {
                fields: {
                  string: 'email,name,first_name,middle_name,last_name',
                },
              },
            },
            (error, result) => this.responseInfoCallback(error, result, data),
          ),
        )
        .start();
    }
  };

  onGoogleButtonPress = async () => {
    // Get the users ID token
    const data = await GoogleSignin.signIn();
    if (data) {
      console.log(data);
    }
  };

  handleCloseModal = () => {
    this.setState({
      isOpen: false,
      msgNotification: '',
    });
  };

  render() {
    const {
      loading,
      msgError,
      username,
      password,
      isOpen,
      msgNotification,
    } = this.state;
    const locale = defineLanguage();

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{flex: 1}}>
        <MainContainer locale={locale}>
          {/* Input Email and Password */}
          {/* Email */}
          <Text error center style={Style.errorContainer}>
            {msgError}
          </Text>
          <Input
            style={Style.input}
            email
            placeholder={strings('email', {locale})}
            placeholderTextColor={Colors.gray}
            onChangeText={(username) => this.setState({username})}
            value={username}
            rightLabel={
              <OcIcon
                name="person"
                size={20}
                color={Colors.white}
                style={Style.iconInputEmail}
              />
            }
            rightStyle={{
              width: 48,
              height: 48,
            }}
          />
          {/* Password */}
          <Input
            style={Style.input}
            placeholder={strings('password', {locale})}
            placeholderTextColor={Colors.gray}
            secure
            onChangeText={(password) => this.setState({password})}
            value={password}
            rightStyle={{
              width: 48,
              height: 48,
            }}
          />
          {/* Login */}
          <Button
            style={Style.buttonLoginStyle}
            onPress={() => this.handleLogin(locale)}>
            {loading ? (
              <Loading size="small" color={Colors.white} />
            ) : (
              <Text white bold center style={Style.contentButtonLoginStyle}>
                {strings('login', {locale}).toLocaleUpperCase()}
              </Text>
            )}
          </Button>

          {/* Forgot Password */}
          <TouchableOpacity
            style={Style.forgotPasswordPosition}
            onPress={() => {
              this.clearText();
              this.setState({msgError: ''});
              this.props.navigation.navigate(Screens.RESET_PASSWORD);
            }}>
            <ADIcon name="questioncircle" size={20} color={Colors.white} />
            <Text white style={Style.forgotPasswordStyle}>
              {strings('forgot_password', locale)}
            </Text>
          </TouchableOpacity>

          {/* Sign up account */}
          <Block row style={Style.signUpPosition}>
            <Text white style={Style.askForSignUp}>
              {strings('question_sign_up', locale)}
            </Text>
            <TouchableOpacity
              style={{marginLeft: 10}}
              onPress={() => {
                this.clearText();
                this.setState({msgError: ''});
                this.props.navigation.navigate(Screens.REGISTER);
              }}>
              <Text white bold style={Style.signUp}>
                {strings('sign_up').toUpperCase()}
              </Text>
            </TouchableOpacity>
          </Block>

          {/* Sign in with social networks */}
          <Block row style={Style.signInWithSocialNetworkPosition}>
            <Block
              style={{
                height: 1,
                width: 200,
                backgroundColor: Colors.white,
              }}
            />
            <Text white style={{fontSize: 17, fontWeight: '500'}}>
              {strings('or', locale).toUpperCase()}
            </Text>
            <Block
              style={{
                height: 1,
                width: 200,
                backgroundColor: Colors.white,
              }}
            />
          </Block>

          <Text
            white
            center
            style={{
              fontSize: 15,
              fontWeight: '500',
            }}>
            {strings('sign_in_with', {locale})}
          </Text>

          {/* Three Social Networks: Facebook - Twitter - Line*/}
          <Block row style={Style.socialNetworkContainerPosition}>
            <TouchableOpacity
              onPress={() => this.onFacebookButtonPress()}
              style={Style.socialNetworkContainerStyle}>
              <Image
                style={Style.socialNetworkLogoStyle}
                source={Images.facebook}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.onGoogleButtonPress()}
              style={Style.socialNetworkContainerStyle}>
              <Image
                style={Style.socialNetworkLogoStyle}
                source={Images.google}
              />
            </TouchableOpacity>
            <TouchableOpacity style={Style.socialNetworkContainerStyle}>
              <Image
                style={Style.socialNetworkLogoStyle}
                source={Images.twitter}
              />
            </TouchableOpacity>
            <TouchableOpacity style={Style.socialNetworkContainerStyle}>
              <Image
                style={Style.socialNetworkLogoStyle}
                source={Images.line}
              />
            </TouchableOpacity>
          </Block>
          <ModalNotifcation
            isOpen={isOpen}
            message={msgNotification}
            onAccept={() => this.handleCloseModal()}
          />
        </MainContainer>
      </KeyboardAvoidingView>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
  teamActions: bindActionCreators(TeamActions, dispatch),
});

export default connect(null, mapDispatchToProps)(LoginScreen);
