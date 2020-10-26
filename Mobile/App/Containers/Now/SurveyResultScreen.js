/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import { FlatList, TouchableOpacity, Image } from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import UserActions from '../../Stores/User/Actions';
import PostActions from '../../Stores/Post/Actions';
import Style from './SurveyResultScreenStyle';
import {ApplicationStyles, Colors} from '../../Theme';
import {
  Header,
  Block,
  Text,
  ImageCircle,
} from '../../Components';

import {fileService} from '../../Services/FileService';
import { Config } from '../../Config';
import { PostType } from '../../Constants';
import { postService } from '../../Services/PostService';

class SurveyResultScreen extends Component {
  constructor(props) {
    super(props);
    this.flatListRef = React.createRef();

    const {navigation} = this.props;
    let surveyDetail = navigation.getParam('surveyDetail', {});

    this.state = {
      surveyDetail: surveyDetail,
      indexSelected: 0,
      mainColor: surveyDetail.backgroundImage ? Colors.white : Colors.black,
      listAnsResult: [],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {post} = nextProps;
    if (post.postDetail != prevState.postDetail) {
      return {postDetail: post.postDetail};
    }

    return null;
  }
  
  componentDidMount() {
    const {surveyDetail} = this.state;
    if(surveyDetail.postType == PostType.POST_SURVEY_TEXT) {
      postService.getListSurveyAnswer(surveyDetail.postId).then(
        response => {
          if(response.success) {
            this.setState({listAnsResult: response.data.listAnsResult});
          }
        }
      );
      return;
    }

    postService.getListSurveyVote(surveyDetail.postId).then(
      response => {
        if(response.success) {
          this.setState({listAnsResult: response.data.listAnsResult});
        }
      }
    );
  }

  scrollToIndex = (index) => {
    this.flatListRef.current.scrollToIndex({animated: true, index: index, viewPosition: 0.5});
    this.setState({indexSelected: index});
  }

  renderItemTab = ({item, index}) => {
    const {indexSelected} = this.state;
    return (
      <TouchableOpacity onPress={() => this.scrollToIndex(index)}>
        <Block flex={false} padding={[10, 20, 10, 20]} height={40}>
          <Text color={Colors.white}>{item.ansContent} ({item.totalAnsByAnsId})</Text>
          {index == indexSelected ? (
            <Block
              flex={false}
              height={6}
              color={Colors.white}
              absolute
              style={{left: 0, right: 0, bottom: 2}}
            />
          ) : null}
        </Block>
      </TouchableOpacity>
    );
  };

  renderItemUser = ({item, index}) => {
    const {surveyDetail, mainColor} = this.state;
    return (
      <Block flex={false} row key={index}>
        <ImageCircle
          source={{uri: Config.GET_IMAGE_URL + item.userAvatar}}
          style={{margin: 15, marginBottom: 5}}
          size={55}
        />
        <Block style={{borderBottomWidth: 1, borderColor: Colors.gray13}} margin={[5, 10, 5, 10]} middle>
          <Text color={mainColor} size={13} style={{...ApplicationStyles.fontMPLUS1pRegular}}>{item.userFullName}</Text>
            {surveyDetail.postType == PostType.POST_SURVEY_TEXT ? (
              <Text color={mainColor} size={12.5} style={{marginTop: 10}}>{item.ansContent}</Text>
            ) : null}
        </Block>
      </Block>
    );
  };

  render() {
    const {surveyDetail, listAnsResult, indexSelected} = this.state;
    const {navigation} = this.props;

    const listUserVoted = surveyDetail.postType == PostType.POST_SURVEY_SELECTION
      ? (listAnsResult[indexSelected] && listAnsResult[indexSelected].voteInfo || [])
      : listAnsResult;

    return (
      <Block style={Style.view}>
        <Header
          isShowBack
          navigation={navigation}
          title={'Response Results'}
        />
        <Block flex={false} color={Colors.primary} middle>
          {surveyDetail.postType == PostType.POST_SURVEY_TEXT ? (
            <Block flex={false} center>
              <Text color={Colors.white} size={20} style={{marginHorizontal: 15, marginBottom: 10}}>{surveyDetail.postContent}</Text>
            </Block>
          ) : (
            <FlatList
              data={surveyDetail.optionList}
              ref={this.flatListRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled={true}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.renderItemTab}
            />
          )}
        </Block>
        <Block>
          {surveyDetail.backgroundImage ? (
            <Image
              style={{ width: '100%', height: '100%', position: 'absolute' }}
              source={{ uri: Config.GET_IMAGE_URL + surveyDetail.backgroundImage }}
            />
          ) : null}
          <Block color={surveyDetail.backgroundImage ? Colors.opacity : Colors.white}>
            <FlatList
              data={listUserVoted}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.renderItemUser}
            />
          </Block>
        </Block>
      </Block>
    );
  }
}

SurveyResultScreen.defaultProps = {};

SurveyResultScreen.propTypes = {
  errorCode: PropTypes.string,
  userActions: PropTypes.object,
  profile: PropTypes.object,
  listTeamInfo: PropTypes.array,
  userId: PropTypes.string,
};

const mapStateToProps = (state) => ({
  errorCode: state.user.errorCode,
  profile: state.user.profile,
  listTeamMembers: state.team.listTeamMembers,
  listTeamInfo: state.user.listTeamInfo,
  userId: state.user.userId,
  user: state.user,
  post: state.post,
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
  postActions: bindActionCreators(PostActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SurveyResultScreen);
