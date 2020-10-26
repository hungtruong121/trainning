/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Colors} from 'App/Theme';
import {
  Block,
  Text,
  Input,
  Button,
} from '../../../Components';
import UserActions from '../../../Stores/User/Actions';
import PostActions from '../../../Stores/Post/Actions';
import {Privacy} from '../../..//Constants';
import {strings} from '../../../Locate/I18n';
import {Screens} from '../../../Utils/screens';
import { postService } from '../../../Services/PostService';

class SurveyViewText extends Component {
  constructor(props) {
    super(props);
    this.scrollView = React.createRef();
    this.dialogPrivacy = React.createRef();

    const {navigation} = this.props;
    this.privacyId = navigation.getParam('privacyId', Privacy.PUBLIC);
    this.userInclude = navigation.getParam('userInclude', []);
    this.surveyDetail = this.props.surveyDetail;

    this.state = {
      errorCode: '',
      privacyId: this.privacyId,
      userInclude: this.userInclude,
      surveyDetail: null,
      isAnswered: false,
      answerContent: '',
      isViewResponse: false,
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
    this.setState({privacyId, userInclude});
  };

  sendSurveyAnswer = () => {
    const {surveyDetail, answerContent} = this.state;
    const {postActions} = this.props;
    let formData = new FormData();
    const answerInfo = {
      postId: surveyDetail.postId,
      answerList: [
        {
          postSurveyContent: answerContent.trim(),
        }
      ]
    };
    formData.append('answerInfo', JSON.stringify(answerInfo));

    surveyDetail.flagUserAnsSurvey = true;
    this.setState({surveyDetail, answerContent: '', isViewResponse: false});

    postActions.fetchSendAnswerSurvey(formData);
  };

  render() {
    const {
      surveyDetail,
      isViewResponse,
      answerContent,
    } = this.state;

    return (
      <Block flex={false}>
        {isViewResponse ? (
          <Block flex={false} marginTop={20} padding={[5, 10, 5, 10]} card color={Colors.white} style={{borderWidth: 1, borderColor: Colors.gray5}}>
            <Input
              style={{borderWidth: 0, height: 100, color: Colors.black}}
              multiline
              value={answerContent}
              autoFocus={true}
              placeholder={strings('write_something')}
              placeholderTextColor={Colors.gray5}
              onChangeText={(answerContent) => this.setState({answerContent})}
            />
            <TouchableOpacity
              style={{
                width: 25,
                height: 25,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                top: 0,
                right: 0,
              }}
              onPress={() => this.setState({isViewResponse: false})}>
              <MaterialIcons name={'clear'} size={15} color={Colors.black} />
            </TouchableOpacity>
            {answerContent && answerContent.trim() ? (
              <TouchableOpacity
                style={{
                  width: 25,
                  height: 25,
                  borderRadius: 13,
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  backgroundColor: Colors.primary,
                  bottom: 5,
                  right: 5,
                  zIndex: 100
                }}
                onPress={this.sendSurveyAnswer}>
                <Icon name={'send'} size={15} color={Colors.white} />
              </TouchableOpacity>
            ): null}
          </Block>
        ) : (
          !surveyDetail.flagUserAnsSurvey ? (
            <Block flex={false} center marginTop={20}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: Colors.black,
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  borderRadius: 5,
                }}
                onPress={() => this.setState({ isViewResponse: true })}>
                <Text color={Colors.white} size={15}>
                  Let me know your opinion
              </Text>
                <MaterialIcons
                  name={'open-in-new'}
                  size={15}
                  color={Colors.white}
                  style={{ marginLeft: 10 }}
                />
              </TouchableOpacity>
            </Block>
          ) : null
        )}
      </Block>
    );
  }
}

SurveyViewText.defaultProps = {};

SurveyViewText.propTypes = {
  errorCode: PropTypes.string,
  userActions: PropTypes.object,
};

const mapStateToProps = (state) => ({
  profile: state.user.profile,
  team: state.team.team,
  listTeamMembers: state.team.listTeamMembers,
  postDetail: state.post.postDetail,
  privacyId: state.post.privacyId,
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
  postActions: bindActionCreators(PostActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SurveyViewText);
