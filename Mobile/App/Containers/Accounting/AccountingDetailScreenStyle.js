import {StyleSheet, Dimensions} from 'react-native';
import {Sizes, Colors, ApplicationStyles} from '../../Theme';
import ResponsiveUtils from '../../Utils/ResponsiveUtils';
const {height, width} = Dimensions.get('window');

export default StyleSheet.create({
  view: {
    ...ApplicationStyles.backgroundView,
  },
  container: {
    ...ApplicationStyles.paddingHorizontalView,
  },
  tabs: {
    marginVertical: Sizes.base,
  },
  tab: {
    marginRight: Sizes.base,
  },
  active: {
    borderBottomColor: Colors.red,
    borderBottomWidth: 3,
  },
  tabContent: {
    height: width / 3.5,
    width: width / 3.5,
    borderRadius: 5,
  },
  viewHeaderDetail: {
    height: width / 3.5,
    width: '100%',
    marginTop: 25,
    borderRadius: 5,
    padding: 10,
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
  viewInputSearch: {
    height: 40,
    paddingRight: 10,
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: Colors.white,
  },
  inputSearch: {
    height: 40,
    width: '100%',
    borderRadius: 5,
    borderColor: Colors.white,
    color: Colors.black,
    fontSize: 13.5,
    ...ApplicationStyles.fontMPLUS1pBold,
  },
  viewMemberStatus: {
    height: width / 4,
    width: width / 3.5,
    borderRadius: 5,
    backgroundColor: Colors.white,
    justifyContent: 'center',
  },
  viewEvidence: {
    width: '90%',
    height: ResponsiveUtils.normalize(700),
    alignSelf: 'center',
    position: 'absolute',
    top: '10%',
    borderRadius: 10,
  },
  imageEvidence: {
    height: '90%',
    width: '90%',
    borderRadius: 10,
    margin: 10,
    alignSelf: 'center',
  },
});
