/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Colors} from 'App/Theme';
import {
  Button,
  Block,
  Text,
  ImageCircle,
  DialogPrivacy,
  ButtonPrivacy,
  ModalNotifcation,
  DialogPostOption,
} from '../../../Components';
import UserActions from '../../../Stores/User/Actions';
import PostActions from '../../../Stores/Post/Actions';
import {strings} from '../../../Locate/I18n';
import {postService} from '../../../Services/PostService';
import {PostType} from '../../../Constants';
import {Config} from '../../../Config';
import {Screens} from '../../../Utils/screens';
import SurveyToolbar from './SurveyToolbar';
import Moment from 'moment';
import SurveyViewText from './SurveyViewText';
import SurveyViewSelection from './SurveyViewSelection';
import {Divider} from 'react-native-paper';

class PostSurveyContent extends Component {
  constructor(props) {
    super(props);
    this.scrollView = React.createRef();
    this.dialogPrivacy = React.createRef();

    const {navigation} = this.props;

    this.state = {
      errorCode: '',
      surveyDetail: null,
      visiblePostOption: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {profile, team, surveyDetail} = nextProps;
    if (profile != prevState.profile || team != prevState.team || surveyDetail != prevState.surveyDetail) {
      return {profile, team, surveyDetail};
    }

    return null;
  }

  componentDidMount() {}

  onSelectedPrivacy = (privacyId, userInclude) => {
    let {surveyDetail} = this.state;
    surveyDetail.privacyId = privacyId;
    surveyDetail.userInclude = userInclude;
    this.setState({surveyDetail});
    this.updatePrivacy(surveyDetail);
  };

  updatePrivacy = (surveyDetail) => {
    const data = {
      postId: surveyDetail.postId,
      privacyId: surveyDetail.privacyId,
      userInclude: surveyDetail.userInclude,
    };
    postService.fetchUpdatePrivacy(data);
  };

  onPressBackground = () => {
    const {navigation} = this.props;
    navigation.navigate(Screens.MEDIA_SELECT, {
      mediaType: 'Photos',
      multiSelect: false,
      onSelectedImage: this.onSelectedImage,
    });
  };

  onEditPost = () => {
    const {surveyDetail} = this.state;
    const {navigation} = this.props;
    navigation.navigate(Screens.CREATE_SURVEY, {surveyDetail});
  }
  
  deletePost = () => {
    const {surveyDetail} = this.state;
    const {postActions} = this.props;
    const {teamId, postId} = surveyDetail;
    const data = {
      teamId,
      postId,
    };
    postActions.fetchDeletePost(data);
  };

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
    const disabled =
      !(this.state.listMedia && this.state.listMedia.length > 0) ||
      this.state.isPosting;
    return (
      <Button
        style={{height: null}}
        color={null}
        status={disabled}
        onPress={this.createPostPhoto}>
        <Text bold size={13.5} color={disabled ? Colors.gray2 : Colors.white}>
          {strings('post')}
        </Text>
      </Button>
    );
  };

