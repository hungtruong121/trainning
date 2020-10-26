import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {StyleSheet, Image} from 'react-native';
import Block from './Block';
import {Images} from '../Theme';

class IconFunction extends Component {
  render() {
    const {focused} = this.props;
    return (
      <Block center flex={false}>
        {focused ? (
          <Image source={Images.iconFunctionFocused} style={styles.icon} />
        ) : (
          <Image source={Images.iconFunction} style={styles.icon} />
        )}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'cover',
  },
});

IconFunction.propTypes = {
  color: PropTypes.string,
  focused: PropTypes.bool,
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, null)(IconFunction);
