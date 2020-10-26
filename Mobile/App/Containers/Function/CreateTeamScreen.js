/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import TeamActions from '../../Stores/Team/Actions';
import Style from './TeamProfileDetailScreenStyle';
import {ApplicationStyles, Colors} from '../../Theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-crop-picker';
import {
  PERMISSIONS,
  requestMultiple,
  checkMultiple,
} from 'react-native-permissions';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-easy-toast';
import {teamService} from '../../Services/TeamService';
import {Screens} from '../../Utils/screens';
import {strings} from '../../Locate/I18n';
import {Config} from '../../Config';
import {
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Button,
  Block,
  Text,
  Header,
  Input,
  ModalNotifcation,
  CheckBox,
  BottomSheet,
  Loading,
  TextSelect,
} from '../../Components';
const {height} = Dimensions.get('window');

class CreateTeamScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      errors: [],
      msgError: '',
      userId: {},
      teamAvatar: null,
      sportId: null,
      sportName: '',
      teamName: '',
      teamShortName: '',
      teamSlogan: '',
      teamAddress: '',
      teamNational: '',
      teamMail: '',
      teamDescription: '',
      msgNotification: '',
      isOpen: false,
      isCreateSuccess: false,
      uploadId: '',
      listSport: [],
      isEditing: false,
      isEditingSport: false,
      sportIdSelect: null,
      sportNameSelect: '',
    };
    this.bottomSheet = React.createRef();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {listSport} = nextProps;
    const {isEditing, isEditingSport} = prevState;
    const data = {listSport};
    if (!isEditing && listSport && listSport.length > 0) {
      data.sportName = listSport[0].sportName ? listSport[0].sportName : '';
      data.sportId = listSport[0].sportId ? listSport[0].sportId : null;
    }

    if (!isEditingSport && listSport && listSport.length > 0) {
      data.sportNameSelect = listSport[0].sportName
        ? listSport[0].sportName
        : '';
      data.sportIdSelect = listSport[0].sportId ? listSport[0].sportId : null;
    }

    return data;
  }

  componentDidMount = async () => {
    const {teamActions} = this.props;
    teamActions.fetchSports();
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
                  this.setState({teamAvatar: uploadId.toString()});
                }
              } else {
                this.refs.toastFailed.show(
                  strings('msg_upload_image_successfully'),
                  DURATION.LENGTH_LONG,
                );
              }
            })
            .catch(() =>
              this.refs.toastFailed.show(
                strings('msg_upload_image_unsuccessfully'),
                DURATION.LENGTH_LONG,
              ),
            );
        }
      });
    }
  };

  handleOpenSelectSport = () => {
    this.bottomSheet.current.open();
  };

  handleLoading = (loading) => {
    this.setState({
      loading,
    });
  };

  handleCreateTeam = async () => {
    let msgError = '';
    const {
      sportId,
      sportName,
      teamName,
      teamShortName,
      teamSlogan,
      teamAddress,
      teamNational,
      teamMail,
      teamDescription,
      teamAvatar,
    } = this.state;
    const data = {
      teamAvatar,
      sportId,
      teamName,
      teamShortName,
      teamSlogan,
      teamAddress,
      teamNational,
      teamMail,
      teamDescription,
    };

    this.handleLoading(true);
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (sportName === '') {
      msgError = strings('msg_error_require_sport_name');
    } else if (data.teamName.trim() === '') {
      msgError = strings('Error Required Team Name');
    } else if (data.teamName.length < 4) {
      msgError = strings('msg_error_minimum_length_team_name');
    } else if (data.teamName.length > 30) {
      msgError = strings('msg_error_maximum_length_team_name');
    } else if (data.teamShortName.trim() === '') {
      msgError = strings('msg_error_require_team_short_name');
    } else if (data.teamShortName.length > 10) {
      msgError = strings('msg_error_length_team_short_name');
    } else if (data.teamMail.trim() === '') {
      msgError = strings('msg_error_require_teammail');
    } else if (data.teamMail.length > 100) {
      msgError = strings('Maximum length TeamMail is 100 characters');
    } else if (!regex.exec(data.teamMail)) {
      msgError = strings('msg_error_format_teammail');
    } else if (data.teamNational.length > 100) {
      msgError = strings('msg_error_length_team_national');
    } else if (data.teamAddress.length > 100) {
      msgError = strings('msg_error_length_team_location');
    } else if (data.teamSlogan.length > 100) {
      msgError = strings('msg_error_length_team_slogan');
    }

    this.setState({msgError});
    if (msgError === '') {
      try {
        teamService.requestUpdate(data).then((response) => {
          this.handleLoading(false);
          if (response.success) {
            this.setState({
              msgNotification: strings('msg_create_team_successfully'),
              isOpen: true,
              isCreateSuccess: true,
            });
          } else {
            const {message} = response;
            this.setState({
              msgNotification: message,
              isOpen: true,
            });
          }
        });
      } catch (error) {
        this.handleLoading(false);
        this.setState({
          msgNotification: strings('msg_create_team_unsuccessfully'),
          isOpen: true,
        });
      }
    } else {
      this.handleLoading(false);
    }
  };

  handleCreateSuccess = () => {
    this.setState({
      teamAvatar: null,
      sportId: null,
      sportName: '',
      teamName: '',
      teamShortName: '',
      teamSlogan: '',
      teamAddress: '',
      teamNational: '',
      teamMail: '',
      teamDescription: '',
      uploadId: '',
      msgNotification: '',
      isOpen: false,
      isCreateSuccess: false,
    });
  };

  handleSelectSport = () => {
    const {sportIdSelect, sportNameSelect} = this.state;
    this.setState({
      isEditing: true,
      sportName: sportNameSelect,
      sportId: sportIdSelect,
    });
    this.bottomSheet.current.close();
  };

  handleClose = () => {
    const {sportId, sportName} = this.state;
    this.setState({
      isEditingSport: true,
      sportNameSelect: sportName,
      sportIdSelect: sportId,
    });
  };

  renderSports = () => {
    let {listSport, sportIdSelect} = this.state;
    let html = [];
    if (listSport && listSport.length > 0) {
      listSport.forEach((item) => {
        html.push(
          <TouchableOpacity
            style={{marginVertical: 15}}
            onPress={() => {
              this.setState({
                isEditingSport: true,
                sportNameSelect: item.sportName,
                sportIdSelect: item.sportId,
              });
            }}
            key={item.sportId}>
            <Block flex={false} row>
              <CheckBox
                checked={sportIdSelect === item.sportId}
                onSelected={() => {
                  this.setState({
                    isEditingSport: true,
                    sportNameSelect: item.sportName,
                    sportIdSelect: item.sportId,
                  });
                }}
              />
              <Text style={{paddingLeft: 10}}>{item.sportName}</Text>
            </Block>
          </TouchableOpacity>,
        );
      });
    }

    return (
      <Block style={{padding: 20}}>
        <Block center flex={false} row space="between">
          <TouchableOpacity
            onPress={() => {
              this.handleClose();
              this.bottomSheet.current.close();
            }}>
            <Text size={13.5}>Cancel</Text>
          </TouchableOpacity>
          <Text size={14} bold>
            {strings('select_sport')}
          </Text>
          <TouchableOpacity onPress={() => this.handleSelectSport()}>
            <Text size={13.5}>Done</Text>
          </TouchableOpacity>
        </Block>
        <ScrollView showsVerticalScrollIndicator={false}>{html}</ScrollView>
      </Block>
    );
  };

  genTeamShortName = (teamName) => {
    teamName = teamName.replace(/\s+/g, ' ').trim();
    let word = teamName.split(' ');
    let shortName = '';

    if (word.length === 1) {
      shortName = word[0].substring(0, 3).toUpperCase();
      this.setState({teamShortName: shortName});
    } else if (word.length === 2) {
      shortName =
        word[0].substring(0, 2).toUpperCase() +
        word[1].substring(0, 1).toUpperCase();
      this.setState({teamShortName: shortName});
    } else if (word.length > 2) {
      shortName =
        word[0].substring(0, 1).toUpperCase() +
        word[1].substring(0, 1).toUpperCase() +
        word[2].substring(0, 1).toUpperCase();
      this.setState({teamShortName: shortName});
    }
  };

  render() {
    const {navigation, teamActions, userId} = this.props;
    const {
      loading,
      msgError,
      teamAvatar,
      sportName,
      teamName,
      teamShortName,
      teamSlogan,
      teamAddress,
      teamNational,
      teamMail,
      teamDescription,
      msgNotification,
      isOpen,
      isCreateSuccess,
    } = this.state;
    const gradientColor = [
      Colors.gray1,
      Colors.gray1,
      Colors.gray1,
      Colors.gray1,
    ];
    const imageUrl = `${Config.GET_IMAGE_URL}${teamAvatar}`;

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : null}
        style={{flex: 1}}>
        <Block style={Style.view}>
          <Header
            title={strings('create_a_team')}
            isShowBack
            navigation={navigation}
            rightIcon={
              <TouchableOpacity onPress={() => this.handleCreateTeam()}>
                {loading ? (
                  <Loading size="small" color={Colors.white} />
                ) : (
                  <Text style={Style.headerRight}>{strings('create')}</Text>
                )}
              </TouchableOpacity>
            }
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{...ApplicationStyles.paddingHorizontalView}}>
            <Text style={Style.title}>{strings('profile_picture')}</Text>
            <Block marginTop={12}>
              <Image
                source={{uri: imageUrl}}
                style={{
                  width: 116,
                  height: 116,
                  borderRadius: 65,
                }}
              />
              <Block style={Style.viewChangeAvatar} />
              <TouchableOpacity
                style={Style.viewIcon}
                onPress={() => this.openPicker()}>
                <Icon name="camera" size={22} color={'white'} />
              </TouchableOpacity>
            </Block>

            {msgError !== '' && (
              <Text
                error
                center
                style={{
                  marginTop: 10,
                  ...ApplicationStyles.fontMPLUS1pBold,
                  fontSize: 13.5,
                }}>
                {msgError}
              </Text>
            )}

            <Text style={Style.title}>{strings('sport')}</Text>
            <TextSelect
              selectStyles={[Style.subTitle, {backgroundColor: Colors.gray14}]}
              size={13.5}
              onSelect={() => this.handleOpenSelectSport()}
              style={{...ApplicationStyles.fontMPLUS1pRegular}}>
              {sportName ? sportName : ''}
            </TextSelect>

            <Text style={Style.title}>{strings('name')}</Text>
            <Input
              placeholderTextColor={Colors.placeholder}
              placeholder={strings('enter_name')}
              style={Style.subTitle}
              textAlignVertical={'top'}
              onChangeText={(teamName) => {
                this.setState({teamName});
                this.genTeamShortName(teamName);
              }}
              value={teamName}
            />

            <Text style={Style.title}>{strings('short_name')}</Text>
            <Input
              editable={teamName === '' ? false : true}
              placeholderTextColor={Colors.placeholder}
              placeholder={strings('team_short_name')}
              style={Style.subTitle}
              textAlignVertical={'top'}
              onChangeText={(teamShortName) => {
                this.setState({teamShortName});
              }}
              value={teamShortName}
            />

            <Text style={Style.title}>{strings('slogan')}</Text>
            <Input
              placeholderTextColor={Colors.placeholder}
              placeholder={strings('enter_slogan')}
              style={Style.subTitle}
              textAlignVertical={'top'}
              onChangeText={(teamSlogan) => {
                this.setState({teamSlogan});
              }}
              value={teamSlogan}
            />

            <Text style={Style.title}>{strings('location')}</Text>
            <Input
              placeholderTextColor={Colors.placeholder}
              placeholder={strings('enter_location')}
              style={Style.subTitle}
              textAlignVertical={'top'}
              onChangeText={(teamAddress) => {
                this.setState({teamAddress});
              }}
              value={teamAddress}
            />

            <Text style={Style.title}>{strings('national')}</Text>
            <Input
              placeholderTextColor={Colors.placeholder}
              placeholder={strings('enter_national')}
              style={Style.subTitle}
              textAlignVertical={'top'}
              onChangeText={(teamNational) => {
                this.setState({teamNational});
              }}
              value={teamNational}
            />

            <Text style={Style.title}>{strings('email')}</Text>
            <Input
              email
              height={40}
              placeholderTextColor={Colors.placeholder}
              placeholder={strings('enter_email')}
              style={Style.subTitle}
              textAlignVertical={'top'}
              onChangeText={(teamMail) => {
                this.setState({teamMail});
              }}
              value={teamMail}
            />

            <Text style={Style.title}>{strings('about_us')}</Text>
            <Input
              placeholderTextColor={Colors.placeholder}
              placeholder={strings('enter_description')}
              style={Style.textArea}
              textAlignVertical={'top'}
              multiline
              onChangeText={(teamDescription) => {
                this.setState({teamDescription});
              }}
              value={teamDescription}
            />
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
            isOpen={isOpen}
            message={msgNotification}
            onAccept={() => {
              if (isCreateSuccess) {
                this.handleCreateSuccess();
                teamActions.fetchTeamUserJoined(userId);
                navigation.navigate(Screens.SWITCH_TEAM);
              } else {
                this.setState({
                  msgNotification: '',
                  isOpen: false,
                });
              }
            }}
          />
          <BottomSheet
            animated={true}
            ref={this.bottomSheet}
            style={{
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              height: (height * 1) / 3,
            }}
            onClose={() => this.handleClose()}>
            {this.renderSports()}
          </BottomSheet>
        </Block>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = (state) => ({
  listSport: state.team.listSport,
  userId: state.user.userId,
});

const mapDispatchToProps = (dispatch) => ({
  teamActions: bindActionCreators(TeamActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateTeamScreen);
