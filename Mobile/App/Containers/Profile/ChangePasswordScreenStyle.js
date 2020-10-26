import {StyleSheet} from 'react-native';
import {Colors, ApplicationStyles} from '../../Theme';

export default StyleSheet.create({
  view: {
    ...ApplicationStyles.backgroundView,
  },
  headerRight: {
    fontSize: 15,
    ...ApplicationStyles.fontMPLUS1pBold,
    color: Colors.white,
  },
  input: {
    borderRadius: 7,
    height: 40,
    fontSize: 13.5,
    backgroundColor: Colors.white,
    color: Colors.black,
    ...ApplicationStyles.paddingLeftInput,
    borderWidth: 0,
    marginTop: 5,
    ...ApplicationStyles.fontMPLUS1pRegular,
    paddingRight: 50,
  },
  text: {
    marginTop: 10,
    ...ApplicationStyles.fontMPLUS1pRegular,
    fontSize: 13.5,
  },
  rightStyle: {
    width: 40,
    height: 40,
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
    top: 5,
    backgroundColor: Colors.white,
  },
  rightIconStyle: {
    top: 7.5,
  },
});
