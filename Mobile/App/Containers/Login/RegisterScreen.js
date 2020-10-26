/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {Keyboard, KeyboardAvoidingView, Platform} from 'react-native';
import Style from './CommonStyle';
import {userService} from '../../Services/UserService';
import OcIcon from 'react-native-vector-icons/Octicons';
import MainContainer from './MainContainer';
import {
  Input,
  Button,
  Block,
  Text,
  ModalNotifcation,
  Loading,
} from '../../Components';
import {Screens} from '../../Utils/screens';
import {Colors} from '../../Theme';
import {defineLanguage} from '../../Utils/commonFunction';
import {strings} from '../../Locate/I18n';

class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      msgError: '',
      userMail: '',
      password: '',
      confirmPassword: '',
      userFullName: '',
      isOpen: false,
      isNavigation: false,
      msgNotification: '',
    };
  }

  handleSignUp = async (locale) => {
    Keyboard.dismiss();
    let msgError = '';
    const {userMail, password, confirmPassword, userFullName} = this.state;
    const data = {
      userMail: userMail,
      password: password,
      userFullName: userFullName,
    };

    this.handleLoading(true);
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (data.userMail.trim() === '') {
      msgError = strings('msg_error_require_email', {locale});
    } else if (!regex.exec(data.userMail)) {
      msgError = strings('msg_error_format_email', {locale});
    } else if (data.userMail.length > 100) {
      msgError = strings('msg_error_length_email', {locale});
    } else if (data.password.trim() === '') {
      msgError = strings('msg_error_require_password', {locale});
    } else if (data.password.length < 8) {
      msgError = strings('msg_error_length_password', {locale});
    } else if (confirmPassword !== data.password) {
      msgError = strings('msg_error_confirm_password', {locale});
    } else if (data.userFullName.trim() === '') {
      msgError = strings('msg_error_require_your_name', {locale});
    } else if (data.userFullName.length > 50) {
      msgError = strings('msg_error_length_your_name', {locale});
    }

    this.setState({msgError});
    if (msgError === '') {
      try {
        userService.signUp(data, locale).then((response) => {
          this.handleLoading(false);
          if (response.success) {
            this.setState({
              isOpen: true,
              isNavigation: true,
              msgNotification: strings('msg_sign_up_success', {
                locale,
              }),
            });
          } else {
            const msgNotification = response.message
              ? response.message
              : strings('msg_sign_up_failed', {locale});
            this.setState({
              isOpen: true,
              msgNotification,
            });
          }
        });
      } catch (error) {
        this.handleLoading(false);
        this.setState({
          isOpen: true,
          msgNotification: strings('msg_sign_up_failed', {locale}),
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

  handleCloseModal = () => {
    const {navigation} = this.props;
    const {isNavigation} = this.state;
    this.setState({
      isOpen: false,
      msgNotification: '',
    });
    if (isNavigation) {
      navigation.navigate(Screens.LOGIN);
    }
  };

  render() {
    const {
      loading,
      msgError,
      isOpen,
      userMail,
      password,
      confirmPassword,
      userFullName,
      msgNotification,
    } = this.state;
    const locale = defineLanguage();
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{flex: 1}}>
        <MainContainer locale={locale}>
          {/* Email, Password, Confirm Password, Name */}
          {/* Email */}
          <Text center error style={Style.errorContainer}>
            {msgError}
          </Text>
          <Block style={{marginTop: 0}}>
            <Input
              value={userMail}
              style={Style.input}
              email
              placeholder={strings('email', {locale})}
              placeholderTextColor={Colors.gray}
              onChangeText={(text) => this.setState({userMail: text})}
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
              value={password}
              placeholder={strings('password', {locale})}
              placeholderTextColor={Colors.gray}
              secure
              onChangeText={(text) => this.setState({password: text})}
              rightStyle={{
                width: 48,
                height: 48,
              }}
            />

            {/* Confirm Password */}
            <Input
              value={confirmPassword}
              style={Style.input}
              placeholder={strings('password_confirm', {locale})}
              placeholderTextColor={Colors.gray}
              secure
              onChangeText={(text) => this.setState({confirmPassword: text})}
              rightStyle={{
                width: 48,
                height: 48,
              }}
            />

            {/* Name */}
            <Input
              value={userFullName}
              style={[Style.input, {paddingRight: 10}]}
              placeholder={strings('your_name', {locale})}
              placeholderTextColor={Colors.gray}
              onChangeText={(text) => this.setState({userFullName: text})}
            />
            {/* Button Cancel and Sign Up */}
            <Block row space="between">
              <Button
                white
                style={Style.button}
                onPress={() => this.props.navigation.navigate(Screens.LOGIN)}>
                <Text primary bold center style={Style.textButton}>
                  {strings('cancel', {locale}).toUpperCase()}
                </Text>
              </Button>
              <Button
                primary
                style={Style.button}
                onPress={() => this.handleSignUp(locale)}>
                {loading ? (
                  <Loading size="small" color={Colors.white} />
                ) : (
                  <Text white bold center style={Style.textButton}>
                    {strings('sign_up', {locale}).toUpperCase()}
                  </Text>
                )}
              </Button>
            </Block>
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

export default RegisterScreen;
