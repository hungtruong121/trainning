/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import {Image, TouchableOpacity, ScrollView} from 'react-native';
import {Block, Text, Header} from '../../Components';
import UserActions from '../../Stores/User/Actions';
import Icon from 'react-native-vector-icons/AntDesign';
import {strings} from '../../Locate/I18n';
import Style from './SettingScreenStyle';
import {Images, Colors} from '../../Theme';
import {Screens} from '../../Utils/screens';
import {userService} from '../../Services/UserService';
import {resetUser} from '../../Utils/storage.helper';

class SettingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorCode: '',
    };
  }

  static getDerivedStateFromProps(nextProps) {
    const {errorCode} = nextProps;
    const data = {errorCode};
    return data;
  }

  componentDidMount = async () => {};

  handleLogout = () => {
    const {userActions, navigation} = this.props;
    try {
      userService.logOut().then((response) => {
        if (response.success) {
          resetUser();
          userActions.resetUser();
          navigation.navigate(Screens.LOGIN);
        }
      });
    } catch (error) {}
  };

  renderItemSetting = (text, screen, icon) => {
    const {navigation} = this.props;
    return (
      <TouchableOpacity
        style={Style.itemSetting}
        onPress={() =>
          screen ? navigation.navigate(screen) : this.handleLogout()
        }>
        <Block row space="between" center middle>
          <Block row center>
            <Image source={icon} style={Style.iconLeft} />
            <Text style={[Style.text, {textTransform: 'uppercase'}]}>
              {text}
            </Text>
          </Block>
          <Icon name={'right'} size={16} color={Colors.text} style={{top: 2}} />
        </Block>
      </TouchableOpacity>
    );
  };

  render() {
    const {navigation, language} = this.props;

    return (
      <Block style={Style.view}>
        <Header
          title={strings('settings', {locale: language})}
          isShowBack
          navigation={navigation}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.renderItemSetting(
            strings('general'),
            Screens.GENERAL,
            Images.iconGeneral,
          )}
          {this.renderItemSetting(
            strings('my_folder'),
            Screens.MY_FOLDER,
            Images.iconMyfolder,
          )}
          {this.renderItemSetting(
            strings('edit_profile'),
            Screens.EDIT_PROFILE,
            Images.iconEditProfile,
          )}
          {this.renderItemSetting(
            strings('reset_password'),
            Screens.CHANGE_PASSWORD,
            Images.iconResetPassword,
          )}
          {this.renderItemSetting(strings('logout'), null, Images.iconLogout)}
        </ScrollView>
      </Block>
    );
  }
}

SettingScreen.defaultProps = {};

SettingScreen.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen);
