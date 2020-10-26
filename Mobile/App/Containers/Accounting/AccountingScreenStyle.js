import {StyleSheet, Dimensions} from 'react-native';
import {Sizes, Colors, ApplicationStyles} from '../../Theme';

export default StyleSheet.create({
  view: {
    ...ApplicationStyles.backgroundView,
  },
  container: {
    ...ApplicationStyles.paddingHorizontalView,
  },
  inputSearch: {
    height: 40,
    borderRadius: 5,
    borderColor: Colors.white,
    paddingRight: 20,
    width: '100%',
    color: Colors.black,
    fontSize: 13.5,
  },
  viewInputSearch: {
    height: 40,
    paddingLeft: 10,
    paddingRight: 10,
    width: '100%',
    alignItems: 'center',
    backgroundColor: Colors.white,
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
  viewsection: {
    marginTop: 14,
    padding: 10,
    borderRadius: 10,
  },
});
