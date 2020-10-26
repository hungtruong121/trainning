/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {withNavigation} from 'react-navigation';
import {bindActionCreators} from 'redux';

import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Share from 'react-native-share';

import {Colors} from 'App/Theme';
import {Button, Block, Text} from '.';
import {getTimeAgo} from '../Utils/commonFunction';
import PostActions from '../Stores/Post/Actions';
import {Screens} from '../Utils/screens';
import { Config } from '../Config';

class ToolbarReact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postDetail: {},
      isLiked: false,
      numberOfLikes: 0,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {postDetail} = nextProps;
    if (postDetail != prevState.postDetail) {
      return {
        postDetail,
        isLiked: postDetail.isLiked,
        numberOfLikes: postDetail.numberOfLikes || 0,
      };
    }

    return null;
  }

  onPressLike = () => {
    const {postDetail, isLiked, numberOfLikes} = this.state;
    const {postActions} = this.props;
    let {teamId, postId, postCommentId} = postDetail;

    this.setState({
      isLiked: !isLiked,
      numberOfLikes: numberOfLikes + (isLiked ? -1 : 1),
    });
    const data = {
      teamId,
      postId,
      postCommentId,
    };
    postActions.fetchLikeComment(data);
  };

  onPressComment = () => {
    const {postDetail} = this.state;
    const {navigation, postActions} = this.props;
    postActions.fetchPostDetailSuccess(postDetail);
    navigation.navigate(Screens.POST_DETAIL);
  };

  onPressShare = () => {
    const shareOptions = {
      title: 'Share Post',
      failOnCancel: false,
      urls: [Config.API_URL],
    };

    Share.open(shareOptions)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });
  };

  render() {
    const {postDetail, isLiked, numberOfLikes} = this.state;
    const {style} = this.props;

    const containerStyle = [styles.container, style];

    const timeAgo = getTimeAgo(postDetail.createdDate);

    return (
      <Block flex={false} row center style={containerStyle}>
        <Button style={styles.button} opacity={0.5} onPress={this.onPressLike}>
          <Icon
            name={isLiked ? 'heart' : 'heart-o'}
            size={16}
            color={Colors.primary}
          />
          <Text style={{marginLeft: 3}} color={Colors.primary} size={16}>
            {numberOfLikes || 0}
          </Text>
        </Button>
        <Button
          style={styles.button}
          opacity={0.5}
          onPress={this.onPressComment}>
          <FontAwesome5 name={'comment'} size={16} />
          <Text style={{marginLeft: 3}} size={16}>
            {postDetail.numberOfComments || 0}
          </Text>
        </Button>
        <Button style={styles.button} opacity={0.5} onPress={this.onPressShare}>
          <AntDesign name={'upload'} size={16} />
        </Button>
        <Text color={Colors.gray5} size={16}>
          {timeAgo}
        </Text>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  button: {
    flexDirection: 'row',
    marginVertical: 0,
    paddingHorizontal: 10,
    height: 30,
    alignItems: 'center',
    backgroundColor: null,
  },
});

const mapStateToProps = (state) => ({
  errorCode: state.user.errorCode,
});

const mapDispatchToProps = (dispatch) => ({
  postActions: bindActionCreators(PostActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withNavigation(ToolbarReact));
