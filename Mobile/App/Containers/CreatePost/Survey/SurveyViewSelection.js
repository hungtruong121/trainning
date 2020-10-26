/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Colors} from 'App/Theme';
import {
  Block,
  Text,
} from '../../../Components';
import UserActions from '../../../Stores/User/Actions';
import PostActions from '../../../Stores/Post/Actions';
import {postService} from '../../../Services/PostService';
import SurveySelectionAnswer from './SurveySelectionAnswer';
import { calculateRateSurvey } from '../../../Utils/commonFunction';

class SurveyViewSelection extends Component {
  constructor(props) {
    super(props);
    this.scrollView = React.createRef();
    this.dialogPrivacy = React.createRef();
    this.inputAddMoreSelection = React.createRef();

    this.state = {
      errorCode: '',
      surveyDetail: null,
      isViewOpinion: false,
      selectionInput: '',
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {profile, team, surveyDetail} = nextProps;
    if (profile != prevState.profile || team != prevState.team || surveyDetail != prevState.surveyDetail) {
      calculateRateSurvey(surveyDetail);
      return {profile, team, surveyDetail};
    }

    return null;
  }

  componentDidMount() {}

  onSelectedPrivacy = (privacyId, userInclude) => {
    this.setState({privacyId, userInclude});
  };

  render() {
    const {
      surveyDetail,
      isViewOpinion,
    } = this.state;

    return (
      <Block flex={false}>
        {isViewOpinion ? (
          <SurveySelectionAnswer
            surveyDetail={surveyDetail}
          />
        ) : (
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
              onPress={() => this.setState({ isViewOpinion: true })}>
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
        )}
      </Block>
    );
  }
}

SurveyViewSelection.defaultProps = {};

SurveyViewSelection.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(SurveyViewSelection);
