/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import {
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {
  PERMISSIONS,
  requestMultiple,
  checkMultiple,
} from 'react-native-permissions';
import {
  Block,
  Text,
  Header,
  Input,
  CheckBox,
  Loading,
  BottomSheet,
  TextSelect,
  DateTimePicker,
  ModalNotifcation,
} from '../../Components';
import UserActions from '../../Stores/User/Actions';
import Icon from 'react-native-vector-icons/AntDesign';
import {strings} from '../../Locate/I18n';
import Style from './EditProfileScreenStyle';
import {Images, Colors, ApplicationStyles} from '../../Theme';
import {Config} from '../../Config';
import moment from 'moment';
import {teamService} from '../../Services/TeamService';
import {userService} from '../../Services/UserService';
import {Screens} from '../../Utils/screens';

class EditProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorCode: '',
      profile: {},
      isEditing: false,
      isOpenDateTime: false,
      preferredSelect: {},
      userAchievementName: '',
      userAchievementSport: '',
      userAchievementTime: '',
      msgNotification: '',
      isOpen: false,
      loading: false,
      msgError: '',
      msgErrorAchive: '',
    };
    this.bottomSheet = React.createRef();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {errorCode, profile} = nextProps;
    const {isEditing} = prevState;
    const data = {errorCode};
    if (!isEditing) {
      data.profile = JSON.parse(JSON.stringify(profile));
      if (!data.profile.userPreferredFoot) {
        data.profile.userPreferredFoot = 'right';
      }
      if (!data.profile.userPreferredHand) {
        data.profile.userPreferredHand = 'right';
      }
    }
    return data;
  }

  componentDidMount = async () => {
    this.requestPermission();
  };

  requestPermission = async () => {
    await requestMultiple(
      Platform.select({
        android: [
          PERMISSIONS.ANDROID.CAMERA,
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        ],
        ios: [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.PHOTO_LIBRARY],
      }),
    );
  };

  checkPermission = async () => {
    let permissions = false;
    const status = await checkMultiple(
      Platform.select({
        android: [
          PERMISSIONS.ANDROID.CAMERA,
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        ],
        ios: [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.PHOTO_LIBRARY],
      }),
    );
    if (Platform.OS === 'ios') {
      if (
        status['ios.permission.CAMERA'] === 'granted' &&
        status['ios.permission.PHOTO_LIBRARY'] === 'granted'
      ) {
        permissions = true;
      }
    } else {
      if (
        status['android.permission.CAMERA'] === 'granted' &&
        status['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted'
      ) {
        permissions = true;
      }
    }
    return permissions;
  };

  openPicker = async () => {
    await this.requestPermission();
    const permissions = await this.checkPermission();
    if (permissions) {
      const {userId} = this.props;
      ImagePicker.openPicker({
        forceJpg: true,
        mediaType: 'photo',
      }).then((image) => {
        if (image.path && image.mime) {
          const name = image.path.replace(/^.*[\\\/]/, '');
          let data = new FormData();
          data.append('files', {
            uri: image.path,
            name: name,
            type: image.mime,
          });
          try {
            teamService.requestUploadImage(data).then((response) => {
              if (response.success) {
                const {data} = response;
                if (data.length > 0) {
                  const {uploadId} = data[0];
                  this.handleProcessEdit(true);
                  this.handleChange('userAvatar', uploadId);
                  try {
                    const dataAvatar = {
                      userId,
                      uploadId,
                    };
                    userService.updateAvatar(dataAvatar);
                  } catch (error) {}
                }
              }
            });
          } catch (error) {}
        }
      });
    }
  };

  handleChange = (key, value) => {
    let {profile} = this.state;
    if (key === 'userHeight' || key === 'userWeight') {
      profile[key] = parseFloat(value);
    }
    profile[key] = value;
    this.setState({
      isEditing: true,
      profile,
    });
  };

  showDatePicker = () => {
    this.handleProcessEdit(true);
    this.setDatePickerVisibility(true);
  };

  hideDatePicker = () => {
    this.setDatePickerVisibility(false);
  };

  handleConfirm = (birthDate) => {
    this.hideDatePicker();
    this.handleProcessEdit(true);
    let {profile} = this.state;
    profile.userBirthDay = moment(birthDate).format('DD/MM/YYYY');
    this.setState({
      profile,
    });
  };

  setDatePickerVisibility = (isOpenDateTime) => {
    this.setState({
      isOpenDateTime,
    });
  };

  handleProcessEdit = (isEditing) => {
    this.setState({
      isEditing,
    });
  };

  defineDateTimePicker = (birthDate) => {
    const split = birthDate.split('/');
    return new Date(split[2], split[1] - 1, split[0]);
  };

  handleSelectPreferred = (preferred, isHand) => {
    let {preferredSelect} = this.state;
    (preferredSelect.preferred = preferred),
      (preferredSelect.isHand = isHand),
      this.setState({
        preferredSelect,
      });
    this.bottomSheet.current.open();
  };

  resetPreferedSelect = () => {
    this.setState({
      preferredSelect: {},
    });
  };

  handleChangePreferred = (preferred) => {
    let {preferredSelect} = this.state;
    (preferredSelect.preferred = preferred),
      this.setState({
        preferredSelect,
      });
  };

  changePreferred = () => {
    this.handleProcessEdit(true);
    let {preferredSelect, profile} = this.state;
    const {preferred, isHand} = preferredSelect;
    if (isHand) {
      profile.userPreferredHand = preferred;
    } else {
      profile.userPreferredFoot = preferred;
    }

    this.setState({
      profile,
    });
    this.resetPreferedSelect();
    this.bottomSheet.current.close();
  };

  renderUserAchievements = () => {
    const {profile} = this.state;
    const {userAchievements} = profile;
    let html = [];
    if (userAchievements && userAchievements.length > 0) {
      userAchievements.forEach((item, index) => {
        const {
          userAchievementName,
          userAchievementSport,
          userAchievementTime,
        } = item;
        html.push(
          <Block key={index} row style={Style.itemAchievement}>
            <Block flex={false} style={{width: '90%', paddingRight: 10}}>
              <Text bold primary size={13.5}>
                {userAchievementName ? userAchievementName : ''}
              </Text>
              <Block row flex={false} space="between">
                <Text size={13.5}>
                  {userAchievementTime ? userAchievementTime : ''}
                </Text>
                <Text size={13.5}>
                  {userAchievementSport ? userAchievementSport : ''}
                </Text>
              </Block>
            </Block>
            <Block flex={false} style={{width: '10%'}} center middle>
              <TouchableOpacity
                onPress={() => this.handleDeleteUserAchievement(index)}>
                <Icon name="close" size={25} color={Colors.primary} />
              </TouchableOpacity>
            </Block>
          </Block>,
        );
      });
    }

    return html;
  };

  addUserAchievements = () => {
    let {
      userAchievementName,
      userAchievementSport,
      userAchievementTime,
      profile,
    } = this.state;
    let msgErrorAchive = '';
    if (userAchievementName.trim() === '') {
      msgErrorAchive = strings('msg_error_require_achievement_name');
    } else if (userAchievementName.length > 50) {
      msgErrorAchive = strings('msg_error_length_achievement_name');
    } else if (userAchievementSport.trim() === '') {
      msgErrorAchive = strings('msg_error_require_achievement_sport');
    } else if (userAchievementSport.length > 30) {
      msgErrorAchive = strings('msg_error_length_achievement_sport');
    } else if (userAchievementTime.trim() === '') {
      msgErrorAchive = strings('msg_error_require_achievement_time_session');
    } else if (userAchievementTime.length > 30) {
      msgErrorAchive = strings('msg_error_length_achievement_time_session');
    } 

    if (msgErrorAchive === '') {
      this.handleProcessEdit(true);
      if (profile.userAchievements) {
        profile.userAchievements.push({
          userAchievementName,
          userAchievementSport,
          userAchievementTime,
        });
      } else {
        profile.userAchievements = [
          {
            userAchievementName,
            userAchievementSport,
            userAchievementTime,
          },
        ];
      }

      this.setState({
        profile,
        userAchievementName: '',
        userAchievementSport: '',
        userAchievementTime: '',
      });
    } else {
      this.setState({
        msgErrorAchive,
      });
    }
  };

  handleDeleteUserAchievement = (index) => {
    let {profile} = this.state;
    let {userAchievements} = profile;
    userAchievements.splice(index, 1);
    profile.userAchievements = userAchievements;
    this.handleProcessEdit(true);
    this.setState({
      profile,
    });
  };

  handleUpdateProfile = () => {
    const {profile} = this.state;
    let msgError = '';
    const {userActions, userId, navigation} = this.props;
    this.setState({
      loading: true,
    });

    if (!profile.userFullName || profile.userFullName.length === 0) {
      msgError = strings('msg_error_require_your_name');
    } else if (profile.userFullName.length > 50 ) {
        msgError = strings('msg_error_length_your_name');
    } else if (!profile.userAddress || profile.userAddress.length === 0) {
      msgError = strings('msg_error_require_your_address');
    } else if (profile.userAddress.length > 255) {
      msgError = strings('msg_error_length_your_address');
    } else if (!profile.userShortIntroduction || profile.userShortIntroduction.length === 0) {
      msgError = strings('msg_error_require_short_introduction');
    } else if (profile.userShortIntroduction.length > 200) {
      msgError = strings('msg_error_length_your_short_introduction');
    } else if (!profile.userHeight || profile.userHeight.length === 0) {
      msgError = strings('msg_error_require_your_hight');
    } else if (profile.userHeight.length > 3) {
      msgError = strings('msg_error_length_your_hight');
    } else if (!profile.userWeight || profile.userWeight.length === 0) {
      msgError = strings('msg_error_require_your_weight');
    } else if (profile.userWeight.length > 3) {
      msgError = strings('msg_error_length_your_weight');
    }

    if (msgError === '') {
      try {
        userService.updateProfile(profile).then((response) => {
          const {message} = response;
          this.setState({
            loading: false,
          });
          if (response.success) {
            userActions.fetchProfile(userId);
            navigation.navigate(Screens.PROFILE);
          } else {
            this.setState({
              msgNotification: message,
              isOpen: true,
            });
          }
        });
      } catch (error) {
        this.setState({
          loading: false,
          isOpen: true,
          msgNotification: strings(msg_update_profile_failed),
        });
      }
    } else {
      this.setState({
        msgError,
        loading: false,
      });
    }
  };

  render() {
    const {navigation} = this.props;
    const {
      loading,
      profile,
      msgError,
      msgErrorAchive,
      isOpen,
      msgNotification,
      isOpenDateTime,
      preferredSelect,
      userAchievementName,
      userAchievementSport,
      userAchievementTime,
    } = this.state;
    const {
      userAvatar,
      userFullName,
      userBirthDay,
      userAddress,
      userShortIntroduction,
      userHeight,
      userWeight,
      userPreferredHand,
      userPreferredFoot,
    } = profile;
    const imageUrl = `${Config.GET_IMAGE_URL}${userAvatar}`;
    const dateTimePicker = userBirthDay
      ? this.defineDateTimePicker(userBirthDay)
      : new Date();

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{flex: 1}}>
        <Block style={Style.view}>
          <Header
            title={strings('edit_profile')}
            isShowBack
            navigation={navigation}
            rightIcon={
              <TouchableOpacity
                onPress={() => this.handleUpdateProfile()}
                style={{paddingVertical: 15}}>
                {loading ? (
                  <Loading size="small" color={Colors.white} />
                ) : (
                  <Text style={Style.headerRight}>Save</Text>
                )}
              </TouchableOpacity>
            }
          />
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{...ApplicationStyles.paddingHorizontalView}}>
            <Block marginTop={12} center>
              <Image
                source={
                  userAvatar ? {uri: imageUrl} : Images.team_profile_avatar
                }
                style={{width: 116, height: 116, borderRadius: 65}}
              />
              <Block style={Style.viewChangeAvatar} />
              <Block style={Style.viewIcon}>
                <Icon
                  name="camera"
                  size={22}
                  color={'white'}
                  onPress={() => this.openPicker()}
                />
              </Block>
            </Block>
            {msgError !== '' && (
              <Text error size={13.5}>
                {msgError}
              </Text>
            )}
            <Text bold size={13.5}>
              Name
            </Text>
            <Input
              style={Style.input}
              onChangeText={(text) => this.handleChange('userFullName', text)}
              value={userFullName ? userFullName : ''}
            />
            <Text bold size={13.5} style={Style.textTop}>
              Date of Birth
            </Text>
            <TextSelect
              selectStyles={Style.textSelect}
              size={13.5}
              onSelect={() =>
                this.setState({
                  isOpenDateTime: true,
                })
              }
              style={{...ApplicationStyles.fontMPLUS1pRegular}}>
              {userBirthDay ? userBirthDay : moment().format('DD/MM/YYYY')}
            </TextSelect>
            <Text bold size={13.5} style={Style.textTop}>
              Address
            </Text>
            <Input
              style={Style.input}
              onChangeText={(text) => this.handleChange('userAddress', text)}
              value={userAddress ? userAddress : ''}
            />
            <Text bold size={13.5} style={Style.textTop}>
              Short Introduction
            </Text>
            <Input
              textAlignVertical={'top'}
              multiline
              style={[
                Style.input,
                {height: 90},
                {
                  paddingHorizontal:
                    ApplicationStyles.paddingLeftInput.paddingLeft,
                },
              ]}
              onChangeText={(text) =>
                this.handleChange('userShortIntroduction', text)
              }
              value={userShortIntroduction ? userShortIntroduction : ''}
            />
            <Block flex={false} row space="between">
              <Block flex={false} style={{width: '48%'}}>
                <Text bold size={13.5} style={Style.textTop}>
                  Height (cm)
                </Text>
                <Input
                  style={Style.input}
                  onChangeText={(text) => this.handleChange('userHeight', text)}
                  value={userHeight ? userHeight.toString() : ''}
                  number
                />
              </Block>
              <Block flex={false} style={{width: '48%'}}>
                <Text bold size={13.5} style={Style.textTop}>
                  Weight (kg)
                </Text>
                <Input
                  style={Style.input}
                  onChangeText={(text) => this.handleChange('userWeight', text)}
                  value={userWeight ? userWeight.toString() : ''}
                  number
                />
              </Block>
            </Block>
            <Block flex={false} row space="between">
              <Block flex={false} style={{width: '48%'}}>
                <Text bold size={13.5} style={Style.textTop}>
                  Preferred Hand
                </Text>
                <TextSelect
                  selectStyles={Style.textSelect}
                  size={13.5}
                  onSelect={() =>
                    this.handleSelectPreferred(userPreferredHand, true)
                  }
                  style={{...ApplicationStyles.fontMPLUS1pRegular}}>
                  {userPreferredHand && userPreferredHand === 'right'
                    ? 'RIGHT'
                    : userPreferredHand === 'left'
                    ? 'LEFT'
                    : 'BOTH'}
                </TextSelect>
              </Block>
              <Block flex={false} style={{width: '48%'}}>
                <Text bold size={13.5} style={Style.textTop}>
                  Preferred Foot
                </Text>
                <TextSelect
                  selectStyles={Style.textSelect}
                  size={13.5}
                  onSelect={() =>
                    this.handleSelectPreferred(userPreferredFoot, false)
                  }
                  style={{...ApplicationStyles.fontMPLUS1pRegular}}>
                  {userPreferredFoot && userPreferredFoot === 'right'
                    ? 'RIGHT'
                    : userPreferredFoot === 'left'
                    ? 'LEFT'
                    : 'BOTH'}
                </TextSelect>
              </Block>
            </Block>
            <Text bold size={13.5} style={Style.textTop}>
              CARRER ACHIEVEMENTS
            </Text>
            {msgErrorAchive !== '' && (
              <Text error size={13.5}>
                {msgErrorAchive}
              </Text>
            )}
            <Block flex={false} row space="between">
              <Block flex={false} style={{width: '48%'}}>
                <Input
                  style={Style.input}
                  onChangeText={(text) =>
                    this.setState({
                      userAchievementName: text,
                      msgErrorAchive: '',
                    })
                  }
                  value={userAchievementName ? userAchievementName : ''}
                  placeholder="Achievement"
                />
              </Block>
              <Block flex={false} style={{width: '48%'}}>
                <Input
                  style={Style.input}
                  onChangeText={(text) =>
                    this.setState({
                      userAchievementSport: text,
                      msgErrorAchive: '',
                    })
                  }
                  value={userAchievementSport ? userAchievementSport : ''}
                  placeholder="Sport"
                />
              </Block>
            </Block>
            <Block flex={false} row space="between" style={{marginTop: 5}}>
              <Block flex={false} style={{width: '48%'}}>
                <Input
                  style={Style.input}
                  onChangeText={(text) =>
                    this.setState({
                      userAchievementTime: text,
                      msgErrorAchive: '',
                    })
                  }
                  value={userAchievementTime ? userAchievementTime : ''}
                  placeholder="Time/Session"
                />
              </Block>
              <Block flex={false} style={{width: '48%'}}>
                <TouchableOpacity
                  style={Style.buttonAdd}
                  onPress={() => this.addUserAchievements()}>
                  <Text center>
                    <Icon name="plus" size={20} color={Colors.white} />
                  </Text>
                </TouchableOpacity>
              </Block>
            </Block>
            <Block flex={false} style={Style.textTop}>
              {this.renderUserAchievements()}
            </Block>
          </ScrollView>
          <DateTimePicker
            isOpen={isOpenDateTime}
            mode="date"
            onConfirm={this.handleConfirm}
            onCancel={this.hideDatePicker}
            date={dateTimePicker}
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
          <BottomSheet
            animated={true}
            ref={this.bottomSheet}
            style={{
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}>
            <Block style={{padding: 20}}>
              <Block center flex={false} row space="between">
                <TouchableOpacity
                  onPress={() => {
                    this.resetPreferedSelect();
                    this.bottomSheet.current.close();
                  }}>
                  <Text size={13.5}>Cancel</Text>
                </TouchableOpacity>
                <Text size={14} bold>{`Change Prefered ${
                  preferredSelect.isHand ? 'Hand' : 'Foot'
                }`}</Text>
                <TouchableOpacity onPress={() => this.changePreferred()}>
                  <Text size={13.5}>Done</Text>
                </TouchableOpacity>
              </Block>
              <TouchableOpacity
                style={{marginVertical: 15}}
                onPress={() => this.handleChangePreferred('right')}>
                <Block flex={false} center row>
                  <CheckBox
                    checked={preferredSelect.preferred === 'right'}
                    onSelected={() => this.handleChangePreferred('right')}
                  />
                  <Text size={13} style={Style.textPreferred}>
                    RIGHT
                  </Text>
                </Block>
              </TouchableOpacity>
              <TouchableOpacity
                style={{marginVertical: 15}}
                onPress={() => this.handleChangePreferred('left')}>
                <Block flex={false} center row>
                  <CheckBox
                    checked={preferredSelect.preferred === 'left'}
                    onSelected={() => this.handleChangePreferred('left')}
                  />
                  <Text size={13} style={Style.textPreferred}>
                    LEFT
                  </Text>
                </Block>
              </TouchableOpacity>
              <TouchableOpacity
                style={{marginVertical: 15}}
                onPress={() => this.handleChangePreferred('both')}>
                <Block flex={false} center row>
                  <CheckBox
                    checked={preferredSelect.preferred === 'both'}
                    onSelected={() => this.handleChangePreferred('both')}
                  />
                  <Text size={13} style={Style.textPreferred}>
                    BOTH
                  </Text>
                </Block>
              </TouchableOpacity>
            </Block>
          </BottomSheet>
        </Block>
      </KeyboardAvoidingView>
    );
  }
}

EditProfileScreen.defaultProps = {};

EditProfileScreen.propTypes = {
  userActions: PropTypes.object,
  userId: PropTypes.string,
  profile: PropTypes.object,
};

const mapStateToProps = (state) => ({
  errorCode: state.user.errorCode,
  userId: state.user.userId,
  profile: state.user.profile,
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfileScreen);
