/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {Image, ImageBackground, ScrollView} from 'react-native';
import Styles from './CommonStyle';
import {Sizes, Images} from '../../Theme';
import {Block, Text} from '../../Components';
import {strings} from '../../Locate/I18n';

class MainContainer extends Component {
  render() {
    const {children, locale} = this.props;
    return (
      <ImageBackground source={Images.loginBackground} style={Styles.container}>
        <Block style={Styles.overlay}>
          <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
            <Image source={Images.logo} style={Styles.logoStyle} />
            <Text bold white center style={Styles.appName}>
              {strings('app_name', {locale})}
            </Text>
            <Text white center style={Styles.banner}>
              {strings('app_slogan', {locale})}
            </Text>
            <Block padding={[0, Sizes.base * 2]}>{children}</Block>
          </ScrollView>
        </Block>
      </ImageBackground>
    );
  }
}

export default MainContainer;
