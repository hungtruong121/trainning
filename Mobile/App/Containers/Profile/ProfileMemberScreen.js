/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import UserActions from '../../Stores/User/Actions';
import Style from './ProfileScreenStyle';
import {ApplicationStyles} from '../../Theme';
import MemberInfo from './MemberInfo';
import {ScrollView} from 'react-native';
import {Block, Header, Loading} from '../../Components';

class ProfileMemberScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileMember: {},
      listTeamInfoMember: [],
      errorCode: '',
      userId: null,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    const {
      errorCode,
      profileMember,
      listTeamInfoMember,
      navigation,
    } = nextProps;
    const {userId} = navigation.state.params;
    const data = {
      errorCode,
      profileMember,
      listTeamInfoMember: listTeamInfoMember ? listTeamInfoMember : [],
      userId,
    };

    return data;
  }

  componentDidMount = async () => {
    const {userActions} = this.props;
    const {userId} = this.state;
    userActions.fetchProfile(userId, true);
    userActions.fetchPersonalTeamInfo(userId, true);
  };

  render() {
    const {navigation, loadingListTeamInfo} = this.props;
    const {profileMember, listTeamInfoMember} = this.state;
    const {userFullName} = profileMember;

    return (
      <Block style={Style.view}>
        <Header
          title={userFullName}
          navigation={navigation}
          isShowBack
          widthLeft="10%"
          widthCenter="80%"
          widthRight="10%"
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            ...ApplicationStyles.paddingHorizontalView,
            paddingVertical: 20,
          }}>
          {loadingListTeamInfo ? (
            <Loading color="red" />
          ) : (
            <MemberInfo
              userInfo={profileMember}
              listTeamInfo={listTeamInfoMember}
            />
          )}
        </ScrollView>
      </Block>
    );
  }
}

ProfileMemberScreen.defaultProps = {};

ProfileMemberScreen.propTypes = {
  errorCode: PropTypes.string,
  userActions: PropTypes.object,
  profileMember: PropTypes.object,
  listTeamInfoMember: PropTypes.array,
  listRelatedPost: PropTypes.array,
};

const mapStateToProps = (state) => ({
  errorCode: state.user.errorCode,
  profileMember: state.user.profileMember,
  listTeamInfoMember: state.user.listTeamInfoMember,
  listRelatedPost: state.user.listRelatedPost,
  loadingListTeamInfo: state.user.loadingListTeamInfo,
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileMemberScreen);
