/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import UserActions from '../../Stores/User/Actions';
import Style from './ProfileScreenStyle';
import {Screens} from '../../Utils/screens';
import {Images, ApplicationStyles, Colors} from '../../Theme';
import MemberInfo from '../Profile/MemberInfo';
import PostActions from '../../Stores/Post/Actions';
import {Image, TouchableOpacity, ScrollView} from 'react-native';
import {Block, Text, Header, PostContent} from '../../Components';
import {strings} from '../../Locate/I18n';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {},
      listTeamInfo: [],
      errorCode: '',
    };
  }

  static getDerivedStateFromProps(nextProps) {
    const {errorCode, profile, listTeamInfo} = nextProps;
    const data = {errorCode, profile, listTeamInfo};

    return data;
  }

  componentDidMount = async () => {
    const {userActions, userId} = this.props;
    userActions.fetchPersonalTeamInfo(userId, false);
    userActions.fetchPersonalRelatedPost(userId);
  };

  componentDidMount = async () => {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      // The screen is focused
      // Call any action
      this.fetchData();
    });
  };

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener && this.focusListener.remove();
  }

  fetchData = () => {
    const {userActions, userId} = this.props;
    userActions.fetchPersonalTeamInfo(userId, false);
    userActions.fetchPersonalRelatedPost(userId);
  };

  renderPostNewFeed = () => {
    const {listRelatedPost} = this.props;
    let listHtml = [];
    if (listRelatedPost.length > 0) {
      listRelatedPost.forEach((item, index) => {
        listHtml.push(
          <TouchableOpacity key={index} onPress={() => this.onSelectPost(item)}>
            <PostContent
              margin={[10]}
              color={'white'}
              card
              shadow
              postDetail={item}
            />
          </TouchableOpacity>,
        );
      });
    }
    return <Block>{listHtml}</Block>;
  };

  renderLeftHeader = () => {
    const {navigation} = this.props;

    return (
      <TouchableOpacity onPress={() => navigation.navigate(Screens.FOLLOWING)}>
        <Text size={15} color={Colors.white}>
          Following
        </Text>
      </TouchableOpacity>
    );
  };

  onSelectPost = (post) => {
    const {navigation, postActions} = this.props;
    postActions.fetchPostDetailSuccess(post);
    navigation.navigate(Screens.POST_DETAIL);
  };

  renderRightHeader = () => {
    const {navigation} = this.props;
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate(Screens.SETTING)}
        style={{paddingVertical: 15}}>
        <Image source={Images.iconSettings} style={{height: 15, width: 15}} />
      </TouchableOpacity>
    );
  };

  render() {
    const {navigation} = this.props;
    const {profile, listTeamInfo} = this.state;

    return (
      <Block style={Style.view}>
        <Header
          leftIcon={this.renderLeftHeader()}
          rightIcon={this.renderRightHeader()}
          title={strings('personal')}
          navigation={navigation}
          widthLeft="25%"
          widthCenter="50%"
          widthRight="25%"
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            ...ApplicationStyles.paddingHorizontalView,
            paddingVertical: 20,
          }}>
          <MemberInfo
            userInfo={profile}
            listTeamInfo={listTeamInfo ? listTeamInfo : null}
          />
          <Text
            size={14}
            color={Colors.black}
            style={{...ApplicationStyles.fontMPLUS1pBold, marginTop: 34}}>
            RELATED POSTS
          </Text>
          <Block margin={[0, -10, 0, -10]}>{this.renderPostNewFeed()}</Block>
        </ScrollView>
      </Block>
    );
  }
}

ProfileScreen.defaultProps = {};

ProfileScreen.propTypes = {
  errorCode: PropTypes.string,
  userActions: PropTypes.object,
  profile: PropTypes.object,
  listTeamInfo: PropTypes.array,
  userId: PropTypes.string,
  listRelatedPost: PropTypes.array,
};

const mapStateToProps = (state) => ({
  errorCode: state.user.errorCode,
  profile: state.user.profile,
  listTeamInfo: state.user.listTeamInfo,
  userId: state.user.userId,
  listRelatedPost: state.user.listRelatedPost,
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
  postActions: bindActionCreators(PostActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
