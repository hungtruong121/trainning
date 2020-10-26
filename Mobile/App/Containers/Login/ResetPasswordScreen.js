/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {Keyboard, KeyboardAvoidingView, Platform} from 'react-native';
import OcIcon from 'react-native-vector-icons/Octicons';
import Style from './CommonStyle';
import {userService} from '../../Services/UserService';
import MainContainer from './MainContainer';
import {
  Input,
  Button,
  Block,
  Text,
  BaseModal,
  ModalNotifcation,
  Loading,
} from '../../Components';
import {Screens} from '../../Utils/screens';
import {Colors} from '../../Theme';
import {defineLanguage} from '../../Utils/commonFunction';
import {strings} from '../../Locate/I18n';

class ResetPasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      msgError: '',
      userMail: '',
      isOpen: false,
      otp: '',
      newPassword: '',
      newPasswordConfirm: '',
      msgModalError: '',
      loadingModal: false,
      isOpenModalNotification: false,
      msgNotification: '',
      isNavigation: false,
    };
  }

  handleSendOTP = async (locale) => {
    Keyboard.dismiss();
    let msgError = '';
    const {userMail} = this.state;
    const data = {
      userMail,
    };

    this.handleLoading('loading', true);
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (data.userMail.trim() === '') {
      msgError = strings('msg_error_require_email', {locale});
    } else if (data.userMail.length > 100) {
      msgError = strings('msg_error_length_email', {locale});
    } else if (!regex.exec(data.userMail)) {
      msgError = strings('msg_error_format_email', {locale});
    }

    this.setState({msgError});
    if (msgError === '') {
      try {
        userService.sendOTP(data, locale).then((response) => {
          this.handleLoading('loading', false);
          if (response.success) {
            this.setState({
              isOpen: true,
            });
          }
        });
      } catch (error) {
        this.handleLoading('loading', false);
      }
    } else {
      this.handleLoading('loading', false);
    }
  };

  handleLoading = (key, loading) => {
    this.setState({
      [key]: loading,
    });
  };

  renderBodyModal = (locale) => {
    const {
      otp,
      newPassword,
      newPasswordConfirm,
      msgModalError,
      isOpenModalNotification,
      msgNotification,
    } = this.state;
    return (
      <Block>
        <Text h3 center>
          {strings('msg_otp', {locale})}
        </Text>
        <Text error center style={Style.errorContainer}>
          {msgModalError}
        </Text>
        <Input
          value={otp}
          style={Style.input}
          placeholder={strings('otp', {locale}).toUpperCase()}
          number
          placeholderTextColor={Colors.gray}
          onChangeText={(text) => this.setState({otp: text})}
        />
        <Input
          style={Style.input}
          value={newPassword}
          placeholder={strings('new_password', {locale})}
          placeholderTextColor={Colors.gray}
          secure
          onChangeText={(text) => this.setState({newPassword: text})}
          rightStyle={{
            width: 48,
            height: 48,
          }}
        />
        <Input
          value={newPasswordConfirm}
          style={Style.input}
          placeholder={strings('new_password_confirm', {locale})}
          placeholderTextColor={Colors.gray}
          secure
          onChangeText={(text) => this.setState({newPasswordConfirm: text})}
          rightStyle={{
            width: 48,
            height: 48,
          }}
        />
        <ModalNotifcation
          isOpen={isOpenModalNotification}
          message={msgNotification}
          onAccept={() => this.handleCloseModalNotification()}
        />
      </Block>
    );
  };

  renderFooterModal = (locale) => {
    const {loadingModal} = this.state;
    return (
      <Block row flex={false} space="between" bottom>
        <Button
          primary
          style={Style.button}
          onPress={() => this.handleResetPassWord(locale)}>
          {loadingModal ? (
            <Loading size="small" color={Colors.white} />
          ) : (
            <Text bold white center>
              {strings('ok', {locale})}
            </Text>
          )}
        </Button>
        <Button
          white
          style={[
            Style.button,
            {borderColor: Colors.primary, borderWidth: 0.5},
          ]}
          onPress={() => this.handleCloseModal()}
          disabled={loadingModal}>
          <Text bold primary center>
            {strings('cancel', {locale})}
          </Text>
        </Button>
      </Block>
    );
  };

  handleResetPassWord = (locale) => {
    const {userMail, otp, newPassword, newPasswordConfirm} = this.state;
    this.handleLoading('loadingModal', true);
    let msgModalError = '';
    if (otp.trim() === '') {
      msgModalError = strings('msg_error_require_otp', {locale});
    } else if (newPassword.trim() === '') {
      msgModalError = strings('msg_error_require_new_password', {locale});
    } else if (newPassword.length < 8) {
      msgModalError = strings('msg_error_length_password', {locale});
    } else if (newPasswordConfirm !== newPassword) {
      msgModalError = strings('msg_error_confirm_password', {locale});
    }

    this.setState({
      msgModalError,
    });
    if (msgModalError === '') {
      const data = {
        otp,
        newPassword,
        userMail,
      };
      try {
        userService.resetPassword(data, locale).then((response) => {
          this.handleLoading('loadingModal', false);
          if (response.success) {
            this.setState({
              isOpenModalNotification: true,
              isNavigation: true,
              msgNotification: strings('msg_reset_password_success', {locale}),
            });
          } else {
            const msgNotification = response.message
              ? response.message
              : strings('msg_reset_password_failed', {locale});
            this.setState({
              isOpenModalNotification: true,
              msgNotification,
            });
          }
        });
      } catch (error) {
        this.handleLoading('loadingModal', false);
        this.setState({
          isOpenModalNotification: true,
          msgNotification: strings('msg_reset_password_failed', {locale}),
        });
      }
    } else {
      this.handleLoading('loadingModal', false);
    }
  };

  handleCloseModal = () => {
    this.setState({
      isOpen: false,
      msgModalError: '',
      otp: '',
      newPassword: '',
      newPasswordConfirm: '',
      loadingModal: false,
    });
  };

  handleCloseModalNotification = () => {
    const {navigation} = this.props;
    const {isNavigation} = this.state;

    if (isNavigation) {
      this.setState({
        isOpen: false,
        isOpenModalNotification: false,
      });
      navigation.navigate(Screens.LOGIN);
    } else {
      this.setState({
        isOpenModalNotification: false,
        msgNotification: '',
      });
    }
  };

  render() {
    const {loading, msgError, userMail, isOpen} = this.state;
    const locale = defineLanguage();

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{flex: 1}}>
        <MainContainer locale={locale}>
          {/* Email */}
          <Text error center style={Style.errorContainer}>
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
          </Block>

          {/* Button Cancel and Reset */}
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
              onPress={() => this.handleSendOTP(locale)}>
              {loading ? (
                <Loading size="small" color={Colors.white} />
              ) : (
                <Text white bold center style={Style.textButton}>
                  {strings('reset', {locale}).toUpperCase()}
                </Text>
              )}
            </Button>
          </Block>
          <BaseModal
            title=""
            isOpen={isOpen}
            bodyModal={() => this.renderBodyModal(locale)}
            footerModal={() => this.renderFooterModal(locale)}
            onCancel={this.handleCloseModal}
            useScrollView={true}
          />
        </MainContainer>
      </KeyboardAvoidingView>
    );
  }
}

export default ResetPasswordScreen;
