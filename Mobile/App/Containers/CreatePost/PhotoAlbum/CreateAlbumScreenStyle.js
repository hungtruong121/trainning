import {StyleSheet} from 'react-native';
import {Colors, ApplicationStyles} from '../../../Theme';

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
  inputAlbumName: {
    height: 40,
    color: Colors.black,
    borderWidth: 0,
  },
  inputDescription: {
    marginTop: 17,
    height: 110,
    color: Colors.black,
    borderWidth: 0,
  },
  buttonPrivacy: {
    marginVertical: 0,
    height: null,
    paddingVertical: 0,
    marginTop: 15,
    elevation: 5,
  },
  containerPrivacy: {
    height: 60,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
});
