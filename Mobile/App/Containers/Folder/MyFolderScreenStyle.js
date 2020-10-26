import {StyleSheet, Dimensions} from 'react-native';
import {Colors, ApplicationStyles} from '../../Theme';
const {height, width} = Dimensions.get('window');

export default StyleSheet.create({
  view: {
    ...ApplicationStyles.backgroundView,
  },
  container: {
    ...ApplicationStyles.paddingHorizontalView,
  },
  inputSearch: {
    borderRadius: 5,
    backgroundColor: Colors.white,
    paddingRight: 20,
    color: Colors.black,
    fontSize: 13.5,
    paddingLeft: 10,
    borderWidth: 0,
  },
  viewInputSearch: {
    height: 50,
    width: '100%',
    backgroundColor: Colors.white,
  },
  viewStorage: {
    backgroundColor: Colors.white,
    width: '95%',
    height: width / 4,
    marginTop: 20,
    borderRadius: 10,
    padding: 15,
    marginLeft: 10,
  },
  btnUpgrade: {
    height: 24,
    width: width / 5,
    backgroundColor: Colors.red,
    marginLeft: 25,
  },
  menuFeature: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray4,
    width: '100%',
    height: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheetMultipleFeature: {
    margin: 10,
    borderRadius: 10,
    height: height / 4.5,
    width: '95%',
    position: 'absolute',
    top: '45%',
  },
  bottomSheetFeature: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height / 5,
  },

  inputRename: {
    ...ApplicationStyles.fontMPLUS1pRegular,
    backgroundColor: Colors.gray15,
    height: 40,
    borderRadius: 5,
    borderColor: Colors.gray15,
    paddingLeft: 15,
    color: Colors.black,
    fontSize: 12,
    marginTop: 10,
  },
  footer: {
    borderTopColor: Colors.gray2,
    borderTopWidth: 1,
    height: 40,
  },
  textSelect: {
    ...ApplicationStyles.paddingLeftInput,
    marginTop: 5,
    height: 40,
  },
});
