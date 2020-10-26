import {StyleSheet} from 'react-native';
import {Colors, ApplicationStyles} from '../../Theme';

export default StyleSheet.create({
  view: {
    ...ApplicationStyles.backgroundView,
  },
  container: {
    ...ApplicationStyles.borderRadiusItem,
    ...ApplicationStyles.backgroundItem,
    padding: ApplicationStyles.paddingHorizontalView.paddingHorizontal,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  info: {
    marginTop: 10,
    paddingTop: 10,
    borderTopColor: Colors.gray1,
    borderTopWidth: 1,
  },
  text: {
    ...ApplicationStyles.fontMPLUS1pMedium,
    fontSize: 13.5,
    marginVertical: 5,
  },
  textBenefit: {
    ...ApplicationStyles.fontMPLUS1pRegular,
    fontSize: 14,
    marginVertical: 5,
  },
});
