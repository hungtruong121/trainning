import React, {Component} from 'react';
import {StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import Text from './Text';
import Block from './Block';
import {Sizes, Colors} from 'App/Theme';

export default class Input extends Component {
  state = {
    toggleSecure: false,
  };

  renderLabel() {
    const {label, labelColor, error, labelStyle} = this.props;
    const color = error ? 'error' : labelColor ? labelColor : 'green';
    return (
      <Block flex={false}>
        {label ? (
          <Text style={labelStyle} color={color}>
            {label}
          </Text>
        ) : null}
      </Block>
    );
  }

  renderToggle() {
    const {
      secure,
      rightLabel,
      rightStyle,
      rightIconStyle,
      rightIconColor,
    } = this.props;
    const {toggleSecure} = this.state;
    if (!secure) {
      return null;
    }
    const iconStyle = [{position: 'absolute', top: 10}, rightIconStyle];

    return (
      <TouchableOpacity
        style={[styles.toggle, rightStyle]}
        onPress={() => this.setState({toggleSecure: !toggleSecure})}>
        {rightLabel ? (
          rightLabel
        ) : (
          <Icon
            color={rightIconColor ? rightIconColor : Colors.white}
            size={Sizes.font * 1.75}
            name={!toggleSecure ? 'eye' : 'eye-with-line'}
            style={iconStyle}
          />
        )}
      </TouchableOpacity>
    );
  }

  renderRight() {
    const {rightLabel, rightStyle, onRightPress} = this.props;

    if (!rightLabel) {
      return null;
    }

    return (
      <TouchableOpacity
        style={[styles.toggle, rightStyle]}
        onPress={() => onRightPress && onRightPress()}
        disabled={onRightPress ? false : true}>
        {rightLabel}
      </TouchableOpacity>
    );
  }

  render() {
    const {
      email,
      phone,
      number,
      secure,
      error,
      style,
      refName,
      ...props
    } = this.props;

    const {toggleSecure} = this.state;
    const isSecure = toggleSecure ? false : secure;

    const inputStyles = [
      styles.input,
      error && {borderColor: Colors.error},
      style,
    ];

    const inputType = email
      ? 'email-address'
      : number
      ? 'numeric'
      : phone
      ? 'phone-pad'
      : 'default';

    return (
      <Block flex={false} margin={[0, 0, 0]} {...props}>
        {this.renderLabel()}
        <TextInput
          ref={refName}
          style={inputStyles}
          secureTextEntry={isSecure}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType={inputType}
          placeholderTextColor={Colors.gray}
          {...props}
        />
        {this.renderToggle()}
        {this.renderRight()}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.black,
    borderRadius: Sizes.radius,
    fontSize: Sizes.font,
    color: Colors.white,
    height: Sizes.base * 3,
    fontFamily: 'MPLUS1p-Medium',
  },
  toggle: {
    position: 'absolute',
    alignItems: 'center',
    width: Sizes.base * 3,
    height: Sizes.base * 2,
    right: 0,
    backgroundColor: Colors.black,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    top: 10,
  },
});
