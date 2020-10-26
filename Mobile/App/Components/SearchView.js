import React, {Component} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default class SearchView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      style,
      placeholder,
      multiline,
      value,
      styleInput,
      onChangeText,
    } = this.props;

    return (
      <View style={[styles.container, style]}>
        <Icon name="search" size={20} color={'#BDBDBD'} />
        <TextInput
          style={[{flex: 1, padding: 10}, styleInput]}
          multiline={multiline}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: '#BDBDBD',
    alignItems: 'center',
  },
  item: {
    alignItems: 'center',
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
    color: 'white',
    fontSize: 20,
  },
});
