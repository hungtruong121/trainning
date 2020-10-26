import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {CheckBox, Text, ImageCircle} from '.';
import {Colors} from 'App/Theme';
import {Config} from 'App/Config';

class UserCheckBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {checked} = nextProps;
    if (checked != prevState.checked) {
      return {checked};
    }

    return null;
  }

  onSelected = () => {
    const {user} = this.props;
    this.props.onSelected(user);
  };

  render() {
    const {style, user, borderBottom, checked} = this.props;

    return (
      <TouchableOpacity onPress={this.onSelected}>
        <View style={[styles.container, borderBottom && styles.border, style]}>
          <CheckBox checked={checked} onSelected={this.onSelected} />
          <ImageCircle
            source={{uri: Config.GET_IMAGE_URL + user.userAvatar}}
            style={{marginHorizontal: 16}}
            size={40}
          />
          <Text size={12.5}>{user.userFullName}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: Colors.gray8,
    paddingVertical: 8,
  },
  border: {
    borderBottomWidth: 1,
  },
  opacity: {
    position: 'absolute',
    opacity: 0.6,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  text: {
    position: 'absolute',
    left: 20,
    bottom: 10,
    color: Colors.white,
    fontSize: 20,
  },
});

export default UserCheckBox;
