import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import {TouchableOpacity, ScrollView} from 'react-native';
import {
  Block,
  Text,
  Header,
  Input,
  Loading,
  ModalNotifcation,
} from '../../Components';
import UserActions from '../../Stores/User/Actions';
import {strings} from '../../Locate/I18n';
import Style from './ChangePasswordScreenStyle';
import {ApplicationStyles, Colors} from '../../Theme';
import {userService} from '../../Services/UserService';
import {Screens} from '../../Utils/screens';

class ChangePasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorCode: '',
      oldPassword: '',
      password: '',
      passwordConfirm: '',
      msgError: '',
      loading: false,
      msgNotification: '',
    };
    this.bottomSheet = React.createRef();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {errorCode, language} = nextProps;
    const {isEditing} = prevState;
    const data = {errorCode, language};
    if (!isEditing) {
      data.languageSelect = language;
    }

    return data;
  }

  componentDidMount = async () => {};

  handleChangePassword = () => {
    this.setState({loading: true, msgError: ''});
    const {oldPassword, password, passwordConfirm} = this.state;
    const {userId, navigation} = this.props;

    let msgError = '';
    if (oldPassword.trim() === '') {
      msgError = strings('msg_error_require_old_password');
    } else if (oldPassword.length < 8) {
      msgError = strings('msg_error_length_password');
    } else if (password.trim() === '') {
      msgError = strings('msg_error_require_new_password');
    } else if (password.length < 8) {
      msgError = strings('msg_error_length_password');
    } else if (passwordConfirm !== password) {
      msgError = strings('msg_error_confirm_password');
    }

    if (msgError === '') {
      const data = {
        userId,
        oldPassword,
        password,
      };
      try {
        userService.changePassword(data).then((response) => {
          this.setState({
            loading: false,
          });
          if (response.success) {
            navigation.navigate(Screens.SETTING);
          } else {
            const {message} = response;
            this.setState({
              isOpen: true,
              msgNotification: message,
            });
          }
        });
      } catch (error) {
        this.setState({
          loading: false,
          isOpen: true,
          msgNotification: strings('msg_change_password_failed'),
        });
      }
    } else {
      this.setState({
        loading: false,
        msgError,
      });
    }
  };

  render() {
    const {navigation} = this.props;
    const {
      oldPassword,
      password,
      passwordConfirm,
      loading,
      msgError,
      isOpen,
      msgNotification,
    } = this.state;
    return (
      <Block style={Style.view}>
        <Header
          title={strings('reset_password')}
          isShowBack
          navigation={navigation}
          rightIcon={
            <TouchableOpacity
              onPress={() => this.handleChangePassword()}
              style={{paddingVertical: 15}}>
              {loading ? (
                <Loading size="small" color={Colors.white} />
              ) : (
                <Text style={Style.headerRight}>{strings('save')}</Text>
              )}
            </TouchableOpacity>
          }
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            ...ApplicationStyles.paddingHorizontalView,
            paddingVertical: 20,
          }}>
          {msgError !== '' && (
            <Text error size={13.5}>
              {msgError}
            </Text>
          )}
          <Text style={Style.text}>{strings('old_password')}</Text>
          <Input
            style={Style.input}
            placeholderTextColor={Colors.gray}
            secure
            onChangeText={(oldPassword) =>
              this.setState({msgError: '', oldPassword})
            }
            value={oldPassword}
            rightStyle={Style.rightStyle}
            rightIconStyle={Style.rightIconStyle}
            rightIconColor={Colors.gray}
          />
          <Text style={Style.text}>{strings('new_password')}</Text>
          <Input
            style={Style.input}
            placeholderTextColor={Colors.gray}
            secure
            onChangeText={(password) => this.setState({msgError: '', password})}
            value={password}
            rightStyle={Style.rightStyle}
            rightIconStyle={Style.rightIconStyle}
            rightIconColor={Colors.gray}
          />
          <Text style={Style.text}>{strings('new_password_confirm')}</Text>
          <Input
            style={Style.input}
            placeholderTextColor={Colors.gray}
            secure
            onChangeText={(passwordConfirm) =>
              this.setState({msgError: '', passwordConfirm})
            }
            value={passwordConfirm}
            rightStyle={Style.rightStyle}
            rightIconStyle={Style.rightIconStyle}
            rightIconColor={Colors.gray}
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
        </ScrollView>
      </Block>
    );
  }
}

ChangePasswordScreen.defaultProps = {};

ChangePasswordScreen.propTypes = {
  userActions: PropTypes.object,
  userId: PropTypes.string,
  language: PropTypes.string,
};

const mapStateToProps = (state) => ({
  errorCode: state.user.errorCode,
  userId: state.user.userId,
  language: state.user.language,
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChangePasswordScreen);
