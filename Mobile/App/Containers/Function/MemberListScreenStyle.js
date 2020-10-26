import {StyleSheet} from 'react-native';
import {Colors, ApplicationStyles} from '../../Theme';

export default StyleSheet.create({
  view: {
    ...ApplicationStyles.backgroundView,
  },
  input: {
    height: 48,
    fontSize: 16,
    ...ApplicationStyles.paddingLeftInput,
    borderWidth: 0,
    backgroundColor: Colors.gray3,
    color: Colors.black,
  },
  title: {
    marginVertical: 10,
    paddingHorizontal: ApplicationStyles.paddingLeftInput.paddingLeft,
  },
  rowFront: {
    backgroundColor: Colors.white,
    paddingVertical: 5,
    paddingRight: 10,
  },
  rowBack: {
    backgroundColor: Colors.white,
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: '#F7F7F7',
    right: 150,
  },
  backRightBtnCenter: {
    backgroundColor: '#EBEBEB',
    right: 75,
  },
  backRightBtnRight: {
    right: 0,
  },
  userAvatar: {
    width: 52,
    height: 52,
    borderRadius: 52 / 2,
  },
  text: {
    color: Colors.gray5,
    fontSize: 12,
  },
  icon: {
    width: 12,
    height: 15,
  },
  textPosition: {
    paddingLeft: 10,
    fontSize: 13,
  },
});
