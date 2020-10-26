import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import {Colors} from 'App/Theme';

export default class CheckBox extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      style,
      size,
      activeColor,
      checked,
      disabled,
      onSelected,
    } = this.props;

    const styleContainer = [
      styles.container,
      size && {height: size, width: size, borderRadius: size / 2},
    ];

    const styleChecked = [
      styles.selected,
      activeColor && {backgroundColor: activeColor},
    ];

    return (
      <TouchableOpacity disabled={disabled} onPress={onSelected}>
        <View
          style={[
            styleContainer,
            checked ? styleChecked : styles.normal,
            style,
          ]}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 20,
    width: 20,
    borderRadius: 20 / 2,
  },
  selected: {
    backgroundColor: Colors.primary,
  },
  normal: {
    borderWidth: 3,
    borderColor: '#707070',
    backgroundColor: '#FFFFFF40',
  },
});
