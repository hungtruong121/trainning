/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import {Image, ScrollView} from 'react-native';
import {
  Block,
  Text,
  Header,
  ImageCircle,
  SwitchTeam,
  DialogPrivacy,
  ButtonPrivacy,
} from '../../Components';
import {getPrivacy, savePrivacy} from '../../Utils/storage.helper';
import {strings} from '../../Locate/I18n';
import Style from './MenuPostScreenStyle';
import {Colors, Images} from 'App/Theme';
import {Privacy} from '../..//Constants';
import {Screens} from '../../Utils/screens';
import PostItem from './PostItem';
import {Config} from '../../Config';
import UserActions from '../../Stores/User/Actions';
import TeamActions from '../../Stores/Team/Actions';

class MenuPostScreen extends Component {
  constructor(props) {
    super(props);

    this.dialogPrivacy = React.createRef();

    this.state = {
      errorCode: '',
      privacyId: Privacy.PUBLIC,
      userInclude: [],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {profile, team, teamActions} = nextProps;
    if (profile != prevState.profile || team != prevState.team) {
      if (profile) {
        teamActions.fetchTeamMembers(profile.activeTeam, '');
      }
      return {profile, team};
    }

    return null;
  }

  componentDidMount() {
    const {profile, team, teamActions} = this.props;
    if (team && team.teamId) {
      getPrivacy().then((result) => this.setState({privacyId: result}));
    } else {
      teamActions.fetchTeam(profile.activeTeam, profile.userId);
    }
  }

  onChangePrivacy = async (privacyId, userInclude) => {
    this.setState({privacyId, userInclude});
    await savePrivacy(privacyId);
  };

  menuCreatePost = (screen) => {
    const {privacyId, userInclude} = this.state;
    this.props.navigation.navigate(screen, {privacyId, userInclude});
  };

  render() {
    const {privacyId, userInclude} = this.state;
    const {profile, team, navigation, listTeamMembers} = this.props;

    return (
      <>
        <Block flex={false} style={Style.view}>
          <Image
            source={Images.profileBG}
            resizeMode={'stretch'}
            style={{width: '100%'}}
          />
          <Block
            flex={false}
            color={Colors.primary}
            style={Style.backgroundProfile}
          />
        </Block>

        <Block absolute style={{top: 0, bottom: 0, left: 0, right: 0}}>
          <Block>
            <Header
              title={team.teamName}
              transparent
              leftIcon={<SwitchTeam navigation={navigation} />}
            />
            <Block style={Style.containerMenu}>
              <Block flex={false} style={Style.containerUser} row center>
                <ImageCircle
                  source={{
                    uri: Config.GET_IMAGE_URL + profile.userAvatar,
                  }}
                  style={{marginTop: 10}}
                  size={77}
                />
                <Block marginLeft={20}>
                  <Text
                    style={{marginTop: 8}}
                    size={16}
                    color={Colors.white}
                    bold>
                    {profile.userFullName}
                  </Text>
                  <ButtonPrivacy
                    style={{backgroundColor: Colors.white}}
                    margin={[5, 0, 0, 0]}
                    privacyId={privacyId}
                    userInclude={userInclude}
                    onPress={() =>
                      this.dialogPrivacy.current?.open(privacyId, userInclude)
                    }
                    onLayout={(event) =>
                      this.setState({
                        containerWidth: event.nativeEvent.layout.width,
                      })
                    }
                  />
                </Block>
              </Block>
              <Block marginTop={20}>
                <ScrollView
                  contentContainerStyle={{paddingBottom: 10}}
                  showsVerticalScrollIndicator={false}>
                  <PostItem
                    style={{marginTop: 10}}
                    text={strings('post')}
                    background={Images.bgMenuPost}
                    onPress={() => this.menuCreatePost(Screens.CREATE_POST)}
                  />
                  <PostItem
                    style={{marginTop: 10}}
                    text={strings('event')}
                    background={Images.bgMenuEvent}
                    onPress={() => {}}
                  />
                  <PostItem
                    style={{marginTop: 10}}
                    text={strings('survey')}
                    background={Images.bgMenuSurvey}
                    onPress={() =>
                      navigation.navigate(Screens.CREATE_SURVEY, {
                        privacyId,
                        userInclude,
                      })
                    }
                  />
                  <PostItem
                    style={{marginTop: 10}}
                    text={strings('photo_video')}
                    background={Images.bgMenuPhoto}
                    onPress={() =>
                      navigation.navigate(Screens.MEDIA_SELECT, {
                        privacyId,
                        userInclude,
                      })
                    }
                  />
                  <PostItem
                    style={{marginTop: 10}}
                    text={strings('album')}
                    background={Images.bgMenuAlbum}
                    onPress={() => {}}
                  />
                </ScrollView>
              </Block>
            </Block>
          </Block>

          <DialogPrivacy
            ref={this.dialogPrivacy}
            privacyId={privacyId}
            teamUsers={listTeamMembers}
            onSelected={this.onChangePrivacy}
          />
        </Block>
      </>
    );
  }
}

MenuPostScreen.defaultProps = {};

MenuPostScreen.propTypes = {
  errorCode: PropTypes.string,
  userActions: PropTypes.object,
};

const mapStateToProps = (state) => ({
  profile: state.user.profile,
  team: state.team.team,
  listTeamMembers: state.team.listTeamMembers,
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
  teamActions: bindActionCreators(TeamActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuPostScreen);
