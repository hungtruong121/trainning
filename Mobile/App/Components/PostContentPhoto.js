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

import {TouchableOpacity} from 'react-native';
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
import {Divider} from 'react-native-paper';
import ResponsiveUtils from '../Utils/ResponsiveUtils';

import DialogPostOption from './DialogPostOption';
import ImageItem from '../Containers/CreatePost/ImageItem';
import { PostType } from '../Constants';

class PostContentPhoto extends Component {
  constructor(props) {
    super(props);
    this.dialogPrivacy = React.createRef();

    this.state = {
      postDetail: null,
      listMedia: [],
      visiblePostOption: false,
      visibleNotice: false,
      containerWidth: 100,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {postDetail} = nextProps;
    let listMedia = [];
    if (postDetail != prevState.postDetailTemp) {
      if (postDetail.postChild) {
        postDetail.postChild.forEach((child) => {
          listMedia.push({
            image: {
              postId: child.postId,
              uri: (postDetail.postType == PostType.POST_ALBUM ? Config.GET_MEDIA_FOLDER_URL : Config.GET_MEDIA_URL) + child.postMedia,
            },
            type: child.fileType,
            userTag: child.userTag,
            description: child.postDescription,
          });
        });
      }
      return {postDetail, postDetailTemp: postDetail, listMedia};
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

  onPressMedia = (index) => {
    const {listMedia} = this.state;
    const data = {
      listMedia,
      mediaIndex: index,
      isEditable: false,
    };

    this.props.navigation.navigate(Screens.PREVIEW_ALBUM, data);
  };

  onEditPost = () => {
    const {postDetail, listMedia} = this.state;
    const {navigation, postActions} = this.props;
    postActions.fetchPostDetailSuccess(postDetail);
    navigation.navigate(Screens.PHOTO_ALBUM, {postDetail, listMedia});
  };

  render() {
    const {
      postDetail,
      listMedia,
      visiblePostOption,
      visibleNotice,
      containerWidth,
    } = this.state;
    const {navigation, profile, isShowBack, listTeamMembers} = this.props;

    const imageMargin = 5;
    const imageSize = (containerWidth - imageMargin * 2) / 3;
    const isAuthorPost = postDetail.createdby == profile.userId && profile.userId;
    
    return (
      <Block flex={false} {...this.props}>
        <Block flex={false} row center margin={[10, 10, 0, 10]}>
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
        <Block flex={false} card margin={[15]}>
          <Block flex={false}>
            {postDetail.postContent ? (
              <Text style={{marginBottom: 10}}>{postDetail.postContent}</Text>
            ) : null}
            <Block
              flex={false}
              center
              onLayout={(event) =>
                this.setState({containerWidth: event.nativeEvent.layout.width})
              }>
              {listMedia.length > 0 && (
                <ImageItem
                  style={{
                    width: containerWidth,
                    height: ResponsiveUtils.height(204),
                  }}
                  type={listMedia[0].type}
                  uri={listMedia[0].image.uri}
                  onPress={() => this.onPressMedia(0)}
                />
              )}
            </Block>
            {listMedia.length > 1 && (
              <Block
                flex={false}
                row
                height={imageSize}
                marginTop={imageMargin}>
                {listMedia.map((media, index) => {
                  if (index > 0 && index < 4) {
                    return (
                      <Block
                        flex={1}
                        row
                        margin={[0, 0, 0, index > 1 ? imageMargin : 0]}
                        key={index}>
                        <ImageItem
                          key={index}
                          style={{width: '100%', height: imageSize}}
                          uri={media.image.uri}
                          type={media.type}
                          // onDeleted={() => this.onDeleteMedia(index)}
                          onPress={() => this.onPressMedia(index)}
                        />
                      </Block>
                    );
                  } else if (index == 4) {
                    return (
                      <Button
                        key={index}
                        style={{marginVertical: 0, height: null}}
                        onPress={() => this.onPressMedia(3)}>
                        <Block
                          absolute
                          color={'#00000084'}
                          style={{
                            width: imageSize,
                            height: imageSize,
                            top: 0,
                            right: 0,
                            justifyContent: 'center',
                          }}
                          center>
                          <Text color={Colors.white} size={24}>
                            +{postDetail.postChild.length - 4}
                          </Text>
                        </Block>
                      </Button>
                    );
                  }
                })}
              </Block>
            )}
          </Block>
        </Block>
        <Divider marginHorizontal={0} />
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

PostContentPhoto.defaultProps = {};

PostContentPhoto.propTypes = {
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
)(withNavigation(PostContentPhoto));
