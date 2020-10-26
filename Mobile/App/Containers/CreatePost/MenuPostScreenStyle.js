import {StyleSheet, Dimensions} from 'react-native';
import {ApplicationStyles} from '../../Theme';
const {width} = Dimensions.get('window');

export default StyleSheet.create({
  view: {
    ...ApplicationStyles.backgroundView,
  },
  screenWidth: width,
  backgroundProfile: {
    position: 'absolute',
    opacity: 0.8,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  containerUser: {
    marginTop: 20,
  },
  containerMenu: {
    ...ApplicationStyles.paddingHorizontalView,
  },
});
