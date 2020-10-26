/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import { strings } from '../../Locate/I18n';
import Toast from 'react-native-easy-toast';
import {Config} from '../../Config/index';
import UserActions from '../../Stores/User/Actions';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Clipboard from '@react-native-community/clipboard';
import Style from './InviteScreenStyle';
import {Screens} from '../../Utils/screens';
import {Images, ApplicationStyles, Colors} from '../../Theme';
import QRCode from 'react-native-qrcode-svg';
import LinearGradient from 'react-native-linear-gradient';
import TeamActions from '../../Stores/Team/Actions';
import {teamService} from '../../Services/TeamService';
const {width} = Dimensions.get('window');
import {Image, TouchableOpacity, Dimensions, ScrollView} from 'react-native';
import {
  Button,
  Block,
  Text,
  Header,
  Input,
  RightHeader,
} from '../../Components';
import {Constants} from '../../Utils/constants';

const tabs = ['Invite', 'Approve'];
class InviteScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listRequestJoins: {},
      errorCode: '',
      active: 'Invite',
      isChangeTab: false,
      teamId: null,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {errorCode, listRequestJoins, navigation} = nextProps;
    const {teamId} = navigation.state.params;
    const data = {errorCode, listRequestJoins, teamId};
    const {isChangeTab} = prevState;

    if (!isChangeTab) {
      data.active = tabs[0];
    }

    return data;
  }

  componentDidMount = async () => {
    const {teamActions} = this.props;
    const {teamId} = this.state;
    teamActions.fetchListRequestJoinTeam(teamId);
  };

  renderTabInvite = () => {
    const {navigation, team} = this.props;
    const gradientButtonLine = ['#54BC4D', '#8DC73F'];
    const gradientButtonMessage = ['#00AEFF', '#0071FF'];
    const linkIos = `${Config.DEEP_LINK_URL}?teamId=${team.teamId}&os=ios`;
    const linkAndroid = `${Config.DEEP_LINK_URL}?teamId=${team.teamId}&os=android`;
    return (
      <Block column margin={[10, 15, 10, 15]}>
        <Block column style={Style.container}>
          <Button
            onPress={() => navigation.navigate(Screens.INVITE_EMAIL)}
            color={Colors.red}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: 42,
            }}>
            <Text
              size={12.5}
              color={Colors.white}
              style={{...ApplicationStyles.fontMPLUS1pBold}}>
              Invite via Email
            </Text>
          </Button>
          <Text
            size={13.5}
            color={Colors.black}
            style={{...ApplicationStyles.fontMPLUS1pBold, marginTop: 25}}>
            QR code
          </Text>
          <Block style={Style.viewQR}>
            <QRCode size={width / 1.8} value={`${team.teamId}`} />
          </Block>
          <Block row center space="between" margin={[40, 0, 0, 0]}>
            <Text>Share with IOS</Text>
            <Block flex={false} style={Style.iconCoppy}>
              <TouchableOpacity onPress={() => Clipboard.setString(linkIos)}>
                <Image source={Images.iconCopy} />
              </TouchableOpacity>
            </Block>
          </Block>
          <Block row center space="between" margin={[10, 0, 0, 0]}>
            <Text>Share with Android</Text>
            <Block flex={false} style={Style.iconCoppy}>
              <TouchableOpacity
                onPress={() => Clipboard.setString(linkAndroid)}>
                <Image source={Images.iconCopy} />
              </TouchableOpacity>
            </Block>
          </Block>
          <Text
            size={13.5}
            color={Colors.black}
            style={{...ApplicationStyles.fontMPLUS1pBold, marginTop: 25}}>
            Social Network
          </Text>
          <Block margin={[10, 0, 30, 0]} flex={false} row>
            <LinearGradient
              style={Style.buttonLine}
              colors={gradientButtonLine}
              start={{x: 1, y: 0.6}}
              end={{x: 0, y: 0}}>
              <Button onPress={() => alert('abc')} style={Style.buttonClick}>
                <Fontisto color={Colors.white} size={28} name="line" />
              </Button>
            </LinearGradient>
            <LinearGradient
              style={Style.buttonMessage}
              colors={gradientButtonMessage}
              start={{x: 1, y: 0.6}}
              end={{x: 0, y: 0}}>
              <Button onPress={() => alert('abc')} style={Style.buttonClick}>
                <Fontisto color={Colors.white} size={28} name="messenger" />
              </Button>
            </LinearGradient>
          </Block>
        </Block>
      </Block>
    );
  };

  handleAfterJoin = () => {
    const {team, teamActions} = this.props;
    teamActions.fetchListRequestJoinTeam(team.teamId);
  };

  renderTabIApproval = () => {
    return (
      <Block column margin={[10, 15, 0, 15]}>
        <Block column style={Style.container}>
          <Text
            size={13.5}
            color={Colors.black}
            style={{...ApplicationStyles.fontMPLUS1pBold}}>
            People who want to join your team
          </Text>
          {this.renderListNotification()}
        </Block>
      </Block>
    );
  };

  renderListNotification = () => {
    const {listRequestJoins} = this.state;
    const {team} = this.props;
    const adminRole = team.teamMemberRole;
    let listHtml = [];
    let isHaveTeam = true;
    if (listRequestJoins !== null) {
      listRequestJoins.forEach((element, index) => {
        const imageUrl = `${Config.GET_IMAGE_URL}${
          element.userAvatar ? element.userAvatar : Images.memberOne
        }`;
        const listTeamJoineds = element.teamJoined.split(', ');
        const teamJoined = listTeamJoineds[0];
        const teamJoinedRemain = listTeamJoineds.length - 1;

        const listSports = element.sportName.split(',');
        const sportName = listSports[0];
        const SportNameRemain = listSports.length - 1;
        if (!element.teamJoined) {
          isHaveTeam = false;
        }
        listHtml.push(
          <Block
            key={index}
            row
            margin={[15, 0, 0, 0]}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: '#DBDBDB',
            }}>
            <Block style={[Style.avatarUser, {marginBottom: 10}]}>
              <Image source={{uri: imageUrl}} style={Style.avatarUser} />
            </Block>
            <Block column>
              <Text size={13.5} color={Colors.black}>
                {element.userFullName ? element.userFullName : ''}
              </Text>
              {isHaveTeam ? (
                <Text style={[Style.approvalTextDetail, {marginTop: 5}]}>
                  Playing{' '}
                  <Text style={[Style.approvalTextDetail, {color: Colors.red}]}>
                    {sportName}
                  </Text>{' '}
                  {SportNameRemain > 0 ? (
                    <Text style={Style.approvalTextDetail}>
                      and {SportNameRemain} more
                    </Text>
                  ) : null}
                </Text>
              ) : null}

              {isHaveTeam ? (
                <Text style={Style.approvalTextDetail}>
                  Member of{' '}
                  <Text style={[Style.approvalTextDetail, {color: Colors.red}]}>
                    {teamJoined}
                  </Text>{' '}
                  {teamJoinedRemain > 0 ? (
                    <Text style={Style.approvalTextDetail}>
                      and {teamJoinedRemain} more
                    </Text>
                  ) : null}
                </Text>
              ) : null}
              {Constants.TEAM_ADMIN == adminRole ? (
                <Block row margin={[10, 0, 10, 0]}>
                  <Button
                    shadow
                    color={Colors.red}
                    style={[Style.buttonAprroval, {marginRight: 24}]}
                    onPress={() => this.handleApproval(element.userId)}>
                    <Text color={Colors.white} size={12.5}>
                      Approve
                    </Text>
                  </Button>
                  <Button
                    shadow
                    color={Colors.gray5}
                    style={Style.buttonAprroval}
                    onPress={() => this.handleReject(element.userId)}>
                    <Text color={Colors.white} size={12.5}>
                      Reject
                    </Text>
                  </Button>
                </Block>
              ) : null}
            </Block>
          </Block>,
        );
      });
    }
    return <Block>{listHtml}</Block>;
  };
  handleChangeTab = (isChangeTab) => {
    this.setState({
      isChangeTab: isChangeTab,
    });
  };

  handleTab = (tab) => {
    this.handleChangeTab(true);
    this.setState({
      active: tab,
    });
    tab !== 'Invite' ? this.handleAfterJoin() : null;
  };

  renderTab = (tab, key) => {
    const {active} = this.state;
    const isActive = active === tab;

    return (
      <TouchableOpacity
        key={key}
        onPress={() => this.handleTab(tab)}
        style={[Style.tab, isActive ? Style.active : null]}>
        <Text
          color={isActive ? '#4F4F4F' : Colors.gray6}
          size={isActive ? 16 : 13.5}
          medium
          style={{...ApplicationStyles.fontMPLUS1pBold}}>
          {tab}
        </Text>
      </TouchableOpacity>
    );
  };

  handleApproval = (userId) => {
    const {team, teamActions} = this.props;
    const data = {
      teamId: team.teamId,
      userId: userId,
    };
    try {
      teamService.approvalJoinTeam(data).then((response) => {
        if (response.success) {
          teamActions.fetchListRequestJoinTeam(team.teamId);
          teamActions.fetchTeam(team.teamId, userId);
        } else {
          const {message} = response;
          const {messageError} = message ? message : strings('approval_failed');
          this.refs.toastFailed.show(messageError, DURATION.LENGTH_LONG);
        }
      });
    } catch (error) {
      this.refs.toastFailed.show(strings('approval_failed'), DURATION.LENGTH_LONG);
    }
  };

  handleReject = (userId) => {
    const {team, teamActions} = this.props;
    const data = {
      teamId: team.teamId,
      userId: userId,
    };
    try {
      teamService.rejectJoinTeam(data).then((response) => {
        if (response.success) {
          teamActions.fetchListRequestJoinTeam(team.teamId);
        } else {
          const {message} = response;
          const {messageError} = message ? message : strings('rject_failed');
          this.refs.toastFailed.show(messageError, DURATION.LENGTH_LONG);
        }
      });
    } catch (error) {
      this.refs.toastFailed.show( strings('rject_failed'), DURATION.LENGTH_LONG);
    }
  };

  render() {
    const {navigation} = this.props;
    const {active} = this.state;
    return (
      <Block style={Style.view}>
        <Header
          isShowBack
          rightIcon={<RightHeader navigation={navigation} />}
          title={active === 'Invite' ? ' Invite' : 'Approve'}
          navigation={navigation}
        />
        <ScrollView style={Style.view} showsVerticalScrollIndicator={false}>
          <ScrollView horizontal style={Style.tabs}>
            {tabs.map((tab, index) => this.renderTab(tab, index))}
          </ScrollView>
          {active === 'Invite'
            ? this.renderTabInvite()
            : this.renderTabIApproval()}
        </ScrollView>
        <Toast
          ref="toastFailed"
          style={{backgroundColor: Colors.error}}
          position="top"
          positionValue={200}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
        />
      </Block>
    );
  }
}

InviteScreen.defaultProps = {};

InviteScreen.propTypes = {
  errorCode: PropTypes.string,
  userActions: PropTypes.object,
  teamActions: PropTypes.object,
  profile: PropTypes.object,
  userId: PropTypes.string,
  language: PropTypes.string,
  listRequestJoins: PropTypes.array,
};

const mapStateToProps = (state) => ({
  errorCode: state.user.errorCode,
  userId: state.user.userId,
  listRequestJoins: state.team.listRequestJoins,
  team: state.team.team,
  language: state.user.language,
  profile: state.user.profile,
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
  teamActions: bindActionCreators(TeamActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(InviteScreen);
