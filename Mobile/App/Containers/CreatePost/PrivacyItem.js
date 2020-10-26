/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {CheckBox, Text} from '../../Components';
import {Colors} from 'App/Theme';
import {PrivacyIcon} from '../..//Constants';

class PrivacyItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      privacyId,
      title,
      content,
      borderBottom,
      checked,
      onSelected,
    } = this.props;

    return (
      <TouchableOpacity onPress={() => onSelected(privacyId)}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: borderBottom ? 1 : undefined,
            borderColor: Colors.gray8,
            paddingVertical: 8,
          }}>
          <CheckBox
            checked={checked}
            onSelected={() => onSelected(privacyId)}
          />
          <View
            style={{width: 60, justifyContent: 'center', alignItems: 'center'}}>
            <Icon
              name={PrivacyIcon[privacyId]}
              size={30}
              color={Colors.gray5}
            />
          </View>
          <View style={{flex: 1}}>
            <Text size={12.5}>{title}</Text>
            <Text size={11} color={Colors.gray5} numberOfLines={1}>
              {content}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default PrivacyItem;
