import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
// import * as Progress from "react-native-progress";
import {ProgressBar} from 'react-native-paper';

import Block from './Block';
import {Colors} from '../Theme';

export default class Progress extends Component {
  render() {
    const {
      progress,
      color,
      indeterminate,
      visible,
      style,
      theme,
      backgroundColors,
      type,
      width,
      height,
      ...props
    } = this.props;
    const progressStyles = [styles.defaultStyle, style];
    return (
      <Block style={{justifyContent: 'center'}}>
        {type == 'bar' ? (
          <ProgressBar
            progress={!progress ? 0.5 : progress}
            color={!color ? Colors.red : color}
            style={progressStyles}
            {...props}
          />
        ) : (
          // Progress Circle
          <Block />
        )}
      </Block>
    );
  }
}
const styles = StyleSheet.create({
  defaultStyle: {
    backgroundColor: '#C9C9C9',
    borderRadius: 3,
    height: 8,
  },
});
