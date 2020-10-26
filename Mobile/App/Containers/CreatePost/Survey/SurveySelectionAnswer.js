/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Colors} from 'App/Theme';
import {
  Block,
  Input,
} from '../../../Components';
import UserActions from '../../../Stores/User/Actions';
import PostActions from '../../../Stores/Post/Actions';
import SurveyPercentBar from './SurveyPercentBar';
import SurveyImageItem from './SurveyImageItem';

class SurveySelectionAnswer extends Component {
  constructor(props) {
    super(props);
    this.scrollView = React.createRef();
    this.dialogPrivacy = React.createRef();
    this.inputAddMoreSelection = React.createRef();

    this.state = {
      errorCode: '',
      surveyDetail: null,
      selectionInput: '',
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

  addSelection = () => {
    let {surveyDetail, selectionInput} = this.state;
    const content = selectionInput.trim();
    this.setState({selectionInput: ''});

    this.fetchAddMoreSelection(surveyDetail.postId, content)
  };

  fetchAddMoreSelection = (postId, content) => {
    const {postActions} = this.props;
    let formData = new FormData();
    const answerInfo = {
      postId,
      answerList: [{postSurveyContent: content}],
    };
    formData.append('answerInfo', JSON.stringify(answerInfo));
    postActions.fetchSendAnswerSurvey(formData);
  }

  onVoteSurvey = (index) => {
    const {surveyDetail} = this.state;
    const {postActions} = this.props;
    const selection = surveyDetail.optionList[index];

    const data = {
      postId: surveyDetail.postId,
      votes: [{ ansId: selection.ansId }],
    };
    postActions.fetchVoteSelection(data);
    surveyDetail.flagUserAnsSurvey = true;
    this.setState({surveyDetail});
  };

  render() {
    const {
      surveyDetail,
      selectionInput,
      containerWidth,
    } = this.state;

    const {mainColor} = this.props;
    const {optionList} = surveyDetail;

    const imageWidth = ((containerWidth || 0) - 10) / 2;

    return (
      <Block flex={false} marginTop={20}>
        {surveyDetail.selectionImage ? (
          <Block
            flex={false}
            row
            wrap
            onLayout={(event) =>
              this.setState({
                containerWidth: event.nativeEvent.layout.width,
              })
            }>
            {optionList.map((selection, index) => {
              let disabled = false;
              if(surveyDetail.isMultiple) {
                disabled = selection.userSelected;
              }
              else {
                disabled = surveyDetail.flagUserAnsSurvey;
              }
              return (
                <SurveyImageItem
                  key={index}
                  style={{marginTop: index > 1 ? 15 : 0}}
                  imageWidth={imageWidth}
                  marginLeft={index % 2 === 0 ? 0 : 10}
                  disabled={disabled}
                  selection={selection}
                  mainColor={mainColor}
                  onPress={() => this.onVoteSurvey(index)}
                />
              )
            })}
          </Block>
        ) : (
          <Block flex={false}>
            {optionList.map((selection, index) =>  {
              let disabled = false;
              if(surveyDetail.isMultiple) {
                disabled = selection.userSelected;
              }
              else {
                disabled = surveyDetail.flagUserAnsSurvey;
              }
              return (
                <SurveyPercentBar
                  key={index}
                  style={{marginTop: index > 0 ? 15 : 0}}
                  selection={selection}
                  disabled={disabled}
                  onPress={() => this.onVoteSurvey(index)}
                />
              )
            })}
          </Block>
        )}
        {surveyDetail.isExtendsAns ? (
          <Block
            flex={false}
            row
            center
            marginTop={15}
            color={Colors.black}
            card>
            <FontAwesome5
              name={'plus'}
              color={Colors.white}
              size={15}
              style={{marginLeft: 10, marginRight: 6}}
            />
            <Block height={32} marginRight={10} middle>
              <Input
                refName={this.inputAddMoreSelection}
                style={{borderWidth: 0, height: null, paddingVertical: 5}}
                maxLength={30}
                placeholder={'Add more selection...'}
                placeholderTextColor={Colors.gray9}
                value={selectionInput}
                onChangeText={(text) => this.setState({ selectionInput: text })}
              />
            </Block>
            {selectionInput && selectionInput.trim() ? (
              <TouchableOpacity
                style={{ paddingRight: 10 }}
                onPress={this.addSelection}>
                <Icon name={'check'} color={Colors.green} size={20} />
              </TouchableOpacity>
            ) : null}
          </Block>
        ) : null}
      </Block>
    );
  }
}

SurveySelectionAnswer.defaultProps = {};

SurveySelectionAnswer.propTypes = {
  errorCode: PropTypes.string,
  userActions: PropTypes.object,
};

const mapStateToProps = (state) => ({
  profile: state.user.profile,
  team: state.team.team,
  postDetail: state.post.postDetail,
  privacyId: state.post.privacyId,
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
  postActions: bindActionCreators(PostActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SurveySelectionAnswer);
