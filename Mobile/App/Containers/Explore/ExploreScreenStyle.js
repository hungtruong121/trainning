import {StyleSheet, Dimensions} from 'react-native';
import {Sizes, Colors, ApplicationStyles} from '../../Theme';
const {width} = Dimensions.get('window');

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
  tabs: {
    marginVertical: Sizes.base / 2,
    paddingHorizontal: Sizes.base,
  },
  tab: {
    marginRight: Sizes.base,
    paddingBottom: Sizes.base / 2,
  },
  active: {
    borderBottomColor: Colors.red,
    borderBottomWidth: 3,
  },
  viewQR: {
    backgroundColor: Colors.white,
    width: width / 1.5,
    height: width / 1.5,
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputLink: {
    height: 40,
    borderRadius: 5,
    borderColor: Colors.white,
    paddingLeft: 20,
    paddingRight: 20,
    color: Colors.black,
    textAlign: 'center',
  },
  inputSearch: {
    height: 40,
    borderRadius: 5,
    borderColor: Colors.white,
    paddingLeft: 20,
    paddingRight: 20,
    color: Colors.black,
  },
  viewSearch: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  viewInputSearch: {
    height: 40,
    paddingLeft: 20,
    paddingRight: 20,
  },
  viewInput: {
    height: 40,
    borderRadius: 5,
    backgroundColor: Colors.white,
    borderColor: Colors.white,
    width: width / 1.5,
  },
  iconCoppy: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    marginLeft: 10,
    borderRadius: 5,
    backgroundColor: Colors.white,
  },
  buttonMessage: {
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  buttonLine: {
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginRight: 15,
  },
  buttonClick: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarUser: {
    width: width / 5,
    height: width / 5,
    flex: null,
    backgroundColor: 'blue',
    justifyContent: 'center',
    borderRadius: 45,
    marginRight: 20,
  },
  buttonAprroval: {
    height: 28,
    borderRadius: 5,
    width: width / 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
