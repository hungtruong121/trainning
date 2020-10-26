import {StyleSheet, Dimensions} from 'react-native';
import {Colors, ApplicationStyles} from '../../Theme';
const {width} = Dimensions.get('window');

export default StyleSheet.create({
  view: {
    ...ApplicationStyles.backgroundView,
  },
  teamSelectContainer: {
    backgroundColor: Colors.gray17,
    width: width / 2,
    height: 78,
  },
  badgeContent: {
    ...ApplicationStyles.fontMPLUS1pRegular,
    fontSize: 11,
    color: Colors.white,
  },
  badgeContainer: {
    position: 'absolute',
    left: 50,
    zIndex: 99999,
  },
  avatarTeam: {
    marginLeft: 15,
    height: 56,
    width: 56,
    borderRadius: 28,
  },
  teamSelectName: {
    ...ApplicationStyles.fontMPLUS1pBold,
    fontSize: 13.5,
    marginLeft: 10,
    flexWrap: 'wrap',
    flex: 1,
  },
  separatorBar: {
    height: 0.5,
    backgroundColor: Colors.gray,
    width: '100%',
  },
  avatarNotification: {
    marginLeft: 15,
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  notificationContent: {
    fontSize: 13,
    ...ApplicationStyles.fontMPLUS1pRegular,
  },
  notificationTime: {
    ...ApplicationStyles.fontMPLUS1pRegular,
    fontSize: 12,
    marginTop: -8,
  },
});
