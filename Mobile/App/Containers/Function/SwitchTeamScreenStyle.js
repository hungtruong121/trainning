import {StyleSheet} from 'react-native';
import {Colors} from '../../Theme';

export default StyleSheet.create({
  iconScanQRCodeContainer: {
    width: 30,
    height: 30,
  },
  view: {
    backgroundColor: Colors.gray15,
    height: 40,
  },
  itemContainer: {
    height: 80,
  },
  avatarTeamContainer: {
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  buttonAddTeamStyle: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamInfoContainer: {
    marginLeft: 10,
    height: 60,
  },
  activeContainer: {
    height: 80,
    width: 80,
    marginBottom: 0,
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
  buttonLeaveTeamStyle: {
    height: 80,
    width: 80,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
