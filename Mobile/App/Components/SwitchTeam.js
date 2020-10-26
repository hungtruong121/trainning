import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Block, Text} from '../Components';
import {Colors, ApplicationStyles} from '../Theme';
import TeamActions from '../Stores/Team/Actions';
import {Screens} from '../Utils/screens';

class SwitchTeam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamId: null,
      teamShortName: '',
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {errorCode, teamId, teamShortName} = nextProps;
    const data = {
      errorCode,
      teamId,
      teamShortName: teamShortName ? teamShortName : 'N/A',
    };
    return data;
  }

  componentDidMount = () => {};

  render() {
    const {navigation} = this.props;
    const {teamShortName} = this.state;

    return (
      <TouchableOpacity
        style={style.container}
        activeOpacity={0.8}
        onPress={() => navigation.navigate(Screens.SWITCH_TEAM)}>
        <Block block row center>
          <Block flex={false} style={style.circle} />
          <Text style={style.teamShortName}>{teamShortName}</Text>
        </Block>
      </TouchableOpacity>
    );
  }
}

const style = StyleSheet.create({
  container: {
    width: 60,
    height: 25,
    backgroundColor: Colors.white,
    borderRadius: 15,
  },
  circle: {
    width: 18,
    height: 18,
    backgroundColor: Colors.gray8,
    borderRadius: 9,
    marginLeft: 5,
  },
  teamShortName: {
    marginLeft: 5,
    ...ApplicationStyles.fontMPLUS1pRegular,
    fontSize: 11,
    color: Colors.red,
  },
});

const mapStateToProps = (state) => ({
  userId: state.user.userId,
  teamId: state.user.profile.activeTeam,
  teamShortName: state.team.team.teamShortName,
});

const mapDispatchToProps = (dispatch) => ({
  teamActions: bindActionCreators(TeamActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SwitchTeam);
