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
  backgroundView: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(220, 54, 66, 0.8)',
  },
  containerMenu: {
    ...ApplicationStyles.paddingHorizontalView,
    marginBottom: 20,
  },
  avatarTeam: {
    height: 40,
    width: 40,
  },
  platinumCard: {
    marginTop: -5,
    marginBottom: -5,
  },
  borderCard: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
  },
  titleEvent: {
    ...ApplicationStyles.fontMPLUS1pBold,
    fontSize: 15,
    color: Colors.black,
  },
});
