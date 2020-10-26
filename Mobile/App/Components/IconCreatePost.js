import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {StyleSheet, Image} from 'react-native';
import Block from './Block';
import {Images} from '../Theme';

class IconCreatePost extends Component {
  render() {
    const {focused} = this.props;
    return (
      <Block center flex={false}>
        {focused ? (
          <Image source={Images.iconCreatePostFocused} style={styles.icon} />
        ) : (
          <Image source={Images.iconCreatePost} style={styles.icon} />
        )}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
});

IconCreatePost.propTypes = {
  color: PropTypes.string,
  focused: PropTypes.bool,
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps, null)(IconCreatePost);
