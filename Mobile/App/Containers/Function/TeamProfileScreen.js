import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import PostActions from '../../Stores/Post/Actions';
import {Image, TouchableOpacity, ScrollView, StatusBar} from 'react-native';
import {
  Button,
  Block,
  Text,
  Header,
  Loading,
  PostContent,
} from '../../Components';
import Style from './TeamProfileScreenStyle';
import {Screens} from '../../Utils/screens';
import {Constants} from '../../Utils/constants';
import {Images, ApplicationStyles, Colors} from '../../Theme';
import TeamActions from '../../Stores/Team/Actions';
import UserActions from '../../Stores/User/Actions';
import {Config} from '../../Config/index';
import {teamService} from '../../Services/TeamService';
import Toast from 'react-native-easy-toast';
import { strings } from '../../Locate/I18n';

class TeamProfileScreen extends Component {
  blockHeaderHeight = 0;
  constructor(props) {
    super(props);
    this.state = {
      errorCode: '',
      isInvite: false,
      team: {},
      teamId: null,
      teamPost: [],
      loadingJoin: false,
      loadingFollow: false,
      isScoll: false,
      isActiveButton: false,
      isFollow: false,
      isNormalUser: false,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    const {errorCode, team, navigation, teamPost} = nextProps;
    const {teamId} = navigation.state.params;
    const data = {
      errorCode,
      team,
      teamId,
      teamPost,
    };

    data.isNormalUser = !team.teamMemberRole ? true : false;

    if (team.teamMemberStatus && team.teamMemberStatus.length > 0) {
      const checkIsFollow = team.teamMemberStatus.filter(
        (item) => Constants.FOLOWING === item.statusId,
      );
      data.isFollow = checkIsFollow.length > 0 ? true : false;
      const checkIsActiveButton = team.teamMemberStatus.filter(
        (item) => Constants.REQUESTED === item.statusId,
      );
      data.isActiveButton = checkIsActiveButton.length > 0 ? true : false;
    }
    return data;
  }

  componentDidMount = async () => {
    const {teamActions, userId} = this.props;
    const {teamId} = this.state;
    teamActions.fetchPublicPost(teamId, true);
    teamActions.fetchTeam(teamId, userId);
  };

  filterAllPost = () => {
    const {teamId} = this.state;
    const {teamActions} = this.props;
    teamActions.fetchPublicPost(teamId, true);
  };

  onSelectPost = (post) => {
    const {navigation, postActions} = this.props;
    postActions.fetchPostDetailSuccess(post);
    navigation.navigate(Screens.POST_DETAIL);
  };

  renderPostNewFeed = () => {
    const {teamPost} = this.state;
    let listHtml = [];
    if (teamPost.length > 0) {
      teamPost.forEach((item, index) => {
        listHtml.push(
          <TouchableOpacity key={index} onPress={() => this.onSelectPost(item)}>
            <PostContent
              margin={[10]}
              color={Colors.white}
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

  handleLoadingJoin = (loadingJoin) => {
    this.setState({
      loadingJoin,
    });
  };
  handleLoadingFollow = (loadingFollow) => {
    this.setState({
      loadingFollow,
    });
  };
  handleRequestJoinTeam = async () => {
    this.handleLoadingJoin(true);
    const {team} = this.state;
    const {teamActions, userId} = this.props;
    const data = {
      teamId: team.teamId,
    };

    try {
      teamService.requestJoinTeam(data).then((response) => {
        this.handleLoadingJoin(false);
        if (response.success) {
          this.setState({
            isActiveButton: true,
          });
          teamActions.fetchTeam(team.teamId, userId);
        } else {
          const {message} = response;
          const {messageError} = message ? message : strings('join_failed');
          this.refs.toastFailed.show(messageError, DURATION.LENGTH_LONG);
        }
      });
    } catch (error) {
      this.refs.toastFailed.show(strings('join_failed'), DURATION.LENGTH_LONG);
      this.handleLoadingJoin(false);
    }
  };

  handleRequestFollowTeam = async () => {
    this.handleLoadingFollow(true);
    const {team} = this.state;
    const {userId, teamActions} = this.props;
    const data = {
      teamId: team.teamId,
    };
    try {
      teamService.requestFollowTeam(data).then((response) => {
        this.handleLoadingFollow(false);
        if (response.success) {
          teamActions.fetchTeam(team.teamId, userId);
          this.setState({
            isFollow: true,
          });
        } else {
          const {message} = response;
          const {messageError} = message ? message : strings('follow_failed');
          this.refs.toastFailed.show(messageError, DURATION.LENGTH_LONG);
        }
      });
    } catch (error) {
      this.refs.toastFailed.show(strings('follow_failed'), DURATION.LENGTH_LONG);
      this.handleLoadingFollow(false);
    }
  };

  handleRequestUnfollowTeam = async () => {
    this.handleLoadingFollow(true);
    const {userId, teamActions} = this.props;
    const {team} = this.state;
    const data = {
      userId,
      teamId: team.teamId,
    };
    try {
      teamService.requestUnfollowTeam(data).then((response) => {
        this.handleLoadingFollow(false);
        if (response.success) {
          teamActions.fetchTeam(team.teamId, userId);
          this.setState({
            isFollow: false,
          });
        } else {
          const {message} = response;
          const {messageError} = message ? message : strings('follow_failed');
          this.refs.toastFailed.show(messageError, DURATION.LENGTH_LONG);
        }
      });
    } catch (error) {
      this.refs.toastFailed.show(strings('follow_failed'), DURATION.LENGTH_LONG);
      this.handleLoadingFollow(false);
    }
  };

  onScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    let shouldChangeColor = false;
    if (
      y > this.blockHeaderHeight + StatusBar.currentHeight &&
      this.blockHeaderHeight > 0
    ) {
      shouldChangeColor = true;
    }
    const currentScroll = this.state.isScoll;
    if (currentScroll !== shouldChangeColor) {
      this.setState({
        isScoll: shouldChangeColor,
      });
    }
  };

  onBlockHeaderLayout = (e) => {
    this.blockHeaderHeight = e.nativeEvent.layout.height;
  };

  render() {
    const {navigation} = this.props;
    const {
      team,
      isScoll,
      loadingFollow,
      loadingJoin,
      isActiveButton,
      isFollow,
      isNormalUser,
    } = this.state;
    const imageUrl = `${Config.GET_IMAGE_URL}${
      team.teamAvatar ? team.teamAvatar : null
    }`;
    const totalAdmin =
      team.userAdmin && team.userAdmin.length ? team.userAdmin.length : 0;
    const totalUser =
      team.userMember && team.userMember.length ? team.userMember.length : 0;
    const totalMember = totalAdmin + totalUser;
    let status;
    if (team.teamMemberStatus && team.teamMemberStatus.length > 0) {
      team.teamMemberStatus.forEach((item) => {
        status = item.statusId;
      });
    }
    return (
      <Block>
        <Block
          onLayout={this.onBlockHeaderLayout}
          style={{
            backgroundColor: isScoll ? Colors.red : Colors.transparent,
            position: 'absolute',
            zIndex: 1,
          }}>
          <Header
            isShowBack
            navigation={navigation}
            title={team.teamName}
            transparent
          />
        </Block>
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={this.onScroll}>
          <Block style={Style.view}>
            <Block shadow style={Style.headerViewParent}>
              <Image
                style={Style.headerImageBg}
                source={Images.team_profile_header}
              />
              <Block style={Style.headerViewBg} />
              <TouchableOpacity
                style={Style.viewAvatar}
                disabled={isNormalUser}
                onPress={() =>
                  navigation.navigate(Screens.TEAM_PROFILE_DETAIL, {
                    teamId: team.teamId,
                  })
                }>
                <Image
                  style={Style.viewAvatar}
                  source={
                    team.teamAvatar
                      ? {uri: imageUrl}
                      : Images.team_profile_avatar
                  }
                />
              </TouchableOpacity>
            </Block>
            <Block column center>
              <TouchableOpacity
                disabled={isNormalUser}
                onPress={() =>
                  navigation.navigate(Screens.TEAM_PROFILE_DETAIL, {
                    teamId: team.teamId,
                  })
                }>
                <Text black style={Style.textNameTeam}>
                  {team.teamName ? team.teamName : ''}
                </Text>
              </TouchableOpacity>
              <Text style={Style.textNumberMember}>
                {totalMember ? totalMember : 0} member
              </Text>
              {isNormalUser ? (
                <Block flex={false} row>
                  <Button
                    disabled={isActiveButton}
                    color={isActiveButton ? Colors.gray5 : Colors.red}
                    style={Style.btnJoin}
                    onPress={() => this.handleRequestJoinTeam()}>
                    {loadingJoin ? (
                      <Loading size="small" color={Colors.white} />
                    ) : (
                      <Text
                        white
                        center
                        size={13.5}
                        style={{...ApplicationStyles.fontMPLUS1pBold}}>
                        {isActiveButton ? 'Sent' : 'Join'}
                      </Text>
                    )}
                  </Button>

                  <Button
                    color={isFollow ? Colors.gray5 : Colors.red}
                    style={Style.btnFollow}
                    onPress={() =>
                      status === Constants.FOLOWING
                        ? this.handleRequestUnfollowTeam()
                        : this.handleRequestFollowTeam()
                    }>
                    {loadingFollow ? (
                      <Loading size="small" color={Colors.white} />
                    ) : (
                      <Text
                        white
                        center
                        size={13.5}
                        style={{...ApplicationStyles.fontMPLUS1pBold}}>
                        {isFollow ? 'Followed' : 'Follow'}
                      </Text>
                    )}
                  </Button>
                </Block>
              ) : null}
            </Block>
            <Block
              block
              card
              white
              shadow
              column
              margin={[15, 10, 10, 10]}
              padding={[18]}
              style={Style.viewInfo}>
              <Block block row>
                <Image
                  source={Images.slogan}
                  style={[Style.iconInfo, {marginTop: 5}]}
                />
                <Block column margin={[0, 0, 0, 10]}>
                  <Text black style={Style.textInfoTitle}>
                    Slogan
                  </Text>
                  <Text style={Style.textInfoSubTitle}>
                    {team.teamSlogan ? team.teamSlogan : ''}
                  </Text>
                </Block>
              </Block>
              <Block block row margin={[13, 0, 0, 0]}>
                <Image
                  source={Images.aboutus}
                  style={[Style.iconInfo, {marginTop: 4}]}
                />
                <Block column margin={[0, 0, 0, 10]}>
                  <Text style={Style.textInfoTitle}>About us</Text>
                  <Text style={Style.textInfoSubTitle}>
                    {team.teamDescription ? team.teamDescription : ''}
                  </Text>
                </Block>
              </Block>
              <Block block row margin={[13, 0, 0, 0]}>
                <Image
                  source={Images.sport}
                  style={[Style.iconInfo, {marginTop: 5}]}
                />
                <Block column margin={[0, 0, 0, 10]}>
                  <Text style={Style.textInfoTitle}>Sport</Text>
                  <Text style={Style.textInfoSubTitle}>
                    {team.sportName ? team.sportName : ''}
                  </Text>
                </Block>
              </Block>
              <Block block row margin={[13, 0, 0, 0]}>
                <Image
                  source={Images.national}
                  style={[Style.iconInfo, {marginTop: 6}]}
                />
                <Block column margin={[0, 0, 0, 10]}>
                  <Text style={Style.textInfoTitle}>National</Text>
                  <Text style={Style.textInfoSubTitle}>
                    {team.teamNational ? team.teamNational : ''}
                  </Text>
                </Block>
              </Block>
            </Block>
            <Block row space={'between'} margin={[0, 10, 0, 10]}>
              <Button
                color={Colors.red}
                style={Style.btnFillter}
                onPress={() => this.filterAllPost()}>
                <Text white center style={Style.titleButtonFillter}>
                  All
                </Text>
              </Button>
              <Button white style={Style.btnFillter}>
                <Text
                  color={Colors.red}
                  center
                  style={Style.titleButtonFillter}>
                  Posts
                </Text>
              </Button>
              <Button white style={Style.btnFillter}>
                <Text
                  color={Colors.red}
                  center
                  style={Style.titleButtonFillter}>
                  Videos
                </Text>
              </Button>
              <Button white style={Style.btnFillter}>
                <Text
                  color={Colors.red}
                  center
                  style={Style.titleButtonFillter}>
                  Photo
                </Text>
              </Button>
              <Button white style={Style.btnFillter}>
                <Text
                  color={Colors.red}
                  center
                  style={Style.titleButtonFillter}>
                  Event
                </Text>
              </Button>
            </Block>
            <Block>{this.renderPostNewFeed()}</Block>
          </Block>
          <Toast
            ref="toastFailed"
            style={{backgroundColor: Colors.error}}
            position="top"
            positionValue={200}
            fadeInDuration={750}
            fadeOutDuration={1000}
            opacity={0.8}
          />
        </ScrollView>
      </Block>
    );
  }
}

TeamProfileScreen.defaultProps = {};

TeamProfileScreen.propTypes = {
  errorCode: PropTypes.string,
  userActions: PropTypes.object,
  team: PropTypes.object,
  teamPost: PropTypes.array,
  userId: PropTypes.string,
};

const mapStateToProps = (state) => ({
  errorCode: state.user.errorCode,
  team: state.team.team,
  teamPost: state.team.teamPost,
  userId: state.user.userId,
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
  teamActions: bindActionCreators(TeamActions, dispatch),
  postActions: bindActionCreators(PostActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(TeamProfileScreen);
