/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {StyleSheet, Image, Dimensions, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {Block, Text} from 'App/Components';
const {width} = Dimensions.get('window');
import {Colors, ApplicationStyles, Images} from '../../Theme';

export default class TypeFileComponent extends Component {
  render() {
    const {
      fileName,
      sizeMemory,
      image,
      createDate,
      deleteDate,
      onPress,
      style,
      folder,
      redirect,
    } = this.props;
    return (
      <Block margin={[20, 0, 10, 0]} flex={false} column style={style}>
        <TouchableOpacity onPress={() => redirect && redirect()}>
          <Block row flex={false}>
            {folder ? (
              <Image
                source={image}
                style={{width: 35, height: 30, alignSelf: 'center'}}
              />
            ) : (
              <Image source={image} style={{width: 35, height: 45}} />
            )}
            <Block columnn margin={[0, 0, 0, 20]}>
              <Text size={12}>{fileName}</Text>
              <Block row>
                <Text
                  size={10}
                  style={{
                    marginRight: 10,
                    ...ApplicationStyles.fontMPLUS1pRegular,
                  }}>
                  {createDate}
                </Text>
                <Text
                  size={10}
                  color={Colors.primary}
                  style={{...ApplicationStyles.fontMPLUS1pBold}}>
                  {deleteDate}
                </Text>
              </Block>
              <Text size={8} style={{...ApplicationStyles.fontMPLUS1pRegular}}>
                {sizeMemory}
              </Text>
            </Block>
            <Block flex={false}>
              <TouchableOpacity
                onPress={() => onPress && onPress()}
                style={{paddingLeft: 5, paddingBottom: 5}}>
                <Image
                  source={Images.iconFeature}
                  style={Style.iconFeature}
                  style={{height: 5, width: 28, resizeMode: 'center'}}
                />
              </TouchableOpacity>
            </Block>
          </Block>
        </TouchableOpacity>
      </Block>
    );
  }
}

TypeFileComponent.propTypes = {
  icon: PropTypes.any,
  style: PropTypes.any,
  children: PropTypes.object,
};
const Style = StyleSheet.create({
  backgroundImageView: {
    resizeMode: 'center',
    justifyContent: 'center',
    padding: 15,
    height: width / 4,
    width: width / 3.5,
  },
  iconFeature: {
    width: 30,
    marginRight: -5,
    marginTop: 10,
    marginBottom: 5,
    height: 6,
    alignSelf: 'flex-end',
    resizeMode: 'center',
  },
});
