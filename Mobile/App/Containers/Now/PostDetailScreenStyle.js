import {StyleSheet} from 'react-native';
import {Colors, ApplicationStyles} from '../../Theme';

export default StyleSheet.create({
  view: {
    ...ApplicationStyles.backgroundView,
  },
  container: {
    ...ApplicationStyles.marginHorizontal,
    ...ApplicationStyles.marginTop10,
    ...ApplicationStyles.borderRadiusItem,
    ...ApplicationStyles.backgroundItem,
    ...ApplicationStyles.padding,
  },
  textInput: {
    flex: 1,
    paddingVertical: 0,
    marginLeft: 10,
    height: 28,
    color: Colors.black,
  },
  buttonGIF: {
    height: 28,
    marginLeft: 10,
    borderRadius: 6,
    borderWidth: 1,
    padding: 2,
    borderColor: Colors.gray5,
  },
});
