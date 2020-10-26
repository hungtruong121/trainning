import {Dimensions} from 'react-native';
const {height, width} = Dimensions.get('window');
const SizeBase = {width: 414.0, height: 869.0};

export default class ResponsiveUtils {
  static scaleWidth() {
    return width / SizeBase.width;
  }

  static scaleHeight() {
    return height / SizeBase.height;
  }

  static scale() {
    return (width + height) / (SizeBase.width + SizeBase.height);
  }

  static width(size) {
    return size * this.scaleWidth();
  }

  static height(size) {
    return size * this.scaleHeight();
  }

  static normalize(size) {
    return size * this.scale();
  }
}
