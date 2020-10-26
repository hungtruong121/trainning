import {StyleSheet, Dimensions} from 'react-native';
import {Colors, ApplicationStyles} from '../../Theme';
import ResponsiveUtils from '../../Utils/ResponsiveUtils';

export default StyleSheet.create({
  view: {
    ...ApplicationStyles.backgroundView,
  },
  container: {
    ...ApplicationStyles.paddingHorizontalView,
  },
  textArea: {
    ...ApplicationStyles.fontMPLUS1pRegular,
    paddingLeft: 10,
    fontSize: 13.5,
    backgroundColor: Colors.white,
    borderColor: Colors.white,
    color: Colors.black,
  },
  textSelect: {
    marginTop: 5,
    height: 40,
    backgroundColor: Colors.primary,
  },
  bottomSheet: {
    height: ResponsiveUtils.normalize(865),
  },
  sectionHeader: {
    height: 45,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.gray17,
    paddingRight: 10,
    paddingLeft: 10,
  },
  inputSearch: {
    height: 50,
    borderRadius: 5,
    borderColor: Colors.background,
    paddingRight: 20,
    color: Colors.black,
    fontSize: 13.5,
    width: '100%',
  },
  viewInputSearch: {
    height: 50,
    paddingLeft: 10,
    paddingRight: 10,
    width: '100%',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});
