/* eslint-disable radix */
import AsyncStorage from '@react-native-community/async-storage';
import {Constants} from './constants';
import {Privacy} from '..//Constants';

export const saveLanguage = async (userId, lang) => {
  await AsyncStorage.setItem(`${Constants.LANGUAGE}_${userId}`, lang);
};

export const getLanguage = async (userId) => {
  const lang = await AsyncStorage.getItem(`${Constants.LANGUAGE}_${userId}`);
  return lang || Constants.EN;
};

export const saveToken = (token) => {
  AsyncStorage.setItem(Constants.TOKEN, token);
};

export const getToken = () => {
  return AsyncStorage.getItem(Constants.TOKEN);
};

export const saveUserId = (id) => {
  AsyncStorage.setItem(Constants.USER_ID, id);
};

export const getUserId = () => {
  return AsyncStorage.getItem(Constants.USER_ID);
};

export const savePrivacy = async (privacyId) => {
  await AsyncStorage.setItem(Constants.PRIVACY, `${privacyId}`);
};

export const getPrivacy = async () => {
  const privacyId = await AsyncStorage.getItem(Constants.PRIVACY);
  return parseInt(privacyId) || Privacy.PUBLIC;
};

export const removeStorageItem = (item) => {
  AsyncStorage.removeItem(item);
};

export const resetUser = () => {
  AsyncStorage.removeItem(Constants.TOKEN);
  AsyncStorage.removeItem(Constants.USER_ID);
};
