import {StyleSheet, Dimensions} from 'react-native';
import {Colors, ApplicationStyles, Helpers} from '../../Theme';
const {height, width} = Dimensions.get('window');

export default StyleSheet.create({
  view: {
    ...ApplicationStyles.backgroundView,
  },
  headerViewParent: {
    height: height / 3.5,
    ...Helpers.fullWidth,
  },
  headerViewBg: {
    ...Helpers.fullSize,
    backgroundColor: Colors.red,
    position: 'absolute',
    opacity: 0.8,
  },
  headerImageBg: {
    ...Helpers.fullSize,
    overflow: 'hidden',
  },
  viewAvatar: {
    height: width / 3,
    width: width / 3,
    borderRadius: 100,
    alignSelf: 'center',
    position: 'absolute',
    top: '35%',
  },
  viewContain: {
    ...Helpers.fullSize,
  },
  textNameTeam: {
    color: Colors.black,
    fontSize: 15,
    marginTop: '20%',
    ...ApplicationStyles.fontMPLUS1pBold,
  },
  textNumberMember: {
    fontSize: 11,
    color: Colors.gray5,
    ...ApplicationStyles.fontMPLUS1pMedium,
  },
  btnJoin: {
    height: 40,
    width: '35%',
    marginRight: 10,
    marginLeft: 60,
  },
  btnFollow: {
    width: '35%',
    height: 40,
    marginLeft: 10,
    marginRight: 60,
  },
  btnReject: {
    width: '35%',
    height: 40,
    marginLeft: 10,
    marginRight: 60,
    backgroundColor: Colors.gray5,
  },
  viewInfo: {
    backgroundColor: Colors.white,
    borderRadius: 5,
    flex: 1,
  },
  textInfoTitle: {
    fontSize: 13.5,
    color: Colors.black,
    ...ApplicationStyles.fontMPLUS1pBold,
  },
  textInfoSubTitle: {
    fontSize: 12.5,
    color: Colors.gray5,
    ...ApplicationStyles.fontMPLUS1pRegular,
  },
  iconInfo: {
    height: 28,
    width: 28,
  },
  btnFillter: {
    width: 60,
    height: 30,
    borderRadius: 20,
  },
  titleButtonFillter: {
    fontSize: 12.5,
    ...ApplicationStyles.fontMPLUS1pMedium,
  },
});
