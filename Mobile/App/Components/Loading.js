import React, {Component} from 'react';
import {ActivityIndicator} from 'react-native';
import {Colors} from '../Theme';

export default class Loading extends Component {
  render() {
    const {color, size, style} = this.props;
    return (
      <ActivityIndicator
        color={color || Colors.primary}
        size={size || 'large'}
        style={style}
      />
    );
  }
}
