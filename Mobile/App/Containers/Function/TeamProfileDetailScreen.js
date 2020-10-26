/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import Style from './TeamProfileDetailScreenStyle';
import {strings} from '../../Locate/I18n';
import LinearGradient from 'react-native-linear-gradient';
import {Images, ApplicationStyles, Colors} from '../../Theme';
import {Config} from '../../Config/index';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-easy-toast';
import {teamService} from '../../Services/TeamService';
import TeamActions from '../../Stores/Team/Actions';
import {
  PERMISSIONS,
  requestMultiple,
  checkMultiple,
} from 'react-native-permissions';
import {
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import {
  Button,
  Block,
  Text,
  Header,
  Input,
  Loading,
  ModalNotifcation,
} from '../../Components';
import UserActions from '../../Stores/User/Actions';
import {Constants} from '../../Utils/constants';
import {timeConverter} from '../../Utils/commonFunction';
import {Screens} from '../../Utils/screens';
class TeamProfileDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      team: {},
      headerBarName: '',
      errorCode: '',
      msgError: '',
      isCreate: true,
      isOpen: false,
      isLeave: false,
      loading: false,
      isEditing: false,
      isAdmin: false,
      isOpenModalUpdate: false,
      isOpenModalLeave: false,
      activeTeam: null,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {errorCode, team, headerBarName, navigation} = nextProps;
    const {activeTeam} = navigation.state.params;
    const data = {errorCode, headerBarName, activeTeam};
    const {isEditing} = prevState;
    const adminRole = team.teamMemberRole;
    data.isAdmin = adminRole === Constants.TEAM_ADMIN ? true : false;
    if (!isEditing) {
      data.team = JSON.parse(JSON.stringify(team));
    }
    return data;
  }

  componentDidMount = async () => {
    const {teamActions, userId} = this.props;
    const {activeTeam} = this.state;
    teamActions.fetchTeam(activeTeam, userId);
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

  renderListUser = (isCheckAdmin, listObject) => {
    const {navigation, userId} = this.props;
    let listHtmlMembers = [];
    let leftItem = 0;
    if (listObject && listObject.length > 0) {
      const listUser = listObject.slice(0, 7);
      listUser.forEach((item, index) => {
        const imageUrl = `${Config.GET_IMAGE_URL}${
          item.userAvatar ? item.userAvatar : Images.memberOne
        }`;
        leftItem = index * 40;
        listHtmlMembers.push(
          <Block style={Style.containerBlock} key={index}>
            <Block
              style={[
                Style.blockMember,
                {left: leftItem, backgroundColor: Colors.gray3},
              ]}>
              <TouchableOpacity
                onPress={() =>
                  userId == item.userId
                    ? navigation.navigate(Screens.PROFILE)
                    : navigation.navigate(Screens.PROFILE_MEMBER, {
                        userId: item.userId,
                      })
                }>
                <Image source={{uri: imageUrl}} style={Style.viewImageAvatar} />
              </TouchableOpacity>
            </Block>
          </Block>,
        );
      });
    }

    return <Block style={Style.viewBlockMember}>{listHtmlMembers}</Block>;
  };

  handleModalUpdate = (isOpen) => {
    this.setState({
      isOpenModalUpdate: isOpen,
    });
    const {team} = this.state;
    const {teamActions, userId} = this.props;
    teamActions.fetchTeam(team.teamId, userId);
  };

  handleModalLeaveTeam = (isOpen) => {
    this.setState({
      isOpenModalLeave: isOpen,
    });
    const {team} = this.state;
    const {teamActions, userId} = this.props;
    teamActions.fetchTeam(team.teamId, userId);
  };

  handleLoading = (loading) => {
    this.setState({
      loading,
    });
  };

  handleRequestUpdateTeam = async () => {
    Keyboard.dismiss();
    this.handleLoading(true);
    let msgError = '';
    const {team} = this.state;
    const {
      teamId,
      teamAvatar,
      teamName,
      teamSlogan,
      teamAddress,
      teamNational,
      teamMail,
      teamDescription,
      teamShortName,
    } = team;
    const data = {
      teamId,
      teamAvatar,
      teamName,
      teamSlogan,
      teamAddress,
      teamNational,
      teamMail,
      teamDescription,
      teamShortName,
    };
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (data.sportId === '') {
      msgError = strings('msg_error_require_sport_name');
    } else if (data.teamName === '') {
      msgError = strings('msg_error_require_team_name');
    } else if (data.teamName.length < 4) {
      msgError = strings('msg_error_minimum_length_team_name'); 
    } else if (data.teamName.length > 30) {
      msgError = strings('msg_error_maximum_length_team_name');
    } else if (data.teamMail === '') {
      msgError = strings('msg_error_require_teammail');
    } else if (!regex.exec(data.teamMail)) {
      msgError = strings('msg_error_format_teammail');
    }

    this.setState({msgError});
    if (msgError === '') {
      try {
        teamService.requestUpdate(data).then((response) => {
          this.handleLoading(false);
          if (response.success) {
          } else {
            const {message} = response;
            const {messageError} = message ? message : strings('update_failed');
            this.refs.toastFailed.show(messageError, DURATION.LENGTH_LONG);
          }
        });
      } catch (error) {
        this.refs.toastFailed.show(strings('update_failed'), DURATION.LENGTH_LONG);
        this.handleLoading(false);
      }
    } else {
      this.handleLoading(false);
    }
  };

  handleRequestLeaveTeam = () => {
    this.handleModalLeaveTeam(false);
    const {team} = this.state;
    const {userId, teamActions, userActions, navigation} = this.props;
    const {teamId} = team;
    const data = {
      userId,
      teamId,
    };
    try {
      teamService.requetLeaveTeam(data).then((response) => {
        if (response.success) {
          teamActions.fetchTeam(teamId, userId);
          userActions.fetchProfile(userId);
          teamActions.fetchTeamUserJoined(userId);
          navigation.navigate(Screens.SWITCH_TEAM);
        } else {
          const {message} = response;
          const {messageError} = message ? message : strings('leave_team_failed');
          this.refs.toastFailed.show(messageError, DURATION.LENGTH_LONG);
        }
      });
    } catch (error) {
      this.refs.toastFailed.show(strings('leave_team_failed'), DURATION.LENGTH_LONG);
    }
  };

  openPicker = async () => {
    await this.requestPermission();
    const permissions = await this.checkPermission();
    if (permissions) {
      const {team} = this.props;
      const {teamId} = team;
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

          teamService
            .requestUploadImage(data)
            .then((response) => {
              if (response.success) {
                const {data} = response;
                if (data.length > 0) {
                  const {uploadId} = data[0];
                  this.handleChange('teamAvatar', uploadId);
                  try {
                    const dataAvatar = {
                      teamId,
                      uploadId,
                    };
                    teamService.updateAvatar(dataAvatar).then(() => {});
                  } catch (error) {}
                }
              } else {
                this.refs.toastFailed.show(
                  strings('msg_upload_image_failed'),
                  DURATION.LENGTH_LONG,
                );
              }
            })
            .catch(() =>
              this.refs.toastFailed.show(
                strings('msg_upload_image_failed'),
                DURATION.LENGTH_LONG,
              ),
            );
        }
      });
    }
  };

  navigateMemberList = () => {
    this.handleModalLeaveTeam(false);
    const {navigation} = this.props;
    const {team} = this.state;
    navigation.navigate(Screens.MEMBER_LIST, {teamId: team.teamId});
  };

  handleChange = (key, value) => {
    let {team} = this.state;
    team[key] = value;
    this.setState({
      isEditing: true,
      team,
    });
  };

  render() {
    const {
      team,
      headerBarName,
      loading,
      isAdmin,
      isOpenModalLeave,
      msgError,
    } = this.state;
    const {navigation} = this.props;
    const gradientColor = ['#C09939', '#E8D492', '#ECDC9D', '#C49941'];
    const totalMember =
      team.userMember && team.userMember.length ? team.userMember.length : 0;
    const totalAdmin =
      team.userAdmin && team.userAdmin.length ? team.userAdmin.length : 0;
    const imageUrl = `${Config.GET_IMAGE_URL}${
      team.teamAvatar ? team.teamAvatar : ''
    }`;
    const createDate = timeConverter(
      team.createdDate ? team.createdDate : '',
      'LL',
    );
    const {
      teamName,
      teamSlogan,
      teamAddress,
      teamNational,
      teamMail,
      teamDescription,
      sportName,
      teamRankName,
      teamId,
      teamShortName,
    } = team;

    return (
      <Block>
        <Header
          title={headerBarName}
          isShowBack
          navigation={navigation}
          rightIcon={
            isAdmin ? (
              <TouchableOpacity
                style={{marginRight: 5, paddingVertical: 15}}
                onPress={() => {
                  this.handleRequestUpdateTeam();
                }}>
                {loading ? (
                  <Loading size="small" color={Colors.white} />
                ) : (
                  <Text center style={[Style.headerRight, {width: '100%'}]}>
                    Save
                  </Text>
                )}
              </TouchableOpacity>
            ) : null
          }
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Block style={Style.view}>
            <Block column style={Style.viewContainer}>
              <Block column>
                <Text style={Style.title}>Profile Picture</Text>
                <Block marginTop={12}>
                  <Image
                    source={
                      team.teamAvatar
                        ? {uri: imageUrl}
                        : Images.team_profile_avatar
                    }
                    style={{width: 116, height: 116, borderRadius: 65}}
                  />
                  <Block style={Style.viewChangeAvatar} />
                  <Block style={Style.viewIcon}>
                    <Icon
                      name="camera"
                      size={22}
                      color={'white'}
                      onPress={() => (isAdmin ? this.openPicker() : null)}
                    />
                  </Block>
                </Block>
                {msgError !== '' && (
                  <Text
                    error
                    center
                    style={{
                      ...ApplicationStyles.fontMPLUS1pBold,
                      fontSize: 13.5,
                    }}>
                    {msgError}
                  </Text>
                )}
              </Block>
              <KeyboardAvoidingView
                behavior={Platform.OS == 'ios' ? 'padding' : null}
                style={{flex: 1}}>
                <Block column style={Style.viewElement}>
                  <Text style={Style.title}>Sport</Text>
                  {this.state.isCreate ? (
                    <Text
                      style={{
                        fontSize: 13.5,
                        color: Colors.gray6,
                        marginTop: 7,
                        marginLeft: 15,
                      }}>
                      {sportName ? sportName : ''}
                    </Text>
                  ) : (
                    //Case Role Admin
                    <Input
                      placeholderTextColor={Colors.placeholder}
                      placeholder={strings('enter_sport')}
                      style={Style.subTitle}
                      textAlignVertical={'top'}
                    />
                  )}
                </Block>
                <Block style={Style.viewElement}>
                  <Text style={Style.title}>Name</Text>
                  <Input
                    editable={isAdmin}
                    placeholderTextColor={Colors.placeholder}
                    placeholder={strings('enter_name')}
                    style={Style.subTitle}
                    textAlignVertical={'top'}
                    onChangeText={(text) => this.handleChange('teamName', text)}
                    value={teamName ? teamName : ''}
                  />
                </Block>
                <Block style={Style.viewElement}>
                  <Text style={Style.title}>Short Name</Text>
                  <Input
                    editable={isAdmin}
                    placeholderTextColor={Colors.placeholder}
                    placeholder={strings('enter_sport_name')}
                    style={Style.subTitle}
                    textAlignVertical={'top'}
                    onChangeText={(text) =>
                      this.handleChange('teamShortName', text)
                    }
                    value={teamShortName ? teamShortName : ''}
                  />
                </Block>
                <Block style={Style.viewElement}>
                  <Text style={Style.title}>Slogan</Text>
                  <Input
                    editable={isAdmin}
                    placeholderTextColor={Colors.placeholder}
                    placeholder={strings('enter_slogan')}
                    style={Style.subTitle}
                    textAlignVertical={'top'}
                    onChangeText={(text) =>
                      this.handleChange('teamSlogan', text)
                    }
                    value={teamSlogan ? teamSlogan : ''}
                  />
                </Block>
                <Block style={Style.viewElement}>
                  <Text style={Style.title}>Location</Text>
                  <Input
                    editable={isAdmin}
                    placeholderTextColor={Colors.placeholder}
                    placeholder={strings('enter_location')}
                    style={Style.subTitle}
                    textAlignVertical={'top'}
                    onChangeText={(text) => {
                      this.handleChange('teamAddress', text);
                    }}
                    value={teamAddress ? teamAddress : ''}
                  />
                </Block>
                <Block style={Style.viewElement}>
                  <Text style={Style.title}>National</Text>
                  <Input
                    editable={isAdmin}
                    placeholderTextColor={Colors.placeholder}
                    placeholder={strings('enter_national')}
                    style={Style.subTitle}
                    textAlignVertical={'top'}
                    onChangeText={(text) => {
                      this.handleChange('teamNational', text);
                    }}
                    value={teamNational ? teamNational : ''}
                  />
                </Block>
                <Block style={Style.viewElement}>
                  <Text style={Style.title}>Email</Text>
                  <Input
                    editable={isAdmin}
                    height={40}
                    placeholderTextColor={Colors.placeholder}
                    placeholder={strings('enter_email')}
                    style={Style.subTitle}
                    textAlignVertical={'top'}
                    onChangeText={(text) => {
                      this.handleChange('teamMail', text);
                    }}
                    value={teamMail ? teamMail : ''}
                  />
                </Block>
                <Block style={Style.viewElement}>
                  <Text style={Style.title}>About us</Text>
                  <Input
                    editable={isAdmin}
                    placeholderTextColor={Colors.placeholder}
                    placeholder={strings('enter_bios')}
                    style={[
                      Style.textArea,
                      {
                        paddingHorizontal:
                          ApplicationStyles.paddingLeftInput.paddingLeft,
                      },
                    ]}
                    textAlignVertical={'top'}
                    multiline
                    onChangeText={(text) => {
                      this.handleChange('teamDescription', text);
                    }}
                    value={teamDescription ? teamDescription : ''}
                  />
                </Block>
              </KeyboardAvoidingView>
              <Block style={Style.viewElement}>
                <Text style={Style.title}>Rank</Text>
                <Block row center>
                  <LinearGradient
                    style={{borderRadius: 18}}
                    colors={gradientColor}
                    start={{x: 0, y: 0}}
                    end={{x: 0.6, y: 1}}>
                    <Icon
                      name="credit-card"
                      color={Colors.background}
                      size={60}
                      style={Style.creditCard}
                    />
                  </LinearGradient>

                  <Block column margin={[0, 0, 0, 13]}>
                    <Text style={Style.textPlatinum}>
                      {teamRankName ? teamRankName : ''}
                    </Text>
                    <Button
                      disabled={isAdmin ? false : true}
                      error
                      style={Style.btnUpgrade}
                      onPress={() => navigation.navigate(Screens.UPGRADE_TEAM)}>
                      <Text
                        center
                        color={Colors.white}
                        style={{
                          ...ApplicationStyles.fontMPLUS1pBold,
                          fontSize: 13,
                        }}>
                        Upgrade
                      </Text>
                    </Button>
                  </Block>
                </Block>
              </Block>
              {this.state.isCreate ? (
                <Block>
                  <Block
                    row
                    margin={[31, 0, 0, 0]}
                    style={{alignItems: 'center'}}>
                    <Text style={Style.title}>Member ({totalMember})</Text>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate(Screens.MEMBER_LIST, {teamId})
                      }>
                      <Text style={Style.btnSeeAll}>See all</Text>
                    </TouchableOpacity>
                  </Block>
                  {this.renderListUser(false, team.userMember)}
                  <Block row margin={[15, 0, 0, 0]}>
                    <Text style={Style.title}>Admin ({totalAdmin})</Text>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate(Screens.MEMBER_LIST, {teamId})
                      }>
                      <Text style={Style.btnSeeAll}>See all</Text>
                    </TouchableOpacity>
                  </Block>
                  {this.renderListUser(true, team.userAdmin)}
                  <Block row margin={[15, 0, 0, 0]}>
                    <Text style={Style.title}>History</Text>
                  </Block>
                  <Block style={Style.viewBlockAvatar}>
                    <Text style={Style.textHistory}>
                      Team created on {createDate}
                    </Text>
                  </Block>
                  <Button
                    disabled={!team.teamMemberRole ? true : false}
                    style={Style.btnSignOut}
                    onPress={() => {
                      this.handleModalLeaveTeam(true);
                    }}>
                    <Block
                      style={{paddingLeft: 10, paddingRight: 10}}
                      row
                      center>
                      <Text style={Style.textBtnSignOut}>Leave team</Text>
                      <Icon name="sign-out" size={26} color={Colors.white} />
                    </Block>
                  </Button>
                </Block>
              ) : null}
            </Block>
          </Block>
          <Toast
            ref="toastFailed"
            style={{backgroundColor: Colors.error}}
            position="top"
            positionValue={200}
            fadeInDuration={750}
            fadeOutDuration={1000}
            opacity={0.8}
          />
        </ScrollView>
        <ModalNotifcation
          isConfirm
          message={
            totalAdmin >= 2 || team.teamMemberRole == Constants.TEAM_MEMBER
              ? strings('msg_are_you_sure_to_leave_the_team')
              : strings('msg_you_are_the_last_admin_you_must_be_assign_new_admin')
          }
          isOpen={isOpenModalLeave}
          onAccept={() =>
            totalAdmin >= 2 || team.teamMemberRole == Constants.TEAM_MEMBER
              ? this.handleRequestLeaveTeam()
              : this.navigateMemberList()
          }
          onCancel={() => this.handleModalLeaveTeam(false)}
        />
      </Block>
    );
  }
}

TeamProfileDetailScreen.defaultProps = {};

TeamProfileDetailScreen.propTypes = {
  userActions: PropTypes.object,
  teamActions: PropTypes.object,
  userId: PropTypes.string,
  team: PropTypes.object,
  headerBarName: PropTypes.string,
};

const mapStateToProps = (state) => ({
  errorCode: state.user.errorCode,
  userId: state.user.userId,
  team: state.team.team,
  headerBarName: state.team.team.teamName,
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
  teamActions: bindActionCreators(TeamActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TeamProfileDetailScreen);
