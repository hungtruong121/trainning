/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import {Block, Text} from 'App/Components';
const {width} = Dimensions.get('window');
import {Colors, ApplicationStyles, Images} from '../../Theme';

export default class MenuComponent extends Component {
  render() {
    const {
      style,
      styleIcon,
      children,
      onPress,
      icon,
      text,
      backgroundImage,
      rightContent,
    } = this.props;
    return (
      <TouchableOpacity
        magnification={0.5}
        onPress={() => onPress && onPress()}>
        <Block shadow row style={[Style.parentViewCalender, style]}>
          <Block style={Style.leftItem}>
            <ImageBackground
              source={backgroundImage}
              imageStyle={{borderRadius: 10}}
              style={Style.leftItemImage}>
              <Block cloumn style={Style.leftItemView}>
                <Block
                  style={{
                    justifyContent: 'center',
                    marginLeft: 25,
                  }}>
                  <Image
                    source={icon}
                    style={[
                      icon !== Images.folder && icon !== Images.teamprofile
                        ? Style.iconsSize
                        : Style.iconSize2x,
                      styleIcon,
                    ]}
                  />
                  <Text style={Style.titleName}>{text}</Text>
                  {children}
                </Block>
              </Block>
            </ImageBackground>
          </Block>
          <Block style={Style.rightItem}>{rightContent}</Block>
        </Block>
      </TouchableOpacity>
    );
  }
}
MenuComponent.propTypes = {
  icon: PropTypes.node.isRequired,
  backgroundImage: PropTypes.node.isRequired,
  backgroundColor: PropTypes.string,
  text: PropTypes.string,
  rightContent: PropTypes.any,
  style: PropTypes.any,
  children: PropTypes.object,
  // onPress: PropTypes.any,
};
const Style = StyleSheet.create({
  parentViewCalender: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    height: width / 4,
  },
  rightItem: {
    justifyContent: 'center',
    marginLeft: '5%',
  },
  leftItem: {
    flex: 1.4,
  },
  leftItemImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  leftItemView: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
  },
  avatarTeam: {
    height: 40,
    width: 40,
    marginTop: 5,
  },
  iconsSize: {
    height: 33,
    width: 33,
    justifyContent: 'center',
  },
  iconSize2x: {
    height: 33,
    width: 36,
    justifyContent: 'center',
  },
  titleName: {
    ...ApplicationStyles.fontMPLUS1pBold,
    fontSize: 13.5,
    color: Colors.white,
    marginTop: 13.5,
  },
  titleEvent: {
    ...ApplicationStyles.fontMPLUS1pBold,
    fontSize: 15,
    color: Colors.black,
  },
  platinumCard: {
    marginTop: -5,
    marginBottom: -5,
  },
  borderCard: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
  },
});
