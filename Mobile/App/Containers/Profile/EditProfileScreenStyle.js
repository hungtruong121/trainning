import {StyleSheet} from 'react-native';
import {Colors, ApplicationStyles} from '../../Theme';

export default StyleSheet.create({
  view: {
    ...ApplicationStyles.backgroundView,
    paddingBottom: 20,
  },
  headerRight: {
    fontSize: 15,
    ...ApplicationStyles.fontMPLUS1pBold,
    color: Colors.white,
  },
  viewChangeAvatar: {
    backgroundColor: Colors.black,
    opacity: 0.36,
    width: 116,
    height: 58,
    position: 'absolute',
    bottom: 0,
    borderBottomLeftRadius: 65,
    borderBottomRightRadius: 65,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  viewIcon: {
    width: 116,
    height: 58,
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  textTop: {
    marginTop: 20,
  },
  textSelect: {
    ...ApplicationStyles.paddingLeftInput,
    marginTop: 5,
    height: 40,
  },
  textPreferred: {
    paddingLeft: 10,
    fontSize: 13.5,
    ...ApplicationStyles.fontMPLUS1pRegular,
  },
  buttonAdd: {
    width: 40,
    height: 40,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    marginRight: 0,
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  itemAchievement: {
    paddingVertical: 10,
    borderBottomColor: Colors.gray3,
    borderBottomWidth: 1,
  },
});
