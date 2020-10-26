/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import QRCodeScanner from 'react-native-qrcode-scanner';
import TeamActions from '../../Stores/Team/Actions';
import {Block, Header, ModalNotifcation} from '../../Components';
import {Colors} from '../../Theme';
import {Screens} from '../../Utils/screens';
import {strings} from '../../Locate/I18n';

class ScanQRCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listTeam: [],
      isOpen: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {listTeam} = nextProps;
    const data = {listTeam};
    return data;
  }

  componentDidMount() {
    const {navigation, teamActions, userId} = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      this.scanner.reactivate();
      teamActions.fetchTeamUserJoined(userId);
    });
  }

  componentWillUnmount() {
    this.focusListener && this.focusListener.remove();
  }

  onSuccess = (e) => {
    const {listTeam} = this.state;
    if (e.data) {
      const check = listTeam.filter((item) => item.teamId == e.data);
      if (check.length > 0) {
        this.setState({
          isOpen: true,
        });
      } else {
        const {navigation} = this.props;
        navigation.navigate(Screens.TEAM_PROFILE, {teamId: e.data});
      }
    }
  };

  render() {
    const {navigation} = this.props;
    const {isOpen} = this.state;
    return (
      <Block>
        <Header
          isShowBack
          title={strings('scan_qr_code')}
          navigation={navigation}
        />
        <QRCodeScanner
          containerStyle={{backgroundColor: Colors.black}}
          ref={(node) => {
            this.scanner = node;
          }}
          onRead={this.onSuccess}
          permissionDialogMessage={strings('msg_need_permission_to_access_camera')}
          reactivateTimeout={10}
          showMarker={true}
          markerStyle={{borderColor: Colors.white, borderRadius: 10}}
        />
        <ModalNotifcation
          isOpen={isOpen}
          message={'You have joined this team'}
          onAccept={() => {
            this.setState({
              isOpen: false,
            });
            this.scanner.reactivate();
          }}
        />
      </Block>
    );
  }
}

ScanQRCode.defaultProps = {};

ScanQRCode.propTypes = {
  listTeam: PropTypes.array,
  teamActions: PropTypes.object,
  userId: PropTypes.string,
};

const mapStateToProps = (state) => ({
  userId: state.user.userId,
  listTeam: state.team.listTeam,
});

const mapDispatchToProps = (dispatch) => ({
  teamActions: bindActionCreators(TeamActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ScanQRCode);
