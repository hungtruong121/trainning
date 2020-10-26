/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {withNavigation} from 'react-navigation';
import {bindActionCreators} from 'redux';

import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Share from 'react-native-share';

import {Colors} from 'App/Theme';
import {getTimeAgo} from '../../../Utils/commonFunction';
import {Button, Block, Text} from '../../../Components';
import PostActions from '../../../Stores/Post/Actions';
import { Config } from '../../../Config';

class SurveyToolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      surveyDetail: {},
      isLiked: false,
      numberOfLikes: 0,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {surveyDetail} = nextProps;
    if (surveyDetail != prevState.surveyDetail) {
      return {
        surveyDetail,
        isLiked: surveyDetail.isLiked,
        numberOfLikes: surveyDetail.numberOfLikes || 0,
      };
    }

    return null;
  }

  onPressLike = () => {
    const {surveyDetail, isLiked, numberOfLikes} = this.state;
    const {postActions} = this.props;
    let {teamId, postId, postCommentId} = surveyDetail;

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
    const {surveyDetail, isLiked, numberOfLikes} = this.state;
    const {style} = this.props;

    const containerStyle = [styles.container, style];

    const timeAgo = getTimeAgo(surveyDetail.createdDate);

    return (
      <Block flex={false} row center style={containerStyle}>
        <Button style={styles.button} opacity={0.5} onPress={this.onPressLike}>
          <Icon
            name={isLiked ? 'heart' : 'heart-o'}
            size={13}
            color={Colors.primary}
          />
          <Text style={{marginLeft: 3}} color={Colors.primary} size={13}>
            {numberOfLikes || 0}
          </Text>
        </Button>

        <Block flex={false} style={styles.button} row>
          <MaterialIcons name={'person-outline'} size={16} />
          <Text style={{marginLeft: 3}} size={13}>
            17/30
          </Text>
        </Block>

        <Button style={styles.button} opacity={0.5} onPress={this.onPressShare}>
          <AntDesign name={'upload'} size={13} />
        </Button>

        <Text color={Colors.gray5} size={13}>
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
)(withNavigation(SurveyToolbar));
