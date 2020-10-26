/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import Toast from 'react-native-easy-toast';
import UserActions from '../../Stores/User/Actions';
import TeamActions from '../../Stores/Team/Actions';
import Icon from 'react-native-vector-icons/FontAwesome';
import Style from './InviteScreenStyle';
import {ApplicationStyles, Colors} from '../../Theme';
import {teamService} from '../../Services/TeamService';
import { strings } from '../../Locate/I18n';
import {TouchableOpacity, FlatList} from 'react-native';
import {
  Block,
  Text,
  Header,
  Input,
  Loading,
  ModalNotifcation,
} from '../../Components';
class InviteEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {},
      listTeamInfo: [],
      email: '',
      listEmail: [],
      isOpenActionSend: false,
      isOpenInput: false,
      loadingSend: false,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    const {errorCode, profile} = nextProps;
    const data = {errorCode, profile};

    return data;
  }

  componentDidMount = async () => {};

  renderRightHeader = () => {
    const {loadingSend} = this.state;
    return (
      <TouchableOpacity onPress={() => this.handleSendInviteEmal()}>
        {loadingSend ? (
          <Loading size="small" color={Colors.white} />
        ) : (
          <Text
            size={13.5}
            color={Colors.white}
            style={{...ApplicationStyles.fontMPLUS1pBold, marginRight: 10}}>
            Send
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  renderLeftHeader = () => {
    const {navigation} = this.props;
    return (
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text size={13.5} color={Colors.white} style={{marginLeft: 10}}>
          Cancel
        </Text>
      </TouchableOpacity>
    );
  };

  renderItem = ({item}) => {
    return (
      <Block
        margin={[10, 20, 0, 20]}
        style={{
          height: 40,
          borderBottomWidth: 1,
          borderBottomColor: Colors.gray6,
          justifyContent: 'center',
        }}>
        <Text
          color={Colors.gray6}
          size={12.5}
          style={{...ApplicationStyles.fontMPLUS1pRegular}}>
          {item}
        </Text>
      </Block>
    );
  };

  clearText = () => {
    this.setState({
      email: '',
    });
  };

  handleLoadingSend = (isLoading) => {
    this.setState({
      loadingSend: isLoading,
    });
  };

  handleTextChange = (value) => {
    this.setState({
      email: value,
    });
  };

  handleModalSend = (isOpen) => {
    this.setState({
      isOpenActionSend: isOpen,
    });
  };

  handleModalInput = (isOpen) => {
    this.setState({
      isOpenInput: isOpen,
    });
  };

  handleSendInviteEmal = () => {
    const {listEmail} = this.state;
    const {team} = this.props;
    const {teamId} = team;
    const data = {
      emailInvite: listEmail,
      teamId,
    };
    if (listEmail.length === 0) {
      this.handleModalInput(true);
    } else {
      this.handleLoadingSend(true);
      try {
        teamService.sendMailInvite(data).then((response) => {
          if (response.success) {
            this.handleLoadingSend(false);
            this.handleModalSend(true);
          } else {
            const {message} = response;
            const {messageError} = message ? message : strings('send_failed');
            this.refs.toastFailed.show(messageError, DURATION.LENGTH_LONG);
          }
        });
      } catch (error) {
        this.handleLoadingSend(true);
        this.refs.toastFailed.show(strings('send_failed'), DURATION.LENGTH_LONG);
      }
    }
  };

  renderListEmail = () => {
    const {email} = this.state;

    if (!email) {
      this.handleModalInput(true);
    } else {
      this.setState((prevProps) => ({
        listEmail: [...prevProps.listEmail, email],
      }));
      this.clearText();
    }
  };

  render() {
    const {navigation} = this.props;
    const {listEmail, email, isOpenActionSend, isOpenInput} = this.state;
    return (
      <Block style={Style.view}>
        <Header
          leftIcon={this.renderLeftHeader()}
          rightIcon={this.renderRightHeader()}
          title={strings('invite_by_email')}
          navigation={navigation}
        />
        <Block flex={false} row style={Style.viewSearch}>
          <Block style={Style.viewInputSearch}>
            <Input
              placeholderTextColor={Colors.placeholder}
              placeholder={strings('enter_name')}
              style={Style.inputSearch}
              onChangeText={(text) => this.handleTextChange(text)}
              value={email}
            />
          </Block>
          <TouchableOpacity onPress={() => this.renderListEmail()}>
            <Icon
              name="check"
              size={21}
              color={Colors.red}
              style={{marginRight: 23}}
            />
          </TouchableOpacity>
        </Block>
        <Text
          size={12.5}
          color={Colors.black}
          style={{
            ...ApplicationStyles.fontMPLUS1pBold,
            marginTop: 15,
            marginLeft: 20,
          }}>
          Selected Email
        </Text>
        <FlatList
          data={listEmail}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this.renderItem}
        />
        <Toast
          ref="toastFailed"
          style={{backgroundColor: Colors.error}}
          position="top"
          positionValue={200}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
        />
        <ModalNotifcation
          message={strings('msg_email_have_sent')}
          isOpen={isOpenActionSend}
          onAccept={() => this.handleModalSend(false)}
        />
        <ModalNotifcation
          message={strings('msg_please_input_email')}
          isOpen={isOpenInput}
          onAccept={() => this.handleModalInput(false)}
        />
      </Block>
    );
  }
}

InviteEmail.defaultProps = {};

InviteEmail.propTypes = {
  errorCode: PropTypes.string,
  userActions: PropTypes.object,
  teamActions: PropTypes.object,
  profile: PropTypes.object,
  listTeamInfo: PropTypes.array,
  userId: PropTypes.string,
  team: PropTypes.object,
};

const mapStateToProps = (state) => ({
  errorCode: state.user.errorCode,
  profile: state.user.profile,
  listTeamInfo: state.user.listTeamInfo,
  userId: state.user.userId,
  team: state.team.team,
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
  teamActions: bindActionCreators(TeamActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(InviteEmail);
