/**
 * This file defines the base application styles.
 *
 * Use it to define generic component styles (e.g. the default text styles, default button styles...).
 */
import Colors from './Colors';
import Sizes from './Sizes';
import {StyleSheet} from 'react-native';

export default {
  button: {
    backgroundColor: Colors.primary,
  },
  backgroundView: {
    backgroundColor: Colors.background,
  },
  backgroundItem: {
    backgroundColor: Colors.white,
  },
  paddingHorizontalView: {
    paddingHorizontal: 10,
  },
  marginVertical: {
    marginVertical: 10,
  },
  marginHorizontal: {
    marginHorizontal: 10,
  },
  borderRadiusItem: {
    borderRadius: 10,
  },
  marginTop10: {
    marginTop: 10,
  },
  input: {
    borderRadius: 0,
    borderWidth: 0,
    borderBottomColor: Colors.green,
    borderBottomWidth: StyleSheet.hairlineWidth,
    fontSize: Sizes.h3,
  },
  fontMPLUS1pBlack: {
    fontFamily: 'MPLUS1p-Black',
  },
  fontMPLUS1pBold: {
    fontFamily: 'MPLUS1p-Bold',
  },
  fontMPLUS1pExtraBold: {
    fontFamily: 'MPLUS1p-ExtraBold',
  },
  fontMPLUS1pExtraLight: {
    fontFamily: 'MPLUS1p-Light',
  },
  fontMPLUS1pMedium: {
    fontFamily: 'MPLUS1p-Medium',
  },
  fontMPLUS1pRegular: {
    fontFamily: 'MPLUS1p-Regular',
  },
  fontMPLUS1pThin: {
    fontFamily: 'MPLUS1p-Thin',
  },
  paddingLeftInput: {
    paddingLeft: 15,
  },
};
