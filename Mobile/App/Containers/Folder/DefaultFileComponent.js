/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {StyleSheet, Image, Dimensions} from 'react-native';
import PropTypes from 'prop-types';
import {Block, Text} from 'App/Components';
import {Colors, ApplicationStyles} from '../../Theme';
const {width} = Dimensions.get('window');

export default class DefaultFileComponent extends Component {
  render() {
    const {title, numberItem, sizeMemory, icon, color} = this.props;
    return (
      <Block center row flex={false} color={color} style={Style.typeFile}>
        <Block flex={false} style={{width: '40%', height: '100%'}}>
          <Image source={icon} style={{width: '70%', height: '100%'}} />
        </Block>
        <Block flex={false} column>
          <Text size={13} style={{...ApplicationStyles.fontMPLUS1pBold}}>
            {title}
          </Text>
          <Text
            color={Colors.gray9}
            size={11}
            style={{...ApplicationStyles.fontMPLUS1pRegular}}>
            {numberItem}
          </Text>
          <Text
            color={Colors.gray9}
            size={11}
            style={{...ApplicationStyles.fontMPLUS1pRegular}}>
            {sizeMemory}
          </Text>
        </Block>
      </Block>
    );
  }
}

DefaultFileComponent.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string,
  style: PropTypes.any,
  children: PropTypes.object,
};
const Style = StyleSheet.create({
  typeFile: {
    borderRadius: 10,
    padding: 15,
    height: width / 4.5,
    width: '48%',
    marginBottom: 14,
  },
});
