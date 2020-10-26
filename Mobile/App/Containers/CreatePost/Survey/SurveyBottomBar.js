/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Colors} from 'App/Theme';
import {Button, Block, Text, DateTimePicker} from '../../../Components';
import UserActions from '../../../Stores/User/Actions';
import PostActions from '../../../Stores/Post/Actions';
import {strings} from '../../../Locate/I18n';

class SurveyBottomBar extends Component {
  constructor(props) {
    super(props);
    this.scrollView = React.createRef();
    this.dialogPrivacy = React.createRef();

    this.state = {
      errorCode: '',
      isCollapsed: true,
      isOpenDateTime: false,
      dateTime: new Date(),
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {profile, team} = nextProps;
    if (profile != prevState.profile || team != prevState.team) {
      return {profile, team};
    }

    return null;
  }

  componentDidMount() {}

  onSelectedPrivacy = (privacyId, userInclude) => {
    this.setState({privacyId, userInclude});
  };

  onChangeText = (text) => {
    const {tags} = this.state;

    const words = text.split(/\s+/);
    const firstWord = words[0];
    if (
      words.length > 1 &&
      firstWord.charAt(0) === '#' &&
      firstWord.length > 1
    ) {
      tags.push(words[0]);
      text = text.substring(words[0].length + 1, text.length);
      this.setState({tags, text: text});
      return;
    }

    this.setState({text});
  };

  onPressBackground = () => {
    this.setState({isCollapsed: true});
    if (this.props.onPressBackground) {
      this.props.onPressBackground();
    }
  };

  onPressLocation = () => {
    this.props.onPressLocation();
  };

  onPressTimeClosing = () => {
    this.setState({isOpenDateTime: true});
  };

  handleConfirmDateTime = (date) => {
    const {onSetTimeClosing} = this.props;
    if (onSetTimeClosing) {
      onSetTimeClosing(date);
    }
    this.setState({isOpenDateTime: false, isCollapsed: true});
  };

  hideDatePicker = () => {
    const {onSetTimeClosing} = this.props;
    if (onSetTimeClosing) {
      onSetTimeClosing(null);
    }
    this.setState({isOpenDateTime: false});
  };

  render() {
    const {isCollapsed, isOpenDateTime, dateTime} = this.state;
    return (
      <Block flex={false}>
        {isCollapsed ? (
          <Button
            style={{marginVertical: 0, height: null}}
            onPress={() => this.setState({isCollapsed: false})}>
            <Block
              flex={false}
              color={Colors.white}
              style={{borderTopLeftRadius: 20, borderTopRightRadius: 20, borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor: Colors.gray5}}
              padding={[17]}>
              <Block flex={false} row center>
                <Text style={{flex: 1}} size={15}>
                  Add to your survey
                </Text>
                <Icon name={'image'} size={28} color={Colors.gray9} />
                <Icon
                  name={'map-marker-alt'}
                  size={25}
                  color={Colors.gray9}
                  style={{marginLeft: 20}}
                />
                <MaterialIcons
                  name={'timer'}
                  size={28}
                  color={Colors.gray9}
                  style={{marginLeft: 20}}
                />
              </Block>
            </Block>
          </Button>
        ) : (
          <Block
            flex={false}
            color={Colors.white}
            style={{borderTopLeftRadius: 20, borderTopRightRadius: 20, borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor: Colors.gray5}}
            padding={[0, 17, 17, 17]}>
            <Block flex={false} center>
              <Button
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 0,
                  height: null,
                  paddingVertical: 10,
                }}
                onPress={() => this.setState({isCollapsed: true})}>
                <Block flex={false} width={50} height={6} color={'#EEEEEE'} />
              </Button>

              <Button
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 0,
                  height: null,
                  paddingVertical: 7,
                }}
                onPress={this.onPressBackground}>
                <Block flex={false} width={48}>
                  <Icon name={'image'} size={28} color={Colors.gray9} />
                </Block>
                <Text style={{flex: 1}} size={15}>
                  Add background survey
                </Text>
              </Button>
              <Button
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 0,
                  height: null,
                  paddingVertical: 7,
                }}
                onPress={this.onPressLocation}>
                <Block flex={false} width={48}>
                  <Icon
                    name={'map-marker-alt'}
                    size={25}
                    color={Colors.gray9}
                  />
                </Block>
                <Text style={{flex: 1}} size={15}>
                  Add location
                </Text>
              </Button>
              <Button
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 0,
                  height: null,
                  paddingVertical: 7,
                }}
                onPress={this.onPressTimeClosing}>
                <Block flex={false} width={48}>
                  <MaterialIcons
                    name={'timer'}
                    size={28}
                    color={Colors.gray9}
                  />
                </Block>
                <Text style={{flex: 1}} size={15}>
                  Set closing time
                </Text>
              </Button>
            </Block>
          </Block>
        )}

        <DateTimePicker
          isOpen={isOpenDateTime}
          mode="datetime"
          minimumDate={new Date()}
          onConfirm={this.handleConfirmDateTime}
          onCancel={this.hideDatePicker}
          date={dateTime}
        />
      </Block>
    );
  }
}

SurveyBottomBar.defaultProps = {};

SurveyBottomBar.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(SurveyBottomBar);
