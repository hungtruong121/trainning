import React, {Component} from 'react';
import {StyleSheet, Image, TouchableOpacity, View} from 'react-native';

import {Text} from '../../Components';

class PostItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {style, text, background, onPress} = this.props;

    const borderRadius = 10;

    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <View style={[styles.container, style]}>
          <Image
            style={[styles.image, {borderRadius: borderRadius}]}
            resizeMode={'cover'}
            source={background}
          />
          <View style={[styles.opacity, {borderRadius: borderRadius}]} />
          <Text style={styles.text} bold>
            {text}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 85,
  },
  item: {
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 85,
  },
  opacity: {
    position: 'absolute',
    opacity: 0.6,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
  },
  text: {
    position: 'absolute',
    left: 20,
    bottom: 10,
    color: 'white',
    fontSize: 16,
  },
});

export default PostItem;