  render() {
    const {
      visibleNotice,
      visiblePostOption,
    } = this.state;
    const {navigation, profile, listTeamMembers, surveyDetail} = this.props;
    const mainColor = surveyDetail.backgroundImage ? Colors.white : '#606772';
    const isAuthorPost = surveyDetail.createdby == profile.userId && profile.userId;

    return (
      <Block flex={false} shadow>
        <Block flex={false} margin={[15]} color={Colors.white} card shadow style={{overflow: 'hidden'}}>
          <Block flex={false}>
            {surveyDetail.backgroundImage ? (<Image
              style={{ width: '100%', height: '100%', position: 'absolute' }}
              source={{ uri: Config.GET_IMAGE_URL + surveyDetail.backgroundImage }}
            />) : null}
            <Block flex={false} padding={[0, 15, 0, 15]} color={surveyDetail.backgroundImage ? Colors.opacity : Colors.white}>
              <Block flex={false} row marginTop={15}>
                <ImageCircle
                  source={{ uri: Config.GET_IMAGE_URL + surveyDetail.createdByAvatar }}
                  style={{ marginTop: 0 }}
                  size={58}
                />
                <Block margin={[0, 0, 0, 8]}>
                  <Text
                    style={{ marginLeft: 0 }}
                    size={16}
                    color={mainColor}
                    bold>
                    {surveyDetail.createdByName}
                  </Text>
                  <ButtonPrivacy
                    style={{ color: mainColor, borderWidth: 1 }}
                    margin={[5, 0, 0, 0]}
                    privacyId={surveyDetail.privacyId}
                    userInclude={surveyDetail.userInclude}
                    disabled={!isAuthorPost}
                    onPress={() =>
                      this.dialogPrivacy.current?.open(surveyDetail.privacyId, surveyDetail.userInclude)
                    }>
                    <Button
                      style={{
                        marginVertical: 0,
                        height: null,
                        marginLeft: 10,
                      }}>
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
                        <Text color={mainColor} bold>
                          SURVEY
                      </Text>
                      </Block>
                    </Button>
                  </ButtonPrivacy>
                </Block>
                {isAuthorPost ? (
                  <Button
                    style={{
                      marginVertical: 0,
                      height: 30,
                      alignItems: 'center',
                      paddingHorizontal: 10,
                    }}
                    opacity={0.5}
                    onPress={() => this.setState({ visiblePostOption: true })}>
                    <FontAwesome5 name={'ellipsis-h'} size={16} color={mainColor}/>
                  </Button>
                ) : null}
              </Block>
              <Block flex={false} marginTop={20}>
                <Block flex={false} row style={{flexWrap: 'wrap'}}>
                  {surveyDetail.hashTag.map((hashTag, index) => {
                    return (
                      <Block flex={false} row key={index}>
                        {index > 0 && (
                          <Text
                            style={{paddingVertical: 3}}
                            color={Colors.primary}
                            size={15}>
                            {', '}
                          </Text>
                        )}
                        <TouchableOpacity>
                          <Text
                            style={{paddingVertical: 3}}
                            color={Colors.primary}
                            size={15}>
                            {hashTag}
                          </Text>
                        </TouchableOpacity>
                      </Block>
                    );
                  })}
                </Block>
                <Text color={mainColor} size={15} bold selectable>
                  {surveyDetail.postContent}
                </Text>
              </Block>
              
              <Block flex={false}>
                {surveyDetail.postType === PostType.POST_SURVEY_TEXT ? (
                  <SurveyViewText
                    navigation={navigation}
                    surveyDetail={surveyDetail}
                    mainColor={mainColor}
                  />
                ) : (
                  <SurveyViewSelection
                    navigation={navigation}
                    surveyDetail={surveyDetail}
                    mainColor={mainColor}
                  />
                )}
              </Block>

              <Block flex={false} row middle padding={[20, 0, 20, 0]}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: Colors.black,
                    paddingVertical: 5,
                    paddingHorizontal: 15,
                    borderRadius: 5,
                  }}
                  onPress={() => navigation.navigate(Screens.SURVEY_RESULT, {surveyDetail})}>
                  <Text color={Colors.white}>See all responses</Text>
                  <Icon
                    name={'chevron-right'}
                    size={13}
                    color={Colors.white}
                    style={{marginLeft: 10}}
                  />
                </TouchableOpacity>
              </Block>

              <Block flex={false}>
                {surveyDetail.location ? (
                  <Block flex={false} row marginBottom={4}>
                    <Block flex={false} width={30}>
                      <FontAwesome5
                        name={'map-marker-alt'}
                        size={18}
                        color={mainColor}
                      />
                    </Block>
                    <Text style={{ flex: 1 }} size={15} color={mainColor}>
                      {surveyDetail.location}
                    </Text>
                  </Block>
                ) : null}

                {surveyDetail.postSurveyDeadline ? (
                  <Block flex={false} row marginBottom={5} center>
                    <Block flex={false} width={30}>
                      <MaterialIcons
                        name={'timer'}
                        size={18}
                        color={mainColor}
                      />
                    </Block>
                    <Text size={15} color={mainColor}>
                      Closing time:
                  </Text>
                    <Text
                      style={{ flex: 1, marginLeft: 10 }}
                      size={15}
                      color={mainColor}>
                      {Moment(surveyDetail.postSurveyDeadline).format('HH:mm A - DD/MM/YYYY')}
                    </Text>
                  </Block>
                ) : null}
              </Block>
            </Block>
          </Block>
          <Divider />
          <SurveyToolbar
            style={{ paddingLeft: 10, marginRight: 20 }}
            surveyDetail={surveyDetail}
          />
        </Block>
        <DialogPrivacy
          ref={this.dialogPrivacy}
          privacyId={surveyDetail.privacyId}
          teamUsers={listTeamMembers}
          userInclude={surveyDetail.userInclude}
          onSelected={this.onSelectedPrivacy}
        />

        <DialogPostOption
          visible={visiblePostOption}
          pinOnTop={() => {}}
          onEdit={this.onEditPost}
          onDelete={() => this.setState({visibleNotice: true})}
          onCancel={() => this.setState({visiblePostOption: false})}
        />

        <ModalNotifcation
          isOpen={visibleNotice}
          isConfirm
          message={strings('delete_this_post')}
          onAccept={() => {
            this.setState({visibleNotice: false});
            this.deletePost();
          }}
          onCancel={() => this.setState({visibleNotice: false})}
        />
      </Block>
    );
  }
}

PostSurveyContent.defaultProps = {};

PostSurveyContent.propTypes = {
  errorCode: PropTypes.string,
  userActions: PropTypes.object,
};

const mapStateToProps = (state) => ({
  profile: state.user.profile,
  team: state.team.team,
  listTeamMembers: state.team.listTeamMembers,
  postDetail: state.post.postDetail,
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
  postActions: bindActionCreators(PostActions, dispatch),
  postActions: bindActionCreators(PostActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostSurveyContent);
