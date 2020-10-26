import React, {Component} from 'react';
import {StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Colors} from '../Theme';

class ImageCircle extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {style, styleImage, source, size, resizeMode, onPress} = this.props;

    const sizeImage = size > 0 ? size : 20;

    const styleCircle = {
      width: sizeImage,
      height: sizeImage,
      borderRadius: sizeImage / 2,
    };

    const stylesImage = [styleCircle, styles.border, styleImage];

    return (
      <TouchableOpacity
        disabled={onPress ? false : true}
        onPress={onPress}
        style={style}>
        <Image
          resizeMode={resizeMode}
          style={[styles.image, stylesImage]}
          source={source}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
  },
  border: {
    borderWidth: 1,
    borderColor: Colors.gray5,
  },
});

export default ImageCircle;
