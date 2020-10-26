/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {Image, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Colors} from 'App/Theme';
import {
  Button,
  Block,
  Text,
  Header,
  ImageCircle,
  DialogPrivacy,
  ButtonPrivacy,
  ModalNotifcation,
  Input,
} from '../../../Components';
import UserActions from '../../../Stores/User/Actions';
import PostActions from '../../../Stores/Post/Actions';
import {strings} from '../../../Locate/I18n';
import {postService} from '../../../Services/PostService';
import {Privacy, PostType} from '../../../Constants';
import {Config} from '../../../Config';
import {Screens} from '../../../Utils/screens';
import Style from './CreateSurveyScreenStyle';
import {getFileType} from '../../../Utils/commonFunction';
import CreateSurveySelection from './CreateSurveySelection';
import CreateSurveyText from './CreateSurveyText';
import SurveyBottomBar from './SurveyBottomBar';
import Moment from 'moment';

class CreateSurveyScreen extends Component {
  constructor(props) {
    super(props);
    this.scrollView = React.createRef();
    this.dialogPrivacy = React.createRef();
    this.surveyText = React.createRef();
    this.surveySelection = React.createRef();
    this.inputLocation = React.createRef();

    const {navigation} = this.props;
    const privacyId = navigation.getParam('privacyId', Privacy.PUBLIC);
    const userInclude = navigation.getParam('userInclude', []);
    this.surveyDetail = navigation.getParam('surveyDetail');

    this.state = {
      errorCode: '',
      privacyId: this.surveyDetail ? this.surveyDetail.privacyId : privacyId,
      userInclude: this.surveyDetail ? this.surveyDetail.userInclude : userInclude,
      background: null,
      backgroundImageId: this.surveyDetail ? this.surveyDetail.backgroundImage : null,
      surveyType: this.surveyDetail ? this.surveyDetail.postType : null,
      hashTag: (this.surveyDetail && this.surveyDetail.hashTag) || [],
      surveyContent: this.surveyDetail ? (this.surveyDetail.postContent || '') : '',
      isLocation: false,
      location: this.surveyDetail ? this.surveyDetail.location : '',
      timeClosing: this.surveyDetail && this.surveyDetail.postSurveyDeadline ? new Date(this.surveyDetail.postSurveyDeadline) : null,
      message: 'Create Survey failed!',
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {profile, team} = nextProps;
    if (profile != prevState.profile || team != prevState.team) {
      return {profile, team};
    }

    return null;
  }

  componentDidMount() {}

  onSelectedPrivacy = (privacyId, userInclude) => {
    this.setState({privacyId, userInclude});
  };

  onPressBackground = () => {
    const {navigation} = this.props;
    navigation.navigate(Screens.MEDIA_SELECT, {
      mediaType: 'Photos',
      multiSelect: false,
      onSelectedImage: this.onSelectedImage,
    });
  };

  onSelectedImage = (media) => {
    this.setState({background: media});
  };

  onChangeContent = (surveyContent) => {
    this.setState({surveyContent});
  }

  onPressLocation = () => {
    this.setState({isLocation: !this.state.isLocation});
    this.inputLocation.current?.focus();
  };

  setTimeClosing = (date) => {
    this.setState({timeClosing: date});
  };

  createPostSurvey = () => {
    const {
      privacyId,
      userInclude,
      background,
      surveyType,
      surveyContent,
      location,
      timeClosing,
    } = this.state;
    const {navigation, profile} = this.props;
    const teamId = profile.activeTeam;

    const formData = new FormData();
    if (background) {
      const backgroundImage = {
        uri: background.image.uri,
        name: background.image.filename,
        type: getFileType(background.image),
      };
      formData.append('backgroundImage', backgroundImage);
    }

    let hashTag = [];
    let listSelections = [];
    let isMultiSelection = false;
    let isAddMoreSelection = false;
    let answerList = [];

    if(surveyType == PostType.POST_SURVEY_TEXT) {
      hashTag = this.surveyText.current?.getHashTag();
    }
    else {
      hashTag = this.surveySelection.current?.getHashTag();
      listSelections = this.surveySelection.current?.getListSelections() || [];
      isMultiSelection = this.surveySelection.current?.getMultiSelection() || false;
      isAddMoreSelection = this.surveySelection.current?.getEnableAddMoreSelection() || false;

      if(listSelections.length < 2) {
        this.showMessage('Please add at least 2 selections');
        return;
      }

      let isSelectionImage = listSelections.some((selection) => selection.image);
      if(isSelectionImage) {
        let isValidImage = listSelections.every((selection) => selection.image);
        if(!isValidImage) {
          this.showMessage('Please select background for all selection');
            return;
        }
      }
      
      listSelections.forEach((selection) => {
        answerList.push({
          postSurveyContent: selection.ansContent
        });

        if(selection.image && !selection.image.uri.includes('http')) {
          const file = {
            uri: selection.image.uri,
            name: selection.image.filename,
            type: getFileType(selection.image),
          };
          formData.append('files', file);
        }
      });
    }
    
    const dateDeadline = timeClosing && Moment(timeClosing).unix() * 1000;
    const surveyInfo = {
      postId: this.surveyDetail && this.surveyDetail.postId,
      teamId: teamId,
      postSurveyContent: surveyContent.trim(),
      backgroundImage: null,
      backgroundDefault: null,
      privacyId: privacyId,
      postContentFontSize: null,
      postType: surveyType,
      dateDeadline: dateDeadline,
      locale: location,
      hashTag: hashTag,
      isMultiple: isMultiSelection,
      isExtendsAns: isAddMoreSelection,
      userInclude: userInclude,
      userTag: [],
      answerList: answerList,
    };

    formData.append('surveyInfo', JSON.stringify(surveyInfo));
    console.log('surveyInfo', JSON.stringify(surveyInfo));

    this.setState({surveyContent: ''});
    postService.createPostSurvey(formData).then((response) => {
      if (response.success) {
        navigation.goBack();
        navigation.navigate(Screens.NOW);
      } else {
        this.showMessage('Create Survey failed!');
      }
    });
  };

  showMessage = (message) => {
    this.setState({visibleNotice: true, message})
  }

  renderLeftHeader = () => {
    return (
      <Button
        style={{height: null}}
        color={null}
        onPress={() => this.props.navigation.goBack()}>
        <Text size={13.5} color={Colors.white}>
          {strings('cancel')}
        </Text>
      </Button>
    );
  };

  renderRightHeader = () => {
    const surveyContentTrim = this.state.surveyContent.trim();
    const disabled = !this.state.surveyType || !surveyContentTrim;
    return (
      <Button
        style={{height: null}}
        color={null}
        status={disabled}
        onPress={this.createPostSurvey}>
        <Text bold size={13.5} color={disabled ? Colors.gray2 : Colors.white}>
          {strings('post')}
        </Text>
      </Button>
    );
  };

  render() {
    const {
      privacyId,
      userInclude,
      background,
      backgroundImageId,
      surveyType,
      hashTag,
      surveyContent,
      isLocation,
      location,
      timeClosing,
      visibleNotice,
      message,
    } = this.state;
    const {navigation, profile, listTeamMembers} = this.props;

    let backgroundUri = null;
    if(background) {
      backgroundUri = {uri: background.image.uri};
    }
    else if(backgroundImageId) {
      backgroundUri = {uri: Config.GET_IMAGE_URL + backgroundImageId}
    }

    const mainColor = backgroundUri ? Colors.white : '#606772';
    const listSelections = (this.surveyDetail && this.surveyDetail.optionList) || [];

    return (
      <Block style={Style.view}>
        <Header
          leftIcon={this.renderLeftHeader()}
          title={strings('survey')}
          rightIcon={this.renderRightHeader()}
        />
        <Block color={Colors.white}>
          <Image
            style={{width: '100%', height: '100%'}}
            source={backgroundUri}
          />
          
          <Block color={background ? Colors.opacity : null} absolute style={{top: 0, right: 0, bottom: 0, left: 0}}>
            <Block flex={false} margin={[15]}>
              <Block flex={false} row center>
                <ImageCircle
                  source={{uri: Config.GET_IMAGE_URL + profile.userAvatar}}
                  style={{marginTop: 0}}
                  size={58}
                />
                <Block margin={[0, 0, 0, 8]}>
                  <Text
                    style={{marginLeft: 0}}
                    size={16}
                    color={mainColor}
                    bold>
                    {profile.userFullName}
                  </Text>
                  <ButtonPrivacy
                    style={{color: mainColor, borderWidth: 1}}
                    margin={[5, 0, 0, 0]}
                    privacyId={privacyId}
                    userInclude={userInclude}
                    onPress={() =>
                      this.dialogPrivacy.current?.open(privacyId, userInclude)
                    }
                    onLayout={(event) =>
                      this.setState({
                        containerWidth: event.nativeEvent.layout.width,
                      })
                    }>
                    {surveyType && (
                      <Button
                        style={{
                          marginVertical: 0,
                          height: null,
                          marginLeft: 10,
                        }}
                        disabled={this.surveyDetail ? true : false}
                        onPress={() => this.setState({surveyType: null})}>
                        <Block
                          flex={false}
                          row
                          height={32}
                          padding={[0, 10, 0, 10]}
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderColor: mainColor,
                            borderWidth: 1,
                            borderRadius: 5,
                          }}>
                          <Text color={mainColor}>{surveyType == PostType.POST_SURVEY_TEXT ? 'TEXT' : 'SELECTION'}</Text>
                        </Block>
                      </Button>
                    )}
                  </ButtonPrivacy>
                </Block>
              </Block>
            </Block>

            <Block padding={[15, 15, 0, 15]} marginTop={10}>
              <ScrollView
                ref={this.scrollView}
                showsVerticalScrollIndicator={false}>
                {!surveyType && (
                  <Block flex={false}>
                    <Button
                      style={{marginVertical: 0, height: null}}
                      onPress={() => this.setState({surveyType: PostType.POST_SURVEY_TEXT})}>
                      <Block
                        flex={false}
                        card
                        border
                        center
                        color={Colors.black}
                        padding={[15]}>
                        <Text size={16} color={Colors.white}>
                          TEXT
                        </Text>
                        <Text
                          size={15}
                          color={Colors.white}
                          style={{textAlign: 'center'}}>
                          Others can write their opinions which are sent to you
                          privately
                        </Text>
                      </Block>
                    </Button>

                    <Button
                      style={{marginVertical: 0, height: null, marginTop: 15}}
                      onPress={() => this.setState({surveyType: PostType.POST_SURVEY_SELECTION})}>
                      <Block
                        flex={false}
                        card
                        border
                        center
                        color={Colors.black}
                        padding={[15]}>
                        <Text size={16} color={Colors.white}>
                          SELECTION
                        </Text>
                        <Text
                          size={15}
                          color={Colors.white}
                          style={{textAlign: 'center'}}>
                          Others can vote your available selection or add more
                          selection
                        </Text>
                      </Block>
                    </Button>
                  </Block>
                )}
                {surveyType === PostType.POST_SURVEY_TEXT ? (
                  <CreateSurveyText
                    ref={this.surveyText}
                    inputStyle={{minHeight: 100}}
                    padding={[10]}
                    hashTag={hashTag}
                    content={surveyContent}
                    color={Colors.black}
                    onChangeContent={this.onChangeContent}
                  />
                ) : null}
                {surveyType === PostType.POST_SURVEY_SELECTION ? (
                  <CreateSurveySelection
                    ref={this.surveySelection}
                    navigation={navigation}
                    surveyDetail={this.surveyDetail}
                    content={surveyContent}
                    hashTag={hashTag}
                    listSelections={listSelections}
                    onChangeContent={this.onChangeContent}
                  />
                ) : null}
              </ScrollView>
            </Block>

            <Block flex={false} margin={[10, 17, 5, 17]}>
              {isLocation || location ? (
                <Block flex={false} row center>
                  <Block flex={false} width={30}>
                    <Icon
                      name={'map-marker-alt'}
                      size={25}
                      color={Colors.gray9}
                    />
                  </Block>
                  <Block>
                    <Input
                      refName={this.inputLocation}
                      style={{borderWidth: 0, height: null, padding: 0, borderRadius: 0, color: mainColor}}
                      inputStyle={{flex: 1}}
                      placeholder={strings('location')}
                      placeholderTextColor={Colors.gray}
                      onChangeText={(location) => this.setState({location})}
                      value={location}
                    />
                  </Block>
                </Block>
              ) : null}

              {timeClosing ? (
                <Block flex={false} row marginTop={10} center>
                  <Block flex={false} width={30}>
                    <MaterialIcons
                      name={'timer'}
                      size={25}
                      color={mainColor}
                      // style={{marginLeft: 20}}
                    />
                  </Block>
                  <Text size={15} color={mainColor}>
                    Closing time:
                  </Text>
                  <Text
                    style={{flex: 1, marginLeft: 10}}
                    size={15}
                    color={mainColor}>
                    {Moment(timeClosing).format('HH:mm A - DD/MM/YYYY')}
                  </Text>
                </Block>
              ) : null}
            </Block>

            <SurveyBottomBar
              onPressBackground={this.onPressBackground}
              onPressLocation={this.onPressLocation}
              onSetTimeClosing={this.setTimeClosing}
            />
          </Block>
        </Block>
        <DialogPrivacy
          ref={this.dialogPrivacy}
          privacyId={privacyId}
          teamUsers={listTeamMembers}
          userInclude={userInclude}
          onSelected={this.onSelectedPrivacy}
        />

        <ModalNotifcation
          isOpen={visibleNotice}
          message={message}
          onAccept={() => this.setState({visibleNotice: false})}
        />
      </Block>
    );
  }
}

CreateSurveyScreen.defaultProps = {};

CreateSurveyScreen.propTypes = {
  errorCode: PropTypes.string,
  userActions: PropTypes.object,
};

const mapStateToProps = (state) => ({
  profile: state.user.profile,
  team: state.team.team,
  listTeamMembers: state.team.listTeamMembers,
  postDetail: state.post.postDetail,
  privacyId: state.post.privacyId,
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
  postActions: bindActionCreators(PostActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateSurveyScreen);
