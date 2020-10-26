/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
import React, {Component} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Media, CheckBox, Button} from '../../Components';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Colors} from '../../Theme';

export default class ImageItem extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      this.props.style != nextProps.style ||
      this.props.checked != nextProps.checked ||
      this.props.uri != nextProps.uri
    );
  }

  onPress = () => {
    const {onPress} = this.props;
    if (onPress) {
      onPress();
    }
  };

  render() {
    const {
      style,
      type,
      checked,
      uri,
      resizeMode,
      repeat,
      onSelected,
      onDeleted,
      ...props
    } = this.props;
    return (
      <TouchableOpacity
        style={[{borderWidth: 1, borderColor: Colors.gray8}, style]}
        onPress={this.onPress}>
        <Media
          style={{width: style.width, height: style.height}}
          source={{uri: uri}}
          resizeMode={resizeMode || 'cover'}
          repeat={repeat}
          {...props}
          type={type.includes('video') ? 'image_temp' : type}
        />
        <View style={{position: 'absolute', top: 6, right: 6}}>
          {onSelected ? (
            <CheckBox
              size={25}
              style={{borderColor: Colors.white, borderWidth: 1}}
              checked={checked}
              disabled={true}
            />
          ) : onDeleted ? (
            <Button
              style={{marginVertical: 0, height: null}}
              onPress={onDeleted}>
              <Icon name={'times-circle'} size={25} color={'#FFFFFF6B'} />
            </Button>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }
}
