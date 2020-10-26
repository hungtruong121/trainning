/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Colors, ApplicationStyles} from '../Theme';
import PropTypes from 'prop-types';
import {Block, Text} from 'App/Components';
import Icon from 'react-native-vector-icons/AntDesign';
import ResponsiveUtils from '../Utils/ResponsiveUtils';
import {SafeAreaView} from 'react-navigation';

export default class Header extends Component {
  handleGoBack = () => {
    const {navigation, goBackAction, goBackData, onPressBack} = this.props;
    if (onPressBack) {
      onPressBack();
    } else {
      navigation.goBack();
    }
    if (goBackAction) {
      navigation.state.params[goBackAction](goBackData ? goBackData : null);
    }
  };

  render() {
    const {
      title,
      centerHeader,
      rightIcon,
      style,
      isShowBack,
      iconBack,
      leftIcon,
      transparent,
      widthLeft,
      widthCenter,
      widthRight,
    } = this.props;

    const styleLeft = [
      styles.headerLeft,
      widthLeft ? {width: widthLeft} : null,
    ];
    const styleCenter = [
      styles.headerCenter,
      widthCenter ? {width: widthCenter} : null,
    ];
    const styleRight = [
      styles.headerRight,
      widthRight ? {width: widthRight} : null,
    ];

    return (
      <SafeAreaView
        style={{backgroundColor: transparent ? null : Colors.primary}}>
        <Block
          flex={false}
          // color={transparent ? null : Colors.primary}
          row
          center
          style={[styles.header, style]}>
          <Block flex={false} style={styleLeft} center>
            {isShowBack && (
              <TouchableOpacity
                onPress={() => this.handleGoBack()}
                style={{paddingVertical: 15}}>
                <Icon
                  name={iconBack || 'left'}
                  size={15}
                  color={Colors.white}
                />
              </TouchableOpacity>
            )}
            {leftIcon}
          </Block>
          <Block flex={false} style={styleCenter} center>
            {title ? (
              <Text style={{fontSize: 16}} bold white center numberOfLines={1}>
                {title}
              </Text>
            ) : null}
            {centerHeader}
          </Block>
          <Block flex={false} style={styleRight} center>
            {rightIcon}
          </Block>
        </Block>
      </SafeAreaView>
    );
  }
}

Header.propTypes = {
  title: PropTypes.string,
};

const styles = StyleSheet.create({
  header: {
    ...ApplicationStyles.paddingHorizontalView,
    flexDirection: 'row',
    height: ResponsiveUtils.height(54),
    alignItems: 'center',
  },
  headerLeft: {
    width: '20%',
    alignItems: 'flex-start',
    paddingLeft: 0,
  },
  headerCenter: {
    width: '60%',
  },
  headerRight: {
    width: '20%',
    alignItems: 'flex-end',
  },
});
