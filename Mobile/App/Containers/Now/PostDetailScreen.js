/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import UserActions from '../../Stores/User/Actions';
import PostActions from '../../Stores/Post/Actions';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {strings} from '../../Locate/I18n';
import Style from './PostDetailScreenStyle';
import {Colors} from '../../Theme';
import {
  Image,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {
  Button,
  Block,
  Text,
  GalleryScreen,
  PostContent,
  PostComment,
} from '../../Components';

import {Divider} from 'react-native-paper';
import {fileService} from '../../Services/FileService';
import {SafeAreaView} from 'react-navigation';
import GIF from './GIF';
import PostContentPhoto from '../../Components/PostContentPhoto';
import {PostType} from '../../Constants';

class PostDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.imagePicker = React.createRef();

    this.state = {
      postDetail: null,
      commentInput: '',
      commentImage: undefined,
      commentSelected: null,
      visibleGallery: false,
      visibleGIF: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {post} = nextProps;
    if (post.postDetail != prevState.postDetail) {
      return {postDetail: post.postDetail};
    }

    return null;
  }

  getPostDetail() {
    const {postActions} = this.props;
    postActions.fetchPostDetail(this.post.postId);
  }

  onChangeComment = (text) => {
    this.setState({commentInput: text});
  };

  sendComment = async (gif) => {
    const {postActions} = this.props;
    const {
      postDetail,
      commentInput,
      commentSelected,
      commentImage,
    } = this.state;
    let imageId;

    if (!commentInput.trim() && !gif) {
      return;
    }

    if (commentImage) {
      const response = await fileService.uploadImage(commentImage);
      if (response.success) {
        imageId = response.data[0].uploadId;
      }
    }

    const data = {
      teamId: postDetail.teamId,
      postCommentId: null,
      postCommentParentId: commentSelected && commentSelected.postCommentId,
      postId: postDetail.postId,
      gif_id: gif,
      postCommentContent: commentInput.trim(),
      postCommentImage: imageId,
      userInclude: [],
    };

    postActions.fetchSendComment(data);
    this.setState({
      commentInput: '',
      commentSelected: null,
      commentImage: null,
    });
  };

  onSelectComment = (comment) => {
    this.setState({commentSelected: comment});
  };

  render() {
    const {
      postDetail,
      commentSelected,
      commentInput,
      commentImage,
      visibleGallery,
      visibleGIF,
    } = this.state;
    const {navigation} = this.props;

    return (
      <Block style={Style.view}>
        <SafeAreaView style={{backgroundColor: Colors.primary}} />
        <ScrollView>
          {postDetail.postType == PostType.POST_NORMAL ? (
            <PostContent
              isShowBack
              padding={[8, 0, 0, 0]}
              postDetail={postDetail}
              onDeletePost={() => navigation.goBack()}
            />
          ) : (
            <PostContentPhoto
              isShowBack
              padding={[8, 0, 0, 0]}
              postDetail={postDetail}
              onDeletePost={() => navigation.goBack()}
            />
          )}
          <Divider marginHorizontal={20} />

          <PostComment
            margin={[0, 20, 0, 20]}
            postDetail={postDetail}
            onSelectComment={this.onSelectComment}
          />
        </ScrollView>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Block
            flex={false}
            color={Colors.white}
            card
            style={{borderTopWidth: 1, borderColor: Colors.gray8}}>
            {visibleGIF && (
              <Block flex={false} row padding={[10, 10, 0, 10]}>
                <GIF
                  style={{flex: 1}}
                  onClose={() => this.setState({visibleGIF: false})}
                  onSelected={this.sendComment}
                />
                <Button
                  style={{
                    height: 30,
                    width: 30,
                    backgroundColor: Colors.gray8,
                    alignItems: 'center',
                    marginLeft: 10,
                    marginVertical: 0,
                  }}
                  onPress={() => this.setState({visibleGIF: false})}>
                  <Text>x</Text>
                </Button>
              </Block>
            )}
            {!visibleGIF && (
              <Block flex={false} padding={[15]}>
                <Block flex={false}>
                  {commentSelected && (
                    <Block flex={false} row>
                      <Text style={{margin: 15}}>
                        {'Reply: ' + commentSelected.postCommentContent}
                      </Text>
                      <Button
                        style={{
                          height: 20,
                          width: 20,
                          backgroundColor: Colors.gray8,
                          alignItems: 'center',
                        }}
                        onPress={() => this.setState({commentSelected: null})}>
                        <Text>x</Text>
                      </Button>
                    </Block>
                  )}
                  {commentImage && (
                    <Block flex={false} row>
                      <Block flex={false} row>
                        <Image
                          source={{uri: commentImage.uri}}
                          style={{width: 50, height: 50, margin: 10}}
                        />
                        <Button
                          style={{
                            height: 20,
                            width: 20,
                            backgroundColor: Colors.gray8,
                            alignItems: 'center',
                            position: 'absolute',
                            top: -8,
                            right: 0,
                          }}
                          onPress={() => this.setState({commentImage: null})}>
                          <Text>x</Text>
                        </Button>
                      </Block>
                    </Block>
                  )}
                </Block>

                <Block flex={false} row center>
                  <Button
                    flex={false}
                    style={{height: 28}}
                    opacity={0.4}
                    onPress={() => this.setState({visibleGallery: true})}>
                    <FontAwesome5
                      name={'camera'}
                      size={28}
                      color={Colors.gray5}
                    />
                  </Button>
                  <Button
                    flex={false}
                    style={[
                      Style.buttonGIF,
                      visibleGIF && {borderColor: Colors.primary},
                    ]}
                    opacity={0.4}
                    disabled={Boolean(commentImage)}
                    onPress={() => {
                      this.setState({visibleGIF: !this.state.visibleGIF});
                    }}>
                    <Text name={'camera'} size={14} color={Colors.gray5}>
                      GIF
                    </Text>
                  </Button>
                  <Block
                    row
                    center
                    color={Colors.white}
                    margin={[0, 0, 0, 15]}
                    style={{
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: Colors.gray8,
                    }}>
                    <TextInput
                      style={Style.textInput}
                      placeholder={strings('write_your_comment')}
                      numberOfLines={3}
                      value={commentInput}
                      placeholderTextColor={Colors.gray5}
                      onChangeText={this.onChangeComment}
                    />
                    <Button
                      style={{height: 15, paddingVertical: 0}}
                      onPress={() => this.sendComment(null)}>
                      <Icon
                        name={'chevron-right'}
                        size={16}
                        color={Colors.gray5}
                        style={{marginHorizontal: 10}}
                      />
                    </Button>
                  </Block>
                </Block>
              </Block>
            )}
          </Block>
        </KeyboardAvoidingView>

        <GalleryScreen
          visible={visibleGallery}
          ref={this.imagePicker}
          onSelected={this.onSelectImage}
          onClose={() => this.setState({visibleGallery: false})}
        />
      </Block>
    );
  }

  onSelectImage = (image) => {
    this.setState({commentImage: image});
  };
}

PostDetailScreen.defaultProps = {};

PostDetailScreen.propTypes = {
  errorCode: PropTypes.string,
  userActions: PropTypes.object,
  profile: PropTypes.object,
  listTeamInfo: PropTypes.array,
  userId: PropTypes.string,
};

const mapStateToProps = (state) => ({
  errorCode: state.user.errorCode,
  profile: state.user.profile,
  listTeamInfo: state.user.listTeamInfo,
  userId: state.user.userId,
  user: state.user,
  post: state.post,
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
  postActions: bindActionCreators(PostActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostDetailScreen);
