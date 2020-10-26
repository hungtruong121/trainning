import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import UserActions from '../../Stores/User/Actions';
import TeamActions from '../../Stores/Team/Actions';
import Style from './ExploreScreenStyle';
import {Screens} from '../../Utils/screens';
import {Block, Header, SwitchTeam, RightHeader} from '../../Components';

class ExploreScreen extends Component {
  constructor(props) {
    super(props);

    this.webView = React.createRef();

    this.state = {
      privacy: 0,
      teamPosts: [],
      refreshing: false,
    };

    this.getTeamPosts();
  }

  getTeamPosts() {
    const {user, teamActions} = this.props;
    teamActions.fetchPublicPost(user.profile.activeTeam, false);
  }

  onSwipeRight() {
    const {navigation} = this.props;
    navigation.navigate(Screens.SWITCH_TEAM);
  }

  render() {
    const {navigation} = this.props;

    return (
      <Block style={Style.view}>
        <Header
          title={'Explore'}
          leftIcon={<SwitchTeam navigation={navigation} />}
          rightIcon={<RightHeader navigation={navigation} />}
        />
      </Block>
    );
  }

  _sendAction(type, action, data) {
    let jsonString = JSON.stringify({type, name: action, data});
    if (this.webView) {
      this.webView.current.postMessage(jsonString);
    }
  }
}

ExploreScreen.defaultProps = {};

ExploreScreen.propTypes = {
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
  team: state.team,
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
  teamActions: bindActionCreators(TeamActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExploreScreen);
