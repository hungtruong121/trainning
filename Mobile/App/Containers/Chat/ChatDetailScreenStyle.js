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
    flexDirection: 'row-reverse'
  },
  buttonGIF: {
    width: 30,
    height: 30,
    borderRadius: 6,
    borderWidth: 0,
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
