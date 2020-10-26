/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  StyleSheet,
  Image,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import {Block, Text} from 'App/Components';
const {width} = Dimensions.get('window');
import {Colors, ApplicationStyles, Images} from '../../Theme';

export default class TypeFolderComponent extends Component {
  render() {
    const {
      createName,
      folderName,
      sizeMemory,
      icon,
      backgroundImage,
      isDefault,
      isGenerate,
      createDate,
      deleteDate,
      onPress,
      redirect,
      style,
      isListView,
    } = this.props;
    return (
      <Block
        flex={false}
        column
        style={[style, isListView ? {width: width} : {}]}>
        <TouchableOpacity onPress={() => redirect && redirect()}>
          <Block flex={false} style={isListView ? Style.row : {}}>
            <Block
              flex={false}
              center
              middle
              style={isListView ? {width: width * 0.1} : {}}>
              <ImageBackground
                imageStyle={{borderRadius: 5}}
                source={backgroundImage}
                style={[
                  Style.backgroundImageView,
                  isListView ? {width: width * 0.1, height: width * 0.1} : {},
                ]}>
                {isDefault && (
                  <Block column center middle flex={false}>
                    <Image
                      source={icon}
                      style={{
                        width: isListView ? 15 : 35,
                        height: isListView ? 15 : 30,
                        resizeMode: 'center',
                      }}
                    />
                    {!isListView && (
                      <Text center size={9}>
                        {sizeMemory}
                      </Text>
                    )}
                  </Block>
                )}
                {isGenerate && (
                  <Block column flex={false}>
                    {!isListView && (
                      <TouchableOpacity
                        onPress={() => onPress && onPress()}
                        style={{paddingVertical: 10}}>
                        <Image
                          source={Images.iconFeature}
                          style={Style.iconFeature}
                        />
                      </TouchableOpacity>
                    )}
                    {!isListView && (
                      <>
                        <Text
                          numberOfLines={1}
                          size={9}
                          center
                          style={{marginBottom: 8, marginTop: 10}}>
                          {createName}
                        </Text>
                        <Text center size={9}>
                          {sizeMemory}
                        </Text>
                      </>
                    )}
                  </Block>
                )}
              </ImageBackground>
            </Block>
            <Block
              flex={false}
              style={{
                width: isListView ? width * 0.8 : width / 3.5,
                paddingLeft: isListView ? 20 : 0,
              }}>
              <Text
                numberOfLines={isListView ? 1 : 2}
                size={12}
                style={{
                  ...ApplicationStyles.fontMPLUS1pBold,
                  marginTop: 8,
                  textAlign: isListView ? 'left' : 'center',
                }}>
                {folderName}
              </Text>
              {isListView && isDefault && (
                <Text left size={9}>
                  {sizeMemory}
                </Text>
              )}
              {isListView && isGenerate && (
                <>
                  <Text size={9} left numberOfLines={1}>
                    {createName}
                  </Text>
                  <Text left size={9}>
                    {sizeMemory}
                  </Text>
                </>
              )}
              <Text
                size={8}
                style={{
                  textAlign: isListView ? 'left' : 'center',
                }}>
                {createDate}
              </Text>
              <Text
                size={9}
                center
                color={Colors.red}
                style={{
                  ...ApplicationStyles.fontMPLUS1pBold,
                }}>
                {deleteDate}
              </Text>
            </Block>
            {isListView && !isDefault && (
              <Block flex={false} center middle>
                <TouchableOpacity
                  onPress={() => onPress && onPress()}
                  style={{paddingVertical: 10}}>
                  <Image
                    source={Images.iconFeature}
                    style={{
                      width: width * 0.05,
                      height: 6,
                      resizeMode: 'center',
                    }}
                  />
                </TouchableOpacity>
              </Block>
            )}
          </Block>
        </TouchableOpacity>
      </Block>
    );
  }
}

TypeFolderComponent.propTypes = {
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
    height: 6,
    alignSelf: 'flex-end',
    resizeMode: 'center',
  },
  row: {
    flexDirection: 'row',
  },
});
