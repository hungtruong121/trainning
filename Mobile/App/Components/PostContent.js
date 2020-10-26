/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withNavigation} from 'react-navigation';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import {Config} from '../Config/index';
import PostActions from '../Stores/Post/Actions';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {strings} from '../Locate/I18n';
import {Screens} from '../Utils/screens';
import {Colors} from '../Theme';

import {
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  ScrollView,
} from 'react-native';
import {
  Block,
  Text,
  ImageCircle,
  Button,
  ModalNotifcation,
  DialogPrivacy,
  ButtonPrivacy,
} from '.';

import {postService} from '../Services/PostService';
import ToolbarReact from './ToolbarReact';
import HTML from 'react-native-render-html';
import {Divider} from 'react-native-paper';
import ResponsiveUtils from '../Utils/ResponsiveUtils';

import DialogPostOption from './DialogPostOption';

class PostContent extends Component {
  constructor(props) {
    super(props);
    this.dialogPrivacy = React.createRef();

    this.state = {
      postDetail: null,
      visiblePostOption: false,
      visibleNotice: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {postDetail} = nextProps;
    if (postDetail != prevState.postDetailTemp) {
      return {postDetail, postDetailTemp: postDetail};
    }

    return null;
  }

  handleLiked = (postDetail) => {
    const {postActions} = this.props;
    let {teamId, postId, postCommentId} = postDetail;
    const data = {
      teamId,
      postId,
      postCommentId,
    };

    if (postDetail.isLiked) {
      postDetail.numberOfLikes--;
    } else {
      postDetail.numberOfLikes++;
    }
    postDetail.isLiked = !postDetail.isLiked;
    postDetail = {...postDetail};
    this.setState({postDetail});
    postActions.fetchLikeComment(data);
  };

  handleComment = () => {
    const {postDetail} = this.state;
    const {navigation, postActions} = this.props;
    postActions.fetchPostDetailSuccess(postDetail);
    navigation.navigate(Screens.POST_DETAIL);
  };

  deletePost = () => {
    const {postDetail} = this.state;
    const {postActions} = this.props;
    const {teamId, postId} = postDetail;
    const data = {
      teamId,
      postId,
    };
    postActions.fetchDeletePost(data);
  };

  selectUserProfile = (userId) => {
    const {navigation, profile} = this.props;
    if (userId == profile.userId) {
      navigation.navigate(Screens.PROFILE);
      return;
    }
    navigation.navigate(Screens.PROFILE_MEMBER, {userId});
  };

  openDialogPrivacy = () => {
    const {postDetail} = this.state;
    this.dialogPrivacy.current.open(
      postDetail.privacyId,
      postDetail.userInclude,
    );
  };

  onSelectedPrivacy = (privacyId, userInclude) => {
    let {postDetail} = this.state;
    postDetail.privacyId = privacyId;
    postDetail.userInclude = userInclude;
    this.setState({postDetail});
    this.updatePrivacy(postDetail);
  };

  updatePrivacy = (postDetail) => {
    const data = {
      postId: postDetail.postId,
      privacyId: postDetail.privacyId,
      userInclude: postDetail.userInclude,
    };
    postService.fetchUpdatePrivacy(data);
  };

  onEditPost = () => {
    const {postDetail} = this.state;
    const {navigation, postActions} = this.props;
    postActions.fetchPostDetailSuccess(postDetail);
    navigation.navigate(Screens.CREATE_POST, {postDetail});
  };

  render() {
    const {postDetail, visiblePostOption, visibleNotice} = this.state;
    const {navigation, profile, isShowBack, listTeamMembers} = this.props;
    let bgPostContent = null;

    if (postDetail.backgroundDefault) {
      bgPostContent = postDetail.backgroundDefault;
    } else if (postDetail.backgroundImage) {
      bgPostContent = {uri: Config.GET_IMAGE_URL + postDetail.backgroundImage};
    }
    const textColor = bgPostContent ? Colors.white : Colors.black;
    const htmlBaseStyles = {fontFamily: 'MPLUS1p-Medium'};
    const isAuthorPost = postDetail.createdby == profile.userId && profile.userId;

    return (
      <Block flex={false} {...this.props}>
        <Block flex={false} row center margin={[8, 10, 0, 10]}>
          {isShowBack && (
            <Button
              style={{backgroundColor: null, marginLeft: 4}}
              opacity={0.4}
              onPress={() => navigation.goBack()}>
              <AntDesign name={'left'} size={25} />
            </Button>
          )}
          <Block row marginLeft={8}>
            <ImageCircle
              source={{uri: Config.GET_IMAGE_URL + postDetail.createdByAvatar}}
              style={{marginTop: 0}}
              size={58}
              onPress={() => this.selectUserProfile(postDetail.createdby)}
            />
            <Block column margin={[0, 0, 0, 8]}>
              <TouchableOpacity
                onPress={() => this.selectUserProfile(postDetail.createdby)}>
                <Text size={16} color={Colors.black} bold>
                  {postDetail.createdByName}
                </Text>
              </TouchableOpacity>
              <ButtonPrivacy
                privacyId={postDetail.privacyId}
                userInclude={postDetail.userInclude}
                disabled={!isAuthorPost}
                onPress={this.openDialogPrivacy}
              />
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
                onPress={() => this.setState({visiblePostOption: true})}>
                <FontAwesome5 name={'ellipsis-h'} size={16} />
              </Button>
            ) : null}
          </Block>
        </Block>
        <ImageBackground
          source={bgPostContent}
          style={{width: '100%', marginTop: 8}}
          resizeMode={'cover'}>
          <Block
            flex={false}
            padding={[8, 20, 8, 20]}
            color={bgPostContent ? Colors.opacity : Colors.transparent}
            style={{
              justifyContent: 'space-between',
              minHeight: bgPostContent ? ResponsiveUtils.height(180) : null,
            }}
            // height={bgPostContent ? ResponsiveUtils.height(220) : null}
          >
            {/* hashTag */}
            <Block flex={false} row style={{flexWrap: 'wrap'}}>
              {postDetail.hashTag.map((hashTag, index) => {
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
            {/* postContent */}
            <Block flex={false}>
              <ScrollView>
                <HTML
                  html={`<customize>${postDetail.postContent}</customize>`}
                  baseFontStyle={{
                    fontSize: parseFloat(postDetail.postContentFontSize) || 15,
                    color: textColor,
                  }}
                  imagesMaxWidth={Dimensions.get('window').width}
                  tagsStyles={{
                    customize: bgPostContent
                      ? {...htmlBaseStyles, textAlign: 'center'}
                      : htmlBaseStyles,
                  }}
                />
              </ScrollView>
            </Block>
            {/* userTag */}
            <Block
              flex={false}
              marginTop={8}
              row
              center
              style={{flexWrap: 'wrap'}}>
              {postDetail.userTag.length > 0 && (
                <Text color={textColor}>{strings('with')} </Text>
              )}
              {postDetail.userTag.map((userTag, index) => {
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
                        {userTag.userFullName}
                      </Text>
                    </TouchableOpacity>
                  </Block>
                );
              })}
            </Block>
          </Block>
        </ImageBackground>
        <Divider marginHorizontal={20} />
        <ToolbarReact
          style={{paddingLeft: 10, marginRight: 20}}
          postDetail={postDetail}
          onPressComment={this.handleComment}
        />

        <DialogPrivacy
          ref={this.dialogPrivacy}
          privacyId={postDetail.privacyId}
          teamUsers={listTeamMembers}
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

PostContent.defaultProps = {};

PostContent.propTypes = {
  errorCode: PropTypes.string,
  user: PropTypes.object,
  listTeamMembers: PropTypes.array,
};

const mapStateToProps = (state) => ({
  errorCode: state.user.errorCode,
  profile: state.user.profile,
  listTeamMembers: state.team.listTeamMembers,
});

const mapDispatchToProps = (dispatch) => ({
  postActions: bindActionCreators(PostActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withNavigation(PostContent));
