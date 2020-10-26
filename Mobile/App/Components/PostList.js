import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withNavigation} from 'react-navigation';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import UserActions from '../Stores/User/Actions';
import PostActions from '../Stores/Post/Actions';
import {Screens} from '../Utils/screens';
import {Colors} from '../Theme';

import {FlatList, RefreshControl} from 'react-native';
import {Block, PostContent} from '.';
import PostContentPhoto from './PostContentPhoto';
import { PostType } from '../Constants';
import PostSurveyContent from '../Containers/CreatePost/Survey/PostSurveyContent';

class ListPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamPosts: this.props.teamPosts || [],
      refreshing: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {teamPosts} = nextProps;
    if (teamPosts != prevState.teamPosts) {
      return {teamPosts, refreshing: false};
    }
    return null;
  }

  onSelectPost = (post) => {
    const {navigation, postActions} = this.props;
    postActions.fetchPostDetailSuccess(post);
    navigation.navigate(Screens.POST_DETAIL);
  };

  renderItem = ({item, index}) => {
    const {navigation} = this.props;
    if (
      item.postType == PostType.POST_PHOTO ||
      (item.postChild && item.postChild.length > 0)
    ) {
      return (
        <PostContentPhoto
          margin={[10]}
          color={Colors.white}
          card
          shadow
          postDetail={item}
          key={index}
        />
      );
    }

    if (item.postType == PostType.POST_SURVEY_TEXT || item.postType == PostType.POST_SURVEY_SELECTION) {
      return (
        <PostSurveyContent
          navigation={navigation}
          surveyDetail={item}
          key={index}
        />
      );
    }

    return (
      <PostContent
        margin={[10]}
        color={Colors.white}
        card
        shadow
        postDetail={item}
        key={index}
      />
    );
  };

  render() {
    const {teamPosts} = this.state;
    const {refreshControl} = this.props;
    return (
      <Block>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={teamPosts}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={refreshControl}
            />
          }
        />
      </Block>
    );
  }
}

ListPost.defaultProps = {};

ListPost.propTypes = {
  errorCode: PropTypes.string,
  profile: PropTypes.object,
};

const mapStateToProps = (state) => ({
  errorCode: state.user.errorCode,
  profile: state.user.profile,
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
  postActions: bindActionCreators(PostActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withNavigation(ListPost));
