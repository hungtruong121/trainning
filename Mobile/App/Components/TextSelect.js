// just copy this code from the driving repo :)
import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Image} from 'react-native';
import Block from './Block';
import Text from './Text';
import {Images, Colors} from '../Theme';

export default class TextSelect extends Component {
  render() {
    const {selectStyles, children, onSelect, hiddenSelect} = this.props;

    return (
      <TouchableOpacity onPress={() => onSelect && onSelect()}>
        <Block
          flex={false}
          row
          center
          middle
          space="between"
          style={[styles.select, selectStyles]}>
          <Text {...this.props} numberOfLines={1}>
            {children}
          </Text>
          {hiddenSelect ? null : (
            <Image source={Images.iconSelect} style={styles.icon} />
          )}
        </Block>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  // // default style
  select: {
    backgroundColor: Colors.gray14,
    paddingHorizontal: 7,
    height: 48,
    borderRadius: 7,
  },
  icon: {
    width: 8,
    height: 15,
    resizeMode: 'cover',
  },
});
