import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import {Image, ScrollView, Platform, ImageBackground} from 'react-native';
import {
  Block,
  Text,
  Header,
  Progress,
  ModalNotifcation,
  SwitchTeam,
} from '../../Components';
import Icon from 'react-native-vector-icons/FontAwesome';
import Style from './FuntionScreenStyle';
import {Screens} from '../../Utils/screens';
import {Images, ApplicationStyles, Colors} from '../../Theme';
import MenuComponent from './MenuComponent';
import TeamActions from '../../Stores/Team/Actions';
import UserActions from '../../Stores/User/Actions';
import { strings } from '../../Locate/I18n';

class FuntionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorCode: '',
      team: {},
      profile: {},
      listPublicPosts: [],
      isHaveTeam: false,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    const {errorCode, profile, team} = nextProps;
    const data = {errorCode, profile, team};
    return data;
  }

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
    const {teamActions, userId} = this.props;
    const {profile} = this.state;
    const {activeTeam} = profile;
    teamActions.fetchFolder('', activeTeam);
    teamActions.fetchTeam(activeTeam, userId);
    if (!activeTeam) {
      this.handleUserOfTeam(true);
    } else {
      this.handleUserOfTeam(false);
    }
  };

  redirectTeam() {
    const {navigation, profile} = this.props;
    const {activeTeam} = profile;
    navigation.navigate(Screens.TEAM_PROFILE_DETAIL, {activeTeam});
  }

  redirectInite() {
    const {navigation, profile} = this.props;
    const {activeTeam} = profile;
    navigation.navigate(Screens.INVITE, {teamId: activeTeam});
  }

  redirectFolder() {
    const {profile} = this.state;
    const {navigation} = this.props;
    const {activeTeam} = profile;
    navigation.navigate(Screens.FOLDER, {teamId: activeTeam});
  }

  redirectSwitchTeam = () => {
    this.handleUserOfTeam(false);
    const {navigation} = this.props;
    navigation.navigate(Screens.SWITCH_TEAM);
  };
  redirectAccounting = () => {
    const {navigation} = this.props;
    navigation.navigate(Screens.ACCOUNTING);
  };

  redirectTodoList = () => {
    const {navigation} = this.props;
    navigation.navigate(Screens.TODO_LIST);
  };

  renderMenuCalender() {
    return (
      <Block style={{justifyContent: 'center'}}>
        <Block flex={false} style={{justifyContent: 'center'}}>
          <Text size={12.5} style={{...ApplicationStyles.fontMPLUS1pBold}}>
            Events up coming
          </Text>
        </Block>
        <Block row margin={[5, 0, 0, 0]} flex={false} style={{height: 40}}>
          <Image source={Images.team1} style={Style.avatarTeam} />
          <Text style={{marginLeft: 10, marginRight: 10, alignSelf: 'center'}}>
            -
          </Text>
          <Image source={Images.team2} style={Style.avatarTeam} />
        </Block>
        <Block flex={false} row center>
          <Text size={11}>20:20</Text>
          <Text style={{marginLeft: 4, marginRight: 4}}>-</Text>
          <Text size={11}>5/8/2020</Text>
        </Block>
      </Block>
    );
  }

  renderMenuFolder() {
    return (
      <Block style={{marginTop: 10, justifyContent: 'center'}}>
        <Block flex={false}>
          <Text size={12.5} style={{...ApplicationStyles.fontMPLUS1pBold}}>
            Capacity
          </Text>
        </Block>

        <Block flex={false} margin={[5, '5%', 0, 0]}>
          <Progress type="bar" />
        </Block>
        <Block flex={false} row center margin={[5, 0, 0, 0]}>
          <Text size={11} color={Colors.red}>
            5,04 GB
          </Text>
          <Text> / </Text>
          <Text size={11}>10.00 GB</Text>
        </Block>
      </Block>
    );
  }

  renderMenuTeamProfile(platinum) {
    const gradientColor = ['#C09939', '#E8D492', '#ECDC9D', '#C49941'];
    return (
      <Block style={{justifyContent: 'center'}}>
        <Block flex={false}>
          <Text
            size={12.5}
            style={{
              ...ApplicationStyles.fontMPLUS1pBold,
            }}>
            Rank
          </Text>
        </Block>
        <Block flex={false} margin={[0, 0, 0, '-2%']} style={{width: 40}}>
          <LinearGradient
            style={[Style.borderCard, {backgroundColor: 'yellow'}]}
            colors={gradientColor}
            start={{x: 0, y: 0}}
            end={{x: 0.6, y: 1}}>
            <Icon
              name="credit-card"
              color={Colors.white}
              size={40}
              style={Style.platinumCard}
            />
          </LinearGradient>
        </Block>
        <Block flex={false} row style={{alignContent: 'center'}}>
          <Text
            size={11}
            color={Colors.red}
            style={{...ApplicationStyles.fontMPLUS1pBold}}>
            20 members/
          </Text>
          <Text
            size={11}
            color={Colors.red}
            style={{...ApplicationStyles.fontMPLUS1pBold}}>
            40
          </Text>
        </Block>
        <Block flex={false}>
          <Text color={Colors.gray5} size={11}>
            {platinum}
          </Text>
        </Block>
      </Block>
    );
  }

  renderMenuPhotoAlbum() {
    return (
      <Block style={{justifyContent: 'center'}}>
        <Block flex={false}>
          <Text
            size={12.5}
            style={{
              ...ApplicationStyles.fontMPLUS1pBold,
            }}>
            Gallery
          </Text>
        </Block>

        <Block flex={false}>
          <Text color={Colors.gray5} size={11}>
            1000 Photos
          </Text>
          <Text color={Colors.gray5} size={11}>
            100 Videos
          </Text>
          <Text color={Colors.gray5} size={11}>
            5 folders
          </Text>
        </Block>
      </Block>
    );
  }

  renderMenuInvite() {
    const {listRequestJoins} = this.props;
    return (
      <Block style={{marginTop: 10, justifyContent: 'center'}}>
        <Block flex={false}>
          <Text size={12.5} style={{...ApplicationStyles.fontMPLUS1pBold}}>
            Request
          </Text>
        </Block>
        <Block flex={false}>
          <Text color={Colors.red} size={11}>
            {listRequestJoins.length} Requests{' '}
            <Text color={Colors.gray5} size={11}>
              are waiting for approve
            </Text>
          </Text>
        </Block>
      </Block>
    );
  }

  renderMenuAccounting = () => {
    return (
      <Block style={{marginTop: 10, justifyContent: 'center'}}>
        <Block flex={false}>
          <Text size={12.5} style={{...ApplicationStyles.fontMPLUS1pBold}}>
            Accounting
          </Text>
        </Block>
        <Block flex={false}>
          <Text color={Colors.red} size={11}>
            4 Acounts{' '}
            <Text color={Colors.gray5} size={11}>
              is not paid yet
            </Text>
          </Text>
        </Block>
      </Block>
    );
  };

  renderMenuTodoList = () => {
    return (
      <Block style={{marginTop: 10, justifyContent: 'center'}}>
        <Block flex={false}>
          <Text size={12.5} style={{...ApplicationStyles.fontMPLUS1pBold}}>
            Todo List
          </Text>
        </Block>
        <Block flex={false}>
          <Text color={Colors.red} size={11}>
            4 Tasks{' '}
            <Text color={Colors.gray5} size={11}>
              is not completed yet
            </Text>
          </Text>
        </Block>
      </Block>
    );
  };
  handleUserOfTeam(isHaveTeam) {
    this.setState({
      isHaveTeam: isHaveTeam,
    });
  }

  render() {
    const {isHaveTeam} = this.state;
    const {navigation, team, children} = this.props;
    const {profile} = this.state;

    return (
      <ImageBackground
        source={Images.fucntion_background}
        style={[Style.backgroundView]}>
        <Block
          onLayout={this.onBlockHeaderLayout}
          style={{
            backgroundColor: Colors.transparent,
            position: 'absolute',
            zIndex: 1,
            top: 0,
          }}>
          <Header
            transparent
            title={team.teamName}
            leftIcon={<SwitchTeam navigation={navigation} />}
          />
        </Block>
        <Block style={Style.overlay}>
          {!profile.activeTeam ? null : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{
                flex: 1,
                zIndex: 1,
                marginTop: Platform.OS == 'ios' ? 90 : 50,
              }}>
              <Block style={Style.containerMenu}>
                <MenuComponent
                  backgroundImage={Images.menuCalendar}
                  icon={Images.calender}
                  text={'Calendar'}
                  rightContent={this.renderMenuCalender()}
                />
                <MenuComponent
                  backgroundImage={Images.menuFolder}
                  icon={Images.folder}
                  text={'Folder'}
                  rightContent={this.renderMenuFolder()}
                  style={{marginTop: 30}}
                  onPress={() => this.redirectFolder()}
                />
                <MenuComponent
                  backgroundImage={Images.menuTeam}
                  icon={Images.teamprofile}
                  text={'Team Profile'}
                  rightContent={this.renderMenuTeamProfile('Platinum')}
                  style={{marginTop: 30}}
                  onPress={() => this.redirectTeam()}
                />
                <MenuComponent
                  backgroundImage={Images.menuInvite}
                  icon={Images.invite}
                  text={'Invite'}
                  rightContent={this.renderMenuInvite()}
                  style={{marginTop: 30}}
                  onPress={() => this.redirectInite()}
                />
                <MenuComponent
                  backgroundImage={Images.menuAccounting}
                  icon={Images.iconAccounting}
                  text={'Accounting'}
                  style={{marginTop: 30}}
                  styleIcon={{resizeMode: 'center'}}
                  rightContent={this.renderMenuAccounting()}
                  onPress={() => this.redirectAccounting()}
                />
                <MenuComponent
                  backgroundImage={Images.menuTodoList}
                  icon={Images.iconTodoList}
                  text={'Todo List'}
                  style={{marginTop: 30}}
                  styleIcon={{resizeMode: 'center'}}
                  rightContent={this.renderMenuTodoList()}
                  onPress={() => this.redirectTodoList()}
                />
                <MenuComponent
                  backgroundImage={Images.menuGallery}
                  icon={Images.photo}
                  text={'Gallery'}
                  rightContent={this.renderMenuPhotoAlbum()}
                  style={{marginTop: 30}}
                />
              </Block>
              {children}
            </ScrollView>
          )}
        </Block>
        <ModalNotifcation
          isConfirm
          message={strings('msg_have_not_activated_any_teams')}
          isOpen={isHaveTeam}
          onAccept={() => this.redirectSwitchTeam()}
          onCancel={() => this.handleUserOfTeam(false)}
        />
      </ImageBackground>
    );
  }
}

FuntionScreen.defaultProps = {};

FuntionScreen.propTypes = {
  errorCode: PropTypes.string,
  userActions: PropTypes.object,
  teamActions: PropTypes.object,
  userId: PropTypes.string,
  team: PropTypes.object,
  profile: PropTypes.object,
  folder: PropTypes.object,
  listRequestJoins: PropTypes.array,
};

const mapStateToProps = (state) => ({
  errorCode: state.user.errorCode,
  userId: state.user.userId,
  team: state.team.team,
  folder: state.team.folder,
  profile: state.user.profile,
  listRequestJoins: state.team.listRequestJoins,
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
  teamActions: bindActionCreators(TeamActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(FuntionScreen);
