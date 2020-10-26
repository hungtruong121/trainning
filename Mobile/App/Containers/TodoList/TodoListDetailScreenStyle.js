import {StyleSheet, Dimensions} from 'react-native';
import {Sizes, Colors, ApplicationStyles} from '../../Theme';
const {width, height} = Dimensions.get('window');
import ResponsiveUtils from '../../Utils/ResponsiveUtils';

export default StyleSheet.create({
  view: {
    ...ApplicationStyles.backgroundView,
  },
  container: {
    ...ApplicationStyles.paddingHorizontalView,
  },
  tabs: {
    marginVertical: Sizes.base / 2,
    ...ApplicationStyles.paddingHorizontalView,
  },
  tab: {
    marginRight: Sizes.base,
    paddingBottom: Sizes.base / 2,
  },
  active: {
    borderBottomColor: Colors.red,
    borderBottomWidth: 3,
  },
  inputStyle: {
    marginTop: 10,
    paddingLeft: 10,
    height: 40,
    fontSize: 13.5,
    color: Colors.black,
    backgroundColor: Colors.white,
    borderColor: Colors.white,
  },
  textSelect: {
    marginTop: 5,
    height: 40,
    backgroundColor: Colors.primary,
    ...ApplicationStyles.fontMPLUS1pRegular,
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
  button: {
    borderWidth: 1,
    borderColor: Colors.black,
    height: 27,
    width: width / 5,
    alignItems: 'center',
  },
  textArea: {
    ...ApplicationStyles.fontMPLUS1pRegular,
    paddingLeft: 10,
    fontSize: 13.5,
    backgroundColor: Colors.white,
    borderColor: Colors.white,
    height: width / 4,
    color: Colors.black,
  },
  bottomSheetFeature: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height / 6,
  },
  menuFeature: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray4,
    width: '100%',
    height: '35%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
