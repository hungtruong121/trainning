import {StyleSheet} from 'react-native';
import {Colors, ApplicationStyles} from '../../Theme';

export default StyleSheet.create({
  view: {
    ...ApplicationStyles.backgroundView,
  },
  iconLeft: {
    width: 15,
    height: 15,
    resizeMode: 'stretch',
  },
  text: {
    fontSize: 16,
    marginLeft: 20,
  },
  itemSetting: {
    paddingVertical: 10,
    ...ApplicationStyles.paddingHorizontalView,
    borderBottomColor: Colors.gray3,
    borderBottomWidth: 1,
  },
});
