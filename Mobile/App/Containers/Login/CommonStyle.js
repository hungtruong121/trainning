import {StyleSheet} from 'react-native';
import {Colors, ApplicationStyles} from '../../Theme';

export default StyleSheet.create({
  // Common Style
  container: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  logoStyle: {
    width: 140,
    height: 140,
    marginTop: '10%',
    borderRadius: 70,
    alignSelf: 'center',
  },
  appName: {
    marginTop: 3,
    fontSize: 32,
  },
  banner: {
    marginTop: 2,
    fontSize: 16,
  },
  // inputOthersContainer: {
  //   height: 48,
  //   width: 300,
  //   backgroundColor: "rgba(0,0,0,0.8)",
  //   borderRadius: 25,
  //   marginTop: 10,
  //   marginLeft: 35,
  //   paddingLeft: 5,
  //   fontSize: 16,
  //   alignSelf: "center",
  // },
  // Login Style
  errorContainer: {
    marginTop: 10,
  },
  input: {
    height: 48,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 25,
    fontSize: 16,
    marginTop: 10,
    ...ApplicationStyles.paddingLeftInput,
    paddingRight: 50,
  },
  iconInputEmail: {
    position: 'absolute',
    top: 12,
  },
  buttonLoginStyle: {
    backgroundColor: Colors.primary,
    height: 48,
    borderRadius: 25,
    marginTop: 20,
  },
  contentButtonLoginStyle: {
    fontSize: 18,
  },
  forgotPasswordPosition: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotPasswordStyle: {
    marginLeft: 6,
    fontSize: 17,
    fontWeight: '600',
  },
  signUpPosition: {
    marginTop: 20,
    height: 30,
    width: 300,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  askForSignUp: {
    fontSize: 17,
    fontWeight: '600',
  },
  signUp: {
    marginTop: -2,
    fontSize: 20,
  },
  signInWithSocialNetworkPosition: {
    marginTop: 10,
    height: 20,
    width: 348,
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
  },
  socialNetworkContainerPosition: {
    width: 180,
    height: 60,
    marginTop: 10,
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  socialNetworkContainerStyle: {
    height: 46,
    width: 46,
    borderRadius: 23,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  socialNetworkLogoStyle: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  // Register & Reset Password Style
  button: {
    height: 40,
    width: 120,
    borderRadius: 25,
    fontSize: 18,
  },
  textButton: {fontSize: 18},
});
