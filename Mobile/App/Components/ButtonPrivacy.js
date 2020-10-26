import React, {Component} from 'react';
import {StyleSheet} from 'react-native';

import {Button, Block, Text} from '.';
import {Colors} from 'App/Theme';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Privacy, PrivacyIcon, PrivacyName} from '../Constants';
import {strings} from '../Locate/I18n';

class ButtonPrivacy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      containerWidth: 0,
      childWidth: 0,
      iconWidth: 40,
    };
  }

  render() {
    const {containerWidth, childWidth, iconWidth} = this.state;
    let {style, margin, onPress, disabled, userInclude} = this.props;

    const color = (style && style.color) || Colors.gray1;

    const containerStyle = [
      styles.container,
      style && style.borderWidth > 0 && {borderRadius: 5, borderColor: color},
      style,
    ];

    let iconStyle = null;
    if (style && (style.borderWidth > 0 || style.backgroundColor)) {
      iconStyle = {paddingHorizontal: 10};
    } else {
      iconStyle = {paddingRight: 10};
    }

    let {privacyId} = this.props;
    if (
      !privacyId ||
      privacyId < Privacy.PUBLIC ||
      privacyId > Privacy.PRIVATE
    ) {
      privacyId = Privacy.PUBLIC;
    }
    const iconName = PrivacyIcon[privacyId];

    let textMaxWidth = containerWidth - childWidth - iconWidth - 10;

    let includes = strings('me');
    userInclude = userInclude || [];
    if (userInclude.length > 0) {
      includes += userInclude.map((user, index) => {
        const preFix = index == 0 ? ` ${strings('and')} ` : ' ';
        return preFix + user.userFullName;
      });
    }

    const content = PrivacyName[privacyId] ? strings(PrivacyName[privacyId]) : includes;

    return (
      <Block
        flex={false}
        row
        margin={margin}
        onLayout={(event) =>
          this.setState({containerWidth: event.nativeEvent.layout.width})
        }>
        <Button style={containerStyle} disabled={disabled} onPress={onPress}>
          <Block flex={false} row center>
            <Block
              flex={false}
              column
              center
              style={iconStyle}
              onLayout={(event) =>
                this.setState({iconWidth: event.nativeEvent.layout.width})
              }>
              <Icon name={iconName} size={20} color={color} />
            </Block>
            <Text
              black
              center
              style={[styles.text, {maxWidth: textMaxWidth, color}]}
              numberOfLines={1}>
              {content}
            </Text>
          </Block>
        </Button>

        <Block
          flex={false}
          row
          onLayout={(event) =>
            this.setState({childWidth: event.nativeEvent.layout.width})
          }>
          {this.props.children}
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 32,
    paddingHorizontal: 0,
    marginVertical: 0,
  },
  text: {
    marginRight: 10,
    color: Colors.gray1,
  },
});

export default ButtonPrivacy;
