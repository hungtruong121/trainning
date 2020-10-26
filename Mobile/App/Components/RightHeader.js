/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {TouchableOpacity, Image} from 'react-native';
import {Block, Text, Badge} from '.';
import {Colors, Images} from '../Theme';
import {Screens} from '../Utils/screens';

class RightHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countNotification: null,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    const {notifications} = nextProps;
    const data = {};
    if (notifications && notifications.length > 0) {
      const dataTeamActive = notifications[0];
      data.countNotification = dataTeamActive.totalUnreadNotification;
    }
    return data;
  }

  render() {
    const {navigation} = this.props;
    const {countNotification} = this.state;
    return (
      <Block row center>
        <TouchableOpacity onPress={() => alert('seach')}>
          <Image
            source={Images.iconSearch}
            style={{height: 15, width: 15, marginRight: 15}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate(Screens.CHAT_SCREEN)}
          style={{paddingVertical: 15}}>
          <Badge
            size={17}
            color={Colors.white}
            children={
              <Text color={Colors.red} size={7}>
                5
              </Text>
            }
            style={{position: 'absolute', top: 5, left: 4, zIndex: 99999}}
          />
          <Image
            source={Images.iconMessage}
            style={{height: 15, width: 15, marginRight: 15}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate(Screens.NOTIFICATION)}
          style={{paddingVertical: 15}}>
          {countNotification && countNotification > 0 ? (
            <Badge
              size={17}
              color={Colors.white}
              children={
                <Text color={Colors.red} size={7}>
                  {countNotification}
                </Text>
              }
              style={{position: 'absolute', top: 5, left: 4, zIndex: 99999}}
            />
          ) : null}
          <Image
            source={Images.iconNotification}
            style={{height: 17, width: 15}}
          />
        </TouchableOpacity>
      </Block>
    );
  }
}

const mapStateToProps = (state) => ({
  notifications: state.user.notifications,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(RightHeader);
