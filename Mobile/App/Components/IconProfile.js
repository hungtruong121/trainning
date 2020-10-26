import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {StyleSheet, Image} from 'react-native';
import Block from './Block';
import {Config} from '../Config';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { Badge } from 'react-native-paper';
// import { Colors } from "../Theme";

class IconProfile extends Component {
  render() {
    const {profile} = this.props;
    const avatarUrl = `${Config.GET_IMAGE_URL}${
      profile.userAvatar ? profile.userAvatar : ''
    }`;
    return (
      <Block center flex={false}>
        <Image source={{uri: avatarUrl}} style={styles.avatar} />
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  avatar: {
    width: 25,
    height: 25,
    borderRadius: 25 / 2,
  },
  icon: {
    position: 'absolute',
    top: -4,
    left: 9,
  },
});

IconProfile.propTypes = {
  color: PropTypes.string,
  focused: PropTypes.bool,
  profile: PropTypes.object,
};

const mapStateToProps = (state) => ({
  profile: state.user.profile,
});

export default connect(mapStateToProps, null)(IconProfile);
