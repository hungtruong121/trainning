import {StyleSheet, Dimensions} from 'react-native';
import {Colors, ApplicationStyles} from '../../../Theme';
const {width} = Dimensions.get('window');

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
  image: {
    height: (width - 8 * 4) / 3 - 2,
    width: (width - 8 * 4) / 3 - 2,
    margin: 4,
    borderWidth: 1,
    borderColor: '#DDDFE1',
  },
  containerDone: {
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 15,
    paddingHorizontal: 8,
    backgroundColor: '#00000090',
  },
  buttonDone: {
    flexDirection: 'row',
    height: 34,
    marginVertical: 0,
    paddingHorizontal: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
