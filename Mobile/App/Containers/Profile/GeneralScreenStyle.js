import {StyleSheet} from 'react-native';
import {Colors, ApplicationStyles} from '../../Theme';

export default StyleSheet.create({
  view: {
    ...ApplicationStyles.backgroundView,
  },
  iconTheme: {
    width: 35,
    height: 35,
    resizeMode: 'stretch',
  },
  text: {
    fontSize: 16,
  },
  itemSetting: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderBottomColor: Colors.gray3,
    borderBottomWidth: 1,
  },
  textLanguage: {
    paddingLeft: 10,
  },
});
