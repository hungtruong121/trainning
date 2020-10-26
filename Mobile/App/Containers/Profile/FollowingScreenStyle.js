import {StyleSheet} from 'react-native';
import {Colors, ApplicationStyles} from '../../Theme';

export default StyleSheet.create({
  view: {
    backgroundColor: Colors.gray16,
    height: 40,
  },
  totalTeamFollowing: {
    fontSize: 13.5,
    ...ApplicationStyles.fontMPLUS1pRegular,
    color: Colors.black,
  },
  itemContainer: {
    height: 80,
    width: '100%',
  },
  avatarTeamContainer: {
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  teamInfoContainer: {
    marginLeft: 10,
    height: 60,
  },
  separatorBar: {
    height: 0.5,
    backgroundColor: Colors.gray,
    width: '100%',
  },
  hiddenItemContainer: {
    height: 80,
    width: '100%',
    alignItems: 'flex-end',
  },
  buttonUnfollowTeamStyle: {
    height: 80,
    width: 80,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
