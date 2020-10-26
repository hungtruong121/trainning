import {StyleSheet, Dimensions} from 'react-native';
import {Sizes, Colors, ApplicationStyles} from '../../Theme';
const {width} = Dimensions.get('window');

export default StyleSheet.create({
  view: {
    ...ApplicationStyles.backgroundView,
  },
  container: {
    ...ApplicationStyles.paddingHorizontalView,
  },
  tabs: {
    marginVertical: Sizes.base / 2,
    ...ApplicationStyles.paddingHorizontalView,
  },
  tab: {
    marginRight: Sizes.base,
    paddingBottom: Sizes.base / 2,
  },
  active: {
    borderBottomColor: Colors.red,
    borderBottomWidth: 3,
  },
});
