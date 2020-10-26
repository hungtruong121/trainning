/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import PostActions from '../Stores/Post/Actions';
import {Config} from '../Config/index';
import {Colors} from '../Theme';
import {Image, TouchableOpacity} from 'react-native';
import {Button, Block, Text, ImageCircle} from '.';

import Video from 'react-native-video';
import {withNavigation} from 'react-navigation';

import {Screens} from '../Utils/screens';

class PostComment extends Component {
  constructor(props) {
    super(props);
    this.imagePicker = React.createRef();

    this.state = {
      postDetail: null,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {profile, postDetail} = nextProps;
    if (
      profile != prevState.profile ||
      postDetail != prevState.postDetailTemp
    ) {
      return {profile, postDetail, postDetailTemp: postDetail};
    }

    return null;
  }

  getPostDetail() {
    const {postActions} = this.props;
    postActions.fetchPostDetail(this.post.postId);
  }

  changeComment = (comment, listComment) => {
    for (let i = 0; i < listComment.length; i++) {
      const cmt = listComment[i];
      if (comment.postCommentId == cmt.postCommentId) {
        listComment[i] = comment;
        return listComment;
      }

      if (listComment[i].childComment) {
        for (let j = 0; j < listComment[i].childComment.length; j++) {
          if (
            comment.postCommentId ==
            listComment[i].childComment[j].postCommentId
          ) {
            listComment[i].childComment[j] = comment;
            return listComment;
          }
        }
      }
    }

    return listComment;
  };

  handleLiked = (comment) => {
    const {postDetail} = this.state;
    const {postActions} = this.props;
    const {postId, postCommentId} = comment;
    const data = {
      teamId: postDetail.teamId,
      postId,
      postCommentId,
    };

    if (comment.isLiked) {
      comment.numberOfLikes--;
    } else {
      comment.numberOfLikes++;
    }
    comment.isLiked = !comment.isLiked;

    comment = {...comment};

    postDetail.listComment = this.changeComment(
      comment,
      postDetail.listComment,
    );

    this.setState({postDetail});

    postActions.fetchLikeComment(data);
  };

  selectUserProfile = (userId) => {
    const {navigation, profile} = this.props;
    if (userId == profile.userId) {
      navigation.navigate(Screens.PROFILE);
      return;
    }
    navigation.navigate(Screens.PROFILE_MEMBER, {userId});
  };

  renderComment = (listComment) => {
    if (!listComment || !Array.isArray(listComment)) {
      return null;
    }
    return listComment.map((comment, index) => {
      const {onSelectComment} = this.props;
      return (
        <Block flex={false} margin={[8, 8, 8, 0]} row key={index}>
          <ImageCircle
            source={{uri: Config.GET_IMAGE_URL + comment.createdByAvatar}}
            size={50}
            onPress={() => this.selectUserProfile(comment.createdby)}
          />
          <Block margin={[0, 0, 0, 8]}>
            <TouchableOpacity
              onPress={() => this.selectUserProfile(comment.createdby)}>
              <Text style={{marginLeft: 0}} size={15} color={Colors.black} bold>
                {comment.createdByName}
              </Text>
            </TouchableOpacity>
            {comment.postCommentContent ? (
              <Text style={{marginLeft: 0}} size={13} color={Colors.black}>
                {comment.postCommentContent}
              </Text>
            ) : null}
            {comment.postCommentImage ? (
              <Image
                source={{uri: Config.GET_IMAGE_URL + comment.postCommentImage}}
                style={{width: 100, height: 100}}
              />
            ) : null}
            <Block flex={false} row style={{paddingVertical: 0}} center>
              <Button
                style={{
                  flexDirection: 'row',
                  marginVertical: 0,
                  height: 30,
                  alignItems: 'center',
                }}
                color={null}
                opacity={0.4}
                onPress={() => this.handleLiked(comment)}>
                {comment.isLiked ? (
                  <Icon name={'heart'} size={16} color={Colors.primary} />
                ) : (
                  <FontAwesome5
                    name={'heart'}
                    size={16}
                    color={Colors.primary}
                  />
                )}
                <Text color={Colors.primary} style={{marginLeft: 3}}>
                  {comment.numberOfLikes || 0}
                </Text>
              </Button>

              {!comment.postCommentParentId ? (
                <Button
                  style={{
                    flexDirection: 'row',
                    marginVertical: 0,
                    height: 30,
                    alignItems: 'center',
                    marginLeft: 30,
                  }}
                  disabled={Boolean(comment.postCommentParentId)}
                  color={null}
                  opacity={0.4}
                  onPress={() => onSelectComment(comment)}>
                  <FontAwesome5 name={'comment'} size={16} />
                  <Text style={{marginLeft: 3}}>
                    {comment.numberOfComments || 0}
                  </Text>
                </Button>
              ) : null}
            </Block>
            {comment.gif_id ? (
              <Video
                source={{uri: comment.gif_id}}
                repeat={true}
                resizeMode="cover"
                muted={true}
                style={{width: 100, height: 100}}
              />
            ) : null}
            {this.renderComment(comment.childComment)}
          </Block>
        </Block>
      );
    });
  };

  render() {
    const {style, postDetail} = this.props;

    return (
      <Block style={style} {...this.props}>
        {this.renderComment(postDetail.listComment)}
      </Block>
    );
  }
}

PostComment.defaultProps = {};

PostComment.propTypes = {
  errorCode: PropTypes.string,
  userActions: PropTypes.object,
  profile: PropTypes.object,
  listTeamInfo: PropTypes.array,
  userId: PropTypes.string,
};

const mapStateToProps = (state) => ({
  profile: state.user.profile,
});

const mapDispatchToProps = (dispatch) => ({
  postActions: bindActionCreators(PostActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withNavigation(PostComment));
